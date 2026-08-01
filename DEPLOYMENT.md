# Lyricly — Deployment Guide

A step-by-step guide to get Lyricly running locally and deployed to Vercel in production.

---

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm 10+ or pnpm 9+
- Git
- A Vercel account (free tier works)

---

## 1. Local Development Setup

### Clone and install

```bash
git clone <your-repo-url> lyricly
cd lyricly
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_LRCLIB_BASE_URL=https://lrclib.net
```

### Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 2. Production Build (local test)

```bash
npm run build
npm start
```

Check that:
- `npm run build` completes with no TypeScript or ESLint errors
- The home page loads and quick-search chips work
- Searching returns results from LRCLIB
- Lyrics pages show clean text (no timestamps)
- Dark mode toggle works
- Back navigation from lyrics page works

---

## 3. Deploy to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts:
- Set up and deploy: **Y**
- Which scope: your personal account
- Link to existing project: **N**
- Project name: `lyricly`
- Directory: `./` (root)
- Override settings: **N**

### Option B — Vercel Dashboard (GUI)

1. Push your code to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Vercel auto-detects Next.js — no framework config needed.
5. Click **Deploy**.

---

## 4. Environment Variables on Vercel

In the Vercel dashboard:

1. Open your project → **Settings** → **Environment Variables**
2. Add these variables for **Production**, **Preview**, and **Development**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` or your custom domain |
| `NEXT_PUBLIC_LRCLIB_BASE_URL` | `https://lrclib.net` |

> **Important:** After changing environment variables, redeploy the project for them to take effect.

---

## 5. Custom Domain (Optional)

1. Vercel Dashboard → your project → **Settings** → **Domains**
2. Add your domain (e.g. `lyricly.app`)
3. Follow the DNS instructions (add CNAME or A record at your registrar)
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
5. Redeploy

---

## 6. Google Search Console Setup (SEO)

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your domain property
3. Verify ownership (HTML file or DNS TXT record)
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`
5. Monitor Core Web Vitals under **Experience** tab

---

## 7. Performance Verification

Run Lighthouse on your production URL:

```bash
npx lighthouse https://your-domain.vercel.app --view
```

Or use [PageSpeed Insights](https://pagespeed.web.dev/).

Target scores:
- Performance: 95+
- SEO: 100
- Accessibility: 95+
- Best Practices: 100

---

## 8. Optional: Firebase Authentication Setup

The codebase is architected to support authentication. To enable it:

### Install Firebase

```bash
npm install firebase
```

### Create `src/lib/firebase.ts`

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
```

### Add to `.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Create auth page at `src/app/auth/page.tsx`

Use `signInWithPopup(auth, new GoogleAuthProvider())` for Google login and
`signInWithEmailAndPassword(auth, email, password)` for email/password.

> **Why Firebase over Supabase/Auth.js?**
> Firebase Auth has the most generous free tier (unlimited auth users),
> excellent React SDK, and zero server config — ideal for a Next.js app
> deployed on Vercel without a database layer.

---

## 9. Project Structure Reference

```
lyricly/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, theme, metadata)
│   │   ├── page.tsx            # Home page (Server Component)
│   │   ├── globals.css         # Global styles + CSS variables
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   ├── robots.ts           # robots.txt generation
│   │   ├── sitemap.ts          # sitemap.xml generation
│   │   ├── manifest.ts         # PWA manifest
│   │   ├── search/
│   │   │   └── page.tsx        # Search results page
│   │   └── lyrics/[id]/
│   │       ├── page.tsx        # Lyrics detail page (SSR)
│   │       ├── loading.tsx     # Loading skeleton
│   │       └── error.tsx       # Lyrics-specific error boundary
│   ├── components/
│   │   ├── home/
│   │   │   ├── HomeClient.tsx      # Interactive home page wrapper
│   │   │   └── QuickSearchSection.tsx  # Clickable quick-search chips
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Sticky header with nav + theme toggle
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   └── ThemeProvider.tsx   # next-themes wrapper
│   │   ├── lyrics/
│   │   │   ├── LyricsView.tsx      # Lyrics display with copy/share
│   │   │   └── LyricsViewSkeleton.tsx  # Loading skeleton
│   │   ├── search/
│   │   │   ├── SearchBar.tsx       # Controlled search input + mode tabs
│   │   │   ├── SearchResults.tsx   # Results list + empty/error states
│   │   │   └── SearchPageClient.tsx  # Search page interactive wrapper
│   │   └── ui/
│   │       ├── Button.tsx          # Reusable button with variants
│   │       └── ThemeToggle.tsx     # Dark/light mode toggle
│   ├── lib/
│   │   ├── api/
│   │   │   └── lrclib.ts       # All LRCLIB API fetch functions
│   │   ├── constants/
│   │   │   └── index.ts        # Site config, routes, quick-search data
│   │   ├── hooks/
│   │   │   ├── useSearch.ts    # Search state machine + API integration
│   │   │   └── useCopyToClipboard.ts  # Clipboard hook with feedback
│   │   └── utils/
│   │       ├── lyrics.ts       # Timestamp stripping + formatting utils
│   │       └── cn.ts           # Tailwind class merge utility
│   └── types/
│       └── index.ts            # All TypeScript interfaces and types
└── public/
    └── favicon.svg
```

---

## 10. Scripts Reference

```bash
npm run dev       # Start development server on :3000
npm run build     # Production build (TypeScript + ESLint checks run here)
npm run start     # Start production server (run after build)
npm run lint      # Run ESLint
npm run format    # Run Prettier on all files
```

---

## Common Issues

**Build fails with TypeScript errors**
Run `npm run lint` to see all issues. The project uses strict TypeScript — fix all errors before deploying.

**LRCLIB returns 429 (rate limited)**
The API has rate limits. In dev, avoid rapid repeated searches. The code handles 429 errors with a user-friendly message.

**Fonts show layout shift**
Ensure `NEXT_PUBLIC_SITE_URL` is set correctly. next/font self-hosts fonts but the CSS variable loading order matters.

**Dark mode flashes on load**
This is the `suppressHydrationWarning` pattern — it's expected on first load and disappears after hydration. next-themes handles it correctly.
