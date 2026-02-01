# Push to GitHub - Quick Instructions

## Step 1: Create GitHub Repository

1. Go to: **https://github.com/new**
2. Repository name: `travelpro`
3. Description: "Professional travel package management SaaS"
4. Make it **Public** (required for free Vercel)
5. **Don't** check "Add a README file"
6. **Don't** add .gitignore or license
7. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repo, GitHub will show you commands. Use these:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/travelpro.git
git branch -M main
git push -u origin main
```

**OR** use the helper script:

```bash
./push-to-github.sh YOUR_USERNAME
```

## Step 3: Verify

Go to: `https://github.com/YOUR_USERNAME/travelpro`

You should see all your files!

## Step 4: Deploy to Vercel

1. Go to: **https://vercel.com**
2. Sign up/Login (use GitHub)
3. Click **"Add New Project"**
4. Select your `travelpro` repository
5. Click **"Deploy"**
6. Get your demo link! 🎉

---

**Need help?** Just provide your GitHub username and I can help you push!
