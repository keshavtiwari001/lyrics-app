"use client";

import { ArrowLeft, Copy, Check, Share2, Clock, Disc3, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DisplayLyrics } from "@/types";
import { formatDuration } from "@/lib/utils/lyrics";
import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

// =============================================================================
// LyricsView Component
//
// WHY CLIENT COMPONENT:
// - Back button uses useRouter (browser API)
// - Copy button needs clipboard access
// - Share button uses Web Share API
// All three require browser APIs unavailable in RSC.
// =============================================================================

interface LyricsViewProps {
  display: DisplayLyrics;
  slug: string;
}

export function LyricsView({ display, slug: _slug }: LyricsViewProps) {
  const router = useRouter();
  const { copy, copied } = useCopyToClipboard();

  async function handleShare() {
    const shareData = {
      title: `${display.trackName} — ${display.artistName}`,
      text: `Check out the lyrics for "${display.trackName}" by ${display.artistName}`,
      url: window.location.href,
    };

    // Use Web Share API if available (mobile browsers) — falls back to clipboard
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share — not an error
      }
    } else {
      // Desktop fallback: copy the URL to clipboard
      await copy(window.location.href);
    }
  }

  function handleCopyLyrics() {
    if (!display.lyrics) return;

    const textToCopy = [
      display.trackName,
      `by ${display.artistName}`,
      display.albumName ? `from "${display.albumName}"` : "",
      "",
      display.lyrics,
    ]
      .filter(Boolean)
      .join("\n");

    copy(textToCopy);
  }

  return (
    <article aria-label={`${display.trackName} by ${display.artistName}`}>
      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className={cn(
            "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
            "text-[rgb(var(--color-text-secondary))] transition-all",
            "hover:bg-[rgb(var(--color-bg-muted))] hover:text-[rgb(var(--color-text-primary))]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          )}
          aria-label="Go back to search results"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to results
        </button>
      </div>

      {/* Track header */}
      <header className="mb-8">
        {/* Track icon */}
        <div
          className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20"
          aria-hidden="true"
        >
          <Music2 className="h-7 w-7 text-brand-600 dark:text-brand-400" strokeWidth={1.5} />
        </div>

        {/* Track title — H1 for SEO — this is the main keyword */}
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[rgb(var(--color-text-primary))] sm:text-4xl">
          {display.trackName}
        </h1>

        {/* Artist */}
        <p className="mt-2 text-lg font-medium text-[rgb(var(--color-text-secondary))]">
          <a
            href={`/search?q=${encodeURIComponent(display.artistName)}&mode=artist`}
            className="transition-colors hover:text-brand-600 dark:hover:text-brand-400"
          >
            {display.artistName}
          </a>
        </p>

        {/* Album + Duration */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {display.albumName && (
            <span className="flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-muted))]">
              <Disc3 size={14} aria-hidden="true" />
              <a
                href={`/search?q=${encodeURIComponent(display.albumName)}&mode=album`}
                className="transition-colors hover:text-[rgb(var(--color-text-secondary))]"
              >
                {display.albumName}
              </a>
            </span>
          )}
          {display.duration > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-[rgb(var(--color-text-muted))]">
              <Clock size={14} aria-hidden="true" />
              {formatDuration(display.duration)}
            </span>
          )}
          {display.instrumental && (
            <span className="pill bg-accent-100 text-amber-700 dark:bg-accent-900/30 dark:text-accent-400">
              Instrumental
            </span>
          )}
        </div>
      </header>

      {/* Action buttons */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopyLyrics}
          disabled={!display.lyrics}
          leftIcon={
            copied ? (
              <Check size={14} className="text-green-600" />
            ) : (
              <Copy size={14} />
            )
          }
          aria-live="polite"
          aria-label={copied ? "Lyrics copied" : "Copy lyrics to clipboard"}
        >
          {copied ? "Copied!" : "Copy lyrics"}
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleShare}
          leftIcon={<Share2 size={14} />}
          aria-label="Share this lyrics page"
        >
          Share
        </Button>
      </div>

      {/* Divider */}
      <div
        className="mb-8 h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-border))] to-transparent"
        aria-hidden="true"
      />

      {/* Lyrics body */}
      <section aria-label="Lyrics">
        {display.instrumental ? (
          <InstrumentalNotice trackName={display.trackName} />
        ) : display.lyrics ? (
          <LyricsBody lyrics={display.lyrics} />
        ) : (
          <LyricsUnavailable />
        )}
      </section>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LyricsBody({ lyrics }: { lyrics: string }) {
  // Split lyrics into stanzas (separated by double newlines)
  // and render each as its own paragraph for clean visual structure
  const stanzas = lyrics.split("\n\n").filter(Boolean);

  return (
    <div className="space-y-5">
      {stanzas.map((stanza, index) => (
        <p
          key={index}
          className="lyrics-text"
          // whitespace-pre-line preserves single line breaks within stanzas
          style={{ whiteSpace: "pre-line" }}
        >
          {stanza}
        </p>
      ))}
    </div>
  );
}

function InstrumentalNotice({ trackName }: { trackName: string }) {
  return (
    <div className="rounded-2xl border border-accent-200/60 bg-accent-50/50 p-8 text-center dark:border-accent-700/40 dark:bg-accent-900/20">
      <div className="mb-3 text-3xl" aria-hidden="true">
        🎵
      </div>
      <h2 className="font-display text-lg font-semibold text-[rgb(var(--color-text-primary))]">
        Instrumental Track
      </h2>
      <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
        &ldquo;{trackName}&rdquo; is an instrumental track — there are no lyrics to display.
      </p>
    </div>
  );
}

function LyricsUnavailable() {
  return (
    <div className="rounded-2xl border border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-subtle))] p-8 text-center">
      <div className="mb-3 text-3xl" aria-hidden="true">
        📝
      </div>
      <h2 className="font-display text-lg font-semibold text-[rgb(var(--color-text-primary))]">
        Lyrics unavailable
      </h2>
      <p className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">
        We don&apos;t have lyrics for this track yet. Try searching for a different version.
      </p>
    </div>
  );
}
