import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names safely.
 *
 * WHY THIS EXISTS:
 * When composing components, conflicting Tailwind classes can cause bugs
 * (e.g. "p-4" and "p-6" both present — last one wins but it's unpredictable).
 * tailwind-merge resolves conflicts by keeping the last class in each group.
 * clsx handles conditional classes cleanly.
 *
 * This pattern is standard in production Next.js/Tailwind codebases
 * (used by shadcn/ui, Radix, and others).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
