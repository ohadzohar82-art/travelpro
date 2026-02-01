-- Complete fix for RLS policies - drops all existing policies first
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own record" ON users;
DROP POLICY IF EXISTS "Users can view their own record" ON users;
DROP POLICY IF EXISTS "Users can view users in their agency" ON users;
DROP POLICY IF EXISTS "Users can view agency members" ON users;
DROP POLICY IF EXISTS "Users can update their own record" ON users;

DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can view their agency" ON agencies;
DROP POLICY IF EXISTS "Authenticated users can create agencies" ON agencies;
DROP POLICY IF EXISTS "Users can update their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can update their agency" ON agencies;

-- Drop the function if it exists and recreate it
DROP FUNCTION IF EXISTS get_user_agency_id();

-- Create a helper function to avoid recursion
CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create RLS Policies for users table (fixed to avoid recursion)
CREATE POLICY "Users can insert their own record"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view agency members"
  ON users FOR SELECT
  USING (
    agency_id = get_user_agency_id() OR
    auth.uid() = id
  );

CREATE POLICY "Users can update their own record"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS Policies for agencies table (fixed to avoid recursion)
CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their agency"
  ON agencies FOR SELECT
  USING (id = get_user_agency_id());

CREATE POLICY "Users can update their agency"
  ON agencies FOR UPDATE
  USING (id = get_user_agency_id())
  WITH CHECK (id = get_user_agency_id());
