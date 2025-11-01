# Frontend-Backend Connection Guide

This document explains how the Fastkart Admin (Frontend) connects to the Laravel API (Backend).

## 🔄 Architecture Overview

```
┌─────────────────────────────────────┐
│   Frontend (Vercel)                 │
│   https://admin.neelayurvedics.in   │
│                                     │
│   - Next.js 15                      │
│   - React Components                │
│   - Axios for API calls             │
│   - React Query for data fetching   │
└──────────────┬──────────────────────┘
               │
               │ HTTPS Requests
               │ (with CORS headers)
               │
               ▼
┌─────────────────────────────────────┐
│   Backend (Laravel)                 │
│   https://api.neelayurvedics.in     │
│                                     │
│   - Laravel 10.x                    │
│   - Laravel Sanctum (Auth)          │
│   - API Routes                      │
│   - Database (MySQL/PostgreSQL)     │
└─────────────────────────────────────┘
```

## 🔗 How They Connect

### 1. Environment Variables

The frontend knows where to find the backend through environment variables:

**Frontend (.env.local or Vercel Environment Variables):**
```bash
# Base API URL
URL=https://api.neelayurvedics.in/api/admin

# For images/storage
storageURL=https://api.neelayurvedics.in
adminURL=https://api.neelayurvedics.in/admin/

# Client-side accessible variables
NEXT_PUBLIC_API_URL=https://api.neelayurvedics.in/api/admin
```

### 2. Axios Configuration

The frontend uses Axios to make HTTP requests to the backend.

**Location:** `src/utils/axiosUtils/AxiosUtils.js`

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.URL || 'https://api.neelayurvedics.in/api/admin',
  withCredentials: true,  // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (adds auth token)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 3. API Endpoints

All API endpoints are defined in one place:

**Location:** `src/utils/axiosUtils/API.js`

```javascript
// Authentication
export const login = "/login";
export const logout = "/logout";
export const me = "/me";

// Attachments
export const attachment = "/attachment";
export const createAttachment = "/attachment";
export const attachmentDelete = "/attachment/deleteAll";

// Products
export const product = "/product";
export const productStatus = "/product/status";

// ... other endpoints
```

### 4. Making API Calls

The frontend uses React Query for data fetching:

**Example: Fetching Attachments**

```javascript
import { useQuery } from '@tanstack/react-query';
import request from '@/utils/axiosUtils';
import { attachment } from '@/utils/axiosUtils/API';

const AttachmentComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [attachment],
    queryFn: () => request({ 
      url: attachment, 
      params: { paginate: 10, page: 1 } 
    }),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

## 🔐 Authentication Flow

### 1. Login Process

```
User enters credentials
       ↓
Frontend sends POST to /api/admin/login
       ↓
Backend validates credentials
       ↓
Backend returns token + user data
       ↓
Frontend stores token in localStorage
       ↓
Frontend redirects to dashboard
```

**Frontend Code:**
```javascript
const handleLogin = async (email, password) => {
  try {
    const response = await axios.post('/login', { email, password });
    
    // Store token
    localStorage.setItem('token', response.data.token);
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

**Backend Route (Laravel):**
```php
// routes/api.php
Route::post('/admin/login', [AuthController::class, 'login']);
```

**Backend Controller:**
```php
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($credentials)) {
        $user = Auth::user();
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Invalid credentials',
    ], 401);
}
```

### 2. Authenticated Requests

All subsequent requests include the token:

```
Frontend makes request
       ↓
Axios interceptor adds Authorization header
       ↓
Backend validates token (Sanctum middleware)
       ↓
If valid: Process request
If invalid: Return 401 Unauthorized
       ↓
Frontend handles response
```

## 🖼️ Image/File Handling

### Uploading Files

```javascript
const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('collection_name', 'images');

  try {
    const response = await axios.post('/attachment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('File uploaded:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### Displaying Images

```javascript
import { getStorageImage } from '@/utils/getImageUrl';

const ImageComponent = ({ imageUrl }) => {
  // Converts relative path to full URL
  // /storage/19/image.jpg → https://api.neelayurvedics.in/storage/19/image.jpg
  const fullUrl = getStorageImage(imageUrl);
  
  return <img src={fullUrl} alt="Product" />;
};
```

## 🔒 CORS Configuration

For the frontend and backend to communicate, CORS must be configured correctly.

### Backend CORS Setup (Laravel)

**config/cors.php:**
```php
return [
    'paths' => ['api/*', 'storage/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://admin.neelayurvedics.in',
        'https://fastkart-admin.vercel.app',
        'http://localhost:3000',
    ],
    
    'allowed_headers' => ['*'],
    
    'supports_credentials' => true,
];
```

### Frontend Configuration

The frontend automatically handles CORS by:
1. Setting `withCredentials: true` in Axios
2. Including proper headers in requests
3. Using the correct domain in requests

## 🔄 Request Flow Example

### Complete Request Lifecycle

1. **User Action**
   ```javascript
   // User clicks "Get Products"
   const fetchProducts = () => {
     // React Query triggers
   };
   ```

2. **React Query Initiates Request**
   ```javascript
   useQuery({
     queryKey: ['products'],
     queryFn: () => request({ url: '/product', params: { page: 1 } })
   });
   ```

3. **Axios Sends Request**
   ```
   GET https://api.neelayurvedics.in/api/admin/product?page=1
   Headers:
     Authorization: Bearer eyJ0eXAiOiJKV1QiLC...
     Accept: application/json
     Content-Type: application/json
   ```

4. **Backend Processes Request**
   ```php
   // Laravel Route
   Route::middleware('auth:sanctum')->get('/product', [ProductController::class, 'index']);
   
   // Controller
   public function index(Request $request) {
       return Product::with('media')
           ->paginate($request->get('paginate', 15));
   }
   ```

5. **Backend Returns Response**
   ```json
   {
     "success": true,
     "data": {
       "data": [...],
       "current_page": 1,
       "total": 50
     }
   }
   ```

6. **Frontend Receives & Displays**
   ```javascript
   // React Query cache updates
   // Component re-renders with new data
   data?.data?.data?.map(product => ...)
   ```

## 🧪 Testing the Connection

### Test from Browser Console

```javascript
// Test API connectivity
fetch('https://api.neelayurvedics.in/api/admin/ping')
  .then(r => r.json())
  .then(data => console.log('API Response:', data));

// Test authenticated endpoint
fetch('https://api.neelayurvedics.in/api/admin/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Accept': 'application/json',
  }
})
  .then(r => r.json())
  .then(data => console.log('User Data:', data));
```

### Test from Terminal

```bash
# Test login endpoint
curl -X POST https://api.neelayurvedics.in/api/admin/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test authenticated endpoint
curl -X GET https://api.neelayurvedics.in/api/admin/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

## 🐛 Common Connection Issues

### Issue: CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
- Add your frontend domain to Laravel CORS config
- Ensure `supports_credentials: true`
- Clear Laravel cache: `php artisan config:clear`

### Issue: 401 Unauthorized

```
{"message": "Unauthenticated"}
```

**Solution:**
- Check if token is stored: `localStorage.getItem('token')`
- Verify token is sent in Authorization header
- Check Sanctum middleware is applied to routes
- Token might be expired

### Issue: Network Error

```
Network Error
```

**Solution:**
- Check if backend server is running
- Verify API URL in environment variables
- Check firewall/security groups
- Test with cURL to isolate issue

### Issue: 500 Internal Server Error

```
500 Internal Server Error
```

**Solution:**
- Check Laravel logs: `storage/logs/laravel.log`
- Enable debug mode temporarily: `APP_DEBUG=true`
- Check database connection
- Verify all required environment variables are set

## 📚 API Documentation Structure

Create API documentation for your team:

```
/api/admin
├── Authentication
│   ├── POST /login
│   ├── POST /logout
│   └── GET /me
├── Products
│   ├── GET /product
│   ├── POST /product
│   ├── PUT /product/{id}
│   └── DELETE /product/{id}
├── Attachments
│   ├── GET /attachment
│   ├── POST /attachment
│   └── DELETE /attachment/{id}
└── ... other endpoints
```

## 🔗 Useful Resources

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Laravel CORS](https://github.com/fruitcake/laravel-cors)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Last Updated**: November 1, 2025
