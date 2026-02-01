# Push to GitHub - Authentication Required

The repository is set up, but you need to authenticate to push. Here are your options:

## Option 1: Use GitHub CLI (Easiest)

If you have GitHub CLI installed:

```bash
gh auth login
# Follow the prompts, then:
git push -u origin main
```

## Option 2: Use Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "TravelPro Push"
   - Select scope: **repo** (full control)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   
   When prompted:
   - Username: `ohadzohar82-art`
   - Password: **Paste your token** (not your GitHub password)

## Option 3: Use SSH (If you have SSH keys set up)

1. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:ohadzohar82-art/travelpro.git
   ```

2. **Push:**
   ```bash
   git push -u origin main
   ```

## Quick Command

After setting up authentication, just run:

```bash
git push -u origin main
```

---

**Repository URL:** https://github.com/ohadzohar82-art/travelpro

Once pushed, you can deploy to Vercel!
