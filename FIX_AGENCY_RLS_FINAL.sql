-- Final fix for agencies RLS policy to allow signup
-- Run this in Supabase SQL Editor

-- Drop existing agencies policies
DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can view their agency" ON agencies;
DROP POLICY IF EXISTS "Authenticated users can create agencies" ON agencies;
DROP POLICY IF EXISTS "Users can update their own agency" ON agencies;
DROP POLICY IF EXISTS "Users can update their agency" ON agencies;

-- Policy 1: Allow authenticated users to INSERT agencies (for signup)
CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 2: Allow authenticated users to SELECT agencies they just created
-- This is needed because after inserting, we need to read it back
CREATE POLICY "Authenticated users can view agencies"
  ON agencies FOR SELECT
  USING (
    -- Allow if authenticated (needed during signup to read back the inserted agency)
    auth.role() = 'authenticated' OR
    -- Or if it's their agency (for normal operations)
    id = get_user_agency_id()
  );

-- Policy 3: Allow users to update their agency
CREATE POLICY "Users can update their agency"
  ON agencies FOR UPDATE
  USING (id = get_user_agency_id())
  WITH CHECK (id = get_user_agency_id());
