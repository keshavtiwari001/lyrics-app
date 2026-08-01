// WHY SERVER COMPONENT:
// The lyrics detail page benefits hugely from SSR:
// - The full lyrics content is in the HTML — Googlebot can index every word
// - Users see lyrics immediately without waiting for client JS
// - We can generate rich metadata (title, description, OG, JSON-LD) server-side
// - Next.js revalidates cached lyrics every hour (they rarely change)

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LyricsView } from "@/components/lyrics/LyricsView";
import { LyricsViewSkeleton } from "@/components/lyrics/LyricsViewSkeleton";
import { getLyricsById } from "@/lib/api/lrclib";
import { buildDisplayLyrics, buildLyricsExcerpt, buildLyricsSlug } from "@/lib/utils/lyrics";
import { SITE_CONFIG } from "@/lib/constants";
import { LrclibNotFoundError } from "@/lib/api/lrclib";

interface LyricsPageProps {
  params: Promise<{ id: string }>;
}

// =============================================================================
// generateMetadata — SSR metadata for each lyrics page
//
// WHY THIS MATTERS FOR SEO:
// Each lyrics page needs a unique, descriptive title and description so Google
// knows what the page is about without executing JavaScript.
// The structured data (MusicRecording schema) tells Google this is lyrics content,
// which can trigger rich snippets in search results.
// =============================================================================

export async function generateMetadata({ params }: LyricsPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) return { title: "Lyrics Not Found" };

  try {
    const record = await getLyricsById(numericId);
    const display = buildDisplayLyrics(record);
    const excerpt = buildLyricsExcerpt(display.lyrics);

    const title = `${record.trackName} Lyrics — ${record.artistName}`;
    const description = excerpt
      ? `${excerpt} — Lyrics to "${record.trackName}" by ${record.artistName} on ${SITE_CONFIG.name}.`
      : `Lyrics to "${record.trackName}" by ${record.artistName}${record.albumName ? ` from the album ${record.albumName}` : ""}.`;

    const canonicalUrl = `${SITE_CONFIG.url}/lyrics/${numericId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "music.song",
      },
      twitter: {
        title,
        description,
        card: "summary",
      },
      // Canonical URL prevents duplicate content if the same page is
      // accessed via different routes
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch {
    return {
      title: "Lyrics Not Found",
      robots: { index: false },
    };
  }
}

// =============================================================================
// Structured Data for Lyrics Page
//
// MusicRecording schema helps Google understand this is song lyrics.
// BreadcrumbList helps Google display breadcrumbs in search results — CTR boost.
// =============================================================================

async function LyricsStructuredData({ id }: { id: number }) {
  try {
    const record = await getLyricsById(id);

    const musicRecordingSchema = {
      "@context": "https://schema.org",
      "@type": "MusicRecording",
      name: record.trackName,
      byArtist: {
        "@type": "MusicGroup",
        name: record.artistName,
      },
      inAlbum: record.albumName
        ? {
            "@type": "MusicAlbum",
            name: record.albumName,
          }
        : undefined,
      duration: `PT${Math.floor(record.duration / 60)}M${record.duration % 60}S`,
      url: `${SITE_CONFIG.url}/lyrics/${id}`,
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_CONFIG.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Search",
          item: `${SITE_CONFIG.url}/search`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${record.trackName} — ${record.artistName}`,
          item: `${SITE_CONFIG.url}/lyrics/${id}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicRecordingSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </>
    );
  } catch {
    return null;
  }
}

// =============================================================================
// Page Component
// =============================================================================

export default async function LyricsPage({ params }: LyricsPageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  let record;
  try {
    record = await getLyricsById(numericId);
  } catch (err) {
    if (err instanceof LrclibNotFoundError) {
      notFound();
    }
    throw err; // Let Next.js error boundary handle unexpected errors
  }

  const displayLyrics = buildDisplayLyrics(record);
  const slug = buildLyricsSlug(record.trackName, record.artistName);

  return (
    <>
      <LyricsStructuredData id={numericId} />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation — helps users and improves SEO */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-muted))]">
            <li>
              <a href="/" className="transition-colors hover:text-[rgb(var(--color-text-secondary))]">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a
                href={`/search?q=${encodeURIComponent(record.artistName)}&mode=artist`}
                className="transition-colors hover:text-[rgb(var(--color-text-secondary))]"
              >
                {record.artistName}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li
              className="max-w-[160px] truncate text-[rgb(var(--color-text-primary))]"
              aria-current="page"
            >
              {record.trackName}
            </li>
          </ol>
        </nav>

        {/* Lyrics content */}
        <Suspense fallback={<LyricsViewSkeleton />}>
          <LyricsView display={displayLyrics} slug={slug} />
        </Suspense>
      </div>
    </>
  );
}
