import Link from "next/link";
import { Music2 } from "lucide-react";
import { SITE_CONFIG, ROUTES } from "@/lib/constants";

/**
 * Site footer — Server Component (no interactivity needed).
 * Simple, minimal — doesn't compete with the content.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-subtle))]"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600">
              <Music2 className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base font-semibold text-[rgb(var(--color-text-primary))]">
              {SITE_CONFIG.name}
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            <Link
              href={ROUTES.home}
              className="text-sm text-[rgb(var(--color-text-muted))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
            >
              Home
            </Link>
            <Link
              href={ROUTES.search}
              className="text-sm text-[rgb(var(--color-text-muted))] transition-colors hover:text-[rgb(var(--color-text-primary))]"
            >
              Search
            </Link>
          </nav>

          {/* Copyright + attribution */}
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            © {currentYear} {SITE_CONFIG.name}. Lyrics via{" "}
            <Link
              href="https://lrclib.net"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-[rgb(var(--color-text-secondary))]"
            >
              LRCLIB
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
