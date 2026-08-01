"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Dark/light mode toggle button.
 *
 * WHY mounted CHECK:
 * next-themes reads from localStorage which is unavailable during SSR.
 * The component renders null until mounted to prevent hydration mismatches.
 * This is the recommended pattern from the next-themes docs.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return <div className={cn("h-9 w-9 rounded-lg", className)} aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
        "border border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-subtle))]",
        "text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-muted))] hover:text-[rgb(var(--color-text-primary))]",
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
