# Image Loading Troubleshooting Guide

## 🔍 How to Debug Image Loading Issues

### Step 1: Open Browser Console

1. Press **F12** or **Right-click → Inspect**
2. Go to **Console** tab
3. Refresh the Media Library page
4. Look for these log messages:

### Step 2: Check Image Data Logs

Look for messages like:
```
🖼️ Image data: {
  id: 21,
  name: "Neel-Ayurvedics-Logo.png",
  asset_url: "https://api.neelayurvedics.in/storage/21/...",
  original_url: "/storage/21/...",
  url: null,
  selected: "...",
  finalUrl: "https://api.neelayurvedics.in/storage/21/..."
}
```

### Step 3: Check Error Messages

If images fail, you'll see:
```
❌ Image failed to load!
📁 Original path: /storage/21/...
🌐 Final URL: https://api.neelayurvedics.in/storage/21/...
🔍 Status: 404 or 403 or 200
```

## 🐛 Common Issues & Solutions

### Issue 1: Status 404 (File Not Found)

**Symptom**: Console shows "File not found (404)"

**Causes**:
- Image file doesn't exist on server
- Wrong file path in database
- Files not uploaded correctly

**Solutions**:

1. **Check if file exists on server**:
```bash
# SSH into Laravel server
ssh your-server
cd /path/to/laravel
ls -la storage/app/public/21/
```

2. **If files are missing**, re-upload them via admin panel

3. **Check database paths**:
```sql
SELECT id, original_url, name FROM attachments LIMIT 10;
```

### Issue 2: Status 403 (Forbidden)

**Symptom**: Console shows "Forbidden (403)"

**Causes**:
- Permission issues on storage directory
- Web server can't read files

**Solutions**:

```bash
# Fix permissions
cd /path/to/laravel
chmod -R 755 storage/app/public
chown -R www-data:www-data storage/app/public

# Restart web server
sudo systemctl restart nginx
# or
sudo systemctl restart apache2
```

### Issue 3: Status 200 but Image Still Fails (CORS Issue)

**Symptom**: Console shows "File exists but failed to load - likely CORS issue"

**Causes**:
- CORS headers not configured for `/storage/*` path
- Browser blocking cross-origin images

**Solutions**:

**For Nginx** (`/etc/nginx/sites-available/your-site`):
```nginx
location /storage {
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
}
```

**For Apache** (`.htaccess` in public directory):
```apache
<IfModule mod_headers.c>
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|ico)$">
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, OPTIONS"
    </FilesMatch>
</IfModule>
```

**For Laravel** (`config/cors.php`):
```php
'paths' => [
    'api/*',
    'storage/*',  // Make sure this is included
    'sanctum/csrf-cookie'
],

'allowed_origins' => [
    'https://admin.neelayurvedics.in',
    'http://localhost:3000',
    '*',  // Or specific domains
],
```

Then restart:
```bash
php artisan config:clear
sudo systemctl restart nginx  # or apache2
```

### Issue 4: Wrong URL Format

**Symptom**: Final URL looks wrong in console

**Example Issues**:
- `https://api.neelayurvedics.in//storage/...` (double slash)
- `https://api.neelayurvedics.in/storage/storage/...` (double storage)
- Missing domain

**Solutions**:

Check the API response format:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.neelayurvedics.in/api/admin/attachment | jq
```

The API should return either:
- **Full URL**: `"asset_url": "https://api.neelayurvedics.in/storage/21/image.png"`
- **Relative path**: `"original_url": "/storage/21/image.png"`
- **Path only**: `"original_url": "21/image.png"`

Frontend handles all these formats correctly.

### Issue 5: Mixed Content (HTTP/HTTPS)

**Symptom**: Console shows "Mixed Content" warning

**Cause**: Admin panel is HTTPS but API serves HTTP

**Solution**: Ensure API uses HTTPS:
```bash
# In Laravel .env
APP_URL=https://api.neelayurvedics.in
```

### Issue 6: Image Too Large

**Symptom**: Images load very slowly or timeout

**Solutions**:

1. **Optimize images** before upload
2. **Increase PHP limits** in `php.ini`:
```ini
upload_max_filesize = 20M
post_max_size = 20M
memory_limit = 256M
```

3. **Use image optimization** in Laravel:
```bash
composer require intervention/image
```

## 🧪 Testing Commands

### Test 1: Check Storage Link
```bash
ls -la /path/to/laravel/public/storage
# Should show: storage -> ../storage/app/public
```

### Test 2: Check File Exists
```bash
ls -la /path/to/laravel/storage/app/public/21/
# Should show your image files
```

### Test 3: Check Permissions
```bash
ls -l /path/to/laravel/storage/app/public/
# Should show: drwxr-xr-x (755)
```

### Test 4: Test URL Directly
```bash
curl -I https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png
# Should return: HTTP/2 200
```

### Test 5: Test with Browser
Open: `https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png`
Should display the image

### Test 6: Check CORS Headers
```bash
curl -I -H "Origin: https://admin.neelayurvedics.in" \
     https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png
```

Should include:
```
Access-Control-Allow-Origin: *
```

## 📊 Debugging Checklist

Go through this checklist:

### Backend Checks
- [ ] Storage symlink created: `php artisan storage:link`
- [ ] Symlink verified: `ls -la public/storage`
- [ ] Files exist: `ls -la storage/app/public/`
- [ ] Permissions correct: `chmod -R 755 storage`
- [ ] Ownership correct: `chown -R www-data:www-data storage`
- [ ] Web server restarted
- [ ] Laravel caches cleared

### Network Checks
- [ ] Direct URL works: `curl -I https://api.neelayurvedics.in/storage/21/image.png`
- [ ] Returns HTTP 200
- [ ] CORS headers present
- [ ] No firewall blocking
- [ ] SSL certificate valid

### Frontend Checks
- [ ] Console shows image data logs
- [ ] URLs look correct (no double slashes)
- [ ] No JavaScript errors
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] Tried in incognito mode

## 🔧 Quick Fixes

### Quick Fix 1: Recreate Symlink
```bash
cd /path/to/laravel
rm public/storage
php artisan storage:link
```

### Quick Fix 2: Fix All Permissions
```bash
cd /path/to/laravel
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Quick Fix 3: Clear Everything
```bash
cd /path/to/laravel
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
composer dump-autoload
```

### Quick Fix 4: Restart Services
```bash
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm  # adjust PHP version
```

## 📱 What to Share with Support

If you need help, provide:

1. **Console logs** (copy from browser console)
2. **curl test result**:
   ```bash
   curl -v https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png
   ```
3. **Symlink verification**:
   ```bash
   ls -la public/storage
   ```
4. **File listing**:
   ```bash
   ls -la storage/app/public/
   ```
5. **CORS config** (`config/cors.php`)
6. **Web server config** (nginx/apache)

## 🎯 Expected Console Output (Working)

When everything works correctly, you should see:

```
🖼️ Image data: {
  id: 21,
  asset_url: "https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png",
  finalUrl: "https://api.neelayurvedics.in/storage/21/Neel-Ayurvedics-Logo.png"
}
```

And NO error messages!

## 📞 Still Not Working?

1. **Check Laravel logs**: `tail -f storage/logs/laravel.log`
2. **Check web server logs**: `tail -f /var/log/nginx/error.log`
3. **Enable Laravel debug**: Set `APP_DEBUG=true` temporarily
4. **Test with a new upload**: Upload a new image and see if it works
5. **Check if old images work**: Test with a known working image path

---

**Created**: November 1, 2025
**Status**: Debugging enabled - Check console for details
