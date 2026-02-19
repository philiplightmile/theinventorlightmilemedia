import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function derivePassword(email: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email.toLowerCase() + secret);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return encodeHex(new Uint8Array(hash)) + "A1!";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName } = await req.json();

    if (!email || !firstName || !lastName) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Derive a deterministic password from email + service role key
    const password = await derivePassword(email, serviceRoleKey);

    // Try signing in first (returning user)
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInData?.session) {
      // Update name if needed
      await supabaseAdmin
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("user_id", signInData.user.id);

      return new Response(
        JSON.stringify({
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // New user — create with admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName },
    });

    if (createError) {
      // User exists but password doesn't match — reset password
      if (createError.message?.includes("already been registered")) {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        const existing = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (existing) {
          await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
          const { data: retryData, error: retryError } = await anonClient.auth.signInWithPassword({
            email,
            password,
          });
          if (retryError) throw retryError;

          await supabaseAdmin
            .from("profiles")
            .update({ first_name: firstName, last_name: lastName })
            .eq("user_id", retryData.user.id);

          return new Response(
            JSON.stringify({
              access_token: retryData.session.access_token,
              refresh_token: retryData.session.refresh_token,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      }
      throw createError;
    }

    // Sign in the newly created user
    const { data: newSignIn, error: newSignInError } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (newSignInError) throw newSignInError;

    return new Response(
      JSON.stringify({
        access_token: newSignIn.session.access_token,
        refresh_token: newSignIn.session.refresh_token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("instant-auth error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
