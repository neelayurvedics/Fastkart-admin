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
    if (!path) return '';
    
    // If already a full URL, return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Get base URL (with fallback)
    const baseURL = getEnvVar('storageURL', 'https://api.neelayurvedics.in');
    
    // Remove any leading slashes
    let cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // If path already starts with "storage/", use it as-is
    // Otherwise, prepend "storage/" to the path
    if (!cleanPath.startsWith('storage/')) {
        cleanPath = `storage/${cleanPath}`;
    }
    
    // Return the complete URL
    return `${baseURL}/${cleanPath}`;
};

export { getImageUrl, getThemeImage, getStorageImage };