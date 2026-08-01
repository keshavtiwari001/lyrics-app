import type { Metadata } from "next";
import { SearchPageClient } from "@/components/search/SearchPageClient";
import { SITE_CONFIG } from "@/lib/constants";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; mode?: string }>;
}

// =============================================================================
// Dynamic metadata for the search page
//
// WHY DYNAMIC:
// Search queries appear in the page title and description — this helps Google
// understand the page context when someone links to a search results URL.
// =============================================================================

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q ?? "";

  if (!query) {
    return {
      title: "Search Lyrics",
      description: `Search millions of song lyrics on ${SITE_CONFIG.name}.`,
      robots: { index: false }, // Empty search page shouldn't be indexed
    };
  }

  const title = `"${query}" — Lyrics Search`;
  const description = `Find lyrics for "${query}" — search results on ${SITE_CONFIG.name}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/search?q=${encodeURIComponent(query)}`,
    },
    // Canonical URL for this search — useful if the same query can appear with different params
    alternates: {
      canonical: `${SITE_CONFIG.url}/search?q=${encodeURIComponent(query)}&mode=${params.mode ?? "track"}`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <SearchPageClient
      initialQuery={params.q ?? ""}
      initialMode={(params.mode as "track" | "artist" | "album") ?? "track"}
    />
  );
}
