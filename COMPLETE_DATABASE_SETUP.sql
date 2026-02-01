-- ============================================
-- TravelPro Complete Database Setup
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Create Helper Functions
-- ============================================

-- Function to get current user's agency_id
CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result UUID;
BEGIN
  SELECT agency_id INTO result
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN result;
END;
$$;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result TEXT;
BEGIN
  SELECT role INTO result
  FROM public.users
  WHERE id = auth.uid();
  
  RETURN result;
END;
$$;

-- ============================================
-- STEP 2: Create Tables
-- ============================================

-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  logo_dark_url TEXT,
  primary_color TEXT DEFAULT '#2563eb',
  secondary_color TEXT DEFAULT '#059669',
  contact_email TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  address TEXT,
  website TEXT,
  default_currency TEXT DEFAULT 'USD',
  default_language TEXT DEFAULT 'he',
  terms_text TEXT,
  email_signature TEXT,
  pdf_footer_text TEXT,
  subscription_plan TEXT DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'expired', 'cancelled')),
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  code TEXT NOT NULL,
  currency TEXT NOT NULL,
  currency_symbol TEXT,
  language TEXT,
  timezone TEXT,
  visa_info TEXT,
  best_season TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_en TEXT,
  region TEXT,
  airport_code TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  highlights JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  image_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  notes TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  country_id UUID REFERENCES countries(id),
  client_id UUID REFERENCES clients(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  currency TEXT DEFAULT 'USD',
  total_price DECIMAL DEFAULT 0,
  adults INTEGER DEFAULT 2,
  children INTEGER DEFAULT 0,
  infants INTEGER DEFAULT 0,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  client_notes TEXT,
  internal_notes TEXT,
  public_token TEXT UNIQUE,
  public_expires_at TIMESTAMPTZ,
  language TEXT DEFAULT 'he',
  sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  duplicated_from UUID REFERENCES packages(id),
  template_id UUID REFERENCES templates(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Package days table
CREATE TABLE IF NOT EXISTS package_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE,
  title TEXT NOT NULL,
  destination_id UUID REFERENCES destinations(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(package_id, day_number)
);

-- Package items table
CREATE TABLE IF NOT EXISTS package_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES package_days(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('flight', 'accommodation', 'transfer', 'activity', 'meal', 'transition', 'free_time', 'custom')),
  sort_order INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  time_start TEXT,
  time_end TEXT,
  duration TEXT,
  price DECIMAL DEFAULT 0,
  price_per TEXT DEFAULT 'total' CHECK (price_per IN ('total', 'person', 'night', 'unit')),
  notes TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  is_included BOOLEAN DEFAULT true,
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  country_id UUID REFERENCES countries(id),
  duration_days INTEGER,
  base_price DECIMAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'deleted', 'sent', 'confirmed', 'cancelled', 'duplicated', 'viewed', 'downloaded')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('package', 'client', 'country', 'destination', 'template')),
  entity_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- STEP 3: Create Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_agency_id ON users(agency_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_agencies_slug ON agencies(slug);
CREATE INDEX IF NOT EXISTS idx_countries_agency_id ON countries(agency_id);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(code);
CREATE INDEX IF NOT EXISTS idx_destinations_agency_id ON destinations(agency_id);
CREATE INDEX IF NOT EXISTS idx_destinations_country_id ON destinations(country_id);
CREATE INDEX IF NOT EXISTS idx_clients_agency_id ON clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_packages_agency_id ON packages(agency_id);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_country_id ON packages(country_id);
CREATE INDEX IF NOT EXISTS idx_packages_client_id ON packages(client_id);
CREATE INDEX IF NOT EXISTS idx_packages_public_token ON packages(public_token);
CREATE INDEX IF NOT EXISTS idx_packages_created_by ON packages(created_by);
CREATE INDEX IF NOT EXISTS idx_package_days_package_id ON package_days(package_id);
CREATE INDEX IF NOT EXISTS idx_package_days_agency_id ON package_days(agency_id);
CREATE INDEX IF NOT EXISTS idx_package_items_day_id ON package_items(day_id);
CREATE INDEX IF NOT EXISTS idx_package_items_package_id ON package_items(package_id);
CREATE INDEX IF NOT EXISTS idx_package_items_agency_id ON package_items(agency_id);
CREATE INDEX IF NOT EXISTS idx_package_items_type ON package_items(type);
CREATE INDEX IF NOT EXISTS idx_templates_agency_id ON templates(agency_id);
CREATE INDEX IF NOT EXISTS idx_templates_country_id ON templates(country_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_agency_id ON activity_log(agency_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON activity_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_id ON activity_log(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- ============================================
-- STEP 4: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Drop Existing Policies (if any)
-- ============================================

DROP POLICY IF EXISTS "agencies_select" ON agencies;
DROP POLICY IF EXISTS "agencies_insert" ON agencies;
DROP POLICY IF EXISTS "agencies_update" ON agencies;
DROP POLICY IF EXISTS "agencies_delete" ON agencies;

DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;

DROP POLICY IF EXISTS "countries_select" ON countries;
DROP POLICY IF EXISTS "countries_insert" ON countries;
DROP POLICY IF EXISTS "countries_update" ON countries;
DROP POLICY IF EXISTS "countries_delete" ON countries;

DROP POLICY IF EXISTS "destinations_select" ON destinations;
DROP POLICY IF EXISTS "destinations_insert" ON destinations;
DROP POLICY IF EXISTS "destinations_update" ON destinations;
DROP POLICY IF EXISTS "destinations_delete" ON destinations;

DROP POLICY IF EXISTS "clients_select" ON clients;
DROP POLICY IF EXISTS "clients_insert" ON clients;
DROP POLICY IF EXISTS "clients_update" ON clients;
DROP POLICY IF EXISTS "clients_delete" ON clients;

DROP POLICY IF EXISTS "packages_select" ON packages;
DROP POLICY IF EXISTS "packages_insert" ON packages;
DROP POLICY IF EXISTS "packages_update" ON packages;
DROP POLICY IF EXISTS "packages_delete" ON packages;

DROP POLICY IF EXISTS "package_days_select" ON package_days;
DROP POLICY IF EXISTS "package_days_insert" ON package_days;
DROP POLICY IF EXISTS "package_days_update" ON package_days;
DROP POLICY IF EXISTS "package_days_delete" ON package_days;

DROP POLICY IF EXISTS "package_items_select" ON package_items;
DROP POLICY IF EXISTS "package_items_insert" ON package_items;
DROP POLICY IF EXISTS "package_items_update" ON package_items;
DROP POLICY IF EXISTS "package_items_delete" ON package_items;

DROP POLICY IF EXISTS "templates_select" ON templates;
DROP POLICY IF EXISTS "templates_insert" ON templates;
DROP POLICY IF EXISTS "templates_update" ON templates;
DROP POLICY IF EXISTS "templates_delete" ON templates;

DROP POLICY IF EXISTS "activity_log_select" ON activity_log;
DROP POLICY IF EXISTS "activity_log_insert" ON activity_log;

-- ============================================
-- STEP 6: Create RLS Policies
-- ============================================

-- Agencies policies
CREATE POLICY "agencies_select" ON agencies
  FOR SELECT
  USING (id = get_user_agency_id() OR id IN (SELECT agency_id FROM users WHERE id = auth.uid()));

CREATE POLICY "agencies_insert" ON agencies
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "agencies_update" ON agencies
  FOR UPDATE
  USING (id = get_user_agency_id() AND (get_user_role() IN ('admin', 'owner')));

CREATE POLICY "agencies_delete" ON agencies
  FOR DELETE
  USING (id = get_user_agency_id() AND get_user_role() = 'owner');

-- Users policies
CREATE POLICY "users_select" ON users
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "users_insert" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update" ON users
  FOR UPDATE
  USING (id = auth.uid() OR (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner')));

-- Countries policies
CREATE POLICY "countries_select" ON countries
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "countries_insert" ON countries
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner', 'agent'));

CREATE POLICY "countries_update" ON countries
  FOR UPDATE
  USING (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner', 'agent'));

CREATE POLICY "countries_delete" ON countries
  FOR DELETE
  USING (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner'));

-- Destinations policies
CREATE POLICY "destinations_select" ON destinations
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "destinations_insert" ON destinations
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "destinations_update" ON destinations
  FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "destinations_delete" ON destinations
  FOR DELETE
  USING (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner'));

-- Clients policies
CREATE POLICY "clients_select" ON clients
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "clients_insert" ON clients
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "clients_update" ON clients
  FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "clients_delete" ON clients
  FOR DELETE
  USING (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner'));

-- Packages policies
CREATE POLICY "packages_select" ON packages
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "packages_insert" ON packages
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "packages_update" ON packages
  FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "packages_delete" ON packages
  FOR DELETE
  USING (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner'));

-- Package days policies
CREATE POLICY "package_days_select" ON package_days
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "package_days_insert" ON package_days
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "package_days_update" ON package_days
  FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "package_days_delete" ON package_days
  FOR DELETE
  USING (agency_id = get_user_agency_id());

-- Package items policies
CREATE POLICY "package_items_select" ON package_items
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "package_items_insert" ON package_items
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "package_items_update" ON package_items
  FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "package_items_delete" ON package_items
  FOR DELETE
  USING (agency_id = get_user_agency_id());

-- Templates policies
CREATE POLICY "templates_select" ON templates
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "templates_insert" ON templates
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

CREATE POLICY "templates_update" ON templates
  FOR UPDATE
  USING (agency_id = get_user_agency_id());

CREATE POLICY "templates_delete" ON templates
  FOR DELETE
  USING (agency_id = get_user_agency_id() AND get_user_role() IN ('admin', 'owner'));

-- Activity log policies
CREATE POLICY "activity_log_select" ON activity_log
  FOR SELECT
  USING (agency_id = get_user_agency_id());

CREATE POLICY "activity_log_insert" ON activity_log
  FOR INSERT
  WITH CHECK (agency_id = get_user_agency_id());

-- ============================================
-- STEP 7: Create Triggers for updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_days_updated_at BEFORE UPDATE ON package_days
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_items_updated_at BEFORE UPDATE ON package_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE! All tables and policies are created
-- ============================================

-- Verify tables were created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;
