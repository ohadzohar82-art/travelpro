# Quick Supabase Setup - Step by Step

## Step 1: Create a New Project in Supabase

1. Go to your Supabase dashboard: https://app.supabase.com
2. Click the **"New Project"** button (top right)
3. Fill in:
   - **Name**: `travelpro` (or any name you like)
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose the closest region to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be ready

## Step 2: Get Your Credentials

1. Once your project is ready, click on it
2. Go to **Settings** (gear icon in left sidebar)
3. Click **"API"** in the settings menu
4. You'll see two important values:
   - **Project URL** - Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public** key - Copy this (starts with `eyJ...`)

## Step 3: Create Database Tables

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste this SQL code:

```sql
-- Create agencies table
CREATE TABLE agencies (
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

-- Create users table
CREATE TABLE users (
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

-- Create indexes for better performance
CREATE INDEX idx_users_agency_id ON users(agency_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_agencies_slug ON agencies(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agencies
CREATE POLICY "Users can view their own agency"
  ON agencies FOR SELECT
  USING (id IN (SELECT agency_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own agency"
  ON agencies FOR UPDATE
  USING (id IN (SELECT agency_id FROM users WHERE id = auth.uid()));

-- RLS Policies for users
CREATE POLICY "Users can view users in their agency"
  ON users FOR SELECT
  USING (agency_id IN (SELECT agency_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own record"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 4: Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your **travelpro** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add the first variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste your Project URL from Step 2
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**
6. Click **"Add New"** again
7. Add the second variable:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste your anon public key from Step 2
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

## Step 5: Redeploy Your App

1. In Vercel, go to your project
2. Click the **"Deployments"** tab
3. Click the **"..."** menu on the latest deployment
4. Click **"Redeploy"**
5. Wait 2-3 minutes for the deployment to complete

## Step 6: Test Signup!

1. Go to your deployed app URL
2. Click **"הרשמה"** (Signup)
3. Fill in:
   - **שם הסוכנות** (Agency name): e.g., "My Travel Agency"
   - **שם מלא** (Full name): Your name
   - **אימייל** (Email): Your email
   - **סיסמה** (Password): At least 6 characters
4. Click **"הירשם"** (Sign up)
5. You should see a success message!

## Troubleshooting

**If you get an error:**
- Check the browser console (F12) for detailed error messages
- Make sure you copied the credentials correctly (no extra spaces)
- Verify the SQL script ran successfully in Supabase
- Make sure you redeployed after adding environment variables

**Need help?** Check the error message - it will tell you what's wrong!
