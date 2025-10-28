import Image from 'next/image';

const defaultLoader = ({ src, width, quality }) => {
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    return `${process.env.adminURL}images/themes/${src}`;
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