# Image Loading Fixes - Documentation

## Issues Fixed

### 1. Missing Environment Variables
- Added `adminURL` to environment configuration (was missing)
- Added client-side accessible environment variables with `NEXT_PUBLIC_` prefix

### 2. Environment Variable Access
- Fixed image helper functions to properly access environment variables
- Added fallback mechanism for both server-side and client-side contexts
- All image-related functions now have hardcoded fallbacks to prevent errors

### 3. Image Error Handling
- Added proper error handling in `AttachmentData.js` with visual fallback
- Added error handling in `FileUploadField.js` to hide broken images
- Improved error logging to avoid calling helper functions inside error handlers

### 4. Configuration Updates
- Updated `next.config.js` to include all necessary environment variables
- Added proper fallbacks in config for production deployments

## Files Modified

1. `.env.local.example` - Added missing environment variables
2. `.env.local` - Created with production values
3. `src/utils/getImageUrl.js` - Added environment variable fallback mechanism
4. `src/utils/imageConfig.js` - Added environment variable fallback mechanism
5. `src/components/common/ThemeImage.jsx` - Fixed environment variable access
6. `next.config.js` - Added all environment variables with fallbacks
7. `src/components/attachment/widgets/AttachmentData.js` - Improved error handling with visual fallback
8. `src/components/inputFields/FileUploadField.js` - Added error handling for broken images

## Environment Variables Required

### Server-Side (.env.local)
```bash
URL=https://api.neelayurvedics.in/api/admin
storageURL=https://api.neelayurvedics.in
adminURL=https://api.neelayurvedics.in/admin/
```

### Client-Side (Accessible in Browser)
```bash
NEXT_PUBLIC_STORAGE_URL=https://api.neelayurvedics.in
NEXT_PUBLIC_ADMIN_URL=https://api.neelayurvedics.in/admin/
NEXT_PUBLIC_API_URL=https://api.neelayurvedics.in/api/admin
```

## How Image Loading Works Now

### 1. Storage Images (Uploaded Content)
- Function: `getStorageImage(path)`
- Converts relative paths to full URLs: `https://api.neelayurvedics.in/storage/...`
- Handles both absolute URLs and relative paths
- Has fallback to hardcoded production URL

### 2. Theme Images (Static Assets)
- Function: `getThemeImage(imageName)` or `getImageUrl(path)`
- Converts to: `https://api.neelayurvedics.in/admin/images/themes/...`
- Used for admin panel UI images

### 3. Error Handling
- Broken images show "Image unavailable" placeholder (AttachmentData)
- Or are hidden automatically (FileUploadField)
- Errors are logged but don't break the UI

## Testing Checklist

- [ ] Images load in development environment
- [ ] Images load after pushing to GitHub/deployment
- [ ] Broken image URLs show fallback instead of breaking
- [ ] Console shows appropriate error messages (not crashes)
- [ ] Theme images (admin UI) load correctly
- [ ] Uploaded images (content) load correctly

## Deployment Notes

When deploying to production:
1. Ensure `.env.local` exists with correct values OR
2. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
3. All environment variables have fallback values, so it will work even without explicit configuration

## Common Issues & Solutions

**Issue**: Images don't show after deployment
**Solution**: Check that your API server allows CORS requests and image requests are not blocked

**Issue**: "Image unavailable" shows for valid images
**Solution**: Check browser console for actual error (CORS, 404, network timeout)

**Issue**: Some images work, others don't
**Solution**: Ensure all image paths in database are either full URLs or relative paths starting with correct format
