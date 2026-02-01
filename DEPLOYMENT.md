# Deployment Guide - TravelPro

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to get a live demo link for your Next.js app.

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default: `travelpro`)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

4. **Add Environment Variables**:
   After deployment, go to your Vercel dashboard:
   - Navigate to your project → Settings → Environment Variables
   - Add all variables from `.env.local.example`

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub + Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Add environment variables in the dashboard
   - Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/travelpro)

## Important: Supabase Setup Required

⚠️ **Before the app will work, you need to:**

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Set up the database**:
   - Create all tables as specified in `travelpro-dev-spec.json`
   - Set up RLS policies
   - Create storage buckets

3. **Get your Supabase credentials**:
   - Project URL
   - Anon key
   - Service role key

4. **Add environment variables in Vercel**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_DEFAULT_LOCALE=he
   ```

## Demo Without Full Setup

If you want to see the UI without setting up Supabase first:

1. The app will show the landing page and login/signup pages
2. You can see the UI structure and design
3. Full functionality requires Supabase database

## Post-Deployment

After deployment, you'll get a URL like:
- `https://travelpro-xxxxx.vercel.app`

This will be your demo link!

## Troubleshooting

- **Build errors**: Make sure all dependencies are in `package.json`
- **Runtime errors**: Check environment variables are set correctly
- **Database errors**: Ensure Supabase is configured and RLS policies are set

## Local Development

To run locally:
```bash
npm install
npm run dev
```

Then visit: `http://localhost:3000`
