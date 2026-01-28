-- Remove the public SELECT policy that exposes all unclaimed access codes
-- The claim_access_code RPC function already handles secure validation and claiming
DROP POLICY IF EXISTS "Anyone can view unclaimed codes" ON public.access_codes;