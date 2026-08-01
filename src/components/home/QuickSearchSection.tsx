"use client";

import { Mic2, Disc3, Music } from "lucide-react";
import type { QuickSearchSection as QuickSearchSectionType, SearchMode } from "@/types";
import { cn } from "@/lib/utils/cn";

// =============================================================================
// QuickSearchSection Component
//
// Renders one of the three home page quick-search sections (Artists, Albums, Tracks).
// Each chip immediately fires a search when clicked — no form submit required.
// =============================================================================

const SECTION_ICONS: Record<SearchMode, React.ElementType> = {
  artist: Mic2,
  album: Disc3,
  track: Music,
};

const SECTION_COLORS: Record<SearchMode, { bg: string; icon: string; chip: string; chipHover: string }> = {
  artist: {
    bg: "from-brand-500/10 to-brand-600/5",
    icon: "text-brand-600 dark:text-brand-400",
    chip: "bg-brand-50 text-brand-700 border-brand-200/60 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700/40",
    chipHover: "hover:bg-brand-100 hover:border-brand-300 dark:hover:bg-brand-800/50",
  },
  album: {
    bg: "from-accent-500/10 to-accent-600/5",
    icon: "text-accent-600 dark:text-accent-400",
    chip: "bg-accent-50 text-amber-700 border-accent-200/60 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-700/40",
    chipHover: "hover:bg-accent-100 hover:border-accent-300 dark:hover:bg-accent-800/50",
  },
  track: {
    bg: "from-violet-500/10 to-violet-600/5",
    icon: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700/40",
    chipHover: "hover:bg-violet-100 hover:border-violet-300 dark:hover:bg-violet-800/50",
  },
};

interface QuickSearchSectionProps {
  section: QuickSearchSectionType;
  onSearch: (query: string, mode: SearchMode) => void;
}

export function QuickSearchSection({ section, onSearch }: QuickSearchSectionProps) {
  const Icon = SECTION_ICONS[section.mode];
  const colors = SECTION_COLORS[section.mode];

  return (
    <div className="rounded-3xl border border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg))] p-6 sm:p-7"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Section header */}
      <div className="mb-5 flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            `bg-gradient-to-br ${colors.bg}`,
          )}
          aria-hidden="true"
        >
          <Icon className={cn("h-5 w-5", colors.icon)} strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-[rgb(var(--color-text-primary))]">
            {section.title}
          </h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            {section.description}
          </p>
        </div>
      </div>

      {/* Chips grid */}
      <ul className="flex flex-wrap gap-2" role="list" aria-label={section.title}>
        {section.items.map((item) => (
          <li key={item}>
            <button
              onClick={() => onSearch(item, section.mode)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                "transition-all duration-150 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
                colors.chip,
                colors.chipHover,
              )}
              aria-label={`Search ${section.mode}: ${item}`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
