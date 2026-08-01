"use client";

// WHY "use client":
// next-themes uses localStorage and window — browser-only APIs.
// It must be a Client Component. All server components inside it
// still render on the server (Client Components can have RSC children).

import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Thin wrapper around NextThemesProvider.
 *
 * WHY A WRAPPER:
 * Keeps the root layout clean and makes it easy to add theme-related
 * context (analytics on theme toggle, system preference detection, etc.)
 * without touching the layout file.
 *
 * attribute="class" — next-themes adds/removes a "dark" class on <html>
 * which Tailwind's `dark:` variant responds to.
 *
 * defaultTheme="system" — respects the OS preference on first visit.
 * Users can override in-app and the choice persists in localStorage.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
