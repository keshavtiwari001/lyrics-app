import type { QuickSearchSection } from "@/types";

// =============================================================================
// API Configuration
// =============================================================================

/** Base URL for the LRCLIB API. Pulled from env so it's easy to swap in staging. */
export const LRCLIB_BASE_URL =
  process.env.NEXT_PUBLIC_LRCLIB_BASE_URL ?? "https://lrclib.net";

/**
 * User-Agent / client identifier sent with every LRCLIB request.
 * LRCLIB docs require this header to identify the client application.
 * Using X-User-Agent because browsers restrict the User-Agent header.
 */
export const LRCLIB_CLIENT_HEADER = "Lyricly v1.0.0 (https://lyricly.app)";

/** Max results returned by /api/search — enforced by the API itself */
export const MAX_SEARCH_RESULTS = 20;

// =============================================================================
// Site Configuration
// Used for metadata, Open Graph, and structured data
// =============================================================================

export const SITE_CONFIG = {
  name: "Lyricly",
  tagline: "Find lyrics for any song, instantly.",
  description:
    "Search millions of song lyrics by track name, artist, or album. Clean, fast, beautiful — Lyricly is the best way to read lyrics online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lyricly.app",
  twitterHandle: "@lyriclyapp",
  themeColor: "#6147f9",
} as const;

// =============================================================================
// Quick Search Sections
// The three home page sections with pre-populated clickable chips.
// Indian music artists/albums chosen to match the target audience shown
// in the sample API response (Hindi lyrics were in the sample).
// =============================================================================

export const QUICK_SEARCH_SECTIONS: QuickSearchSection[] = [
  {
    title: "Popular Artists",
    description: "Tap an artist to explore their lyrics",
    mode: "artist",
    items: [
      "Arijit Singh",
      "KK",
      "Sonu Nigam",
      "Jubin Nautiyal",
      "Shreya Ghoshal",
      "Lata Mangeshkar",
      "Kishore Kumar",
      "Rahat Fateh Ali Khan",
    ],
  },
  {
    title: "Iconic Albums",
    description: "Relive your favourite soundtracks",
    mode: "album",
    items: [
      "Aashiqui 2",
      "Kabir Singh",
      "Animal",
      "Rockstar",
      "Tamasha",
      "Lootera",
      "Gangster",
      "Jab We Met",
    ],
  },
  {
    title: "Trending Tracks",
    description: "Songs everyone is searching right now",
    mode: "track",
    items: [
      "Kesariya",
      "Tum Hi Ho",
      "Apna Bana Le",
      "Channa Mereya",
      "O Maahi",
      "Phir Le Aya Dil",
      "Agar Tum Saath Ho",
      "Raabta",
    ],
  },
];

// =============================================================================
// Routing
// =============================================================================

export const ROUTES = {
  home: "/",
  search: "/search",
  lyrics: (id: number) => `/lyrics/${id}`,
} as const;
