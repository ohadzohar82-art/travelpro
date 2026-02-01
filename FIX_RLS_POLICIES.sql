-- Fix for infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view users in their agency" ON users;
DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can update their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can update their own record" ON users;

-- Fix: Create a function to get user's agency_id (avoids recursion)
CREATE OR REPLACE FUNCTION get_user_agency_id()
RETURNS UUID AS $$
  SELECT agency_id FROM users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Better RLS Policies for users table
-- Allow users to insert their own record (needed for signup)
CREATE POLICY "Users can insert their own record"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own record
CREATE POLICY "Users can view their own record"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to view other users in their agency (using the function to avoid recursion)
CREATE POLICY "Users can view agency members"
  ON users FOR SELECT
  USING (
    agency_id = get_user_agency_id() OR
    auth.uid() = id
  );

-- Allow users to update their own record
CREATE POLICY "Users can update their own record"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Better RLS Policies for agencies table
-- Allow authenticated users to create agencies (needed for signup)
CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow users to view their own agency
CREATE POLICY "Users can view their agency"
  ON agencies FOR SELECT
  USING (id = get_user_agency_id());

-- Allow users to update their own agency
CREATE POLICY "Users can update their agency"
  ON agencies FOR UPDATE
  USING (id = get_user_agency_id())
  WITH CHECK (id = get_user_agency_id());
