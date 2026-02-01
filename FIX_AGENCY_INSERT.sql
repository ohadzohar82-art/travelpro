-- Fix: Allow agencies to be created during signup
-- Run this in Supabase SQL Editor

-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can create agencies" ON agencies;

-- Create a new policy that allows any authenticated user to create agencies
-- This is needed for the signup flow
CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Also make sure the policy allows viewing agencies that were just created
-- (This might be needed if there's a timing issue)
DROP POLICY IF EXISTS "Users can view their agency" ON agencies;

CREATE POLICY "Users can view their agency"
  ON agencies FOR SELECT
  USING (
    id = get_user_agency_id() OR
    -- Allow viewing if you're authenticated (needed during signup)
    auth.role() = 'authenticated'
  );
