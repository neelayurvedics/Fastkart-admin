# Laravel Backend Configuration for Fastkart Admin

This document contains all the Laravel backend configurations needed to connect with your Fastkart Admin panel deployed on Vercel.

## 📋 Prerequisites

- Laravel 8.x or higher
- PHP 8.0 or higher
- Laravel Sanctum installed
- Laravel CORS package installed

## 🔧 Required Laravel Configuration

### 1. Install Required Packages

```bash
# Install Laravel Sanctum (if not already installed)
composer require laravel/sanctum

# Install CORS package
composer require fruitcake/laravel-cors

# Publish Sanctum config
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Run migrations
php artisan migrate
```

### 2. Configure Environment Variables

Edit your Laravel `.env` file:

```bash
# =============================================================================
# APPLICATION
# =============================================================================

APP_NAME="Neel Ayurvedics"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.neelayurvedics.in

# =============================================================================
# FRONTEND & ADMIN
# =============================================================================

FRONTEND_URL=https://neelayurvedics.in
ADMIN_URL=https://admin.neelayurvedics.in

# =============================================================================
# SESSION & COOKIES
# =============================================================================

SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=.neelayurvedics.in
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax

# =============================================================================
# SANCTUM
# =============================================================================

SANCTUM_STATEFUL_DOMAINS=admin.neelayurvedics.in,localhost:3000
SANCTUM_GUARD=web

# =============================================================================
# CORS
# =============================================================================

CORS_ALLOWED_ORIGINS="https://admin.neelayurvedics.in,https://fastkart-admin.vercel.app,https://fastkart-admin-git-*.vercel.app,http://localhost:3000"

# =============================================================================
# FILESYSTEM
# =============================================================================

FILESYSTEM_DISK=public
```

### 3. Configure CORS

Edit `config/cors.php`:

```php
<?php

return [
    /*
     * Paths that should have CORS enabled
     */
    'paths' => [
        'api/*',
        'storage/*',  // IMPORTANT: Allow storage access
        'sanctum/csrf-cookie'
    ],

    /*
     * Allowed HTTP methods
     */
    'allowed_methods' => ['*'],

    /*
     * Allowed origins (domains that can access your API)
     */
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '')),

    /*
     * Patterns for allowed origins
     * Useful for preview deployments with dynamic URLs
     */
    'allowed_origins_patterns' => [
        '/^https:\/\/fastkart-admin-.*\.vercel\.app$/',
    ],

    /*
     * Allowed headers
     */
    'allowed_headers' => ['*'],

    /*
     * Headers to expose to the browser
     */
    'exposed_headers' => [],

    /*
     * Max age for preflight requests
     */
    'max_age' => 0,

    /*
     * Allow credentials (cookies, authorization headers, etc.)
     */
    'supports_credentials' => true,
];
```

### 4. Configure Sanctum

Edit `config/sanctum.php`:

```php
<?php

use Laravel\Sanctum\Sanctum;

return [
    /*
     * Stateful domains that should receive the CSRF cookie
     */
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort()
    ))),

    /*
     * Guard to use for authentication
     */
    'guard' => ['web'],

    /*
     * Token expiration (in minutes)
     */
    'expiration' => null,

    /*
     * Sanctum middleware
     */
    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],
];
```

### 5. Configure Session

Edit `config/session.php`:

```php
<?php

return [
    'driver' => env('SESSION_DRIVER', 'cookie'),
    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'files' => storage_path('framework/sessions'),
    'connection' => env('SESSION_CONNECTION'),
    'table' => 'sessions',
    'store' => env('SESSION_STORE'),
    'lottery' => [2, 100],
    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),
    'path' => '/',
    'domain' => env('SESSION_DOMAIN'),  // Uses .neelayurvedics.in
    'secure' => env('SESSION_SECURE_COOKIE', true),
    'http_only' => true,
    'same_site' => env('SESSION_SAME_SITE', 'lax'),
];
```

### 6. Configure Filesystem

Edit `config/filesystems.php`:

```php
<?php

return [
    'default' => env('FILESYSTEM_DISK', 'public'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app'),
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',  // Public URL for storage
            'visibility' => 'public',
            'throw' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
        ],
    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];
```

### 7. Update HTTP Kernel Middleware

Edit `app/Http/Kernel.php`:

```php
<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     */
    protected $middleware = [
        // ... other middleware
        \Fruitcake\Cors\HandleCors::class,  // Add CORS middleware globally
    ];

    /**
     * The application's route middleware groups.
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];
}
```

### 8. Create Storage Symlink

**CRITICAL STEP** - SSH into your server and run:

```bash
# Navigate to Laravel project directory
cd /var/www/html/your-laravel-project

# Create symbolic link
php artisan storage:link

# Set proper permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache

# Verify symlink was created
ls -la public/storage
# Should show: storage -> ../storage/app/public
```

### 9. Configure Routes

Edit `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\AttachmentController;
// ... other controllers

/*
 * Public routes (no authentication)
 */
Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
});

/*
 * Protected routes (require authentication)
 */
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Attachments/Media
    Route::get('/attachment', [AttachmentController::class, 'index']);
    Route::post('/attachment', [AttachmentController::class, 'store']);
    Route::delete('/attachment/deleteAll', [AttachmentController::class, 'deleteAll']);
    Route::delete('/attachment/{id}', [AttachmentController::class, 'destroy']);
    
    // ... other routes
});
```

### 10. Clear All Caches

After making all configuration changes:

```bash
# Clear configuration cache
php artisan config:clear

# Clear application cache
php artisan cache:clear

# Clear route cache
php artisan route:clear

# Clear view cache
php artisan view:clear

# Clear compiled classes
php artisan clear-compiled

# Optimize for production (optional)
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🔒 Security Considerations

### 1. Environment File Security

```bash
# Ensure .env is not accessible via web
chmod 600 .env

# Ensure .env is in .gitignore
echo ".env" >> .gitignore
```

### 2. Storage Security

```bash
# Ensure storage is not web accessible directly
# Only public storage should be accessible via symlink

# storage/app/public → accessible via /storage
# storage/app/private → NOT accessible via web
```

### 3. Rate Limiting

Edit `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'api' => [
        'throttle:60,1',  // 60 requests per minute
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

### 4. API Token Expiration

For Sanctum tokens, set expiration in `config/sanctum.php`:

```php
'expiration' => 60,  // 60 minutes
```

## 🧪 Testing Configuration

### Test CORS

```bash
curl -H "Origin: https://admin.neelayurvedics.in" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://api.neelayurvedics.in/api/admin/attachment
```

Should return headers:
```
Access-Control-Allow-Origin: https://admin.neelayurvedics.in
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
```

### Test Storage Access

```bash
# Test if storage is accessible
curl -I https://api.neelayurvedics.in/storage/test.jpg
```

Should return `200 OK` (if file exists) or `404 Not Found` (if file doesn't exist)
Should NOT return `400 Bad Request`

### Test API Authentication

```bash
# Test login endpoint
curl -X POST https://api.neelayurvedics.in/api/admin/login \
     -H "Content-Type: application/json" \
     -H "Accept: application/json" \
     -d '{"email":"admin@example.com","password":"password"}'
```

Should return authentication token

## 📝 Additional Notes

1. **Database Configuration**: Ensure your database connection is properly configured
2. **Queue Workers**: If using queues, configure supervisord or similar
3. **Scheduled Tasks**: Set up cron jobs for Laravel scheduler
4. **Logging**: Configure proper logging for production
5. **Backups**: Implement regular database and file backups

## 🔄 Maintenance Commands

```bash
# Check Laravel version
php artisan --version

# Check installed packages
composer show

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Create admin user (if needed)
php artisan make:admin-user
```

## 🆘 Troubleshooting

### Issue: CORS errors
- Check CORS_ALLOWED_ORIGINS in .env
- Clear config cache: `php artisan config:clear`
- Check CORS middleware is enabled

### Issue: Storage 400 error
- Run `php artisan storage:link`
- Check storage permissions
- Verify symlink exists: `ls -la public/storage`

### Issue: Session/Cookie not working
- Check SESSION_DOMAIN is set correctly
- Verify SANCTUM_STATEFUL_DOMAINS includes your admin domain
- Check SESSION_SECURE_COOKIE is true for HTTPS

### Issue: Authentication fails
- Check Sanctum middleware is applied
- Verify API routes are protected
- Check token expiration settings

---

**Last Updated**: November 1, 2025
