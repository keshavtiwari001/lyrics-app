"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

/**
 * Site header — sticky, with blur backdrop on scroll.
 *
 * WHY CLIENT COMPONENT:
 * - Needs scroll position for the "scrolled" style
 * - Needs pathname for the active link state
 * - ThemeToggle needs theme context
 *
 * The header doesn't fetch data, so the Client Component penalty is small.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Apply a subtle background blur once the user scrolls past the hero
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <>
      {/* Skip to main content — keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white focus:no-underline"
      >
        Skip to main content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg))]/90 backdrop-blur-md"
            : "bg-transparent",
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href={ROUTES.home}
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
            aria-label="Lyricly — home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-glow-sm transition-all duration-200 group-hover:scale-105">
              <Music2 className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-[rgb(var(--color-text-primary))]">
              Lyricly
            </span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search link — shown on non-home pages */}
            {!isHome && (
              <Link
                href={ROUTES.home}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-muted))] hover:text-[rgb(var(--color-text-primary))]",
                )}
              >
                Home
              </Link>
            )}

            <ThemeToggle />
          </div>
        </nav>
      </header>
    </>
  );
}
