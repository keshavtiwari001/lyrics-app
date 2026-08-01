import { LyricsViewSkeleton } from "@/components/lyrics/LyricsViewSkeleton";

/**
 * Instant loading UI for /lyrics/[id] routes.
 *
 * WHY loading.tsx:
 * Next.js automatically shows this file while the page component awaits
 * the async getLyricsById() call. Without it, the user sees a blank screen
 * during the server fetch. With it, they see a skeleton immediately.
 *
 * This works because Next.js wraps the page in a Suspense boundary automatically
 * when a loading.tsx is present in the same directory.
 */
export default function LyricsLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <LyricsViewSkeleton />
    </div>
  );
}
