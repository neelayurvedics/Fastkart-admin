# Laravel Backend CORS Configuration

## Issue
Images uploaded to the admin panel are not displaying because the Laravel backend storage is blocking cross-origin requests (CORS).

## Solution
You need to configure CORS headers in your Laravel backend to allow the admin frontend to access the storage images.

### Step 1: Install Laravel CORS Package (if not already installed)

```bash
composer require fruitcake/laravel-cors
```

### Step 2: Configure CORS in `config/cors.php`

Update your `config/cors.php` file:

```php
<?php

return [
    'paths' => [
        'api/*',
        'storage/*',  // Add this line to allow storage access
        'sanctum/csrf-cookie'
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://admneelayurvedics.in',
        'https://admin.neelayurvedics.in',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

### Step 3: Add CORS Middleware to Storage Routes

In `app/Http/Kernel.php`, ensure the CORS middleware is applied:

```php
protected $middlewareGroups = [
    'web' => [
        // ... other middleware
    ],

    'api' => [
        \Fruitcake\Cors\HandleCors::class,  // Add this
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

### Step 4: Configure Storage Symlink Headers

Create a middleware to add headers to storage files.

Create `app/Http/Middleware/AddStorageHeaders.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;

class AddStorageHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        return $response;
    }
}
```

Register this middleware in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // ... other middleware
    'storage.headers' => \App\Http\Middleware\AddStorageHeaders::class,
];
```

### Step 5: Alternative - Use .htaccess (Apache)

If you're using Apache, add this to your `public/.htaccess` file:

```apache
# Handle CORS for storage
<IfModule mod_headers.c>
    <FilesMatch "\.(jpg|jpeg|png|gif|webp|svg|ico)$">
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, OPTIONS"
        Header set Access-Control-Allow-Headers "Content-Type"
    </FilesMatch>
</IfModule>
```

### Step 6: Nginx Configuration (if using Nginx)

Add to your Nginx server block:

```nginx
location ~* \.(jpg|jpeg|png|gif|webp|svg|ico)$ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type";
}

location /storage {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type";
}
```

### Step 7: Clear Cache

After making changes, clear Laravel cache:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

## Testing

After implementing these changes:

1. Restart your Laravel server
2. Hard refresh your admin panel (Ctrl+Shift+R)
3. Check the browser console - CORS errors should be gone
4. Images should now display correctly

## Verification

To verify CORS is working, check the response headers in browser DevTools Network tab. You should see:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
```

---

**Note**: Make sure your storage link is properly set up:
```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public`.
