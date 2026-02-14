// services/imageService.ts
// COMPREHENSIVE IMAGE SERVICE WITH MULTIPLE SOURCES

export type ImageSource = 'unsplash' | 'pexels' | 'pixabay' | 'wikimedia' | 'flags' | 'local' | 'placeholder';

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'webp';
  fallback?: boolean;
}

class ImageService {
  private cache = new Map<string, string>();
  private failedSources = new Set<string>();

  // Multiple image sources with fallbacks
  private sources = {
    unsplash: (query: string, options: ImageOptions = {}) => {
      const w = options.width || 800;
      const h = options.height || 600;
      return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}`;
    },

    pexels: (query: string, options: ImageOptions = {}) => {
      const w = options.width || 800;
      const h = options.height || 600;
      return `https://images.pexels.com/photos/${query}/pexels-photo-${query}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}`;
    },

    pixabay: (query: string, options: ImageOptions = {}) => {
      return `https://pixabay.com/get/${query}.jpg`;
    },

    wikimedia: (filename: string) => {
      return `https://upload.wikimedia.org/wikipedia/commons/${filename}`;
    },

    flags: (countryCode: string) => {
      const code = countryCode.toLowerCase();
      return [
        `https://flagcdn.com/w320/${code}.png`,
        `https://flagcdn.com/${code}.svg`,
        `https://www.countryflagsapi.com/png/${code}`,
        `https://flagpedia.net/data/flags/w580/${code}.png`,
        `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${code.toUpperCase()}.svg`
      ];
    },

    local: (path: string) => {
      return `/images/${path}`;
    },

    placeholder: (text: string, options: ImageOptions = {}) => {
      const w = options.width || 400;
      const h = options.height || 300;
      const bgColor = this.hashStringToColor(text);
      const textColor = this.getContrastColor(bgColor);
      return `data:image/svg+xml,${encodeURIComponent(`
        <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${bgColor}"/>
          <text x="50%" y="50%" font-family="Arial" font-size="24" fill="${textColor}" 
                text-anchor="middle" dominant-baseline="middle">
            ${text}
          </text>
        </svg>
      `)}`;
    }
  };

  // Get image with automatic fallback
  async getImage(
    query: string,
    preferredSource: ImageSource = 'unsplash',
    options: ImageOptions = {}
  ): Promise<string> {
    const cacheKey = `${preferredSource}-${query}-${JSON.stringify(options)}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Try preferred source first
    let url = this.getUrlFromSource(query, preferredSource, options);
    
    if (options.fallback !== false) {
      // If preferred source failed before, try others
      if (this.failedSources.has(`${preferredSource}-${query}`)) {
        url = await this.tryFallbackSources(query, preferredSource, options);
      }
    }

    this.cache.set(cacheKey, url);
    return url;
  }

  // Get multiple images from different sources
  async getMultipleImages(
    query: string,
    count: number = 3,
    options: ImageOptions = {}
  ): Promise<string[]> {
    const images: string[] = [];
    const sources: ImageSource[] = ['unsplash', 'pexels', 'pixabay', 'placeholder'];

    for (let i = 0; i < Math.min(count, sources.length); i++) {
      const url = this.getUrlFromSource(query, sources[i], options);
      images.push(url);
    }

    return images;
  }

  // Get flag with multiple fallback sources
  async getFlag(countryCode: string): Promise<string> {
    const urls = this.sources.flags(countryCode);
    
    // Return first URL, with others as fallback attributes
    return urls[0];
  }

  // Get all flag URLs for a country
  getAllFlagUrls(countryCode: string): string[] {
    return this.sources.flags(countryCode);
  }

  // Try to load image and fallback on error
  async loadImageWithFallback(
    query: string,
    sources: ImageSource[] = ['unsplash', 'pexels', 'placeholder']
  ): Promise<string> {
    for (const source of sources) {
      try {
        const url = this.getUrlFromSource(query, source);
        await this.testImageUrl(url);
        return url;
      } catch (error) {
        this.failedSources.add(`${source}-${query}`);
        continue;
      }
    }
    
    // Final fallback to placeholder
    return this.sources.placeholder(query);
  }

  // Test if image URL is valid
  private async testImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => reject(false), 5000);
    });
  }

  // Get URL from specific source
  private getUrlFromSource(
    query: string,
    source: ImageSource,
    options: ImageOptions = {}
  ): string {
    switch (source) {
      case 'unsplash':
        return this.sources.unsplash(query, options);
      case 'pexels':
        return this.sources.pexels(query, options);
      case 'pixabay':
        return this.sources.pixabay(query, options);
      case 'wikimedia':
        return this.sources.wikimedia(query);
      case 'flags':
        return this.sources.flags(query)[0];
      case 'local':
        return this.sources.local(query);
      case 'placeholder':
      default:
        return this.sources.placeholder(query, options);
    }
  }

  // Try fallback sources
  private async tryFallbackSources(
    query: string,
    excludeSource: ImageSource,
    options: ImageOptions
  ): Promise<string> {
    const fallbackOrder: ImageSource[] = [
      'unsplash', 'pexels', 'pixabay', 'placeholder'
    ].filter(s => s !== excludeSource);

    for (const source of fallbackOrder) {
      if (!this.failedSources.has(`${source}-${query}`)) {
        return this.getUrlFromSource(query, source, options);
      }
    }

    return this.sources.placeholder(query, options);
  }

  // Generate color from string
  private hashStringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const h = hash % 360;
    const s = 65 + (hash % 20);
    const l = 50 + (hash % 20);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // Get contrast color (black or white)
  private getContrastColor(hsl: string): string {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return '#000000';
    
    const l = parseInt(match[3]);
    return l > 50 ? '#000000' : '#ffffff';
  }

  // Preload images
  async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    });
    
    await Promise.all(promises);
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
    this.failedSources.clear();
  }

  // Get cached images count
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const imageService = new ImageService();

// Helper component for reliable image loading
export const createImageWithFallback = (
  src: string,
  fallbacks: string[],
  alt: string = ''
): HTMLImageElement => {
  const img = document.createElement('img');
  img.alt = alt;
  
  let currentIndex = 0;
  const sources = [src, ...fallbacks];
  
  const tryNextSource = () => {
    if (currentIndex < sources.length) {
      img.src = sources[currentIndex];
      currentIndex++;
    }
  };
  
  img.onerror = tryNextSource;
  tryNextSource();
  
  return img;
};
