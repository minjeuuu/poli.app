// components/shared/SmartImage.tsx
// SMART IMAGE COMPONENT WITH MULTIPLE FALLBACK SOURCES

import React, { useState, useEffect } from 'react';
import { imageService, ImageSource } from '../../services/imageService';

interface SmartImageProps {
  query: string;
  alt?: string;
  className?: string;
  sources?: ImageSource[];
  width?: number;
  height?: number;
  fallbackText?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  query,
  alt = '',
  className = '',
  sources = ['unsplash', 'pexels', 'placeholder'],
  width,
  height,
  fallbackText,
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadImage();
  }, [query, sources]);

  const loadImage = async () => {
    setLoading(true);
    setError(false);

    try {
      const url = await imageService.getImage(
        query,
        sources[currentIndex],
        { width, height }
      );
      setCurrentSrc(url);
    } catch (err) {
      handleError(err as Error);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    // Try next source
    if (currentIndex < sources.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setError(true);
      setLoading(false);
      if (onError) onError(new Error('All image sources failed'));
    }
  };

  const handleError = (err: Error) => {
    setError(true);
    setLoading(false);
    if (onError) onError(err);
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-800 ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm p-4 text-center">
          {fallbackText || alt || 'Image unavailable'}
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

// Flag component with multiple fallback sources
export const FlagImage: React.FC<{
  countryCode: string;
  className?: string;
  alt?: string;
}> = ({ countryCode, className = 'w-8 h-6', alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const flagUrls = imageService.getAllFlagUrls(countryCode);
    setUrls(flagUrls);
  }, [countryCode]);

  const handleError = () => {
    if (currentIndex < urls.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!urls.length) {
    return (
      <div className={`bg-gray-300 dark:bg-gray-700 ${className}`} />
    );
  }

  return (
    <img
      src={urls[currentIndex]}
      alt={alt || `${countryCode} flag`}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// Gallery component with multiple image sources
export const ImageGallery: React.FC<{
  query: string;
  count?: number;
  className?: string;
}> = ({ query, count = 3, className = '' }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const urls = await imageService.getMultipleImages(query, count);
      setImages(urls);
      setLoading(false);
    };
    loadImages();
  }, [query, count]);

  if (loading) {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="aspect-video bg-gray-300 dark:bg-gray-700 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {images.map((src, i) => (
        <SmartImage
          key={i}
          query={query}
          className="aspect-video object-cover rounded"
          sources={['unsplash', 'pexels', 'placeholder']}
        />
      ))}
    </div>
  );
};

export default SmartImage;
