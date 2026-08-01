"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { QuickSearchSection } from "@/components/home/QuickSearchSection";
import { useSearch } from "@/lib/hooks/useSearch";
import { QUICK_SEARCH_SECTIONS } from "@/lib/constants";
import type { SearchMode } from "@/types";

// =============================================================================
// HomeClient
//
// WHY A SEPARATE CLIENT COMPONENT:
// The home page server component (page.tsx) exports metadata and stays a RSC.
// All interactivity lives here so the boundary is clean and intentional.
//
// WHY useSearchParams IN A SUSPENSE BOUNDARY:
// Next.js requires useSearchParams to be wrapped in Suspense to prevent the
// entire page from de-opting out of static rendering.
// =============================================================================

function HomeContent() {
  const { state, setQuery, setMode, search } = useSearch();
  const searchParams = useSearchParams();

  // Restore search state from URL on mount — so refreshing the page
  // with an active search re-executes it
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    const urlMode = searchParams.get("mode") as SearchMode | null;

    if (urlQuery && !state.hasSearched) {
      const mode = urlMode ?? "track";
      setQuery(urlQuery);
      setMode(mode);
      search(urlQuery, mode);
    }
    // Intentionally not including 'search' in deps — we only want this to run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleQuickSearch(query: string, mode: SearchMode) {
    setQuery(query);
    setMode(mode);
    search(query, mode);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const showResults = state.isLoading || state.hasSearched;

  return (
    <div className="relative">
      {/* Hero gradient background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-hero-gradient dark:bg-hero-gradient-dark"
        aria-hidden="true"
      />

      <div className="relative">
        {/* ================================================================
            Hero Section
            Large, centered, typographically bold. The search box IS the CTA.
        ================================================================ */}
        <section
          aria-label="Search for lyrics"
          className="mx-auto max-w-3xl px-4 pb-12 pt-32 text-center sm:px-6 sm:pt-36 lg:px-8 lg:pt-40"
        >
          {/* Eyebrow label */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50/80 px-4 py-1.5 text-xs font-medium text-brand-700 dark:border-brand-700/40 dark:bg-brand-900/30 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-soft" aria-hidden="true" />
            Millions of lyrics, instantly searchable
          </div>

          {/* Main heading — H1 is critical for SEO; only one per page */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find lyrics for{" "}
            <span className="gradient-text">any song</span>
            {", "}
            instantly.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-[rgb(var(--color-text-secondary))] sm:text-lg">
            Search by song name, artist, or album. Clean lyrics, no ads, no clutter.
          </p>

          {/* Search box — the primary CTA */}
          <div className="mt-10">
            <SearchBar
              query={state.query}
              mode={state.mode}
              isLoading={state.isLoading}
              onQueryChange={setQuery}
              onModeChange={setMode}
              onSearch={search}
              autoFocus
              size="large"
            />
          </div>
        </section>

        {/* ================================================================
            Search Results (shown after search)
            OR Quick Search Sections (shown before first search)
        ================================================================ */}
        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          {showResults ? (
            <div id="search-results">
              <SearchResults
                results={state.results}
                isLoading={state.isLoading}
                error={state.error}
                hasSearched={state.hasSearched}
                query={state.query}
              />
            </div>
          ) : (
            /* Quick search sections — visible before any search is performed */
            <div
              className="space-y-4"
              aria-label="Browse popular lyrics"
            >
              <h2 className="sr-only">Browse popular lyrics</h2>
              {QUICK_SEARCH_SECTIONS.map((section) => (
                <QuickSearchSection
                  key={section.mode}
                  section={section}
                  onSearch={handleQuickSearch}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Suspense boundary required by Next.js when useSearchParams is used
// Without it, the whole page would be excluded from static rendering
export function HomeClient() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
