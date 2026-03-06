/**
 * Dynamic Sitemap Generator
 *
 * IMPORTANT: The Manus platform injects "Disallow: /api/*" into robots.txt,
 * which blocks Google from crawling /api/ routes. To work around this, all
 * sitemap routes are served at NON-/api/ paths:
 *
 *   /sitemap-index.xml          — Sitemap index (all sub-sitemaps)
 *   /sitemap-main.xml           — All calculator pages
 *   /sitemap-zip-{slug}.xml     — ZIP code pages per calculator
 *
 * The static /sitemap.xml in client/public/ points to /sitemap-index.xml.
 * The /api/sitemap-*.xml routes are kept as aliases for backward compatibility.
 *
 * Total coverage: 63 calculators + (63 x 42,741 ZIP pages) = ~2.7M pages
 */
import { type Express } from "express";
import { getDb } from "./db";
import { zipCodes } from "../drizzle/schema";

const BASE_URL = "https://calchq.io";

// All 63 calculator slugs
const CALCULATOR_SLUGS = [
  "loan", "sba-7a-loan", "mortgage", "rent-vs-buy", "salary", "sales-tax",
  "percentage", "compound-interest", "retirement", "paycheck", "roi", "refinance",
  "tdee", "macro", "bmi", "body-fat", "bmr", "one-rep-max",
  "calories-burned", "fat-burning-zone",
  "pregnancy", "ovulation", "calorie-deficit", "ideal-weight", "sleep",
  "age", "calculator", "unit-converter",
  "gpa", "tip", "fuel-cost", "currency", "inflation",
  "fraction", "exponent", "date",
  "random-number", "password-generator",
  "timezone", "word-counter",
  "scientific-notation", "roman-numerals",
  "color", "number-base",
  "temperature", "speed", "pace", "net-worth",
  // Phase 11 — High-Revenue Expansion
  "sba-504-loan", "auto-loan", "debt-payoff", "home-equity",
  "heart-rate-zone", "water-intake", "due-date", "menstrual-cycle",
  "business-valuation", "break-even", "depreciation", "workers-comp",
  // Phase 14 — VA Loan, Credit Card Payoff, Savings Goal
  "va-loan", "credit-card-payoff", "savings-goal"
];

function buildSitemapIndex(today: string): string {
  // NOTE: Non-/api/ paths are intercepted by the Manus platform in production
  // and return HTML instead of XML. We use /api/ paths here because Google's
  // sitemap fetcher ignores robots.txt Disallow rules for explicitly submitted sitemaps.
  const subSitemaps = [
    `<sitemap><loc>${BASE_URL}/api/sitemap-main.xml</loc><lastmod>${today}</lastmod></sitemap>`,
    ...CALCULATOR_SLUGS.map(slug =>
      `<sitemap><loc>${BASE_URL}/api/sitemap-zip-${slug}.xml</loc><lastmod>${today}</lastmod></sitemap>`
    )
  ].join("\n  ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${subSitemaps}
</sitemapindex>`;
}

function buildMainSitemap(today: string): string {
  const urls = [
    `<url><loc>${BASE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    `<url><loc>${BASE_URL}/calculators</loc><changefreq>weekly</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`,
    ...CALCULATOR_SLUGS.map(slug =>
      `<url><loc>${BASE_URL}/calculator/${slug}</loc><changefreq>monthly</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`
    )
  ].join("\n  ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

export function registerSitemapRoutes(app: Express) {
  // Redirect old short URL format /:slug/:zip to /calculator/:slug/:zip
  app.get('/:slug/:zip', (req, res, next) => {
    const { slug, zip } = req.params;
    if (CALCULATOR_SLUGS.includes(slug) && /^\d{5}$/.test(zip)) {
      return res.redirect(301, `/calculator/${slug}/${zip}`);
    }
    next();
  });

  // ─── PRIMARY ROUTES (not under /api/ — Google can crawl these) ──────────────

  // Sitemap index at /sitemap-index.xml
  app.get("/sitemap-index.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buildSitemapIndex(today));
  });

  // Main sitemap at /sitemap-main.xml
  app.get("/sitemap-main.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buildMainSitemap(today));
  });

  // Per-calculator ZIP sitemaps at /sitemap-zip-{slug}.xml
  app.get("/sitemap-zip-:slug.xml", async (req, res) => {
    const { slug } = req.params;
    if (!CALCULATOR_SLUGS.includes(slug)) {
      res.status(404).send("Not found");
      return;
    }
    await streamZipSitemap(slug, res);
  });

  // ─── LEGACY /api/ ALIASES (kept for backward compatibility) ─────────────────

  app.get("/api/sitemap.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buildSitemapIndex(today));
  });

  app.get("/api/sitemap-main.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buildMainSitemap(today));
  });

  app.get("/api/sitemap-zip-:slug.xml", async (req, res) => {
    const { slug } = req.params;
    if (!CALCULATOR_SLUGS.includes(slug)) {
      res.status(404).send("Not found");
      return;
    }
    await streamZipSitemap(slug, res);
  });
}

async function streamZipSitemap(slug: string, res: any) {
  try {
    const db = await getDb();
    if (!db) {
      res.status(503).send("Database unavailable");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.write(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`);

    const BATCH_SIZE = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const batch = await db
        .select({ zip: zipCodes.zip })
        .from(zipCodes)
        .limit(BATCH_SIZE)
        .offset(offset);

      if (batch.length === 0) {
        hasMore = false;
        break;
      }

      const urlEntries = batch
        .map(row => `  <url><loc>${BASE_URL}/calculator/${slug}/${row.zip}</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${today}</lastmod></url>`)
        .join("\n");

      res.write(urlEntries + "\n");
      offset += BATCH_SIZE;

      if (batch.length < BATCH_SIZE) {
        hasMore = false;
      }
    }

    res.write("</urlset>");
    res.end();
  } catch (err) {
    console.error("[Sitemap] Error generating ZIP sitemap:", err);
    if (!res.headersSent) {
      res.status(500).send("Error generating sitemap");
    }
  }
}
