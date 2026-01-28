-- Create access_codes table for individual code tracking
CREATE TABLE public.access_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  is_claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can check if a code exists and is unclaimed (for login validation)
CREATE POLICY "Anyone can view unclaimed codes"
ON public.access_codes
FOR SELECT
USING (is_claimed = false);

-- Users can view their own claimed code
CREATE POLICY "Users can view own claimed code"
ON public.access_codes
FOR SELECT
USING (claimed_by_user_id = auth.uid());

-- Allow updates to claim codes (will be done via function)
CREATE POLICY "Allow claiming codes"
ON public.access_codes
FOR UPDATE
USING (is_claimed = false)
WITH CHECK (claimed_by_user_id = auth.uid());

-- Only admins can insert new codes
CREATE POLICY "Admins can insert codes"
ON public.access_codes
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete codes
CREATE POLICY "Admins can delete codes"
ON public.access_codes
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all codes
CREATE POLICY "Admins can view all codes"
ON public.access_codes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Function to claim an access code atomically
CREATE OR REPLACE FUNCTION public.claim_access_code(code_to_claim TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_id UUID;
BEGIN
  -- Find and lock the code
  SELECT id INTO code_id
  FROM public.access_codes
  WHERE code = UPPER(code_to_claim)
    AND is_claimed = false
  FOR UPDATE SKIP LOCKED;
  
  IF code_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Claim the code
  UPDATE public.access_codes
  SET is_claimed = true,
      claimed_by_user_id = auth.uid(),
      claimed_at = now()
  WHERE id = code_id;
  
  RETURN TRUE;
END;
$$;

-- Function to generate access codes (admin only)
CREATE OR REPLACE FUNCTION public.generate_access_codes(num_codes INTEGER DEFAULT 500)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  i INTEGER := 0;
  new_code TEXT;
  inserted_count INTEGER := 0;
BEGIN
  -- Check if caller is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can generate codes';
  END IF;
  
  WHILE i < num_codes LOOP
    -- Generate code like EOS-XXXX (4 alphanumeric chars)
    new_code := 'EOS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 4));
    
    -- Try to insert (skip if duplicate)
    BEGIN
      INSERT INTO public.access_codes (code) VALUES (new_code);
      inserted_count := inserted_count + 1;
    EXCEPTION WHEN unique_violation THEN
      -- Skip duplicates, will try again
    END;
    
    i := i + 1;
  END LOOP;
  
  RETURN inserted_count;
END;
$$;

-- Add q3_score and q4_score columns to pulse_surveys for 4-question surveys
ALTER TABLE public.pulse_surveys
ADD COLUMN IF NOT EXISTS q3_score INTEGER,
ADD COLUMN IF NOT EXISTS q4_score INTEGER;