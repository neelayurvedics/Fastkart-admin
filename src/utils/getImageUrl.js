// Helper function to get environment variables with fallbacks
const getEnvVar = (key, fallback) => {
    // Try both server and client-side env vars
    return process.env[key] || process.env[`NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`] || fallback;
};

const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    const adminURL = getEnvVar('adminURL', 'https://api.neelayurvedics.in/admin/');
    return `${adminURL}images/themes/${path}`;
};

const getThemeImage = (imageName) => {
    return getImageUrl(imageName);
};

const getStorageImage = (path) => {
    if (!path) {
        return '';
    }
    
    // If already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Get base URL (with fallback) and ensure no trailing slash
    let baseURL = getEnvVar('storageURL', 'https://api.neelayurvedics.in');
    baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    
    // Remove any leading slashes from the path
    let cleanPath = path;
    while (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }
    
    // If path doesn't already start with "storage/", prepend it
    // This handles cases where the API returns "19/image.webp" or "/storage/19/image.webp"
    if (!cleanPath.startsWith('storage/')) {
        cleanPath = `storage/${cleanPath}`;
    }
    
    // Return the complete URL with single slash
    // This will correctly produce: https://api.neelayurvedics.in/storage/19/image.webp
    return `${baseURL}/${cleanPath}`;
};

export { getImageUrl, getThemeImage, getStorageImage };