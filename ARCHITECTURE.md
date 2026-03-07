# CalcHQ — Architecture & Operations Reference

**Version:** 1.0 · **Last Updated:** March 2026  
**Domain:** calchq.io  
**Purpose:** This document is the single source of truth for every layer of the CalcHQ tech stack. It exists so that any engineer — or AI agent — can understand the full system without guesswork, and so that no decision made here is ever lost or repeated from scratch.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Repository Structure](#2-repository-structure)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Layer](#5-database-layer)
6. [Sitemap & SEO Architecture](#6-sitemap--seo-architecture)
7. [Hosting & Deployment](#7-hosting--deployment)
8. [DNS & CDN Configuration](#8-dns--cdn-configuration)
9. [Environment Variables & Secrets](#9-environment-variables--secrets)
10. [Build & Development Workflow](#10-build--development-workflow)
11. [Google Search Console & Indexing](#11-google-search-console--indexing)
12. [Advertising Integration](#12-advertising-integration)
13. [Analytics](#13-analytics)
14. [Known Constraints & Decisions Log](#14-known-constraints--decisions-log)
15. [Operations Runbook](#15-operations-runbook)

---

## 1. System Overview

CalcHQ is a programmatic SEO utility calculator website. Its primary business model is advertising revenue (Google AdSense) driven by organic search traffic. The site contains **63 calculators** across four categories (Financial, Health, Math, Tools), each of which generates a ZIP-code-specific landing page for all ~42,741 US ZIP codes, producing approximately **2.7 million indexable pages**.

The architecture is a **full-stack Node.js monorepo**: a React SPA served by an Express server, with a MySQL database (TiDB Cloud) for ZIP code data. The Express server also handles all dynamic sitemap generation, robots.txt, and API routes.

### Architecture Diagram

```
Browser
  │
  ▼
Vercel Edge Network (CDN + HTTPS termination)
  │
  ▼
Express Server (Node.js 20, ESM)
  ├── Static files → dist/public/ (Vite-built React SPA)
  ├── /robots.txt → Express route (full control, no platform injection)
  ├── /sitemap.xml → static file in dist/public/ (sitemap index)
  ├── /sitemap-index.xml → Express route (dynamic, lists all sub-sitemaps)
  ├── /sitemap-main.xml → Express route (all 63 calculator pages)
  ├── /sitemap-zip-{slug}.xml → Express route (42,741 ZIP pages per calculator)
  ├── /ads.txt → Express route (redirects to Google-managed ads.txt)
  ├── /api/trpc → tRPC API (ZIP data, auth, system)
  └── /api/oauth/callback → Manus OAuth callback
  │
  ▼
TiDB Cloud (MySQL-compatible, serverless)
  └── zip_codes table (42,741 rows: ZIP, city, state, lat, lng, income, home value)
  └── users table (Manus OAuth users)
```

---

## 2. Repository Structure

The project lives at `/home/ubuntu/calchq` in the Manus sandbox and is pushed to two Git remotes:

| Remote Name | URL | Purpose |
|---|---|---|
| `origin` | `s3://vida-prod-gitrepo/...` | Manus internal Git (Manus platform backup) |
| `render` | `https://github.com/TalendroAI/calchq.git` | GitHub repo used for Vercel/Render deployment |

The GitHub repository is **TalendroAI/calchq** and is the authoritative deployment source.

### Directory Layout

```
calchq/
├── client/                     # React frontend (Vite)
│   ├── index.html              # HTML shell with meta tags, AdSense, GA4 scripts
│   ├── public/                 # Static assets served at root
│   │   ├── robots.txt          # OVERRIDDEN by Express route — see §6
│   │   ├── sitemap.xml         # Static sitemap index (points to dynamic routes)
│   │   ├── ads.txt             # Google AdSense publisher declaration
│   │   ├── favicon.svg         # Site favicon
│   │   └── _redirects          # Netlify-style SPA fallback (not used on Vercel)
│   └── src/
│       ├── App.tsx             # Route definitions (wouter)
│       ├── index.css           # Global Tailwind CSS theme
│       ├── main.tsx            # React root, tRPC provider setup
│       ├── const.ts            # Frontend constants (OAuth login URL helper)
│       ├── _core/hooks/        # useAuth hook
│       ├── components/         # Reusable UI components
│       │   ├── ui/             # shadcn/ui component library
│       │   ├── calculators/    # Calculator UI components (grouped by phase)
│       │   ├── Navbar.tsx      # Site navigation
│       │   ├── Footer.tsx      # Site footer
│       │   └── ErrorBoundary.tsx
│       ├── contexts/
│       │   └── ThemeContext.tsx # Light/dark theme provider
│       ├── lib/
│       │   ├── calculators.ts  # MASTER REGISTRY: all 63 calculators (slug, title, category, FAQs, keywords)
│       │   ├── calculatorContent.ts # Long-form SEO content per calculator
│       │   └── recentlyViewed.ts    # localStorage-based recently viewed tracker
│       └── pages/
│           ├── Home.tsx            # Homepage with hero, search, category sections
│           ├── AllCalculators.tsx  # /calculators — browse all with filter/search
│           ├── CalculatorPage.tsx  # /calculator/:slug — individual calculator
│           ├── ZipCalculatorPage.tsx # /calculator/:slug/:zip — ZIP-specific page
│           └── NotFound.tsx
│
├── server/
│   ├── _core/                  # Framework plumbing — DO NOT edit unless extending infra
│   │   ├── index.ts            # Express server entry point (main server startup)
│   │   ├── vite.ts             # Dev: Vite middleware; Prod: static file serving
│   │   ├── trpc.ts             # tRPC router factory (publicProcedure, protectedProcedure)
│   │   ├── context.ts          # tRPC context (req, res, user from JWT cookie)
│   │   ├── oauth.ts            # Manus OAuth callback handler
│   │   ├── cookies.ts          # JWT session cookie helpers
│   │   ├── env.ts              # Typed environment variable access (ENV object)
│   │   ├── sdk.ts              # Manus platform SDK client
│   │   ├── notification.ts     # Owner notification helper
│   │   ├── llm.ts              # LLM invocation helper (Manus Forge API)
│   │   ├── imageGeneration.ts  # Image generation helper
│   │   ├── voiceTranscription.ts # Audio transcription helper
│   │   ├── dataApi.ts          # Manus Data API helper
│   │   ├── map.ts              # Google Maps proxy helper
│   │   └── systemRouter.ts     # System tRPC procedures (notifyOwner)
│   ├── index.ts                # CUSTOM server additions (robots.txt route, ads.txt)
│   ├── routers.ts              # tRPC app router (combines all sub-routers)
│   ├── sitemapRoutes.ts        # ALL sitemap route handlers (primary SEO file)
│   ├── zipRouter.ts            # tRPC ZIP code procedures (getByZip, getNearby, search)
│   ├── db.ts                   # Database connection helper (getDb, lazy init)
│   └── storage.ts              # S3 file storage helpers (storagePut, storageGet)
│
├── drizzle/
│   ├── schema.ts               # Database schema (users table, zip_codes table)
│   ├── relations.ts            # Drizzle ORM relations
│   ├── 0000_nostalgic_jubilee.sql  # Migration: initial schema
│   ├── 0001_nebulous_sentinel.sql  # Migration: zip_codes table
│   └── meta/                   # Drizzle migration metadata
│
├── shared/
│   ├── const.ts                # Shared constants (COOKIE_NAME, error messages)
│   └── types.ts                # Shared TypeScript types
│
├── ARCHITECTURE.md             # THIS FILE
├── todo.md                     # Feature/bug tracking checklist
├── ideas.md                    # Future feature ideas
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # Locked dependency versions
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite build config
├── drizzle.config.ts           # Drizzle ORM config (reads DATABASE_URL)
├── vitest.config.ts            # Test runner config
└── load_zipcodes.mjs           # One-time script: loaded ZIP data into TiDB
```

---

## 3. Frontend Architecture

### Framework & Tooling

The frontend is a **React 19 SPA** built with **Vite 7** and styled with **Tailwind CSS 4**. Routing is handled by **wouter** (lightweight alternative to React Router). UI components come from **shadcn/ui** (Radix UI primitives + Tailwind). The design language is "Clean Utility" — white background, Space Grotesk headings, Inter body text, emerald green accent color.

### Route Structure

| URL Pattern | Component | Description |
|---|---|---|
| `/` | `Home.tsx` | Homepage: hero, search, category sections, stats bar |
| `/calculators` | `AllCalculators.tsx` | Browse all 63 calculators with category filter and search |
| `/calculator/:slug` | `CalculatorPage.tsx` | Individual calculator with full UI, FAQs, JSON-LD schema |
| `/calculator/:slug/:zip` | `ZipCalculatorPage.tsx` | ZIP-specific calculator page with local data overlay |
| `/404` | `NotFound.tsx` | 404 page |

### Calculator Registry

**`client/src/lib/calculators.ts`** is the master registry. Every calculator is defined here as a `Calculator` object with:

- `slug` — URL identifier (e.g., `mortgage`, `bmi`)
- `title` — Display name
- `description` — One-line description for cards and meta tags
- `category` — One of: `financial`, `health`, `math`, `tools`
- `faqs` — Array of `{ question, answer }` objects (rendered as JSON-LD FAQPage schema)
- `keywords` — Array of SEO keyword strings
- `explanation` — 2–3 paragraph SEO content blocks
- `howTo` — Step-by-step guide (rendered as JSON-LD HowTo schema)

**To add a new calculator**, you must update all of the following:
1. `client/src/lib/calculators.ts` — add the `Calculator` object
2. `client/src/pages/CalculatorPage.tsx` — add the component to the `CALCULATOR_COMPONENTS` map
3. `server/sitemapRoutes.ts` — add the slug to `CALCULATOR_SLUGS`
4. Create the calculator component file in `client/src/components/calculators/`

### Data Fetching

All backend calls use **tRPC 11** with **TanStack Query 5**. The tRPC client is configured in `client/src/lib/trpc.ts` and initialized in `client/src/main.tsx`. All API calls go to `/api/trpc` with `credentials: "include"` for cookie-based auth.

The ZIP code data for `ZipCalculatorPage` is fetched via `trpc.zip.getByZip.useQuery({ zip })` and nearby ZIPs via `trpc.zip.getNearby.useQuery({ zip, limit: 10 })`.

### SEO on Calculator Pages

Every `CalculatorPage` and `ZipCalculatorPage` renders:
- `<title>` and `<meta name="description">` via `document.title` and a `<meta>` tag injected into `<head>`
- **JSON-LD structured data**: `FAQPage` schema (from `calculator.faqs`) and `HowTo` schema (from `calculator.howTo`)
- **Open Graph** tags: `og:title`, `og:description`, `og:type`, `og:url`
- **Recently Viewed** bar (stored in `localStorage` via `client/src/lib/recentlyViewed.ts`)
- **Related Calculators** section: up to 4 cross-links to related tools

---

## 4. Backend Architecture

### Server Entry Point

**`server/_core/index.ts`** is the Express server startup file. It:
1. Initializes Express with 50MB body parser limits
2. Calls `registerSitemapRoutes(app)` — registers all sitemap and robots.txt routes **before** any other middleware
3. Registers OAuth routes at `/api/oauth/callback`
4. Mounts tRPC at `/api/trpc`
5. In development: sets up Vite dev server middleware
6. In production: serves static files from `dist/public/`
7. Finds an available port starting from `process.env.PORT` (defaults to 3000)

**`server/index.ts`** is the custom server additions layer. It adds:
- `GET /robots.txt` — served with `Cache-Control: no-store` to prevent CDN caching of stale content
- `GET /ads.txt` — 301 redirect to Google-managed ads.txt at `https://srv.adstxtmanager.com/19390/calchq.io`

**Important:** `server/index.ts` is imported by `server/_core/index.ts`. The robots.txt and ads.txt routes in `server/index.ts` are registered **before** the static file middleware, so they take precedence over any static files in `client/public/`.

### tRPC API

The tRPC router is defined in `server/routers.ts` and combines:

| Namespace | Procedures | Description |
|---|---|---|
| `auth.me` | `query` | Returns current user from JWT cookie (or null) |
| `auth.logout` | `mutation` | Clears session cookie |
| `system.notifyOwner` | `mutation` (protected) | Sends push notification to site owner |
| `zip.getByZip` | `query` | Returns ZIP code data + live weather + local time |
| `zip.getNearby` | `query` | Returns 10 nearest ZIP codes (Haversine SQL approximation) |
| `zip.search` | `query` | Autocomplete search by ZIP prefix |

### Authentication

Authentication uses **Manus OAuth** (OpenID Connect). The flow:
1. Frontend redirects to `getLoginUrl()` (defined in `client/src/const.ts`)
2. User authenticates via Manus OAuth portal
3. Callback hits `/api/oauth/callback` in `server/_core/oauth.ts`
4. Server creates a JWT session cookie (signed with `JWT_SECRET`)
5. All subsequent requests include the cookie; `server/_core/context.ts` decodes it into `ctx.user`

**Note:** Authentication is not required for any calculator functionality. It exists as infrastructure for potential future features (saved calculations, personalization).

---

## 5. Database Layer

### Provider

**TiDB Cloud** — a serverless MySQL-compatible database. Connection string is stored in the `DATABASE_URL` environment variable.

### Schema

**`drizzle/schema.ts`** defines two tables:

**`users`** — Stores authenticated users (Manus OAuth):
- `id` (int, PK, auto-increment)
- `openId` (varchar 64, unique) — Manus OAuth identifier
- `name`, `email`, `loginMethod`
- `role` (enum: `user` | `admin`, default `user`)
- `createdAt`, `updatedAt`, `lastSignedIn`

**`zip_codes`** — The core SEO data table (42,741 rows):
- `id` (int, PK, auto-increment)
- `zip` (varchar 10, unique) — 5-digit US ZIP code
- `city`, `state` (2-letter), `stateName`, `county`
- `lat`, `lng` (varchar, stored as decimal strings)
- `timezone`, `utcOffset`
- `medianIncome`, `medianHomeValue` (int, nullable)

### ORM

**Drizzle ORM** with the MySQL dialect. Configuration in `drizzle.config.ts`.

**To run migrations:** `pnpm db:push` (runs `drizzle-kit generate && drizzle-kit migrate`)

### Database Connection

`server/db.ts` exports `getDb()` — a lazy singleton that initializes the Drizzle client on first call and reuses it. Returns `null` if `DATABASE_URL` is not set (graceful degradation — sitemap routes return 503 instead of crashing).

### ZIP Data Loading

The `load_zipcodes.mjs` script was used once to bulk-load all 42,741 US ZIP codes into TiDB Cloud. It reads from a CSV source and inserts in batches. **This script does not need to be run again** unless the ZIP code table is dropped or the database is replaced.

---

## 6. Sitemap & SEO Architecture

This is the most critical section for Google indexing. Every decision here has a direct impact on revenue.

### Sitemap Structure

The site uses a **sitemap index** pattern with 64 sub-sitemaps (1 main + 63 per-calculator ZIP sitemaps):

| File / Route | Type | Content | Page Count |
|---|---|---|---|
| `/sitemap.xml` | Static file | Sitemap index pointing to `/sitemap-index.xml` | — |
| `/sitemap-index.xml` | Express route | Dynamic sitemap index listing all 64 sub-sitemaps | — |
| `/sitemap-main.xml` | Express route | All 63 calculator pages + homepage + /calculators | ~65 URLs |
| `/sitemap-zip-{slug}.xml` | Express route (×63) | All 42,741 ZIP pages for one calculator | 42,741 URLs each |

**Total indexed pages: ~2.7 million** (65 + 63 × 42,741)

### How Sitemaps Are Generated

All sitemap logic lives in **`server/sitemapRoutes.ts`**. Key implementation details:

- `CALCULATOR_SLUGS` array at the top of the file is the authoritative list of all 63 slugs. **This must be kept in sync with `client/src/lib/calculators.ts`.**
- ZIP sitemaps are **streamed** from the database in batches of 1,000 rows using `res.write()` to avoid loading 42,741 URLs into memory at once.
- All sitemap routes set `Content-Type: application/xml` and `Cache-Control: public, max-age=86400` (24-hour CDN cache).
- The `BASE_URL` constant at the top of `sitemapRoutes.ts` is `https://calchq.io`. If the domain changes, update this.

### robots.txt

The `robots.txt` is served by an Express route in **`server/index.ts`** (not as a static file). This is intentional — it ensures no hosting platform can inject `Disallow` rules that block Google from crawling sitemaps.

Current content:
```
User-agent: *
Allow: /
Allow: /api/sitemap
Sitemap: https://calchq.io/api/sitemap.xml
```

The `Cache-Control: no-store` header on this route prevents CDN caching so Google always gets the current version.

### Static `client/public/robots.txt`

There is also a static `robots.txt` in `client/public/`. **This file is overridden by the Express route** because Express registers the route before the static file middleware. The static file exists as a fallback only. Keep both in sync.

### Static `client/public/sitemap.xml`

This is a static sitemap index file that points to `/sitemap-index.xml` (the dynamic Express route). It exists so that if someone navigates directly to `/sitemap.xml`, they get a valid sitemap index. The actual sub-sitemaps are all served dynamically by Express.

### Google Search Console Sitemap Submissions

Submit these URLs in Google Search Console under **calchq.io → Sitemaps**:

1. `https://calchq.io/sitemap.xml` (static index)
2. `https://calchq.io/sitemap-index.xml` (dynamic index)
3. `https://calchq.io/sitemap-main.xml` (all calculator pages)

The 63 ZIP sitemaps do not need to be submitted individually — they are discovered via the sitemap index.

---

## 7. Hosting & Deployment

### Target Platform: Vercel

CalcHQ is deployed on **Vercel** (Hobby tier, free). Vercel was chosen because:
- Zero platform-level interference with `robots.txt` or any routes
- Full control over all HTTP response headers (including `Cache-Control`)
- Built-in global CDN (Vercel Edge Network) with cache behavior driven entirely by your `Cache-Control` headers
- Automatic HTTPS with custom domain support
- Instant deployments from GitHub pushes (no build queue wait)
- No cold starts on Hobby tier for Node.js web services

### Deployment Flow

```
Code change in Manus sandbox
  │
  ▼
git push render main  (pushes to TalendroAI/calchq on GitHub)
  │
  ▼
Vercel detects push via GitHub webhook
  │
  ▼
Vercel runs build: pnpm install && pnpm build
  (pnpm build = vite build + esbuild server/_core/index.ts)
  │
  ▼
Vercel deploys dist/index.js (Express server)
  │
  ▼
Live at calchq.io within ~60 seconds
```

### Build Output

`pnpm build` produces:
- `dist/public/` — Vite-built React SPA (HTML, JS, CSS, assets)
- `dist/index.js` — ESM-bundled Express server (via esbuild)

The Express server in production serves `dist/public/` as static files and handles all API/sitemap routes.

### Vercel Configuration

**`vercel.json`** in the project root:
```json
{
  "version": 2,
  "builds": [
    { "src": "dist/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/dist/index.js" }
  ]
}
```

**Build Command** (set in Vercel dashboard): `pnpm install && pnpm build`  
**Output Directory** (set in Vercel dashboard): `dist`  
**Install Command**: `pnpm install`  
**Node.js Version**: 20.x

### GitHub Repository

- **Owner:** TalendroAI
- **Repo:** calchq
- **Branch:** `main` (Vercel deploys from `main`)
- **PAT:** stored in Manus secrets (used for `git push render`)

### Previous Hosting History

| Platform | Period | Why Abandoned |
|---|---|---|
| Manus (manus.space) | Initial build | Injected `Disallow: /api/*` into robots.txt; intercepted non-/api/ .xml routes and returned HTML; no control over CDN cache |
| Render.com | Migration attempt | Cloudflare CDN (not user-controlled) cached stale HTML responses for sitemap URLs; no way to purge without Cloudflare account access |
| **Vercel** | **Current** | Full control over all routes, headers, and CDN behavior |

---

## 8. DNS & CDN Configuration

### DNS Provider

**Hostinger** — manages the `calchq.io` domain.

### DNS Records

| Type | Host | Value | TTL | Purpose |
|---|---|---|---|---|
| A | `@` | `76.76.21.21` | 3600 | Root domain → Vercel |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 | www subdomain → Vercel |

**Note:** Vercel's IP for A records is `76.76.21.21`. The CNAME approach (`cname.vercel-dns.com`) is preferred for `www` because it automatically follows Vercel's infrastructure without requiring IP updates.

### CDN

Vercel Edge Network provides global CDN. Cache behavior is **entirely controlled by `Cache-Control` response headers** set in your Express routes:

| Route | Cache-Control | Reason |
|---|---|---|
| `/robots.txt` | `no-store, no-cache, must-revalidate` | Always fresh — Google must see current rules |
| `/sitemap-index.xml` | `public, max-age=86400` | Cache 24h — changes rarely |
| `/sitemap-main.xml` | `public, max-age=86400` | Cache 24h — changes rarely |
| `/sitemap-zip-*.xml` | `public, max-age=86400` | Cache 24h — ZIP data is static |
| Static assets (JS/CSS) | Vite default (content-hash filenames) | Immutable cache via filename hashing |

### How to Purge Vercel CDN Cache

If you need to force-refresh cached content immediately:
1. Go to **vercel.com → calchq project → Settings → Functions**
2. Or trigger a new deployment — Vercel automatically invalidates CDN cache on every deploy

---

## 9. Environment Variables & Secrets

All environment variables are managed through the Manus `webdev_request_secrets` tool and injected into both the development sandbox and the Vercel deployment.

| Variable | Used By | Description |
|---|---|---|
| `DATABASE_URL` | Server | TiDB Cloud MySQL connection string |
| `JWT_SECRET` | Server | Signs session cookies for Manus OAuth |
| `VITE_APP_ID` | Server + Client | Manus OAuth application ID |
| `OAUTH_SERVER_URL` | Server | Manus OAuth backend base URL |
| `VITE_OAUTH_PORTAL_URL` | Client | Manus login portal URL |
| `OWNER_OPEN_ID` | Server | Owner's Manus OpenID (for notifications) |
| `OWNER_NAME` | Server | Owner's display name |
| `BUILT_IN_FORGE_API_URL` | Server | Manus built-in APIs base URL |
| `BUILT_IN_FORGE_API_KEY` | Server | Bearer token for Manus built-in APIs |
| `VITE_FRONTEND_FORGE_API_KEY` | Client | Frontend token for Manus built-in APIs |
| `VITE_FRONTEND_FORGE_API_URL` | Client | Frontend Manus APIs URL |
| `VITE_ANALYTICS_ENDPOINT` | Client | Umami analytics script URL |
| `VITE_ANALYTICS_WEBSITE_ID` | Client | Umami website ID |

**To add or change a secret:** Use `webdev_request_secrets` in the Manus interface. Never edit `.env` files directly.

**For Vercel deployment:** All secrets must also be added in the Vercel dashboard under **Project → Settings → Environment Variables**.

---

## 10. Build & Development Workflow

### Development

```bash
pnpm dev
```

Starts the Express server in development mode with Vite HMR. The server runs on port 3000 (or next available). Vite dev server is mounted as Express middleware — no separate Vite process needed.

### Production Build

```bash
pnpm build
```

Runs two steps in sequence:
1. `vite build` — builds React SPA to `dist/public/`
2. `esbuild server/_core/index.ts ...` — bundles Express server to `dist/index.js`

### Start Production Server

```bash
pnpm start
```

Runs `NODE_ENV=production node dist/index.js`. The server reads `process.env.PORT` for the port (Vercel injects this automatically).

### Database Migrations

```bash
pnpm db:push
```

Runs `drizzle-kit generate && drizzle-kit migrate`. Generates SQL migration files from schema changes and applies them to TiDB Cloud. Requires `DATABASE_URL` to be set.

### Tests

```bash
pnpm test
```

Runs Vitest. Test files are in `server/*.test.ts`. The reference test is `server/auth.logout.test.ts`.

### Deploying to Production

```bash
git add -A
git commit -m "Description of changes"
git push render main
```

This pushes to `TalendroAI/calchq` on GitHub. Vercel auto-deploys within ~60 seconds.

---

## 11. Google Search Console & Indexing

### Property

- **Property:** `calchq.io` (domain property, not URL-prefix)
- **Verification:** HTML meta tag in `client/index.html`

### Submitted Sitemaps

| Sitemap URL | Status | Pages |
|---|---|---|
| `https://calchq.io/sitemap.xml` | Submitted | Index |
| `https://calchq.io/sitemap-index.xml` | Submitted | Index |
| `https://calchq.io/sitemap-main.xml` | Submitted | ~65 |

### Indexing Strategy

The ZIP code pages (`/calculator/:slug/:zip`) are the primary SEO surface — 2.7M pages targeting long-tail queries like "mortgage calculator 90210" or "BMI calculator New York NY 10001". Each ZIP page renders:
- Calculator-specific content with the ZIP code's city and state in the title and description
- Local data overlay: city name, state, median income, median home value, current weather, local time
- 10 nearby ZIP codes as internal links (deep internal linking across 2.7M pages)

### Crawl Budget Considerations

With 2.7M pages, Google will not crawl all of them immediately. Priority order for indexing:
1. Homepage and `/calculators` (highest priority, `1.0` in sitemap)
2. Individual calculator pages (priority `0.9`)
3. ZIP code pages (priority `0.6`)

---

## 12. Advertising Integration

### Google AdSense

- **Publisher ID:** `ca-pub-2193438800029188`
- **Integration:** Auto Ads script in `client/index.html`
- **ads.txt:** Served at `/ads.txt` via Express route (301 redirect to Google-managed `https://srv.adstxtmanager.com/19390/calchq.io`)

The AdSense script tag:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2193438800029188" crossorigin="anonymous"></script>
```

This is placed in `<head>` in `client/index.html`. Auto Ads handles placement automatically.

### ads.txt

The `client/public/ads.txt` static file contains:
```
google.com, pub-2193438800029188, DIRECT, f08c47fec0942fa0
```

The Express route at `/ads.txt` redirects to the adstxtmanager URL which auto-manages the full ads.txt including all Google partners. The static file is a fallback.

---

## 13. Analytics

### Google Analytics 4

- **Measurement ID:** `G-KFERE433T0`
- **Integration:** GA4 script in `client/index.html` (global site tag pattern)

### Umami Analytics

- **Integration:** Script tag in `client/index.html` using `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID` environment variables
- **Purpose:** Privacy-friendly analytics as a complement to GA4

---

## 14. Known Constraints & Decisions Log

This section records every significant architectural decision and constraint so they are never re-litigated without context.

### Decision: Vercel over Render

**Date:** March 2026  
**Context:** Render was the first external host after Manus. Render uses Cloudflare as its CDN, but the Cloudflare zone is owned by Render, not the site owner. When Render served stale HTML responses for sitemap URLs (due to a CDN cache hit on an old response), there was no way to purge the cache without a Cloudflare account. Vercel's CDN cache is invalidated on every deployment and is controlled entirely by `Cache-Control` headers in your Express responses.

### Decision: Express routes for robots.txt and sitemaps (not static files)

**Date:** February–March 2026  
**Context:** Manus hosting injected `Disallow: /api/*` into robots.txt regardless of the static file content. Render's CDN cached stale static file responses. The only reliable solution is to serve these files from Express routes with explicit `Cache-Control` headers, registered before any static file middleware.

### Decision: Sitemap routes at root level (not under /api/)

**Date:** March 2026  
**Context:** Manus hosting intercepted all non-/api/ `.xml` requests and returned HTML. After migrating to Vercel, there is no such restriction. All sitemap routes are at root level (`/sitemap-*.xml`) which is the industry standard (see Calculator.net: `User-agent: * / Sitemap: https://www.calculator.net/sitemap.xml`).

### Decision: ZIP code pages as primary SEO surface

**Date:** February 2026  
**Context:** 63 calculators alone would produce a small, competitive site. Adding ZIP code pages creates 2.7M long-tail pages that target location-specific queries with almost no competition. The ZIP data (city, state, income, home value, weather) provides genuine unique value on each page.

### Decision: TiDB Cloud for ZIP data

**Date:** February 2026  
**Context:** TiDB Cloud provides a serverless MySQL-compatible database with a generous free tier. The ZIP code table (42,741 rows) is read-only after initial load — no writes occur in normal operation. The Haversine proximity query for "nearby ZIPs" uses a SQL approximation that works well within TiDB's query capabilities.

### Constraint: Manus vite-plugin-manus-runtime in production

**Context:** The `vite-plugin-manus-runtime` package injects Manus-specific behavior in development. In production builds (Vercel), this plugin must not interfere. The current `vite.config.ts` includes it unconditionally — this has not caused issues on Vercel because the plugin's production behavior is a no-op, but it should be reviewed if build issues arise.

---

## 15. Operations Runbook

### Adding a New Calculator

1. Create the calculator component in `client/src/components/calculators/NewCalculator.tsx`
2. Add the calculator definition to `client/src/lib/calculators.ts` (slug, title, description, category, faqs, keywords, explanation, howTo)
3. Add the slug to `CALCULATOR_SLUGS` in `server/sitemapRoutes.ts`
4. Import and register the component in `client/src/pages/CalculatorPage.tsx` in the `CALCULATOR_COMPONENTS` map
5. Update the homepage stats (calculator count) in `client/src/pages/Home.tsx`
6. Update the static `client/public/sitemap.xml` to include the new ZIP sitemap entry
7. Deploy: `git add -A && git commit -m "Add [name] calculator" && git push render main`

### Deploying a Change

```bash
cd /home/ubuntu/calchq
git add -A
git commit -m "Describe the change"
git push render main
```

Vercel deploys automatically. Monitor at **vercel.com → calchq → Deployments**.

### Checking if the Site is Working

```bash
# robots.txt — should show Allow: / with no Disallow: /api/*
curl -s https://calchq.io/robots.txt

# Sitemap index — should return XML
curl -s https://calchq.io/sitemap-index.xml | head -5

# Main sitemap — should return XML with calculator URLs
curl -s https://calchq.io/sitemap-main.xml | head -10

# ZIP sitemap — should return XML with 42,741 URLs
curl -s https://calchq.io/sitemap-zip-mortgage.xml | head -5
```

### Updating DNS (if domain moves)

1. Log in to Hostinger DNS management for `calchq.io`
2. Update A record `@` to new IP
3. Update CNAME `www` to new CNAME target
4. Update `BASE_URL` in `server/sitemapRoutes.ts` if domain changes
5. Update `og:url` in `client/index.html`
6. Update `Sitemap:` URL in `server/index.ts` robots.txt route
7. Deploy

### Refreshing Google Search Console After a Change

1. Go to **search.google.com/search-console**
2. Select `calchq.io` property
3. Go to **Sitemaps** → click each submitted sitemap → click **Resubmit**
4. For individual pages: use **URL Inspection** → **Request Indexing**

### If the Database Goes Down

The site degrades gracefully:
- Calculator pages still load (they don't require the database)
- ZIP code pages load but show no local data
- Sitemap ZIP routes return HTTP 503 (not a crash)
- The `getDb()` function returns `null` when `DATABASE_URL` is missing or the connection fails

### If Vercel Deployment Fails

1. Check **vercel.com → calchq → Deployments** for build logs
2. Common causes: TypeScript errors, missing environment variables, pnpm version mismatch
3. Run `pnpm build` locally first to catch errors before pushing
4. If a bad deploy goes live, roll back in Vercel dashboard: **Deployments → [previous deployment] → Promote to Production**
