#!/usr/bin/env python3
"""
Discover publicly printed contact information (emails, phone numbers) from
organizations' own websites, following bhm-round2/CONTACT_RULES.md.

Input:  bhm-round2/merged_candidates.csv (org_name, unit, territory, homepage_url, contact_page_url)
Output: bhm-round2/contacts/contacts.csv (appended incrementally, resumable)

Rules followed (see bhm-round2/CONTACT_RULES.md):
- Respect robots.txt. If blocked, status=site_failed and do not work around it.
- Record an email only if printed on a page actually fetched. Never guess/infer/pattern-build.
- Record a name/title only if printed next to an address on that page.
- Never follow links to faculty/staff/people/directory pages. Only follow links whose
  text or path contains: contact, programs, events, education, speakers, request, outreach, about.
- Open contact_page_url from merged_candidates.csv first when present.
- Cap at 10 emails per page; flag directory_page_capped if a page has more.
- Skip role addresses (admissions@, advancement@, careers@, hr@, press@, media@,
  webmaster@, registrar@) from the output email field, but list what was skipped in flags.
- Add unit_relevance: on_unit_page if the email's page text/URL names the candidate's unit,
  else other_page.
- Save results after every organization. Skip organizations already in the output file.
"""

import csv
import datetime
import re
import sys
import time
import urllib.parse
import urllib.robotparser

import requests
from bs4 import BeautifulSoup

INPUT_CSV = "bhm-round2/merged_candidates.csv"
OUTPUT_CSV = "bhm-round2/contacts/contacts.csv"

USER_AGENT = (
    "InventorFilmContactLookup/1.0 "
    "(research for a nonprofit film screening program; "
    "+contact: philip@lightmilemedia.com)"
)

REQUEST_TIMEOUT = 15
WAIT_BETWEEN_REQUESTS = 2.0
MAX_PAGES_PER_ORG = 6
MAX_EMAILS_PER_PAGE = 10

# Only these are safe to follow, per CONTACT_RULES.md. Deliberately excludes
# "staff", "faculty", "directory", "people".
LINK_KEYWORDS = [
    "contact",
    "programs",
    "events",
    "education",
    "speakers",
    "request",
    "outreach",
    "about",
]

ROLE_ADDRESS_PREFIXES = [
    "admissions@",
    "advancement@",
    "careers@",
    "hr@",
    "press@",
    "media@",
    "webmaster@",
    "registrar@",
]

FIELDNAMES = [
    "org",
    "territory",
    "homepage_status",
    "page_url",
    "email",
    "nearby_text",
    "proposal_page_url",
    "proposal_snippet",
    "fetched_at",
    "status",
    "flags",
    "unit_relevance",
]

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b")

PROPOSAL_KEYWORDS = ["speaker", "screening", "program"]
REQUEST_WORD = "request"
MAX_SENTENCE_LEN = 300

_robots_cache = {}


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def get_robot_parser(base_url):
    parsed = urllib.parse.urlparse(base_url)
    origin = f"{parsed.scheme}://{parsed.netloc}"
    if origin in _robots_cache:
        return _robots_cache[origin]
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(urllib.parse.urljoin(origin, "/robots.txt"))
    try:
        rp.read()
    except Exception:
        rp = None
    _robots_cache[origin] = rp
    return rp


def robots_allows(url):
    rp = get_robot_parser(url)
    if rp is None:
        return True
    try:
        return rp.can_fetch(USER_AGENT, url)
    except Exception:
        return True


def fetch(url, retried=False):
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
        if resp.status_code >= 400:
            return None, url, f"http_{resp.status_code}"
        ctype = resp.headers.get("Content-Type", "")
        if "text/html" not in ctype and "text" not in ctype:
            return None, url, "non_html_content"
        return resp.text, resp.url, None
    except requests.exceptions.RequestException as exc:
        if not retried:
            time.sleep(WAIT_BETWEEN_REQUESTS)
            return fetch(url, retried=True)
        return None, url, f"fetch_error: {exc.__class__.__name__}"


def _context_for_anchor(a, addr):
    node = a
    for _ in range(4):
        block_text = node.get_text(" ", strip=True)
        if block_text and block_text.lower() != addr.lower() and len(block_text) > len(addr):
            idx = block_text.lower().find(addr.lower())
            if idx == -1:
                return block_text[:160]
            start = max(0, idx - 80)
            end = min(len(block_text), idx + len(addr) + 80)
            return re.sub(r"\s+", " ", block_text[start:end]).strip()
        if node.parent is None:
            break
        node = node.parent
    return a.get_text(" ", strip=True) or addr


def extract_emails_with_context(text, html_soup):
    """Return list of (email, nearby_text) found via mailto links and plain text,
    in page order, deduped."""
    results = []
    seen = set()

    for a in html_soup.find_all("a", href=True):
        href = a["href"]
        if href.lower().startswith("mailto:"):
            addr = href[7:].split("?")[0].strip()
            if addr and addr.lower() not in seen:
                seen.add(addr.lower())
                context = _context_for_anchor(a, addr)
                results.append((addr, context[:160]))

    for m in EMAIL_RE.finditer(text):
        addr = m.group(0)
        if addr.lower() in seen:
            continue
        seen.add(addr.lower())
        start = max(0, m.start() - 80)
        end = min(len(text), m.end() + 80)
        context = re.sub(r"\s+", " ", text[start:end]).strip()
        results.append((addr, context[:160]))

    return results


def extract_phones(text):
    phones = []
    seen = set()
    for m in PHONE_RE.finditer(text):
        ph = m.group(0)
        if ph in seen:
            continue
        seen.add(ph)
        start = max(0, m.start() - 80)
        end = min(len(text), m.end() + 80)
        context = re.sub(r"\s+", " ", text[start:end]).strip()
        phones.append((ph, context[:160]))
    return phones


def is_role_address(addr):
    low = addr.lower()
    return any(low.startswith(prefix) for prefix in ROLE_ADDRESS_PREFIXES)


def find_proposal_evidence(text, url):
    sentences = re.split(r"(?<=[.!?])\s+", text)
    for sent in sentences:
        if len(sent) > MAX_SENTENCE_LEN:
            continue
        lower = sent.lower()
        if REQUEST_WORD not in lower:
            continue
        for kw in PROPOSAL_KEYWORDS:
            if kw not in lower:
                continue
            for m in re.finditer(re.escape(kw), lower):
                window = lower[max(0, m.start() - 80): m.start() + 80]
                if REQUEST_WORD in window:
                    snippet = re.sub(r"\s+", " ", sent).strip()
                    return url, snippet[:300]
    return None, None


def find_allowed_links(soup, base_url):
    """Links whose anchor text or path contains an allowed keyword. Never
    follows anything that looks like a faculty/staff/people/directory page."""
    candidates = []
    seen = set()
    base_parsed = urllib.parse.urlparse(base_url)
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href or href.startswith("#") or href.lower().startswith(("mailto:", "tel:")):
            continue
        text = a.get_text(" ", strip=True).lower()
        full = urllib.parse.urljoin(base_url, href)
        parsed = urllib.parse.urlparse(full)
        if parsed.scheme not in ("http", "https") or parsed.netloc != base_parsed.netloc:
            continue
        path_lower = parsed.path.lower()
        if any(bad in text or bad in path_lower for bad in ("staff", "faculty", "directory", "people")):
            continue
        if any(kw in text for kw in LINK_KEYWORDS) or any(kw in path_lower for kw in LINK_KEYWORDS):
            norm = full.split("#")[0]
            if norm not in seen:
                seen.add(norm)
                candidates.append(norm)
    return candidates


def page_matches_unit(text, url, unit):
    if not unit:
        return False
    unit_lower = unit.lower()
    return unit_lower in text.lower() or unit_lower in url.lower()


def load_processed_orgs():
    processed = set()
    try:
        with open(OUTPUT_CSV, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                processed.add(row["org"])
    except FileNotFoundError:
        pass
    return processed


def ensure_output_header():
    import os

    os.makedirs("bhm-round2/contacts", exist_ok=True)
    try:
        with open(OUTPUT_CSV, "r", encoding="utf-8"):
            pass
    except FileNotFoundError:
        with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()


def append_rows(rows):
    with open(OUTPUT_CSV, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        for row in rows:
            writer.writerow(row)


def base_row(org_name, territory):
    return {
        "org": org_name,
        "territory": territory,
        "homepage_status": "",
        "page_url": "",
        "email": "",
        "nearby_text": "",
        "proposal_page_url": "",
        "proposal_snippet": "",
        "fetched_at": "",
        "status": "",
        "flags": "",
        "unit_relevance": "",
    }


def process_org(org_name, unit, homepage_url, contact_page_url, territory):
    now = datetime.datetime.utcnow().isoformat() + "Z"
    rows = []
    pages_fetched = 0

    if not robots_allows(homepage_url):
        row = base_row(org_name, territory)
        row.update(homepage_status="robots_disallowed", page_url=homepage_url,
                    fetched_at=now, status="site_failed", flags="robots_disallowed")
        rows.append(row)
        return rows

    html, final_url, err = fetch(homepage_url)
    pages_fetched += 1
    if err:
        row = base_row(org_name, territory)
        row.update(homepage_status="failed", page_url=homepage_url,
                    fetched_at=now, status="site_failed", flags=err)
        rows.append(row)
        return rows

    homepage_status = "opened"

    # Build the page queue: contact_page_url first if present, then homepage,
    # then allowed links discovered from the homepage.
    queue = []
    if contact_page_url and contact_page_url.strip() and contact_page_url.strip().lower() not in ("none seen", "(none seen)", "n/a", ""):
        cp = contact_page_url.strip()
        cp_parsed = urllib.parse.urlparse(cp)
        home_parsed = urllib.parse.urlparse(final_url)
        if cp_parsed.scheme in ("http", "https") and cp_parsed.netloc == home_parsed.netloc:
            queue.append(cp)
    queue.append(final_url)

    visited = set()
    all_emails = []  # (page_url, email, nearby_text, unit_relevance)
    all_phones = []  # (page_url, phone, nearby_text)
    skipped_role_addresses = []  # per-page tracking; collected globally
    directory_capped_pages = []
    proposal_evidence = None

    link_queue = []

    while queue and pages_fetched <= MAX_PAGES_PER_ORG:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)

        if url != final_url:
            if not robots_allows(url):
                continue
            time.sleep(WAIT_BETWEEN_REQUESTS)
            page_html, real_url, page_err = fetch(url)
            pages_fetched += 1
            if page_err or page_html is None:
                continue
        else:
            page_html = html
            real_url = final_url

        soup = BeautifulSoup(page_html, "html.parser")
        text = soup.get_text(" ", strip=True)

        found = extract_emails_with_context(text, soup)
        page_kept = []
        page_skipped_roles = []
        for addr, context in found:
            if is_role_address(addr):
                page_skipped_roles.append(addr)
                continue
            page_kept.append((addr, context))

        capped = False
        if len(page_kept) > MAX_EMAILS_PER_PAGE:
            page_kept = page_kept[:MAX_EMAILS_PER_PAGE]
            capped = True
            directory_capped_pages.append(real_url)

        for addr, context in page_kept:
            relevance = "on_unit_page" if page_matches_unit(text, real_url, unit) else "other_page"
            all_emails.append((real_url, addr, context, relevance, capped))

        if page_skipped_roles:
            skipped_role_addresses.extend(page_skipped_roles)

        if not page_kept:
            for phone, context in extract_phones(text):
                all_phones.append((real_url, phone, context))

        if proposal_evidence is None:
            purl, snippet = find_proposal_evidence(text, real_url)
            if snippet:
                proposal_evidence = (purl, snippet)

        if pages_fetched < MAX_PAGES_PER_ORG and url == final_url:
            for link in find_allowed_links(soup, final_url):
                if link not in visited and link not in queue:
                    link_queue.append(link)

        if not queue and link_queue:
            queue.extend(link_queue[: MAX_PAGES_PER_ORG - pages_fetched])
            link_queue = []

    proposal_url, proposal_snippet = (proposal_evidence or ("", ""))
    skipped_flag = (
        "skipped_role_addresses: " + ",".join(sorted(set(skipped_role_addresses)))
        if skipped_role_addresses else ""
    )

    if all_emails:
        for page_url, email, context, relevance, capped in all_emails:
            flags = []
            if capped:
                flags.append("directory_page_capped")
            if skipped_flag:
                flags.append(skipped_flag)
            row = base_row(org_name, territory)
            row.update(
                homepage_status=homepage_status,
                page_url=page_url,
                email=email,
                nearby_text=context,
                proposal_page_url=proposal_url or "",
                proposal_snippet=proposal_snippet or "",
                fetched_at=now,
                status="ok",
                flags="; ".join(flags),
                unit_relevance=relevance,
            )
            rows.append(row)
    elif all_phones:
        page_url, phone, context = all_phones[0]
        row = base_row(org_name, territory)
        flags = []
        if skipped_flag:
            flags.append(skipped_flag)
        row.update(
            homepage_status=homepage_status,
            page_url=page_url,
            nearby_text=f"phone: {phone} | {context}",
            proposal_page_url=proposal_url or "",
            proposal_snippet=proposal_snippet or "",
            fetched_at=now,
            status="phone_only",
            flags="; ".join(flags),
        )
        rows.append(row)
    else:
        row = base_row(org_name, territory)
        flags = ["no_email_found"]
        if skipped_flag:
            flags.append(skipped_flag)
        row.update(
            homepage_status=homepage_status,
            page_url=final_url,
            proposal_page_url=proposal_url or "",
            proposal_snippet=proposal_snippet or "",
            fetched_at=now,
            status="no_email_found",
            flags="; ".join(flags),
        )
        rows.append(row)

    return rows


def main():
    limit = None
    if len(sys.argv) > 1:
        limit = int(sys.argv[1])

    ensure_output_header()
    processed = load_processed_orgs()

    with open(INPUT_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        orgs = list(reader)

    count = 0
    for row in orgs:
        if limit is not None and count >= limit:
            break
        org_name = row["org_name"].strip()
        unit = row.get("unit", "").strip()
        homepage_url = row["homepage_url"].strip()
        contact_page_url = row.get("contact_page_url", "").strip()
        territory = row.get("territory", "").strip()

        if org_name in processed:
            log(f"skip (already processed): {org_name}")
            continue

        log(f"processing: {org_name}  {homepage_url}")
        try:
            rows = process_org(org_name, unit, homepage_url, contact_page_url, territory)
        except Exception as exc:
            row_out = base_row(org_name, territory)
            row_out.update(
                homepage_status="error",
                page_url=homepage_url,
                fetched_at=datetime.datetime.utcnow().isoformat() + "Z",
                status="site_failed",
                flags=f"unexpected_error: {exc.__class__.__name__}",
            )
            rows = [row_out]
        append_rows(rows)
        count += 1
        time.sleep(WAIT_BETWEEN_REQUESTS)

    log(f"done. processed {count} organizations this run.")


if __name__ == "__main__":
    main()
