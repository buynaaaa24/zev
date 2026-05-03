/** CMS paths like `/upload/x.jpg` are proxied to the API via Next rewrites; `/images/...` stays on this app. */
export function resolveMediaUrl(src: string): string {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("/") || src.startsWith("data:")) {
    return src;
  }
  // Default to the same-origin proxy path to bypass ORB and CORS issues
  return `/api/v1/site-pages/media/${src}`;
}
