// =============================================================================
// LRCLIB API Types
// Mirrors the exact shape returned by https://lrclib.net/api
// =============================================================================

/**
 * A single lyrics record from the LRCLIB API.
 * Both plainLyrics and syncedLyrics can be null for instrumental tracks.
 */
export interface LyricsRecord {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number; // in seconds
  instrumental: boolean;
  plainLyrics: string | null;
  syncedLyrics: string | null;
}

/**
 * The /api/search endpoint returns an array of these records.
 */
export type SearchResult = LyricsRecord[];

/**
 * Parameters accepted by the /api/search endpoint.
 * At least one of `q` or `trackName` must be present.
 */
export interface SearchParams {
  q?: string;
  track_name?: string;
  artist_name?: string;
  album_name?: string;
}

/**
 * Parameters accepted by the /api/get endpoint (exact match).
 * All four fields are required for this endpoint.
 */
export interface ExactSearchParams {
  track_name: string;
  artist_name: string;
  album_name: string;
  duration: number;
}

/**
 * Structured error returned by the LRCLIB API on failure.
 */
export interface ApiError {
  code: number;
  name: string;
  message: string;
}

// =============================================================================
// Internal Application Types
// =============================================================================

/**
 * The three search modes the UI exposes to users.
 * Determines which query param gets sent to the API.
 */
export type SearchMode = "track" | "artist" | "album";

/**
 * State shape managed by the search hook.
 */
export interface SearchState {
  query: string;
  mode: SearchMode;
  results: SearchResult;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

/**
 * A quick-search chip shown on the home page.
 * Clicking one immediately fires a search.
 */
export interface QuickSearchItem {
  label: string;
  mode: SearchMode;
}

/**
 * Groups of quick-search items for the three home page sections.
 */
export interface QuickSearchSection {
  title: string;
  description: string;
  mode: SearchMode;
  items: string[];
}

/**
 * Cleaned, display-ready lyrics data.
 * Derived from a raw LyricsRecord after stripping timestamps.
 */
export interface DisplayLyrics {
  id: number;
  trackName: string;
  artistName: string;
  albumName: string;
  duration: number;
  instrumental: boolean;
  // Cleaned lyrics ready to render — timestamps stripped
  lyrics: string | null;
}

/**
 * Props for components that accept a className override.
 * Keeps prop interfaces lean without repeating className everywhere.
 */
export interface WithClassName {
  className?: string;
}

/**
 * Generic async state wrapper for data fetching.
 */
export interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}
