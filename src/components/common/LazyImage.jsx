// filepath: c:\Users\CUI\OneDrive\Desktop\SFour00\src\components\common\LazyImage.jsx
import React, { useState, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null, 
  placeholderColor = '#f3f4f6',
  loadingComponent = null,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true);
    setError(false);
    
    // Create new image object to preload
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
    };
    
    img.src = src;
    
    // If the image is already cached, the onload event might not trigger
    if (img.complete) {
      setImageSrc(src);
      setIsLoading(false);
    }
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);
  
  if (isLoading) {
    return loadingComponent || (
      <div 
        className={`${className} animate-pulse`}
        style={{ backgroundColor: placeholderColor }}
        {...props}
      />
    );
  }
  
  if (error && !fallbackSrc) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-200`}
        {...props}
      >
        <span className="text-red-500">!</span>
      </div>
    );
  }
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage;