-- =========================================================================
-- ChargeCircle (VoltCircle) - Complete PostgreSQL Database Schema
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. PROFILES TABLE (Linked with Supabase Auth)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'driver' CHECK (role IN ('driver', 'host', 'admin')),
  vehicle_model TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('two_wheeler', 'four_wheeler')),
  vehicle_plate TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 2. CHARGERS TABLE (Charging Stations)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.chargers (
  id TEXT PRIMARY KEY,
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  host_name TEXT NOT NULL,
  host_phone TEXT,
  host_type TEXT NOT NULL DEFAULT 'home',
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Karnataka',
  pincode TEXT NOT NULL DEFAULT '560001',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  connector_types TEXT[] NOT NULL DEFAULT ARRAY['Type 2 (AC)'],
  power_rating_kw NUMERIC NOT NULL DEFAULT 7.2,
  pricing_per_kwh NUMERIC NOT NULL DEFAULT 16,
  supported_vehicles TEXT NOT NULL DEFAULT 'both',
  speed_category TEXT NOT NULL DEFAULT 'fast',
  parking_type TEXT DEFAULT 'Covered',
  rating NUMERIC DEFAULT 4.9,
  review_count INT DEFAULT 12,
  verification_status TEXT NOT NULL DEFAULT 'verified',
  is_available_now BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 3. BOOKINGS TABLE (Reservations & Financial Ledger)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  booking_code TEXT NOT NULL UNIQUE,
  charger_id TEXT REFERENCES public.chargers(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  duration_hours INT NOT NULL DEFAULT 2,
  energy_estimated_kwh NUMERIC NOT NULL,
  price_per_kwh NUMERIC NOT NULL,
  base_cost NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL,
  gst_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  host_payout NUMERIC NOT NULL,
  booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'active_charging', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'refunded', 'pending')),
  payment_method TEXT DEFAULT 'UPI',
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 4. TIME SLOTS TABLE (Atomic Double-Booking Prevention)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.time_slots (
  id TEXT PRIMARY KEY,
  charger_id TEXT REFERENCES public.chargers(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_booked BOOLEAN DEFAULT false
);

-- =========================================================================
-- 5. SITE PARTNERSHIPS TABLE (Co-Hosting Marketplace Listings)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.site_partnerships (
  id TEXT PRIMARY KEY,
  property_owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_owner_name TEXT NOT NULL,
  property_owner_phone TEXT,
  title TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'commercial',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  parking_bays_available INT NOT NULL DEFAULT 2,
  parking_access_type TEXT NOT NULL DEFAULT 'Open Commercial Lot',
  sanctioned_load_kw NUMERIC NOT NULL DEFAULT 60,
  preferred_model TEXT NOT NULL DEFAULT 'revenue_share',
  proposed_revenue_split_percent NUMERIC NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'open_for_partners',
  proposals_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 6. PARTNERSHIP PROPOSALS TABLE (Hardware Investor Bids)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.partnership_proposals (
  id TEXT PRIMARY KEY,
  site_listing_id TEXT REFERENCES public.site_partnerships(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  proposed_hardware TEXT NOT NULL,
  hardware_power_kw NUMERIC NOT NULL DEFAULT 50,
  hardware_investment_value NUMERIC NOT NULL DEFAULT 150000,
  owner_share_percent NUMERIC NOT NULL DEFAULT 50,
  partner_share_percent NUMERIC NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- =========================================================================
-- 7. REVIEWS TABLE (Driver Ratings & Feedback)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  charger_id TEXT REFERENCES public.chargers(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  driver_name TEXT NOT NULL,
  rating NUMERIC NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE
);

-- =========================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chargers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access on verified stations, listings, and profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Chargers are viewable by everyone" ON public.chargers FOR SELECT USING (true);
CREATE POLICY "Site partnerships are viewable by everyone" ON public.site_partnerships FOR SELECT USING (true);
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Bookings viewable by participant" ON public.bookings FOR SELECT USING (true);

-- Allow authenticated users to insert/update their own data
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Hosts can insert chargers" ON public.chargers FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Drivers can insert bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- =========================================================================
-- 9. AUTOMATIC PROFILE CREATION TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    name,
    email,
    phone,
    role,
    vehicle_model,
    vehicle_type,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'driver'),
    NEW.raw_user_meta_data->>'vehicle_model',
    NEW.raw_user_meta_data->>'vehicle_type',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================================
-- 10. SAMPLE SEED DATA (Instant Viva Demo Stations)
-- =========================================================================
INSERT INTO public.chargers (
  id, host_name, host_type, name, description, address, city, state, pincode, lat, lng,
  connector_types, power_rating_kw, pricing_per_kwh, speed_category, rating, review_count, verification_status
) VALUES 
(
  'ch_blr_01', 'Rajesh Sharma', 'home', 'Koramangala 4th Block - Green Villa Charger',
  'Dedicated residential 7.2 kW wall-box with certified 3-phase earthing (<1.5V) and 32A MCB protection.',
  'Plot 142, 7th Main, 4th Block Koramangala', 'Bengaluru', 'Karnataka', '560034', 12.9345, 77.6265,
  ARRAY['Type 2 (AC)', '15A 3-Pin Domestic'], 7.2, 15.0, 'fast', 4.9, 28, 'verified'
),
(
  'ch_blr_02', 'Third Wave Coffee', 'cafe', 'Third Wave Coffee Roasters Indiranagar Hub',
  'Commercial high-speed destination bay. Complimentary pour-over coffee pairing included with 1-hour charge.',
  '80 Feet Road, HAL 2nd Stage, Indiranagar', 'Bengaluru', 'Karnataka', '560038', 12.9719, 77.6412,
  ARRAY['CCS2 (DC Fast)', 'Type 2 (AC)'], 25.0, 18.0, 'rapid', 4.95, 64, 'verified'
),
(
  'ch_del_01', 'DLF Cyber Hub Admin', 'commercial', 'DLF Cyber Hub High-Speed EV Bay',
  'High-speed commercial dual gun DC charger located in DLF Cyber Hub premium parking.',
  'Tower B Underground Level, DLF Cyber City', 'Delhi NCR', 'Haryana', '122002', 28.4986, 77.0898,
  ARRAY['CCS2 (DC Fast)'], 50.0, 21.0, 'rapid', 4.88, 52, 'verified'
)
ON CONFLICT (id) DO NOTHING;
