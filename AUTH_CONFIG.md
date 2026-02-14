# Auth Environment Variables Configuration

## Required Variables

### For Local Development:
```env
DATABASE_URL=mongodb://localhost:27017/password_vault
NEXTAUTH_SECRET=your-secret-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=12345678901234567890123456789012
NODE_ENV=development
```

### For Vercel Production:
```env
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/password_vault?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-here-min-32-chars
# NEXTAUTH_URL is automatically set by Vercel - DO NOT SET MANUALLY
ENCRYPTION_KEY=12345678901234567890123456789012
NODE_ENV=production
```

## Generating Secrets

### NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### ENCRYPTION_KEY:
Must be exactly 32 characters. Example:
```
abcdefghijklmnopqrstuvwxyz123456
```

## Common Issues

### Issue: NEXTAUTH_URL is set on Vercel
**Problem**: Setting NEXTAUTH_URL manually on Vercel causes redirect loops.
**Solution**: Remove NEXTAUTH_URL from Vercel environment variables. Vercel sets it automatically.

### Issue: Auth not working after deployment
**Problem**: Missing or incorrect NEXTAUTH_SECRET.
**Solution**: 
1. Generate new secret: `openssl rand -base64 32`
2. Add to Vercel environment variables
3. Redeploy

### Issue: Database connection errors
**Problem**: MongoDB Atlas not accessible.
**Solution**:
1. MongoDB Atlas → Network Access
2. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
3. Wait 2-3 minutes
4. Redeploy on Vercel

## Testing Auth

Visit `/auth/test` to see detailed auth status and configuration.

## Debug Mode

To enable debug mode locally, set in `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

Then check browser console and Vercel function logs for detailed auth information.
