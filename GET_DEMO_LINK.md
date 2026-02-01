# 🚀 Get Your Demo Link in 5 Minutes

## Easiest Method: Vercel (Recommended)

### What You Need:
- A GitHub account (free)
- A Vercel account (free)

### Steps:

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it: `travelpro`
   - Make it **Public** (for free Vercel)
   - Click "Create repository"

2. **Push Your Code to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/travelpro.git
   git branch -M main
   git push -u origin main
   ```
   
   Replace `YOUR_USERNAME` with your GitHub username.

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login (use GitHub to connect)
   - Click **"Add New Project"**
   - Select your `travelpro` repository
   - Click **"Import"**
   - Vercel auto-detects Next.js settings
   - Click **"Deploy"** (no need to change settings)
   - Wait 2-3 minutes

4. **Get Your Demo Link! 🎉**
   - After deployment, you'll see: `https://travelpro-xxxxx.vercel.app`
   - This is your **permanent demo link**
   - Share it with anyone!

### What Works Without Supabase:
✅ Landing page  
✅ Login/Signup pages  
✅ All UI components  
✅ Navigation  
✅ Dashboard layout  
✅ Package editor UI  
✅ All pages visible  

### To Add Full Functionality:
Add environment variables in Vercel:
- Project → Settings → Environment Variables
- Add Supabase credentials when ready

## Alternative: Quick Local Demo

If you want to test locally first:

1. **Install Node.js** from [nodejs.org](https://nodejs.org)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Open**: `http://localhost:3000`

## Need Help?

- Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- GitHub docs: [docs.github.com](https://docs.github.com)

---

**Your demo link will look like:**
```
https://travelpro-xxxxx.vercel.app
```

Share this URL to show your project! 🎊
