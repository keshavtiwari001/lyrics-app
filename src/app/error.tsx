"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Global error boundary — catches unexpected errors in the app.
 *
 * WHY "use client":
 * Next.js error boundaries MUST be Client Components because they use
 * React's error boundary lifecycle (componentDidCatch equivalent).
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, Datadog, etc.)
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
        <AlertTriangle
          className="h-7 w-7 text-red-600 dark:text-red-400"
          strokeWidth={1.5}
        />
      </div>
      <h1 className="font-display text-2xl font-bold text-[rgb(var(--color-text-primary))]">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[rgb(var(--color-text-muted))]">
        An unexpected error occurred. Please try again — if the problem persists, the
        server may be temporarily unavailable.
      </p>
      <Button
        onClick={reset}
        className="mt-8"
        leftIcon={<RefreshCw size={16} />}
      >
        Try again
      </Button>
    </div>
  );
}
