"use client";

import Link from "next/link";
import { Music, Clock, Disc3, AlertCircle, SearchX } from "lucide-react";
import type { LyricsRecord } from "@/types";
import { ROUTES } from "@/lib/constants";
import { formatDuration } from "@/lib/utils/lyrics";
import { cn } from "@/lib/utils/cn";

// =============================================================================
// SearchResults Component
//
// WHY CLIENT COMPONENT:
// Receives live state from the useSearch hook and renders accordingly.
// The actual data fetching happens in the hook — this component only displays.
// =============================================================================

interface SearchResultsProps {
  results: LyricsRecord[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  query: string;
}

export function SearchResults({
  results,
  isLoading,
  error,
  hasSearched,
  query,
}: SearchResultsProps) {
  // Loading state — skeleton cards prevent layout shift
  if (isLoading) {
    return <SearchResultsSkeleton />;
  }

  // Error state
  if (error) {
    return <SearchError message={error} />;
  }

  // Empty state — searched but nothing found
  if (hasSearched && results.length === 0) {
    return <SearchEmpty query={query} />;
  }

  // No search yet — don't render anything (home page handles the pre-search UI)
  if (!hasSearched) {
    return null;
  }

  return (
    <section aria-label={`Search results for "${query}"`}>
      {/* Results count — helpful for screen readers and sighted users */}
      <p className="mb-4 text-sm text-[rgb(var(--color-text-muted))]">
        <span className="font-medium text-[rgb(var(--color-text-primary))]">
          {results.length}
        </span>{" "}
        {results.length === 1 ? "result" : "results"} for{" "}
        <span className="font-medium text-[rgb(var(--color-text-primary))]">
          &ldquo;{query}&rdquo;
        </span>
      </p>

      <ul className="space-y-3" role="list">
        {results.map((track) => (
          <li key={track.id} className="animate-slide-up">
            <ResultCard track={track} />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Result Card
// ---------------------------------------------------------------------------

function ResultCard({ track }: { track: LyricsRecord }) {
  return (
    <Link
      href={ROUTES.lyrics(track.id)}
      className={cn(
        "group block rounded-2xl border border-[rgb(var(--color-border-subtle))]",
        "bg-[rgb(var(--color-bg))] p-4 sm:p-5",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-brand-400/50 hover:shadow-card-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
      aria-label={`${track.trackName} by ${track.artistName}`}
    >
      <div className="flex items-start gap-4">
        {/* Track icon / thumbnail placeholder */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            "bg-gradient-to-br from-brand-500/20 to-accent-500/20",
            "transition-transform duration-200 group-hover:scale-105",
          )}
          aria-hidden="true"
        >
          <Music className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        </div>

        {/* Track info */}
        <div className="min-w-0 flex-1">
          {/* Track name */}
          <h3 className="truncate font-display text-base font-semibold text-[rgb(var(--color-text-primary))] group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {track.trackName}
          </h3>

          {/* Artist */}
          <p className="mt-0.5 truncate text-sm text-[rgb(var(--color-text-secondary))]">
            {track.artistName}
          </p>

          {/* Album + Duration row */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            {track.albumName && (
              <span className="flex items-center gap-1 text-xs text-[rgb(var(--color-text-muted))]">
                <Disc3 size={12} aria-hidden="true" />
                <span className="truncate max-w-[200px]">{track.albumName}</span>
              </span>
            )}
            {track.duration > 0 && (
              <span className="flex items-center gap-1 text-xs text-[rgb(var(--color-text-muted))]">
                <Clock size={12} aria-hidden="true" />
                {formatDuration(track.duration)}
              </span>
            )}
            {track.instrumental && (
              <span className="pill bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                Instrumental
              </span>
            )}
          </div>
        </div>

        {/* Chevron — visual cue that this is a link */}
        <div className="shrink-0 text-[rgb(var(--color-text-muted))] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 12l4-4-4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function SearchResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading search results…">
      <div className="skeleton mb-4 h-5 w-40 rounded-full" />
      <ul className="space-y-3" role="list">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <div
              className="rounded-2xl border border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg))] p-4 sm:p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start gap-4">
                <div className="skeleton h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2.5">
                  <div className="skeleton h-5 w-3/4 rounded-full" />
                  <div className="skeleton h-4 w-1/2 rounded-full" />
                  <div className="skeleton h-3.5 w-1/3 rounded-full" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty State
// ---------------------------------------------------------------------------

function SearchEmpty({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-muted))]">
        <SearchX
          className="h-7 w-7 text-[rgb(var(--color-text-muted))]"
          strokeWidth={1.5}
        />
      </div>
      <h3 className="font-display text-lg font-semibold text-[rgb(var(--color-text-primary))]">
        No results found
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[rgb(var(--color-text-muted))]">
        We couldn&apos;t find any lyrics matching{" "}
        <span className="font-medium text-[rgb(var(--color-text-secondary))]">
          &ldquo;{query}&rdquo;
        </span>
        . Try a different spelling or search by artist or album.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error State
// ---------------------------------------------------------------------------

function SearchError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-medium">Search failed</p>
        <p className="mt-0.5 text-sm opacity-80">{message}</p>
      </div>
    </div>
  );
}
