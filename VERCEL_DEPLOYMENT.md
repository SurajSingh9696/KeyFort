# Vercel Deployment Guide

## Quick Checklist

After deploying to Vercel, verify these items:

### ✅ Required Environment Variables

In Vercel Dashboard → Settings → Environment Variables, you MUST have:

1. **DATABASE_URL** 
   - MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/password_vault?retryWrites=true&w=majority`
   - ⚠️ Use MongoDB Atlas, not local MongoDB

2. **NEXTAUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Example: `jZn8Q3u0eT1wY5rK9mN2pL7oI4hG6fD8cV3xS1aB5nM=`
   - ⚠️ Must be set, or auth will fail

3. **ENCRYPTION_KEY**
   - Exactly 32 characters
   - Example: `12345678901234567890123456789012`
   - ⚠️ Keep this secret and never change it

4. **NODE_ENV** (optional)
   - Set to: `production`
   - Usually set automatically by Vercel

### ❌ DO NOT Set These

- `NEXTAUTH_URL` - Vercel sets this automatically
- Any `GOOGLE_*` variables - Google OAuth was removed

## Common Issues & Solutions

### Issue: "Stuck on login/register page, not redirecting"

**Cause**: Session not being created or middleware blocking routes

**Solutions**:
1. **Clear browser cookies** completely for your domain
2. Verify `NEXTAUTH_SECRET` is set in Vercel environment variables
3. Check Vercel deployment logs for errors
4. Make sure you're accessing via HTTPS (not HTTP)
5. Redeploy after setting environment variables

### Issue: "Home page redirects to login immediately"

**Cause**: Middleware protecting all routes

**Solutions**:
1. Clear browser cache and cookies
2. Open in incognito/private window
3. Check browser console for errors (F12)
4. Verify latest code is deployed

### Issue: "Database connection errors"

**Cause**: MongoDB Atlas not configured correctly

**Solutions**:
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select **"Allow Access from Anywhere"** (`0.0.0.0/0`)
4. Wait 2-3 minutes for changes to propagate
5. Redeploy on Vercel

### Issue: "Login succeeds but immediately logs out"

**Cause**: Cookie/session issues

**Solutions**:
1. Check if accessing via custom domain or vercel.app
2. Ensure HTTPS is used (Vercel does this automatically)
3. Clear all cookies for the site
4. Check browser console for cookie errors
5. Verify `NEXTAUTH_SECRET` is exactly the same in all environments

## Testing After Deployment

1. **Test Home Page**
   - Visit `https://your-app.vercel.app`
   - Should see landing page
   - Click "Back to Home" button should work

2. **Test Registration**
   - Go to Register page
   - Create new account
   - Should redirect to dashboard automatically

3. **Test Login**
   - Go to Login page
   - Login with credentials
   - Should redirect to dashboard automatically

4. **Test Dashboard Access**
   - Dashboard should load with your data
   - Try creating a password entry
   - Verify data persists

## Redeployment Steps

If you make changes and need to redeploy:

```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel will automatically redeploy. Wait for build to complete (~2-3 minutes).

## Environment Variable Changes

If you change environment variables:

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Update the variable
4. Go to Deployments tab
5. Click "..." on latest deployment → **Redeploy**
6. Check "Use existing build cache" → Redeploy

## Debug Mode

To see detailed logs:

1. In Vercel Dashboard, go to your project
2. Click on the latest deployment
3. Go to **Functions** tab
4. Look for errors in the logs
5. Check specifically for:
   - `NEXTAUTH_SECRET` missing
   - Database connection failures
   - Session creation errors

## Support

If issues persist:

1. Check Vercel deployment logs
2. Check browser console (F12) for errors
3. Verify all environment variables are set correctly
4. Try deploying from a fresh git commit
5. Check MongoDB Atlas is accessible (0.0.0.0/0 whitelist)

---

**Last Updated**: After removing Google OAuth and Docker support
