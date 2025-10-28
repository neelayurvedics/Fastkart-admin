import Image from 'next/image';
import React from 'react';

/**
 * Optimized Image Wrapper
 * Automatically handles image loading with fallbacks and error handling
 * All external images are served unoptimized to avoid timeout issues
 */
const OptimizedImage = ({ src, alt = '', onError, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  // Determine if image should be unoptimized
  const isExternalImage = typeof imgSrc === 'string' && (
    imgSrc.startsWith('http://') || 
    imgSrc.startsWith('https://')
  );

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized={isExternalImage || props.unoptimized}
      onError={handleError}
    />
  );
};

export default OptimizedImage;
