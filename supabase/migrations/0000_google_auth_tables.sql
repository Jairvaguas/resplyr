-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- google_accounts table
CREATE TABLE IF NOT EXISTS public.google_accounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL UNIQUE,
    access_token text NOT NULL,
    refresh_token text,
    expires_at timestamptz,
    scope text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text NOT NULL,
    google_location_id text NOT NULL UNIQUE,
    name text NOT NULL,
    address text,
    created_at timestamptz DEFAULT now()
);

-- reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    google_review_id text NOT NULL UNIQUE,
    reviewer_name text,
    rating integer,
    comment text,
    replied boolean DEFAULT false,
    reply_text text,
    review_date timestamptz,
    created_at timestamptz DEFAULT now()
);

-- Row Level Security (RLS) setup
ALTER TABLE public.google_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for google_accounts
CREATE POLICY "Users can view own google accounts" ON public.google_accounts 
FOR SELECT USING (user_id = auth.uid()::text);

-- Create policies for locations
CREATE POLICY "Users can view own locations" ON public.locations 
FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own locations" ON public.locations 
FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own locations" ON public.locations 
FOR UPDATE USING (user_id = auth.uid()::text);

-- Create policies for reviews
CREATE POLICY "Users can view own reviews" ON public.reviews 
FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert own reviews" ON public.reviews 
FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update own reviews" ON public.reviews 
FOR UPDATE USING (user_id = auth.uid()::text);

-- Helper functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_google_accounts_updated_at
    BEFORE UPDATE ON public.google_accounts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
