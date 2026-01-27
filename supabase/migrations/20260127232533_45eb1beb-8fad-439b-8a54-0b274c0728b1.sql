-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for user status
CREATE TYPE public.user_status AS ENUM ('started', 'survey_complete', 'modules_complete');

-- Create enum for pulse survey type
CREATE TYPE public.pulse_type AS ENUM ('pre', 'post');

-- Create users/profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    access_code_used TEXT,
    status public.user_status DEFAULT 'started',
    modules_completed TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Create seat inventory table
CREATE TABLE public.seat_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_seats INTEGER DEFAULT 500,
    claimed_seats INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial seat inventory
INSERT INTO public.seat_inventory (total_seats, claimed_seats) VALUES (500, 0);

-- Create pulse surveys table
CREATE TABLE public.pulse_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type public.pulse_type NOT NULL,
    q1_score INTEGER CHECK (q1_score >= 1 AND q1_score <= 5),
    q2_score INTEGER CHECK (q2_score >= 1 AND q2_score <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create friction logs table (Module 1)
CREATE TABLE public.friction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    struggle_1 TEXT NOT NULL,
    struggle_2 TEXT NOT NULL,
    struggle_3 TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mundane makeover table (Module 2)
CREATE TABLE public.mundane_makeover (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    redesign_description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visibility signals table (Module 3)
CREATE TABLE public.visibility_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    colleague_name TEXT NOT NULL,
    impact_note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pulse_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mundane_makeover ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visibility_signals ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Seat inventory policies (public read, admin update)
CREATE POLICY "Anyone can view seat inventory" ON public.seat_inventory
    FOR SELECT USING (true);

CREATE POLICY "Admins can update seat inventory" ON public.seat_inventory
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Pulse surveys policies
CREATE POLICY "Users can view own surveys" ON public.pulse_surveys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surveys" ON public.pulse_surveys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all surveys" ON public.pulse_surveys
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Friction logs policies
CREATE POLICY "Users can view own friction logs" ON public.friction_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own friction logs" ON public.friction_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all friction logs" ON public.friction_logs
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Mundane makeover policies
CREATE POLICY "Users can view own makeover" ON public.mundane_makeover
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own makeover" ON public.mundane_makeover
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Visibility signals policies
CREATE POLICY "Users can view own signals" ON public.visibility_signals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own signals" ON public.visibility_signals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to claim a seat (atomic operation)
CREATE OR REPLACE FUNCTION public.claim_seat()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_claimed INTEGER;
    max_seats INTEGER;
BEGIN
    SELECT claimed_seats, total_seats INTO current_claimed, max_seats
    FROM public.seat_inventory
    LIMIT 1
    FOR UPDATE;
    
    IF current_claimed < max_seats THEN
        UPDATE public.seat_inventory
        SET claimed_seats = claimed_seats + 1;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;