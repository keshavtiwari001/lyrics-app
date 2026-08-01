"use client";

import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { Search, X } from "lucide-react";
import type { SearchMode } from "@/types";
import { cn } from "@/lib/utils/cn";

// =============================================================================
// SearchBar Component
//
// WHY CLIENT COMPONENT:
// Handles form submission, keyboard shortcuts, and controlled input state.
// These all require browser event listeners.
//
// WHY NOT useSearch HOOK HERE:
// SearchBar is a "dumb" controlled component — it receives state and callbacks
// as props. This makes it reusable (hero, sticky header, etc.) without
// duplicating search logic. The parent decides how to handle search.
// =============================================================================

interface SearchBarProps {
  query: string;
  mode: SearchMode;
  isLoading?: boolean;
  onQueryChange: (query: string) => void;
  onModeChange: (mode: SearchMode) => void;
  onSearch: (query?: string, mode?: SearchMode) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: "default" | "large";
}

const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "track", label: "Song" },
  { value: "artist", label: "Artist" },
  { value: "album", label: "Album" },
];

const PLACEHOLDERS: Record<SearchMode, string> = {
  track: "Search by song name…",
  artist: "Search by artist name…",
  album: "Search by album name…",
};

export function SearchBar({
  query,
  mode,
  isLoading = false,
  onQueryChange,
  onModeChange,
  onSearch,
  autoFocus = false,
  size = "default",
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    // Allow Escape to clear the input
    if (e.key === "Escape") {
      onQueryChange("");
      inputRef.current?.blur();
    }
  }

  function handleClear() {
    onQueryChange("");
    inputRef.current?.focus();
  }

  const isLarge = size === "large";

  return (
    <div className="w-full">
      {/* Search mode tabs — toggle between Song / Artist / Album */}
      <div
        role="tablist"
        aria-label="Search by"
        className="mb-3 flex w-fit gap-1 rounded-xl border border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-subtle))] p-1"
      >
        {SEARCH_MODES.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            aria-selected={mode === value}
            onClick={() => onModeChange(value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
              mode === value
                ? "bg-brand-600 text-white shadow-sm"
                : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label={`Search lyrics by ${mode}`}
        className="relative"
      >
        {/* Search icon */}
        <div
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          {isLoading ? (
            <svg
              className="h-5 w-5 animate-spin text-brand-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <Search
              className="text-[rgb(var(--color-text-muted))]"
              size={isLarge ? 20 : 18}
              strokeWidth={2}
            />
          )}
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[mode]}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label={PLACEHOLDERS[mode]}
          className={cn(
            "w-full rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]",
            "pl-12 pr-28 text-[rgb(var(--color-text-primary))]",
            "placeholder:text-[rgb(var(--color-text-muted))]",
            "transition-all duration-200",
            "focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            "hover:border-[rgb(var(--color-border))]",
            // Disable browser's native search clear button — we have our own
            "[&::-webkit-search-cancel-button]:hidden",
            isLarge ? "h-16 text-lg" : "h-12 text-sm",
          )}
        />

        {/* Clear button — only shown when there's a query */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              "absolute right-[5.5rem] top-1/2 -translate-y-1/2 rounded-full p-1",
              "text-[rgb(var(--color-text-muted))] transition-colors hover:text-[rgb(var(--color-text-primary))]",
            )}
          >
            <X size={16} />
          </button>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 rounded-xl",
            "bg-brand-600 px-4 font-medium text-white",
            "transition-all duration-150 hover:bg-brand-700 active:bg-brand-800",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
            isLarge ? "h-12 text-sm" : "h-9 text-xs",
          )}
        >
          Search
        </button>
      </form>
    </div>
  );
}
