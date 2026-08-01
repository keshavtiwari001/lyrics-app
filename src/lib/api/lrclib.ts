import type { ApiError, LyricsRecord, SearchParams, SearchResult } from "@/types";
import { LRCLIB_BASE_URL, LRCLIB_CLIENT_HEADER } from "@/lib/constants";

// =============================================================================
// LRCLIB API Client
//
// WHY AN API LAYER:
// Centralising all fetch calls here means:
//   - Components never deal with raw HTTP — they call typed functions
//   - Headers, error handling, and retry logic live in one place
//   - Easy to swap the API endpoint or add caching without touching UI code
//   - Type safety flows from the API response to the component via interfaces
// =============================================================================

/**
 * Base fetch wrapper for LRCLIB requests.
 *
 * Sets required headers including the client identifier (LRCLIB requires this).
 * Uses browser's native fetch — no extra HTTP library needed.
 *
 * WHY NOT axios:
 * Native fetch is sufficient here, is already tree-shaken, and ships with
 * Next.js's extended fetch that supports `next.revalidate` caching options.
 */
async function lrclibFetch<T>(
  path: string,
  options?: RequestInit & { nextRevalidate?: number },
): Promise<T> {
  const url = `${LRCLIB_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      // LRCLIB requires client identification — use X-User-Agent
      // because browsers restrict modifying the User-Agent header directly
      "X-User-Agent": LRCLIB_CLIENT_HEADER,
      "Lrclib-Client": LRCLIB_CLIENT_HEADER,
      Accept: "application/json",
      ...options?.headers,
    },
    // Next.js extended fetch: cache search results for 5 minutes
    // WHY: Search results for the same query don't change frequently,
    // so caching reduces API load and improves response times for repeat searches.
    next: { revalidate: options?.nextRevalidate ?? 300 },
  });

  if (!response.ok) {
    // Parse structured LRCLIB errors (404, 429, etc.)
    let errorBody: ApiError | null = null;
    try {
      errorBody = (await response.json()) as ApiError;
    } catch {
      // Ignore JSON parse failure on error responses
    }

    if (response.status === 404) {
      throw new LrclibNotFoundError(errorBody?.message ?? "Track not found");
    }

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After") ?? "60";
      throw new LrclibRateLimitError(
        `Rate limited. Retry after ${retryAfter} seconds.`,
        parseInt(retryAfter, 10),
      );
    }

    throw new LrclibApiError(
      errorBody?.message ?? `API error: ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

// =============================================================================
// Custom Error Classes
//
// WHY CUSTOM ERRORS (not generic Error):
// Lets callers use instanceof checks to handle specific error cases differently.
// E.g. 404 shows "not found" UI, 429 shows "slow down" UI, others show generic error.
// =============================================================================

export class LrclibApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "LrclibApiError";
  }
}

export class LrclibNotFoundError extends LrclibApiError {
  constructor(message: string) {
    super(message, 404);
    this.name = "LrclibNotFoundError";
  }
}

export class LrclibRateLimitError extends LrclibApiError {
  constructor(
    message: string,
    public readonly retryAfter: number,
  ) {
    super(message, 429);
    this.name = "LrclibRateLimitError";
  }
}

// =============================================================================
// Public API Functions
// =============================================================================

/**
 * Searches for lyrics records matching the given parameters.
 * Uses the /api/search endpoint which accepts partial keyword matches.
 *
 * Returns an empty array if no results are found (rather than throwing),
 * because "no results" is a valid UI state, not an error.
 *
 * WHY SEARCH OVER /api/get:
 * The /api/get endpoint requires exact track + artist + album + duration,
 * which is impractical for user-driven searches. /api/search handles
 * partial matches and returns multiple candidates.
 */
export async function searchLyrics(params: SearchParams): Promise<SearchResult> {
  const queryString = new URLSearchParams(
    // Remove undefined values — URLSearchParams coerces them to the string "undefined"
    Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
    ),
  ).toString();

  if (!queryString) {
    throw new Error("At least one search parameter is required");
  }

  const results = await lrclibFetch<SearchResult>(`/api/search?${queryString}`, {
    // Cache search results for 5 minutes — balanced between freshness and performance
    nextRevalidate: 300,
  });

  // API returns an array directly; guard against unexpected shapes
  return Array.isArray(results) ? results : [];
}

/**
 * Fetches a single lyrics record by its LRCLIB ID.
 * Used on the lyrics detail page where we have the exact ID from search results.
 *
 * WHY CACHE LONGER THAN SEARCH:
 * Individual track lyrics almost never change once published.
 * Caching for 1 hour reduces repeated API calls for popular tracks.
 */
export async function getLyricsById(id: number): Promise<LyricsRecord> {
  return lrclibFetch<LyricsRecord>(`/api/get/${id}`, {
    nextRevalidate: 3600, // 1 hour — individual lyrics rarely change
  });
}

/**
 * Builds SearchParams from a user query string and search mode.
 * Centralises the mapping between UI concepts and API params.
 */
export function buildSearchParams(
  query: string,
  mode: "track" | "artist" | "album",
): SearchParams {
  const trimmed = query.trim();

  switch (mode) {
    case "track":
      return { track_name: trimmed };
    case "artist":
      return { artist_name: trimmed, q: trimmed };
    case "album":
      return { album_name: trimmed, q: trimmed };
    default:
      return { q: trimmed };
  }
}
