const adminURL = process.env.adminURL || "http://127.0.0.1:8000/admin/";
const storageURL = process.env.storageURL || "http://127.0.0.1:8000/storage/";

export function getThemeImagePath(imageName) {
    return `${adminURL}images/themes/${imageName}`;
}

export function getStorageImagePath(path) {
    return `${storageURL}${path}`;
}

export function getImageUrl(urlOrPath) {
    if (!urlOrPath) return '';
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
        return urlOrPath;
    }
    if (urlOrPath.startsWith('themes/')) {
        return getThemeImagePath(urlOrPath.replace('themes/', ''));
    }
    return getStorageImagePath(urlOrPath);
}

export const imageConfig = {
    domains: ['127.0.0.1', 'localhost', 'laravel.pixelstrap.net'],
    remotePatterns: [
        {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '8000',
            pathname: '/admin/images/**',
        },
        {
            protocol: 'http',
            hostname: '127.0.0.1',
            port: '8000',
            pathname: '/storage/**',
        }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
};