/**
 * Skeleton loader for the LyricsView component.
 * Matches the visual layout of the actual content to prevent layout shift
 * during the Suspense boundary resolve.
 */
export function LyricsViewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading lyrics…">
      {/* Back button */}
      <div className="skeleton mb-8 h-8 w-32 rounded-xl" />

      {/* Track icon */}
      <div className="skeleton mb-5 h-16 w-16 rounded-2xl" />

      {/* Title */}
      <div className="skeleton mb-3 h-10 w-3/4 rounded-2xl" />

      {/* Artist */}
      <div className="skeleton mb-4 h-6 w-1/2 rounded-xl" />

      {/* Meta row */}
      <div className="mb-8 flex gap-4">
        <div className="skeleton h-4 w-32 rounded-full" />
        <div className="skeleton h-4 w-16 rounded-full" />
      </div>

      {/* Action buttons */}
      <div className="mb-8 flex gap-2">
        <div className="skeleton h-8 w-28 rounded-lg" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>

      {/* Divider */}
      <div className="skeleton mb-8 h-px w-full" />

      {/* Lyrics stanzas */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            {Array.from({ length: i === 1 ? 3 : 4 }).map((_, j) => (
              <div
                key={j}
                className="skeleton h-5 rounded-full"
                style={{ width: `${65 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
