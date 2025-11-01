# Architecture Diagram

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         USER'S BROWSER                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │              https://admin.neelayurvedics.in                     │ │
│  │                                                                   │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐              │ │
│  │  │  Login Page │  │  Dashboard  │  │  Products  │   ...        │ │
│  │  └─────────────┘  └─────────────┘  └────────────┘              │ │
│  │                                                                   │ │
│  │  React Components + Next.js 15 + Axios + React Query            │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS Requests
                                    │ (JSON + Bearer Token)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         VERCEL PLATFORM                                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                    Next.js Application                            │ │
│  │                                                                   │ │
│  │  • Server-Side Rendering (SSR)                                   │ │
│  │  • Static Site Generation (SSG)                                  │ │
│  │  • Edge Network (Global CDN)                                     │ │
│  │  • Automatic HTTPS                                               │ │
│  │  • Environment Variables                                         │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Calls
                                    │ GET, POST, PUT, DELETE
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     LARAVEL API SERVER                                  │
│                 https://api.neelayurvedics.in                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                  API Endpoints                                    │ │
│  │                                                                   │ │
│  │  /api/admin/login          (POST)   - User authentication        │ │
│  │  /api/admin/logout         (POST)   - User logout                │ │
│  │  /api/admin/me             (GET)    - Get user info              │ │
│  │  /api/admin/product        (GET)    - List products              │ │
│  │  /api/admin/product        (POST)   - Create product             │ │
│  │  /api/admin/attachment     (GET)    - List media files           │ │
│  │  /api/admin/attachment     (POST)   - Upload files               │ │
│  │  ...                                                              │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                  Middleware Stack                                 │ │
│  │                                                                   │ │
│  │  • CORS Handler                                                   │ │
│  │  • Laravel Sanctum (Authentication)                              │ │
│  │  • Rate Limiting                                                  │ │
│  │  • Request Validation                                            │ │
│  │  • Error Handling                                                │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         DATABASE SERVER                                 │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                    MySQL / PostgreSQL                             │ │
│  │                                                                   │ │
│  │  Tables:                                                          │ │
│  │  • users                                                          │ │
│  │  • products                                                       │ │
│  │  • attachments                                                    │ │
│  │  • orders                                                         │ │
│  │  • categories                                                     │ │
│  │  • ...                                                            │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         FILE STORAGE                                    │
│                 https://api.neelayurvedics.in/storage                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                    Public Storage                                 │ │
│  │                                                                   │ │
│  │  storage/app/public/                                             │ │
│  │  ├── 1/                                                           │ │
│  │  │   ├── product-image-1.webp                                    │ │
│  │  │   └── product-image-2.jpg                                     │ │
│  │  ├── 2/                                                           │ │
│  │  │   └── category-image.png                                      │ │
│  │  └── ...                                                          │ │
│  │                                                                   │ │
│  │  Symlinked to: public/storage/                                   │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow Diagram

### User Login Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Browser │────▶│  Vercel  │────▶│ Laravel  │────▶│ Database │
│          │     │          │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                 │                │
     │  1. Enter      │                 │                │
     │  Credentials   │                 │                │
     │                │                 │                │
     │  2. POST       │                 │                │
     │  /login        │                 │                │
     │ ──────────────▶│                 │                │
     │                │  3. Forward     │                │
     │                │  Request        │                │
     │                │ ───────────────▶│                │
     │                │                 │  4. Validate   │
     │                │                 │  Credentials   │
     │                │                 │ ──────────────▶│
     │                │                 │                │
     │                │                 │  5. User Data  │
     │                │                 │ ◀──────────────│
     │                │                 │                │
     │                │  6. Generate    │                │
     │                │  Token          │                │
     │                │ ◀───────────────│                │
     │                │                 │                │
     │  7. Return     │                 │                │
     │  Token + User  │                 │                │
     │ ◀──────────────│                 │                │
     │                │                 │                │
     │  8. Store      │                 │                │
     │  in LocalStorage                 │                │
     │                │                 │                │
     │  9. Redirect   │                 │                │
     │  to Dashboard  │                 │                │
     │                │                 │                │
```

### API Request Flow (Authenticated)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Browser │────▶│  Vercel  │────▶│ Laravel  │────▶│ Database │
│          │     │          │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │                │                 │                │
     │  1. User       │                 │                │
     │  Action        │                 │                │
     │                │                 │                │
     │  2. API Call   │                 │                │
     │  with Token    │                 │                │
     │ ──────────────▶│                 │                │
     │  GET /product  │                 │                │
     │  Auth: Bearer  │                 │                │
     │  xyz123...     │                 │                │
     │                │  3. Forward     │                │
     │                │  with Token     │                │
     │                │ ───────────────▶│                │
     │                │                 │  4. Validate   │
     │                │                 │  Token         │
     │                │                 │  (Sanctum)     │
     │                │                 │                │
     │                │                 │  5. Query DB   │
     │                │                 │ ──────────────▶│
     │                │                 │                │
     │                │                 │  6. Results    │
     │                │                 │ ◀──────────────│
     │                │                 │                │
     │                │  7. JSON        │                │
     │                │  Response       │                │
     │                │ ◀───────────────│                │
     │                │                 │                │
     │  8. Display    │                 │                │
     │  Data          │                 │                │
     │ ◀──────────────│                 │                │
     │                │                 │                │
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layer 1                        │
│                         HTTPS                               │
│  • All traffic encrypted                                    │
│  • SSL certificates (automatic on Vercel)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Security Layer 2                        │
│                         CORS                                │
│  • Allowed origins configured                               │
│  • Credentials support enabled                              │
│  • Preflight requests handled                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Security Layer 3                        │
│                    Authentication                           │
│  • Laravel Sanctum tokens                                   │
│  • Bearer token in Authorization header                    │
│  • Token validation on each request                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Security Layer 4                        │
│                    Authorization                            │
│  • Role-based access control                                │
│  • Permission checks                                        │
│  • Resource ownership validation                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Security Layer 5                        │
│                   Input Validation                          │
│  • Request validation rules                                 │
│  • SQL injection prevention                                │
│  • XSS protection                                          │
└─────────────────────────────────────────────────────────────┘
```

## 🌍 Global Distribution (Vercel Edge Network)

```
                    ┌─────────────────┐
                    │                 │
                    │  Vercel Global  │
                    │   CDN Network   │
                    │                 │
                    └────────┬────────┘
                             │
             ┌───────────────┼───────────────┐
             │               │               │
        ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
        │         │     │         │    │         │
        │  USA    │     │  Europe │    │  Asia   │
        │  Edge   │     │  Edge   │    │  Edge   │
        │  Server │     │  Server │    │  Server │
        │         │     │         │    │         │
        └─────────┘     └─────────┘    └─────────┘
             │               │               │
        ┌────▼────┐     ┌────▼────┐    ┌────▼────┐
        │         │     │         │    │         │
        │  Users  │     │  Users  │    │  Users  │
        │  in USA │     │ in EU   │    │ in Asia │
        │         │     │         │    │         │
        └─────────┘     └─────────┘    └─────────┘

• Fast content delivery from nearest edge location
• Automatic load balancing
• Global availability
```

## 📦 Deployment Pipeline

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│              │      │              │      │              │
│   Developer  │─────▶│    GitHub    │─────▶│    Vercel    │
│              │      │  Repository  │      │   Platform   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      │
       │ git push             │ webhook              │
       ▼                      ▼                      ▼
                                              
   Code Changes         Triggers Build        Builds & Deploys
   Committed            Automatically         to Production
                                              
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │                  │
                     │  Live Website    │
                     │  Updated         │
                     │                  │
                     └──────────────────┘
```

## 🔄 Data Flow (Complete Cycle)

```
User Action → Frontend → API Request → Laravel → Database
                                                     │
                                                     ▼
User Sees Result ← Frontend ← API Response ← Laravel
```

---

**Last Updated**: November 1, 2025
