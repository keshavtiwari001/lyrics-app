"use client";

import { useCallback, useState } from "react";

/**
 * Provides a copy-to-clipboard function with a transient "copied" state.
 *
 * WHY A HOOK:
 * The "copied" feedback timer logic is reusable and shouldn't live inside
 * a component where it would be re-created on every render.
 *
 * Returns:
 *   - copy(text): copies text and sets `copied` to true for 2 seconds
 *   - copied: boolean — true briefly after a successful copy
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      } catch {
        // Clipboard API may be blocked in some contexts (e.g. non-HTTPS, certain browsers)
        // We fail silently here — the button just won't show the "copied" state
        console.warn("Clipboard write failed");
      }
    },
    [resetDelay],
  );

  return { copy, copied };
}
