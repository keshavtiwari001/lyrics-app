"use client";

import { useCallback, useReducer, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SearchMode, SearchState } from "@/types";
import { buildSearchParams, searchLyrics, LrclibNotFoundError, LrclibRateLimitError } from "@/lib/api/lrclib";

// =============================================================================
// useSearch Hook
//
// WHY A CUSTOM HOOK:
// Search involves multiple pieces of state (query, mode, results, loading, error)
// that change together in coordinated ways. A custom hook encapsulates that
// complexity so the Search component stays focused on rendering.
//
// WHY useReducer OVER useState:
// Multiple state values that transition together are easier to reason about
// with a reducer. It also makes the state machine explicit and testable.
// =============================================================================

// ---------------------------------------------------------------------------
// State Machine
// ---------------------------------------------------------------------------

type SearchAction =
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_MODE"; payload: SearchMode }
  | { type: "SEARCH_START" }
  | { type: "SEARCH_SUCCESS"; payload: SearchState["results"] }
  | { type: "SEARCH_ERROR"; payload: string }
  | { type: "CLEAR" };

const initialState: SearchState = {
  query: "",
  mode: "track",
  results: [],
  isLoading: false,
  error: null,
  hasSearched: false,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.payload };

    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SEARCH_START":
      return { ...state, isLoading: true, error: null };

    case "SEARCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        results: action.payload,
        hasSearched: true,
        error: null,
      };

    case "SEARCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        results: [],
        hasSearched: true,
      };

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseSearchReturn {
  state: SearchState;
  setQuery: (query: string) => void;
  setMode: (mode: SearchMode) => void;
  search: (query?: string, mode?: SearchMode) => Promise<void>;
  clear: () => void;
}

/**
 * Core search hook used by the SearchBar and SearchResults components.
 *
 * Handles:
 * - State management via reducer
 * - Debounce-free search (user explicitly submits)
 * - Abort in-flight requests when a new search starts
 * - URL sync so search results survive page refresh
 * - Friendly error messages for different failure modes
 */
export function useSearch(): UseSearchReturn {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  // AbortController ref lets us cancel in-flight requests when a new search
  // starts before the previous one completes. Prevents race conditions.
  const abortControllerRef = useRef<AbortController | null>(null);

  const setQuery = useCallback((query: string) => {
    dispatch({ type: "SET_QUERY", payload: query });
  }, []);

  const setMode = useCallback((mode: SearchMode) => {
    dispatch({ type: "SET_MODE", payload: mode });
  }, []);

  const search = useCallback(
    async (queryOverride?: string, modeOverride?: SearchMode) => {
      const query = (queryOverride ?? state.query).trim();
      const mode = modeOverride ?? state.mode;

      if (!query) return;

      // Cancel any in-flight request — new search takes priority
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      dispatch({ type: "SEARCH_START" });

      // Sync the search to URL so it's shareable and survives refresh
      // WHY: Users expect to be able to copy a search URL and share it
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query);
      params.set("mode", mode);
      router.push(`/search?${params.toString()}`, { scroll: false });

      try {
        const apiParams = buildSearchParams(query, mode);
        const results = await searchLyrics(apiParams);

        // If the request was aborted (new search started), ignore these results
        if (abortControllerRef.current?.signal.aborted) return;

        dispatch({ type: "SEARCH_SUCCESS", payload: results });
      } catch (err) {
        if (abortControllerRef.current?.signal.aborted) return;

        // Map specific error types to user-friendly messages
        let errorMessage = "Something went wrong. Please try again.";

        if (err instanceof LrclibRateLimitError) {
          errorMessage = "Too many searches. Please wait a moment and try again.";
        } else if (err instanceof LrclibNotFoundError) {
          // Not found is handled as empty results, not an error state
          dispatch({ type: "SEARCH_SUCCESS", payload: [] });
          return;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        dispatch({ type: "SEARCH_ERROR", payload: errorMessage });
      }
    },
    [state.query, state.mode, router, searchParams],
  );

  const clear = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return { state, setQuery, setMode, search, clear };
}
