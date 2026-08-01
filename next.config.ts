import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for catching potential issues early
  reactStrictMode: true,

  // Compress output for better performance
  compress: true,

  // Power header removed for security
  poweredByHeader: false,

  images: {
    // Allow external image domains if we add album art in the future
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Custom HTTP headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking attacks
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Enable strict HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Referrer policy for privacy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Cache static assets aggressively — they're content-hashed so safe to cache forever
        source: "/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Redirect trailing slashes for canonical URL consistency (important for SEO)
  trailingSlash: false,
};

export default nextConfig;
