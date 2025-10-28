/**
 * Custom image loader for Next.js
 * This bypasses Next.js image optimization and serves images directly
 * Useful for external images that might timeout during optimization
 */
export default function imageLoader({ src, width, quality }) {
  // If src is already a full URL, return it as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path, return it as-is (for local images)
  return src;
}
