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
    const baseURL = process.env.storageURL || 'https://api.neelayurvedics.in';
    
    // Remove any leading slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    
    // If path starts with "storage/", keep it as-is
    // Otherwise, prepend "storage/" to the path
    const finalPath = cleanPath.startsWith('storage/') ? cleanPath : `storage/${cleanPath}`;
    
    // Combine with base URL (ensure no double slashes)
    const result = `${baseURL}/${finalPath}`;
    
    // Debug logging (remove after testing)
    console.log('getStorageImage:', { input: path, output: result });
    
    return result;
};

export { getImageUrl, getThemeImage, getStorageImage };