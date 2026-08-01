import Link from "next/link";
import { Music2, Search } from "lucide-react";
import { ROUTES } from "@/lib/constants";

/**
 * Custom 404 page — shown when notFound() is called or a route doesn't exist.
 *
 * WHY A CUSTOM 404:
 * - Keeps users in the app with navigation back to search
 * - Maintains brand consistency (default Next.js 404 is plain)
 * - Good for Core Web Vitals — the default 404 triggers a full page load
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      {/* Large decorative number */}
      <div
        className="font-display text-8xl font-bold text-[rgb(var(--color-bg-muted))] dark:text-[rgb(var(--color-bg-subtle))] sm:text-9xl"
        aria-hidden="true"
      >
        404
      </div>

      <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600">
        <Music2 className="h-6 w-6 text-white" strokeWidth={2} />
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold text-[rgb(var(--color-text-primary))] sm:text-3xl">
        Track not found
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[rgb(var(--color-text-muted))]">
        The lyrics page you&apos;re looking for doesn&apos;t exist. It may have been
        removed or the link might be incorrect.
      </p>

      <Link
        href={ROUTES.home}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all hover:bg-brand-700"
      >
        <Search size={16} />
        Search for lyrics
      </Link>
    </div>
  );
}
