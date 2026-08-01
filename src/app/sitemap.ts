import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Generates sitemap.xml dynamically.
 *
 * WHY A SITEMAP:
 * Sitemaps help Google discover and prioritise pages — especially important
 * for a lyrics site where page count can grow large.
 *
 * WHY ONLY STATIC PAGES HERE:
 * Individual lyrics pages (/lyrics/[id]) are dynamically generated on demand
 * and there are potentially millions of them. Including them all in a single
 * sitemap would be impractical. Instead, we submit the static pages and let
 * Google discover lyrics pages through internal links (search results, quick chips).
 *
 * A production site would implement sitemap index files and submit batches
 * of lyrics page URLs once they've been crawled organically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_CONFIG.url}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
