// WHY SERVER COMPONENT:
// The home page hero and quick-search sections are static markup — no user interaction
// at the page level. The interactive parts (SearchBar, QuickSearchSection) are
// Client Components nested inside. This keeps the initial HTML payload as
// a static server render (fast TTFB, good SEO) while interactive islands
// hydrate only where needed.

import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { SITE_CONFIG } from "@/lib/constants";

// =============================================================================
// Page Metadata
//
// Overrides the root layout defaults with home-page-specific values.
// These are crucial for Google ranking and social sharing CTR.
// =============================================================================

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    type: "website",
  },
  twitter: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  // Canonical URL for the home page — prevents duplicate content issues
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default function HomePage() {
  return <HomeClient />;
}
