# Supabase Setup Guide

## Why Signup Isn't Working

The signup feature requires a Supabase database to be set up. Currently, the app is using placeholder values, so signup will fail.

## Quick Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: TravelPro
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup

### 2. Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 3. Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

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

-- Create indexes
CREATE INDEX idx_users_agency_id ON users(agency_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_agencies_slug ON agencies(slug);

-- Enable Row Level Security
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agencies
CREATE POLICY "Users can view their own agency"
  ON agencies FOR SELECT
  USING (id IN (SELECT agency_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Authenticated users can create agencies"
  ON agencies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for users
CREATE POLICY "Users can view users in their agency"
  ON users FOR SELECT
  USING (agency_id IN (SELECT agency_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own record"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 4. Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

4. Click **Save**
5. **Redeploy** your application (Vercel will automatically redeploy)

### 5. Test Signup

1. Go to your deployed app
2. Click "הרשמה" (Signup)
3. Fill in the form:
   - Agency name
   - Full name
   - Email
   - Password (min 6 characters)
4. Click "הירשם" (Sign up)

## Troubleshooting

### "Supabase לא מוגדר" Error
- Make sure environment variables are set in Vercel
- Redeploy after adding variables

### "relation does not exist" Error
- Run the SQL script above to create tables

### "permission denied" Error
- Check RLS policies are set up correctly
- Make sure policies allow inserts for authenticated users

## Next Steps

After signup works, you'll also need to create:
- `countries` table
- `destinations` table
- `clients` table
- `packages` table
- `package_days` table
- `package_items` table
- `templates` table

See `travelpro-dev-spec.json` for the complete schema.
