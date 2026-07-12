-- ========================================================
-- Schema: LoveSync Database Setup
-- Copy and paste this directly into Supabase SQL Editor
-- ========================================================

-- 1. Create Couples Table
CREATE TABLE public.couples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    slots INT DEFAULT 10 NOT NULL,
    profile_avatar_url VARCHAR(500) DEFAULT NULL
);

-- 2. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ,
    name TEXT,
    email TEXT,
    couple_id UUID REFERENCES public.couples(id) ON DELETE SET NULL,
    invite_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create Dates Table (Remembrances)
CREATE TABLE public.dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    date_time TIMESTAMPTZ NOT NULL,
    description TEXT,
    rating_user_1 NUMERIC(2,1) DEFAULT 5.0 NOT NULL,
    rating_user_2 NUMERIC(2,1) DEFAULT 5.0 NOT NULL,
    photo_url TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ========================================================
-- Row Level Security (RLS) Policies
-- Ensures security and privacy (couple data separation)
-- ========================================================

ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dates ENABLE ROW LEVEL SECURITY;

-- Couples Policies
CREATE POLICY "Users can view their own couple record" ON public.couples
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.couple_id = couples.id AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own couple record" ON public.couples
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.couple_id = couples.id AND profiles.id = auth.uid()
        )
    );

-- Profiles Policies
CREATE POLICY "Users can view all profiles (needed for invitation lookup)" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Dates Policies
CREATE POLICY "Users can view dates belonging to their couple" ON public.dates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.couple_id = dates.couple_id AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can insert dates into their couple" ON public.dates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.couple_id = dates.couple_id AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can update dates from their couple" ON public.dates
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.couple_id = dates.couple_id AND profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can delete dates from their couple" ON public.dates
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.couple_id = dates.couple_id AND profiles.id = auth.uid()
        )
    );

-- ========================================================
-- Triggers: Auto-create Profile on Sign Up
-- ========================================================

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, invite_code)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', 'Pareja'),
        'LVSY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
