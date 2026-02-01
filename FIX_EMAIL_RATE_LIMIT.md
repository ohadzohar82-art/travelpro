# Fix: Email Rate Limit Exceeded

## What This Means

Supabase has a rate limit on sending emails (usually 4 emails per hour per email address). You've hit this limit from multiple signup attempts.

## Solutions

### Option 1: Wait and Try Again (Easiest)
- Wait 1 hour
- Try signing up again with the same email

### Option 2: Use a Different Email (Quick Fix)
- Use a different email address for testing
- Try: `test1@example.com`, `test2@example.com`, etc.

### Option 3: Disable Email Confirmation (Best for Development)

1. **In Supabase Dashboard:**
   - Go to **Authentication** → **Settings**
   - Scroll to **Email Auth**
   - Find **"Enable email confirmations"**
   - **Turn it OFF** (toggle switch)
   - Click **Save**

2. **Now you can sign up without email confirmation!**
   - Users will be created immediately
   - No need to verify email
   - Perfect for development/testing

### Option 4: Reset Rate Limit (If you have access)

If you're on a paid plan, you can:
- Contact Supabase support
- Or wait for the rate limit to reset (usually 1 hour)

## Recommended: Disable Email Confirmation for Development

For development, I recommend **Option 3** - disable email confirmation. This way:
- ✅ Signup works immediately
- ✅ No waiting for emails
- ✅ No rate limit issues
- ✅ Faster development

You can always re-enable it later for production!

## After Fixing

Once you've disabled email confirmation or waited:
1. Try signing up again
2. You should be able to create an account immediately
3. You'll be redirected to login
4. Log in with your credentials
