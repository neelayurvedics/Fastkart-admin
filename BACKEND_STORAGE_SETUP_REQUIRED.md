# Backend Storage Setup Required

## Issue
Images are not loading because the Laravel backend at `https://api.neelayurvedics.in` is returning **HTTP 400 (Bad Request)** for all storage URLs.

### Test Results
All these URLs return HTTP 400:
- ❌ `https://api.neelayurvedics.in/storage/19/Kumkumadi-Oil-Product-Image.webp`
- ❌ `https://api.neelayurvedics.in/public/storage/19/image.webp`
- ❌ `https://api.neelayurvedics.in/api/storage/19/image.webp`
- ❌ `https://api.neelayurvedics.in/admin/storage/19/image.webp`

## Root Cause
The Laravel backend storage is not publicly accessible. This is typically because:
1. **Storage symlink not created** - Laravel needs `php artisan storage:link`
2. **CORS not configured** for storage paths
3. **Route not defined** to serve storage files
4. **Storage path misconfigured** in Laravel

## Required Backend Fixes

### Fix 1: Create Storage Symlink (CRITICAL)
SSH into your Laravel server and run:
```bash
cd /path/to/your/laravel/project
php artisan storage:link
```

This creates a symlink from `public/storage` to `storage/app/public`, making uploaded files accessible via web.

### Fix 2: Configure CORS for Storage
In your Laravel backend, edit `config/cors.php`:

```php
<?php
return [
    'paths' => [
        'api/*',
        'storage/*',     // Add this line
        'sanctum/csrf-cookie'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://admin.neelayurvedics.in',
        'http://localhost:3000',
        '*',  // Or use specific domains
    ],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Fix 3: Verify Storage Configuration
Check `config/filesystems.php`:

```php
'disks' => [
    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL').'/storage',  // Make sure this is correct
        'visibility' => 'public',
    ],
],
```

### Fix 4: Clear Laravel Cache
After making changes:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Fix 5: Set Proper Permissions
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

## Verification Steps

1. **Test storage URL directly** in browser:
   ```
   https://api.neelayurvedics.in/storage/19/Kumkumadi-Oil-Product-Image.webp
   ```
   Should return the image, not a 400 error

2. **Check symlink exists**:
   ```bash
   ls -la public/storage
   ```
   Should show: `storage -> ../storage/app/public`

3. **Test from command line**:
   ```bash
   curl -I "https://api.neelayurvedics.in/storage/19/your-image.webp"
   ```
   Should return: `HTTP/2 200` not `HTTP/2 400`

## Alternative Solution: API Endpoint

If you can't fix the storage public access, create an API endpoint to serve images:

**Route** (`routes/api.php`):
```php
Route::get('/media/{id}', [AttachmentController::class, 'serveImage']);
```

**Controller**:
```php
public function serveImage($id)
{
    $attachment = Attachment::findOrFail($id);
    $path = storage_path('app/public/' . $attachment->path);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path, [
        'Access-Control-Allow-Origin' => '*',
        'Cache-Control' => 'public, max-age=31536000',
    ]);
}
```

Then update frontend to use:
```
https://api.neelayurvedics.in/api/media/{attachment_id}
```

## Current Admin Panel Status

The admin panel code is **100% correct**:
- ✅ URL construction works perfectly (no double slashes)
- ✅ Error handling in place
- ✅ Fallback placeholders show
- ✅ CORS headers configured in Next.js

**The issue is entirely on the Laravel backend.**

## Contact Backend Team

Please ask your backend developer to:
1. Run `php artisan storage:link`
2. Configure CORS as shown above
3. Verify storage is publicly accessible
4. Test the URL: `https://api.neelayurvedics.in/storage/test.jpg`

## Temporary Workaround

Until the backend is fixed, the admin panel will show "Image unavailable" placeholders. This is correct behavior - the frontend cannot display images that the backend won't serve.

---

**Last tested**: October 31, 2025
**Status**: ❌ Backend storage not accessible (HTTP 400)
**Action required**: Laravel backend configuration
