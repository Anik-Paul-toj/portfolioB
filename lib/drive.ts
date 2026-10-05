/**
 * Utility to extract Google Drive file ID and format direct preview URLs
 */
export function extractDriveFileId(url?: string | null): string | null {
  if (!url) return null;
  const match =
    url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    url.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function formatDriveImageUrl(url?: string | null): string {
  if (!url) return "";
  const fileId = extractDriveFileId(url);
  if (fileId) {
    // High-res Google User Content CDN or Google Drive Thumbnail API
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

export function formatDriveThumbnailUrl(url?: string | null, size = 1200): string {
  if (!url) return "";
  const fileId = extractDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
  }
  return url;
}
