#!/bin/bash

# Script to push TravelPro to GitHub
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "First, create a new repository on GitHub:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: travelpro"
    echo "3. Make it Public (for free Vercel)"
    echo "4. Don't initialize with README"
    echo "5. Click 'Create repository'"
    echo ""
    echo "Then run this script with your GitHub username"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_URL="https://github.com/${GITHUB_USERNAME}/travelpro.git"

echo "Setting up remote and pushing to GitHub..."
echo "Repository URL: $REPO_URL"
echo ""

# Add remote
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo "📦 Repository: $REPO_URL"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Click 'Add New Project'"
echo "3. Import your GitHub repository"
echo "4. Deploy!"
