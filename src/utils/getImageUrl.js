const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${process.env.adminURL}images/themes/${path}`;
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
    const baseURL = 'https://api.neelayurvedics.in';
    
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