import Image from 'next/image';

// Helper function to get environment variables with fallbacks
const getEnvVar = (key, fallback) => {
    return process.env[key] || process.env[`NEXT_PUBLIC_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`] || fallback;
};

const defaultLoader = ({ src, width, quality }) => {
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    const adminURL = getEnvVar('adminURL', 'https://api.neelayurvedics.in/admin/');
    return `${adminURL}images/themes/${src}`;
};

const ThemeImage = ({ src, alt = '', ...props }) => {
    return (
        <Image
            src={src}
            alt={alt}
            loader={defaultLoader}
            unoptimized={true}
            {...props}
        />
    );
};

export default ThemeImage;