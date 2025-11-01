# Quick Start - Deploy in 5 Minutes

Follow these steps to deploy your Fastkart Admin to Vercel quickly.

## 🚀 5-Minute Deployment

### Step 1: Push to GitHub (30 seconds)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import `neelayurvedics/Fastkart-admin`
4. Click **"Deploy"** (don't add variables yet)

### Step 3: Add Environment Variables (2 minutes)

Once deployed:

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables for **ALL environments** (Production, Preview, Development):

```
URL=https://api.neelayurvedics.in/api/admin
storageURL=https://api.neelayurvedics.in
adminURL=https://api.neelayurvedics.in/admin/
NEXT_PUBLIC_STORAGE_URL=https://api.neelayurvedics.in
NEXT_PUBLIC_ADMIN_URL=https://api.neelayurvedics.in/admin/
NEXT_PUBLIC_API_URL=https://api.neelayurvedics.in/api/admin
NODE_ENV=production
```

3. Click **"Redeploy"** to apply variables

### Step 4: Configure Backend (30 seconds)

SSH into your Laravel server:

```bash
cd /path/to/laravel
php artisan storage:link
php artisan config:clear
php artisan cache:clear
```

### Step 5: Test (30 seconds)

Visit your deployment URL and verify:
- ✅ Login page loads
- ✅ Can login
- ✅ Dashboard works

## ✅ Done!

Your admin panel is now live at:
- `https://fastkart-admin.vercel.app`
- Or your custom domain

## 🆘 If Something's Wrong

### Build Fails?
- Check build logs in Vercel
- Run `npm install && npm run build` locally

### Can't Login?
- Check environment variables are set
- Verify API URL is correct
- Check CORS in Laravel backend

### Images Don't Load?
- Run `php artisan storage:link` on server
- Check backend storage setup

## 📚 Need More Details?

See the full documentation:
- `deployment/README.md` - Complete deployment guide
- `deployment/LARAVEL_BACKEND_CONFIG.md` - Backend setup
- `deployment/DEPLOYMENT_CHECKLIST.md` - Detailed checklist

---

**Questions?** Check the troubleshooting section in README.md
