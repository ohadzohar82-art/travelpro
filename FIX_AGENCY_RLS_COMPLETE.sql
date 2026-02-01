-- Complete fix for agencies RLS - drops ALL policies first
-- Run this in Supabase SQL Editor

-- Drop ALL existing agencies policies (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can view their agency" ON agencies;
DROP POLICY IF EXISTS "Authenticated users can create agencies" ON agencies;
DROP POLICY IF EXISTS "Authenticated users can view agencies" ON agencies;
DROP POLICY IF EXISTS "Users can update their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can update their agency" ON agencies;

-- Now create the policies fresh

-- Policy 1: Allow authenticated users to INSERT agencies (for signup)
CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 2: Allow authenticated users to SELECT agencies (needed to read back after insert)
CREATE POLICY "Authenticated users can view agencies"
  ON agencies FOR SELECT
  USING (
    auth.role() = 'authenticated' OR
    id = get_user_agency_id()
  );

-- Policy 3: Allow users to update their agency
CREATE POLICY "Users can update their agency"
  ON agencies FOR UPDATE
  USING (id = get_user_agency_id())
  WITH CHECK (id = get_user_agency_id());
