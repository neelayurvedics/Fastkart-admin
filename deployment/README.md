# Fastkart Admin - Vercel Deployment Guide

## 📋 Quick Start

This guide will help you deploy the Fastkart Admin Panel to Vercel and connect it with your Laravel backend API.

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Make sure all your code is committed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? **Select your account**
   - Link to existing project? **N**
   - What's your project's name? **fastkart-admin**
   - In which directory is your code located? **./
   - Want to override settings? **N**

5. For production deployment:
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository: `neelayurvedics/Fastkart-admin`
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Add Environment Variables (see Step 3 below)
6. Click **"Deploy"**

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```bash
# API Configuration
URL=https://api.neelayurvedics.in/api/admin
storageURL=https://api.neelayurvedics.in
adminURL=https://api.neelayurvedics.in/admin/

# Client-side variables (accessible in browser)
NEXT_PUBLIC_STORAGE_URL=https://api.neelayurvedics.in
NEXT_PUBLIC_ADMIN_URL=https://api.neelayurvedics.in/admin/
NEXT_PUBLIC_API_URL=https://api.neelayurvedics.in/api/admin

# Environment
NODE_ENV=production
```

**Important:** Add these for all environments (Production, Preview, Development)

### Step 4: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain: `admin.neelayurvedics.in`
3. Follow DNS configuration instructions
4. Update your domain's DNS records:
   - **Type**: CNAME
   - **Name**: admin
   - **Value**: cname.vercel-dns.com

## 🔗 Connect Frontend & Backend

### Backend Requirements

Your Laravel API at `https://api.neelayurvedics.in` must allow requests from your Vercel domain.

#### 1. Configure CORS in Laravel

Edit `config/cors.php`:

```php
<?php

return [
    'paths' => [
        'api/*',
        'storage/*',
        'sanctum/csrf-cookie'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://admin.neelayurvedics.in',           // Your custom domain
        'https://fastkart-admin.vercel.app',          // Vercel domain
        'https://fastkart-admin-*.vercel.app',        // Preview deployments
        'http://localhost:3000',                       // Local development
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/fastkart-admin-.*\.vercel\.app$/',  // All preview branches
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

#### 2. Create Storage Symlink (Critical!)

SSH into your Laravel server and run:

```bash
cd /path/to/your/laravel/project
php artisan storage:link
chmod -R 755 storage
chown -R www-data:www-data storage
```

#### 3. Configure API Routes

Ensure your `routes/api.php` has:

```php
// Admin routes
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/attachment', [AttachmentController::class, 'index']);
        // ... other routes
    });
});
```

#### 4. Update Laravel .env

```bash
# Application
APP_URL=https://api.neelayurvedics.in
FRONTEND_URL=https://admin.neelayurvedics.in

# Session & Cookie
SESSION_DOMAIN=.neelayurvedics.in
SANCTUM_STATEFUL_DOMAINS=admin.neelayurvedics.in,localhost:3000

# CORS
CORS_ALLOWED_ORIGINS="https://admin.neelayurvedics.in,http://localhost:3000"
```

#### 5. Clear Laravel Cache

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 🔧 Vercel Configuration Files

The following files are automatically configured:

### `vercel.json` (Root directory)

Already configured in your project. If missing, it should contain:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "URL": "@url",
    "storageURL": "@storage-url",
    "adminURL": "@admin-url"
  }
}
```

### `.vercelignore` (Optional)

Create this file to exclude files from deployment:

```
.git
.next
node_modules
.env.local
*.log
.DS_Store
```

## 🔍 Verify Deployment

### 1. Check Build Logs

In Vercel Dashboard → Deployments → Click on your deployment → View Build Logs

Look for:
- ✅ Build completed successfully
- ✅ No compilation errors
- ✅ All pages generated

### 2. Test Your Deployment

Visit your deployed URL and test:

- ✅ Login page loads
- ✅ Can login with credentials
- ✅ Dashboard loads after login
- ✅ API calls work (check Network tab)
- ✅ Images load (once backend storage is configured)

### 3. Check API Connection

Open browser console and check:
- No CORS errors
- API requests return 200 (not 401/403/500)
- Authentication tokens are set

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
1. Check build logs in Vercel
2. Ensure all dependencies are in `package.json`
3. Run `npm install && npm run build` locally first
4. Check for TypeScript/ESLint errors

### Issue: Environment Variables Not Working

**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Make sure variables are added for all environments
3. Redeploy after adding variables
4. For client-side variables, use `NEXT_PUBLIC_` prefix

### Issue: API Requests Fail (CORS Errors)

**Solution:**
1. Check Laravel CORS configuration
2. Add Vercel domain to `allowed_origins`
3. Clear Laravel cache: `php artisan config:clear`
4. Check browser console for exact error

### Issue: Images Don't Load

**Solution:**
1. Check if `php artisan storage:link` was run on Laravel server
2. Test storage URL directly: `https://api.neelayurvedics.in/storage/test.jpg`
3. Verify storage permissions: `chmod -R 755 storage`
4. Check CORS allows `/storage/*` paths

### Issue: 404 on Page Refresh

**Solution:**
Next.js handles routing automatically. If you get 404s, check:
1. `next.config.js` has correct redirects
2. Vercel routing is configured (automatic for Next.js)

### Issue: Slow Performance

**Solution:**
1. Enable Vercel Analytics in project settings
2. Check if images are optimized
3. Verify API response times
4. Consider using Vercel Edge Network

## 📱 Preview Deployments

Every Git branch push creates a preview deployment:

- **Main branch**: `https://fastkart-admin.vercel.app` (production)
- **Feature branches**: `https://fastkart-admin-git-{branch}.vercel.app`
- **Pull requests**: Automatic preview URLs in PR comments

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel environment variables for secrets
- ✅ Different variables for dev/staging/production

### 2. API Security
- ✅ Enable authentication on all admin routes
- ✅ Use HTTPS only
- ✅ Implement rate limiting on Laravel API
- ✅ Validate CORS origins (don't use `'*'` in production)

### 3. Vercel Security
- ✅ Enable password protection for preview deployments
- ✅ Use Vercel's built-in DDoS protection
- ✅ Enable HTTPS redirect (automatic)

## 📊 Monitoring & Analytics

### Enable Vercel Analytics

1. Go to Project → Analytics
2. Enable Web Analytics
3. Add analytics code (automatic for Next.js)

### Enable Vercel Speed Insights

1. Install package:
```bash
npm install @vercel/speed-insights
```

2. Add to your layout:
```javascript
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Push to main**: Deploys to production
- **Push to other branches**: Creates preview deployment
- **Open Pull Request**: Creates preview with unique URL

### Disable Auto-Deploy (if needed)

Vercel Dashboard → Git → Disable "Production Branch"

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Laravel CORS](https://github.com/fruitcake/laravel-cors)
- [Sanctum with SPA](https://laravel.com/docs/sanctum#spa-authentication)

## 🆘 Support

- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Next.js Discord: [nextjs.org/discord](https://nextjs.org/discord)
- Laravel Discord: [discord.gg/laravel](https://discord.gg/laravel)

---

**Last Updated**: November 1, 2025
**Status**: Production Ready ✅
