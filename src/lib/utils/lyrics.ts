import type { DisplayLyrics, LyricsRecord } from "@/types";

// =============================================================================
// Lyrics Cleaning Utility
//
// WHY THIS EXISTS:
// The LRCLIB API returns lyrics in two formats:
//   1. `syncedLyrics` — timestamped LRC format: "[00:17.12] Lyric line here"
//   2. `plainLyrics`  — clean text, but sometimes has inconsistent line endings
//
// We prefer syncedLyrics (it's more structured and often more complete), but
// we need to strip the timestamps before displaying them to users.
//
// WHY A UTILITY FUNCTION (not inline logic):
// This logic is used in multiple places — the search results page, the lyrics
// detail page, and potentially a copy-to-clipboard feature. Centralising it
// means the cleaning logic stays consistent and is easy to update.
// =============================================================================

/**
 * Regex that matches LRC timestamp tags in the format [mm:ss.xx] or [mm:ss.xxx].
 *
 * Breakdown:
 *   \[       — literal opening bracket
 *   \d{2}    — two-digit minutes
 *   :        — colon separator
 *   \d{2}    — two-digit seconds
 *   \.       — literal decimal point
 *   \d{2,3}  — two or three decimal digits (LRCLIB uses both)
 *   \]       — literal closing bracket
 *   \s?      — optional space after the tag
 *
 * The `g` flag replaces ALL occurrences in a string, not just the first.
 */
const LRC_TIMESTAMP_REGEX = /\[\d{2}:\d{2}\.\d{2,3}\]\s?/g;

/**
 * Strips LRC timestamp tags from a single line of synced lyrics.
 *
 * Examples:
 *   "[00:10.20] Hello World" → "Hello World"
 *   "[01:20.115] Two three" → "Two three"
 *   "No timestamp here"     → "No timestamp here"
 */
function stripTimestampFromLine(line: string): string {
  return line.replace(LRC_TIMESTAMP_REGEX, "");
}

/**
 * Cleans a full synced lyrics string by removing all timestamp tags
 * and filtering out lines that become empty after stripping.
 *
 * We keep empty lines that separate stanzas (blank lines in the original),
 * but drop lines that were ONLY timestamps (common at the very end of LRC files).
 *
 * Input:
 *   "[00:10.20] Hello\n[00:15.42] World\n[03:54.94] "
 *
 * Output:
 *   "Hello\nWorld"
 */
function cleanSyncedLyrics(syncedLyrics: string): string {
  return syncedLyrics
    .split("\n")
    .map(stripTimestampFromLine)
    .map((line) => line.trimEnd()) // remove trailing whitespace left after stripping
    .filter((line, index, array) => {
      // Keep non-empty lines always
      if (line.trim() !== "") return true;

      // Keep empty lines that separate stanzas (i.e., surrounded by non-empty lines)
      // but drop leading/trailing empty lines and consecutive empties
      const prevLine = array[index - 1]?.trim();
      const nextLine = array[index + 1]?.trim();
      return Boolean(prevLine && nextLine);
    })
    .join("\n");
}

/**
 * Normalises plain lyrics by trimming and collapsing excessive blank lines.
 * The LRCLIB API sometimes returns plainLyrics with 3+ consecutive newlines.
 */
function normalPlainLyrics(plainLyrics: string): string {
  return plainLyrics
    .trim()
    .replace(/\n{3,}/g, "\n\n"); // collapse 3+ newlines down to 2 (stanza break)
}

/**
 * Takes a raw LyricsRecord from the API and returns a DisplayLyrics object
 * with cleaned, timestamp-free lyrics ready for rendering.
 *
 * Strategy:
 *   1. If syncedLyrics is available → strip timestamps and use it.
 *      (Preferred because it's usually more complete and better formatted.)
 *   2. Else if plainLyrics is available → normalise and use it.
 *   3. Else if instrumental → lyrics is null (we show an "instrumental" state).
 *   4. Else → lyrics is null (we show a "not found" state).
 *
 * WHY NOT ALWAYS USE plainLyrics:
 *   syncedLyrics often contains the same content but is fetched more reliably
 *   and tends to have better line breaks that match the song's actual phrasing.
 */
export function buildDisplayLyrics(record: LyricsRecord): DisplayLyrics {
  let lyrics: string | null = null;

  if (record.syncedLyrics) {
    lyrics = cleanSyncedLyrics(record.syncedLyrics);
  } else if (record.plainLyrics) {
    lyrics = normalPlainLyrics(record.plainLyrics);
  }
  // If both are null and it's not instrumental, lyrics stays null
  // (the UI will handle this as an empty state)

  return {
    id: record.id,
    trackName: record.trackName,
    artistName: record.artistName,
    albumName: record.albumName,
    duration: record.duration,
    instrumental: record.instrumental,
    lyrics,
  };
}

/**
 * Formats a duration in seconds into a human-readable "m:ss" string.
 * Used in search result cards and the lyrics detail page.
 *
 * Example: 233 → "3:53"
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Generates a URL-safe slug from a track name and artist.
 * Used to build clean page titles and share URLs.
 */
export function buildLyricsSlug(trackName: string, artistName: string): string {
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // remove non-word chars
      .replace(/\s+/g, "-") // spaces to hyphens
      .replace(/-+/g, "-") // collapse multiple hyphens
      .trim();

  return `${slugify(trackName)}-${slugify(artistName)}`;
}

/**
 * Truncates a lyrics string to a short excerpt for use in meta descriptions.
 * We use the first 160 chars (Google's meta description limit) of clean lyrics.
 */
export function buildLyricsExcerpt(lyrics: string | null, maxLength = 160): string {
  if (!lyrics) return "";
  const firstFewLines = lyrics.split("\n").slice(0, 4).join(" ");
  return firstFewLines.length > maxLength
    ? `${firstFewLines.slice(0, maxLength - 3)}...`
    : firstFewLines;
}
