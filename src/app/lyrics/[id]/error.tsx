"use client";

import { useEffect } from "react";
import { ArrowLeft, RefreshCw, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface LyricsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for individual lyrics pages.
 *
 * WHY PAGE-LEVEL ERROR BOUNDARY (not just global):
 * If a single lyrics page fails (API timeout, malformed ID), we want to
 * show a contextual message — not crash the whole app. This lets the user
 * go back to search and try again without losing their session.
 */
export default function LyricsError({ error, reset }: LyricsErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Lyrics page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(var(--color-bg-muted))]">
          <Music2
            className="h-7 w-7 text-[rgb(var(--color-text-muted))]"
            strokeWidth={1.5}
          />
        </div>

        <h1 className="font-display text-2xl font-bold text-[rgb(var(--color-text-primary))]">
          Couldn&apos;t load lyrics
        </h1>
        <p className="mt-3 max-w-sm text-sm text-[rgb(var(--color-text-muted))]">
          There was a problem fetching these lyrics. The API may be temporarily
          unavailable — please try again in a moment.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft size={16} />}
          >
            Go back
          </Button>
          <Button onClick={reset} leftIcon={<RefreshCw size={16} />}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
