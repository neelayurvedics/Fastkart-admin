/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  env: {
    // Server-side environment variables
    URL: process.env.URL || "https://api.neelayurvedics.in/api/admin",
    storageURL: process.env.storageURL || "https://api.neelayurvedics.in",
    adminURL: process.env.adminURL || "https://api.neelayurvedics.in/admin/",
    // Make them available on client-side as well
    NEXT_PUBLIC_STORAGE_URL: process.env.NEXT_PUBLIC_STORAGE_URL || process.env.storageURL || "https://api.neelayurvedics.in",
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || process.env.adminURL || "https://api.neelayurvedics.in/admin/",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.URL || "https://api.neelayurvedics.in/api/admin",
  },
  
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          // Cache static assets
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  images: {
    // Disable image optimization to avoid loader errors with static imports
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "laravel.pixelstrap.net",
      },
      {
        protocol: "http",
        hostname: "laravel.pixelstrap.net",
      },
      {
        protocol: "https",
        hostname: "admin.neelayurvedics.in",
      },
      {
        protocol: "https",
        hostname: "api.neelayurvedics.in",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Image configuration for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
