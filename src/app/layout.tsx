import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

// =============================================================================
// Font Loading
//
// WHY next/font/google:
// - Fonts are self-hosted at build time — zero network requests to Google at runtime
// - Eliminates Cumulative Layout Shift (CLS) from font swapping
// - CSS variables make fonts available to both Tailwind and CSS custom properties
// - Automatic subsetting reduces font file size
//
// Playfair Display — display face for headings: editorial, elegant, musical
// Inter — body face: highly legible at all sizes, neutral but not boring
// =============================================================================

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap", // 'swap' shows system font until Playfair loads — avoids invisible text
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// =============================================================================
// Root Metadata
//
// WHY generateMetadata at root level:
// This sets the fallback for every page. Individual pages override specific fields
// (title, description, OG image) but inherit defaults like themeColor and viewport.
//
// The `template` in title means child pages get "Song Name | Lyricly" automatically.
// =============================================================================

export const metadata: Metadata = {
  // Template: child pages fill in %s, falling back to "Lyricly" if empty
  title: {
    template: `%s | ${SITE_CONFIG.name}`,
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,

  // Canonical base URL — tells Google the authoritative domain
  metadataBase: new URL(SITE_CONFIG.url),

  // Open Graph — controls how pages look when shared on social media
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    locale: "en_US",
  },

  // Twitter Card — large image card for better click-through on Twitter
  twitter: {
    card: "summary_large_image",
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
  },

  // Robots — allow all crawlers on every page by default
  // Individual pages can override this (e.g. /auth pages set noindex)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App manifest and icons
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  // Verification meta tags for Google Search Console (add your token here)
  // verification: { google: "your-token-here" },
};

// Viewport is separate from metadata in Next.js 15 — required for theme-color
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE_CONFIG.themeColor },
    { media: "(prefers-color-scheme: dark)", color: "#13101e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow pinch zoom for accessibility — don't use maximum-scale=1
};

// =============================================================================
// Structured Data (JSON-LD)
//
// WHY JSON-LD:
// Google recommends JSON-LD for structured data. It's easier to maintain than
// microdata, doesn't require HTML changes, and can be injected via <script> tags.
//
// Organization + Website schemas help Google understand the site's identity
// and enable the search box directly in Google results (SearchAction).
// =============================================================================

function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    sameAs: [`https://twitter.com/${SITE_CONFIG.twitterHandle.replace("@", "")}`],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    // SearchAction enables Google to show a search box in results for this site
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}&mode=track`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning prevents the mismatch warning caused by
      // next-themes injecting the class="dark" before React hydrates
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <head>
        <StructuredData />
      </head>
      <body className="font-body min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))] antialiased">
        {/* ThemeProvider wraps everything to enable dark/light mode toggle */}
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            {/* role="main" and id for skip navigation link (accessibility) */}
            <main id="main-content" role="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
