import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Generates robots.txt dynamically via Next.js App Router.
 *
 * WHY DYNAMIC (not static):
 * Using the Next.js robots() function means we can reference SITE_CONFIG.url
 * for the sitemap location — no hardcoded URLs to maintain.
 *
 * WHY THESE RULES:
 * - Allow all bots to crawl the main content pages
 * - Disallow /api/ routes — no SEO value and adds crawl budget waste
 * - Disallow /auth/ — login/signup pages shouldn't be indexed
 * - The sitemap declaration helps crawlers discover all pages efficiently
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/"],
      },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
