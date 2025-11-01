# 📦 Deployment Folder - Complete Guide

Welcome to the Fastkart Admin deployment folder! This folder contains everything you need to deploy your application to Vercel.

## 📁 What's in This Folder?

```
deployment/
├── README.md                          ← Main deployment guide (START HERE!)
├── QUICK_START.md                     ← 5-minute quick deployment
├── DEPLOYMENT_CHECKLIST.md            ← Step-by-step checklist
├── LARAVEL_BACKEND_CONFIG.md          ← Backend configuration
├── FRONTEND_BACKEND_CONNECTION.md     ← How frontend connects to API
├── vercel-environment-variables.env   ← Environment variables reference
└── vercel.json                        ← Vercel configuration (optional)
```

## 🚀 Getting Started

### For Quick Deployment (5 minutes)
Read: **`QUICK_START.md`**

### For Complete Deployment (30 minutes)
Read: **`README.md`** (Main guide)

### For Backend Setup
Read: **`LARAVEL_BACKEND_CONFIG.md`**

### For Understanding the Connection
Read: **`FRONTEND_BACKEND_CONNECTION.md`**

## 📋 Deployment Overview

### 1. Frontend (Vercel)
- Platform: Vercel
- Framework: Next.js 15
- Domain: admin.neelayurvedics.in
- Repository: GitHub

### 2. Backend (Laravel)
- Platform: Your server
- Framework: Laravel 10.x
- Domain: api.neelayurvedics.in
- Authentication: Laravel Sanctum

### 3. Connection
- Protocol: HTTPS
- Method: REST API
- Format: JSON
- Auth: Bearer Token

## 🔑 Required Information

Before deployment, have these ready:

### Frontend
- ✅ GitHub repository access
- ✅ Vercel account
- ✅ Custom domain (optional): admin.neelayurvedics.in

### Backend
- ✅ Laravel API URL: https://api.neelayurvedics.in
- ✅ SSH access to Laravel server
- ✅ Database credentials
- ✅ Admin account credentials

### Environment Variables
All variables are documented in `vercel-environment-variables.env`

## 📊 Deployment Steps Summary

### Step 1: Prepare Code
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. Import GitHub repository
2. Configure project settings
3. Add environment variables
4. Deploy

### Step 3: Configure Backend
```bash
php artisan storage:link
php artisan config:clear
php artisan cache:clear
```

### Step 4: Test & Verify
- Login works
- API calls succeed
- Images load
- All features functional

## 🔧 Configuration Files

### In This Folder

**vercel.json**
- Vercel-specific configuration
- Headers, redirects, security settings
- Copy to root if needed

**vercel-environment-variables.env**
- All environment variables
- Instructions for adding to Vercel
- Copy values to Vercel dashboard

### In Root Directory

**next.config.js**
- Next.js configuration
- Already configured
- Contains API URLs, CORS, images

**.env.local.example**
- Example environment variables
- For local development
- Don't commit actual .env.local

**vercel.json** (will be created)
- Deployment configuration
- Auto-detected by Vercel

## 🆘 Troubleshooting Quick Reference

### Build Fails
→ Check `README.md` section "Troubleshooting: Build Fails"

### Can't Login
→ Check `FRONTEND_BACKEND_CONNECTION.md` section "Authentication Flow"

### CORS Errors
→ Check `LARAVEL_BACKEND_CONFIG.md` section "Configure CORS"

### Images Don't Load
→ Check `../BACKEND_STORAGE_SETUP_REQUIRED.md`

### API Connection Issues
→ Check `FRONTEND_BACKEND_CONNECTION.md` section "Testing the Connection"

## ✅ Checklist Before Deployment

Use `DEPLOYMENT_CHECKLIST.md` to verify:

- [ ] Code committed to GitHub
- [ ] Environment variables documented
- [ ] Backend properly configured
- [ ] Build succeeds locally
- [ ] All tests pass

## 📚 Additional Resources

### In Parent Directory
- `../BACKEND_STORAGE_SETUP_REQUIRED.md` - Storage configuration
- `../IMAGE_FIX_NOTES.md` - Image loading fixes
- `../LARAVEL_CORS_SETUP.md` - CORS setup guide
- `../README.md` - Project README

### External Links
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Laravel Documentation](https://laravel.com/docs)

## 🔄 Continuous Deployment

Once set up, deployment is automatic:

1. **Push to GitHub** → Vercel builds and deploys
2. **Open PR** → Preview deployment created
3. **Merge PR** → Production deployment updated

## 🔒 Security Notes

- ✅ Never commit `.env.local` to Git
- ✅ Use environment variables in Vercel for secrets
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Configure CORS properly (not `*` in production)
- ✅ Use strong authentication tokens

## 📊 Monitoring After Deployment

1. **Vercel Dashboard** - Build status, logs
2. **Browser Console** - Frontend errors
3. **Laravel Logs** - Backend errors
4. **Analytics** - User behavior (optional)

## 🆘 Getting Help

### Documentation Order
1. Try `QUICK_START.md` first
2. If issues, check specific guide (README, BACKEND_CONFIG, etc.)
3. Use `DEPLOYMENT_CHECKLIST.md` to verify all steps
4. Check troubleshooting sections

### Support Resources
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Check GitHub Issues
- Review error logs in Vercel dashboard
- Check Laravel logs on server

## 📝 Post-Deployment

After successful deployment:

- [ ] Update team with new URL
- [ ] Document any custom configuration
- [ ] Set up monitoring/alerts
- [ ] Create backup strategy
- [ ] Test all critical features

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ Site loads at deployed URL
- ✅ Login works correctly
- ✅ Dashboard displays data
- ✅ API calls return data
- ✅ Images load (after backend config)
- ✅ All features functional
- ✅ No console errors
- ✅ HTTPS working

## 📞 Contact Information

**Technical Lead**: _________________
**Backend Developer**: _________________
**DevOps**: _________________
**Project Manager**: _________________

## 📅 Deployment Log

**Date**: _________________
**Version**: _________________
**Deployed By**: _________________
**Git Commit**: _________________
**Status**: _________________
**Notes**: _________________

---

## 🎉 Ready to Deploy?

Start with **`QUICK_START.md`** for a 5-minute deployment!

For detailed step-by-step instructions, see **`README.md`**

Good luck with your deployment! 🚀

---

**Last Updated**: November 1, 2025
**Status**: ✅ Production Ready
