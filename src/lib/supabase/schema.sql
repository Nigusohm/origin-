-- ORIGIN AND EVERLASTING TRADING PLC — SUPABASE DATABASE SCHEMA

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Products Table (B-VIBE Garment)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_etb NUMERIC(10,2) NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  category TEXT CHECK (category IN ('traditional','corporate','mini-me','custom')),
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb,
  is_wholesale BOOLEAN DEFAULT false,
  wholesale_tiers JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  fabric_details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_etb NUMERIC(10,2) NOT NULL,
  total_usd NUMERIC(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('chapa','stripe')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
  chapa_tx_ref TEXT,
  stripe_payment_intent TEXT,
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Case Studies Table (Tx Digital Marketing)
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'brand-identity',
  campaign_type TEXT[] DEFAULT '{}',
  cover_image TEXT,
  before_image TEXT,
  after_image TEXT,
  brief TEXT,
  process JSONB DEFAULT '[]'::jsonb,
  metrics JSONB DEFAULT '[]'::jsonb,
  collateral TEXT[] DEFAULT '{}',
  testimonial JSONB,
  published_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  case_study_id UUID REFERENCES case_studies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Consulting Slots Table
CREATE TABLE IF NOT EXISTS consulting_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  session_type TEXT CHECK (session_type IN ('discovery','advisory','workshop')),
  duration_min INTEGER DEFAULT 60,
  is_booked BOOLEAN DEFAULT false,
  booking_id UUID,
  UNIQUE(date, time)
);

-- 6. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES consulting_slots(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  organization TEXT,
  role TEXT,
  session_type TEXT CHECK (session_type IN ('discovery','advisory','workshop')),
  description TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Foreign key link back to consulting_slots
ALTER TABLE consulting_slots 
  ADD CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- 7. Resources Table (Strategic Consulting Hub)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('whitepaper','analysis','brief','case-study','ai-doc')),
  industry TEXT,
  excerpt TEXT,
  content_mdx TEXT NOT NULL,
  pdf_url TEXT,
  is_gated BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Comments Table (Resource Knowledge Base)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_verified_pro BOOLEAN DEFAULT false,
  is_spam BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE consulting_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public products view" ON products FOR SELECT USING (true);
CREATE POLICY "Public case studies view" ON case_studies FOR SELECT USING (true);
CREATE POLICY "Public reviews view" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public consulting slots view" ON consulting_slots FOR SELECT USING (true);
CREATE POLICY "Public resources view" ON resources FOR SELECT USING (true);
CREATE POLICY "Public comments view" ON comments FOR SELECT USING (true);

-- Authenticated / Insert Policies
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);
CREATE POLICY "Anyone insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone insert reviews" ON reviews FOR INSERT WITH CHECK (true);
