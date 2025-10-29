/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    // frontend code expects a base API URL like /api (not the admin subpath)
    URL: "https://api.neelayurvedics.in/api/admin",
    storageURL: "https://api.neelayurvedics.in",
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
    // Custom loader to bypass Next.js optimization for external images
    loader: 'custom',
    loaderFile: './src/utils/imageLoader.js',
    // Image configuration
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
