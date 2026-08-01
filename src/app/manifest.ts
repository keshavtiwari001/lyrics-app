import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Web App Manifest — enables "Add to Home Screen" on mobile browsers.
 *
 * WHY THIS MATTERS:
 * - Improves mobile user experience significantly
 * - Google uses manifest data as a PWA signal (minor ranking factor)
 * - Defines the app name, icons, and theme color for installed mode
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d0b14",
    theme_color: SITE_CONFIG.themeColor,
    orientation: "portrait",
    categories: ["music", "entertainment"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
