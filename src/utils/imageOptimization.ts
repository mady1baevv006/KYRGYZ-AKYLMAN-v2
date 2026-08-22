/**
 * Cloudinary & Image URL Optimization Utility
 * 
 * Automatically applies Cloudinary on-the-fly transformations:
 * - f_auto (delivers WebP/AVIF instead of heavy PNG/JPEG)
 * - q_auto:eco (optimizes perceptual quality reducing file size up to 90%)
 * - w_{width} (scales to required dimensions)
 */

export interface OptimizeImageOptions {
  width?: number;
  quality?: 'auto' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  crop?: string;
}

export function optimizeCloudinaryUrl(
  url: string | undefined | null,
  options: OptimizeImageOptions = {}
): string {
  if (!url || typeof url !== 'string') return '';

  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com') || !url.includes('/image/upload/')) {
    return url;
  }

  const {
    width,
    quality = 'auto:eco',
    format = 'auto',
    crop = 'limit',
  } = options;

  // Build transform string
  const transforms: string[] = [];
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (width) {
    transforms.push(`w_${width}`);
    if (crop) transforms.push(`c_${crop}`);
  }

  const transformString = transforms.join(',');

  const uploadIndex = url.indexOf('/image/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + '/image/upload/'.length);
  let rest = url.substring(uploadIndex + '/image/upload/'.length);

  // If rest already starts with transformations (e.g. f_auto,q_auto/...), remove them
  if (/^[a-z]_[a-zA-Z0-9_:,]+(\/[a-z]_[a-zA-Z0-9_:,]+)*\//.test(rest)) {
    rest = rest.replace(/^[a-z]_[a-zA-Z0-9_:,]+(\/[a-z]_[a-zA-Z0-9_:,]+)*\//, '');
  }

  return `${prefix}${transformString}/${rest}`;
}

/**
 * Optimized helper for student avatar / photos (max 400px square, fast WebP)
 */
export function getOptimizedStudentPhotoUrl(url: string | undefined | null): string {
  if (!url) return '';
  return optimizeCloudinaryUrl(url, {
    width: 400,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill',
  });
}

/**
 * Optimized helper for test scan pages (high-speed readable test sheets, max 1100px width)
 */
export function getOptimizedTestPageUrl(url: string | undefined | null): string {
  if (!url) return '';
  return optimizeCloudinaryUrl(url, {
    width: 1100,
    quality: 'auto:eco',
    format: 'auto',
  });
}

/**
 * In-memory image preload cache to eliminate image flickering and loading delay
 */
const preloadedCache = new Set<string>();

export function preloadImage(url: string): Promise<void> {
  if (!url || preloadedCache.has(url)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      preloadedCache.add(url);
      resolve();
    };
    img.onerror = () => {
      resolve();
    };
    img.src = url;
  });
}

export function preloadImages(urls: string[]): void {
  if (typeof window === 'undefined') return;
  const filtered = urls.filter((u) => u && !preloadedCache.has(u));
  filtered.forEach((url) => {
    preloadImage(url);
  });
}

