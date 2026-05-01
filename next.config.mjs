/**
 * Where Next.js should proxy `/upload/*` (zev-back static files).
 */
function uploadProxyOrigin() {
  const explicit =
    process.env.UPLOAD_PROXY_ORIGIN ||
    process.env.API_INTERNAL_URL ||
    process.env.SITE_CONTENT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL;
  if (explicit) {
    return String(explicit)
      .replace(/\/$/, "")
      .replace(/\/api(?:\/v\d+)?$/, "");
  }
  return "http://103.236.194.106:5000";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const origin = uploadProxyOrigin();
    return [
      {
        source: "/upload/:path*",
        destination: `${origin}/upload/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${origin}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      // Remote production server
      { protocol: "http",  hostname: "103.236.194.106", pathname: "/upload/**" },
      // Local dev
      { protocol: "http",  hostname: "localhost",   port: "5000", pathname: "/upload/**" },
      { protocol: "http",  hostname: "127.0.0.1",   port: "5000", pathname: "/upload/**" },
      // Legacy 4000 port
      { protocol: "http",  hostname: "localhost",   port: "4000", pathname: "/upload/**" },
      { protocol: "http",  hostname: "127.0.0.1",   port: "4000", pathname: "/upload/**" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  transpilePackages: ["lenis"],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
