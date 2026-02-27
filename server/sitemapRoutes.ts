/**
 * Dynamic Sitemap Generator
 * 
 * Serves multiple sitemaps:
 * /sitemap.xml              — Sitemap index pointing to all sub-sitemaps
 * /sitemap-main.xml         — All 32 calculator pages
 * /sitemap-zip-{slug}.xml   — ZIP code pages for each calculator (42,741 entries each)
 * 
 * Total coverage: 32 calculators + (32 x 42,741 ZIP pages) = ~1,369,744 pages
 */
import { type Express } from "express";
import { getDb } from "./db";
import { zipCodes } from "../drizzle/schema";

const BASE_URL = "https://calchq.io";

// All 32 calculator slugs
const CALCULATOR_SLUGS = [
  "loan", "mortgage", "rent-vs-buy", "salary", "sales-tax",
  "percentage", "compound-interest", "retirement", "paycheck", "roi", "refinance",
  "tdee", "macro", "bmi", "body-fat", "bmr", "one-rep-max",
  "calories-burned", "fat-burning-zone",
  "pregnancy", "ovulation", "calorie-deficit", "ideal-weight", "sleep",
  "age", "calculator", "unit-converter",
  "gpa", "tip", "fuel-cost", "currency", "inflation",
  "fraction", "exponent", "date",
  "random-number", "password-generator"
];

export function registerSitemapRoutes(app: Express) {
  // Sitemap index — lists all sub-sitemaps
  app.get("/sitemap.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const subSitemaps = [
      `<sitemap><loc>${BASE_URL}/sitemap-main.xml</loc><lastmod>${today}</lastmod></sitemap>`,
      ...CALCULATOR_SLUGS.map(slug =>
        `<sitemap><loc>${BASE_URL}/sitemap-zip-${slug}.xml</loc><lastmod>${today}</lastmod></sitemap>`
      )
    ].join("\n  ");

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400"); // 24h cache
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${subSitemaps}
</sitemapindex>`);
  });

  // Main sitemap — homepage + all 32 calculator pages
  app.get("/sitemap-main.xml", (_req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const urls = [
      `<url><loc>${BASE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
      ...CALCULATOR_SLUGS.map(slug =>
        `<url><loc>${BASE_URL}/calculator/${slug}</loc><changefreq>monthly</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`
      )
    ].join("\n  ");

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`);
  });

  // Per-calculator ZIP code sitemaps — one per calculator slug
  // Each contains all 42,741 ZIP code pages for that calculator
  app.get("/sitemap-zip-:slug.xml", async (req, res) => {
    const { slug } = req.params;
    if (!CALCULATOR_SLUGS.includes(slug)) {
      res.status(404).send("Not found");
      return;
    }

    try {
      const db = await getDb();
      if (!db) {
        res.status(503).send("Database unavailable");
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      
      // Stream the response for memory efficiency
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.write(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`);

      // Fetch all ZIP codes in batches to avoid memory issues
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
  });
}
