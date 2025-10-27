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
    return `${process.env.storageURL}${path}`;
};

export { getImageUrl, getThemeImage, getStorageImage };