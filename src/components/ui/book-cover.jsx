"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/**
 * BookCover component for displaying book cover images with proper fallbacks
 * 
 * @param {Object} props - Component props
 * @param {string} props.coverUrl - URL of the book cover
 * @param {string} props.title - Book title for alt text
 * @param {string} props.size - Size variant (small, medium, large)
 * @param {boolean} props.priority - Whether the image should load with priority
 * @param {string} props.className - Additional CSS classes
 */
export function BookCover({ 
  coverUrl, 
  title = "Book cover", 
  size = "medium", 
  priority = false,
  className = "", 
}) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  // Define dimensions based on size variant
  const dimensions = {
    small: { width: 100, height: 150 },
    medium: { width: 200, height: 300 },
    large: { width: 300, height: 450 },
  };
  
  const { width, height } = dimensions[size] || dimensions.medium;
  const placeholderUrl = `https://placehold.co/${width}x${height}?text=No+Cover`;
  
  useEffect(() => {
    // Reset state when coverUrl changes
    setError(false);
    setLoaded(false);
    
    // Set image source - either the book cover or the placeholder
    if (coverUrl) {
      setImgSrc(coverUrl);
    } else {
      setImgSrc(placeholderUrl);
    }
  }, [coverUrl, placeholderUrl]);
  
  const handleImageError = () => {
    console.log(`Image failed to load: ${imgSrc}`);
    setError(true);
    setImgSrc(placeholderUrl);
  };

  const handleImageLoad = () => {
    setLoaded(true);
  };
  
  // Show loading state or placeholder while image loads
  if (!imgSrc) {
    return (
      <div className={`relative aspect-[2/3] bg-gray-200 animate-pulse ${className}`} />
    );
  }
  
  return (
    <div className={`relative aspect-[2/3] bg-gray-100 overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-gray-200 ${loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
      <Image
        src={imgSrc}
        alt={`Cover for ${title}`}
        fill
        priority={priority}
        sizes={`(max-width: 768px) ${width}px, ${width}px`}
        className="object-cover transition-opacity"
        onError={handleImageError}
        onLoad={handleImageLoad}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFeQI4W7hGygAAAABJRU5ErkJggg=="
        unoptimized={imgSrc.includes('placehold.co')}
      />
    </div>
  );
}