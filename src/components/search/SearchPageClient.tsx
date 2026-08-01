"use client";

import { Suspense, useEffect } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearch } from "@/lib/hooks/useSearch";
import type { SearchMode } from "@/types";

interface SearchPageClientProps {
  initialQuery: string;
  initialMode: SearchMode;
}

function SearchPageContent({ initialQuery, initialMode }: SearchPageClientProps) {
  const { state, setQuery, setMode, search } = useSearch();

  // Execute the initial search from URL params on mount
  useEffect(() => {
    if (initialQuery && !state.hasSearched) {
      setQuery(initialQuery);
      setMode(initialMode);
      search(initialQuery, initialMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="pb-6 pt-28">
        <h1 className="font-display text-2xl font-bold text-[rgb(var(--color-text-primary))] sm:text-3xl">
          Search Lyrics
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
          Find lyrics by song name, artist, or album
        </p>
      </div>

      {/* Sticky search bar */}
      <div className="sticky top-16 z-30 -mx-4 bg-[rgb(var(--color-bg))]/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <SearchBar
          query={state.query}
          mode={state.mode}
          isLoading={state.isLoading}
          onQueryChange={setQuery}
          onModeChange={setMode}
          onSearch={search}
        />
      </div>

      {/* Results */}
      <div className="pb-20 pt-6">
        <SearchResults
          results={state.results}
          isLoading={state.isLoading}
          error={state.error}
          hasSearched={state.hasSearched}
          query={state.query}
        />
      </div>
    </div>
  );
}

export function SearchPageClient(props: SearchPageClientProps) {
  return (
    <Suspense>
      <SearchPageContent {...props} />
    </Suspense>
  );
}
