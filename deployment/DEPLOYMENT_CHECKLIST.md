# Vercel Deployment Checklist

Use this checklist to ensure your deployment is complete and working correctly.

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All changes committed to Git
- [ ] Code pushed to GitHub repository
- [ ] `package.json` dependencies up to date
- [ ] Build succeeds locally (`npm run build`)
- [ ] No console errors in development
- [ ] All environment variables documented

### Configuration Files
- [ ] `next.config.js` properly configured
- [ ] `.env.local.example` created with all variables
- [ ] `.gitignore` includes `.env.local`
- [ ] `vercel.json` created (if using custom config)
- [ ] No hardcoded API URLs in code

## 🚀 Deployment Checklist

### Vercel Setup
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Framework preset set to "Next.js"
- [ ] Root directory set correctly
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### Environment Variables (Critical!)
- [ ] `URL` = https://api.neelayurvedics.in/api/admin
- [ ] `storageURL` = https://api.neelayurvedics.in
- [ ] `adminURL` = https://api.neelayurvedics.in/admin/
- [ ] `NEXT_PUBLIC_STORAGE_URL` = https://api.neelayurvedics.in
- [ ] `NEXT_PUBLIC_ADMIN_URL` = https://api.neelayurvedics.in/admin/
- [ ] `NEXT_PUBLIC_API_URL` = https://api.neelayurvedics.in/api/admin
- [ ] `NODE_ENV` = production
- [ ] All variables added to **Production** environment
- [ ] All variables added to **Preview** environment
- [ ] All variables added to **Development** environment

### Domain Configuration (If Using Custom Domain)
- [ ] Custom domain added in Vercel
- [ ] DNS records configured
  - [ ] Type: CNAME
  - [ ] Name: admin
  - [ ] Value: cname.vercel-dns.com
- [ ] SSL certificate provisioned (automatic)
- [ ] Domain verified and active

### Initial Deployment
- [ ] Deployment triggered
- [ ] Build completed successfully
- [ ] No build errors in logs
- [ ] Deployment URL accessible
- [ ] Site loads without errors

## 🔧 Backend Configuration Checklist

### Laravel Backend Setup
- [ ] Composer packages installed
  - [ ] Laravel Sanctum
  - [ ] Laravel CORS
- [ ] `.env` configured with correct values
- [ ] CORS configuration updated in `config/cors.php`
- [ ] Sanctum configuration updated
- [ ] Session configuration updated
- [ ] HTTP Kernel middleware configured

### Storage Configuration (Critical!)
- [ ] `php artisan storage:link` executed
- [ ] Symlink verified: `public/storage` → `storage/app/public`
- [ ] Storage permissions set: `chmod -R 755 storage`
- [ ] Storage ownership set: `chown -R www-data:www-data storage`
- [ ] Storage accessible at: https://api.neelayurvedics.in/storage/

### Cache & Optimization
- [ ] `php artisan config:clear`
- [ ] `php artisan cache:clear`
- [ ] `php artisan route:clear`
- [ ] `php artisan view:clear`
- [ ] (Production) `php artisan config:cache`
- [ ] (Production) `php artisan route:cache`

### API Routes
- [ ] Login endpoint working: `/api/admin/login`
- [ ] Protected routes require authentication
- [ ] CORS headers present in responses
- [ ] Rate limiting configured

## ✅ Testing Checklist

### Frontend Testing
- [ ] Login page loads
- [ ] Can login with valid credentials
- [ ] Dashboard loads after login
- [ ] Navigation works correctly
- [ ] No console errors
- [ ] No 404 errors for assets

### API Connection Testing
- [ ] API requests succeed (check Network tab)
- [ ] No CORS errors in console
- [ ] Authentication tokens set correctly
- [ ] Protected routes accessible when logged in
- [ ] Logout works correctly

### Image/Media Testing
- [ ] Media library page loads
- [ ] Can upload new images
- [ ] Uploaded images display correctly
- [ ] Image URLs are correct format
- [ ] No 400/403 errors for storage URLs
- [ ] Placeholders show for broken images

### Cross-Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile devices

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] No memory leaks
- [ ] API response time < 1 second
- [ ] Images load quickly
- [ ] No layout shift (CLS)

## 🔒 Security Checklist

### Environment Security
- [ ] `.env.local` not committed to Git
- [ ] No API keys in frontend code
- [ ] Environment variables properly scoped
- [ ] No sensitive data in `NEXT_PUBLIC_` variables

### HTTPS & SSL
- [ ] Site serves over HTTPS
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Secure cookies enabled

### Backend Security
- [ ] CORS configured (not using `'*'` in production)
- [ ] Rate limiting enabled
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (use Eloquent)
- [ ] XSS protection enabled

### Authentication Security
- [ ] Strong password requirements
- [ ] Password hashing (bcrypt)
- [ ] Session timeout configured
- [ ] Remember me functionality secure
- [ ] Logout clears all tokens

## 📊 Monitoring Checklist

### Vercel Monitoring
- [ ] Deployment notifications enabled
- [ ] Build error notifications enabled
- [ ] Vercel Analytics enabled (optional)
- [ ] Speed Insights enabled (optional)

### Error Monitoring
- [ ] Console errors monitored
- [ ] API errors logged
- [ ] 404 errors tracked
- [ ] Build failures alerted

### Performance Monitoring
- [ ] Core Web Vitals monitored
- [ ] Page load times tracked
- [ ] API response times monitored
- [ ] Database query performance checked

## 🔄 Post-Deployment Checklist

### Immediate Actions
- [ ] Test all critical user flows
- [ ] Verify all integrations work
- [ ] Check error logs
- [ ] Monitor first hour of traffic
- [ ] Communicate deployment to team

### Documentation
- [ ] Deployment documented
- [ ] Environment variables documented
- [ ] Known issues documented
- [ ] Rollback procedure documented
- [ ] Team members trained

### Backup & Recovery
- [ ] Database backup completed
- [ ] Previous deployment saved
- [ ] Rollback procedure tested
- [ ] Recovery time objective (RTO) defined
- [ ] Recovery point objective (RPO) defined

## 🐛 Troubleshooting Reference

### If Build Fails
1. Check build logs in Vercel dashboard
2. Test build locally: `npm run build`
3. Check for missing dependencies
4. Verify Node.js version compatibility

### If Site Won't Load
1. Check deployment status
2. Verify DNS configuration
3. Check for JavaScript errors in console
4. Verify environment variables are set

### If API Calls Fail
1. Check CORS errors in console
2. Verify backend is running
3. Test API endpoints with cURL
4. Check authentication tokens

### If Images Don't Load
1. Check storage symlink exists
2. Test storage URL directly
3. Verify CORS allows `/storage/*`
4. Check file permissions

## 📝 Notes

- Date deployed: _________________
- Deployed by: _________________
- Deployment URL: _________________
- Custom domain: _________________
- Git commit: _________________
- Known issues: _________________

---

**Sign-off**

- [ ] Technical lead approved
- [ ] QA testing passed
- [ ] Stakeholders notified
- [ ] Documentation complete
- [ ] Monitoring in place

---

**Status**: ✅ Ready for Production

**Last Updated**: November 1, 2025
