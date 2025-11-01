# Quick Image Check Commands

## 🚀 Run These Commands Now

### 1. **Check Console** (Most Important!)
1. Open admin panel: https://admin.neelayurvedics.in (or http://localhost:3000)
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Go to Media Library page
5. Look for messages starting with:
   - 🖼️ Image data: ...
   - ❌ Image failed to load! ...
   - 🔍 Status: ...

**Take a screenshot of the console and share it!**

---

### 2. Test Backend URLs Directly

Open these URLs in your browser:

#### Test URL 1: Logo
```
https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png
```
**Expected**: Should display the logo image
**If fails**: Check error message

#### Test URL 2: Product Image
```
https://api.neelayurvedics.in/storage/19/Kumkumadi-Oil-Product-Image.webp
```
**Expected**: Should display the product image
**If fails**: Check error message

---

### 3. Test with cURL (From Your Server)

```bash
# Test if storage link works
curl -I https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png

# Should return:
# HTTP/2 200 
# Content-Type: image/png
# Access-Control-Allow-Origin: *
```

---

### 4. Check if Files Actually Exist

SSH into your Laravel server and run:

```bash
# Go to Laravel directory
cd /path/to/your/laravel/project

# Check symlink
ls -la public/storage
# Expected: public/storage -> ../storage/app/public

# Check if files exist
ls -la storage/app/public/21/
ls -la storage/app/public/19/

# Should show files like:
# Neel-Ayurvedics-Logo.png
# Kumkumadi-Oil-Product-Image.webp
```

---

## 📋 Quick Diagnostic Report

Fill this out and share:

### Frontend Test
- [ ] Admin panel loads: ✅ / ❌
- [ ] Media library shows placeholders: ✅ / ❌
- [ ] Console shows image data logs: ✅ / ❌
- [ ] Console shows error messages: ✅ / ❌
- [ ] What HTTP status code in console? ____

### Browser Test
- [ ] https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png works: ✅ / ❌
- [ ] What happens? (displays image / shows error / blank page)

### Server Test
- [ ] Files exist in storage/app/public/: ✅ / ❌
- [ ] Symlink exists in public/storage: ✅ / ❌
- [ ] cURL returns 200: ✅ / ❌

---

## 🎯 Next Steps Based on Results

### If Console Shows "Status: 404"
→ Files don't exist on server
→ Check: `ls -la storage/app/public/`

### If Console Shows "Status: 403"
→ Permission problem
→ Run: `chmod -R 755 storage/app/public`

### If Console Shows "Status: 200" but image fails
→ CORS issue!
→ Check: Is `Access-Control-Allow-Origin` header present?

### If Browser URL shows image but admin panel doesn't
→ JavaScript or CORS blocking
→ Check: Browser console for CORS errors

### If Files Don't Exist on Server
→ Re-upload images
→ Or: Check if they're in a different folder

---

## 🔥 Most Likely Issue

Based on your symptoms (backend returns 200, files exist), this is **likely a CORS issue**.

### Quick CORS Fix for Nginx

Edit: `/etc/nginx/sites-available/api.neelayurvedics.in`

Add this block:

```nginx
server {
    # ... existing config ...
    
    # Add this section for storage images
    location /storage {
        alias /path/to/laravel/storage/app/public;
        
        # CORS headers for images
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        # Handle OPTIONS requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        
        # Cache images
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # ... rest of config ...
}
```

Then:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📸 What to Share

Please share:
1. **Console screenshot** (F12 → Console tab)
2. **Result of opening** https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png in browser
3. **Output of**: `curl -I https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png`
4. **Output of**: `ls -la public/storage` (from Laravel directory)

This will tell us exactly what's wrong! 🎯
