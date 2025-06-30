/**
 * Get the image URL for an item
 * First checks if image exists in database, then falls back to URL
 */
export function getItemImageUrl(itemId: string, imageIndex: number = 0): string {
  // Use our API endpoint that handles both database and URL fallback
  return `/api/items/${itemId}/images?index=${imageIndex}`;
}

/**
 * Check if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get all image URLs for an item
 */
export function getItemImageUrls(itemId: string, imageCount: number): string[] {
  return Array.from({ length: imageCount }, (_, index) => 
    getItemImageUrl(itemId, index)
  );
}