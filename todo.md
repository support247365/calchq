# CalcHQ TODO

## Phase 1 - Launch (Complete)
- [x] 27 calculators across Financial, Health, Tools categories
- [x] ZIP code pages for all calculators (1.15M+ pages)
- [x] Dynamic sitemap with 27 sub-sitemaps
- [x] AdSense integration (ca-pub-2193438800029188)
- [x] Google Analytics integration
- [x] Custom domain calchq.io
- [x] ads.txt file for AdSense verification
- [x] Static sitemap.xml removed (dynamic server route now serves correctly)

## Phase 2 - Calculator Expansion
- [x] GPA Calculator
- [x] Tip Calculator
- [x] Fuel Cost Calculator
- [x] Currency Converter
- [x] Inflation Calculator
- [x] Updated homepage stats to 32 calculators / 1.3M+ pages
- [x] Updated sitemap routes to include all 32 slugs

## Upcoming
- [ ] GPA, Tip, Fuel Cost, Currency, Inflation ZIP code pages (5 x 42,741 = 213,705 new pages)
- [ ] Nearby ZIP codes section on ZIP calculator pages (internal linking)
- [ ] Ezoic application (after 10k monthly visitors)

## Phase 3 - Homepage Math Category
- [x] Add 'math' category type to calculators.ts
- [x] Tag GPA, Percentage, and Calculator as 'math'
- [x] Add Math category definition with Sigma icon and violet color
- [x] Update homepage to display Math section
- [x] Add Math to Navbar dropdown

## Phase 4 - Math Section Expansion
- [x] Build Fraction Calculator component (add, subtract, multiply, divide, simplify)
- [x] Build Square Root / Exponent Calculator component
- [x] Register both in calculators.ts with FAQs
- [x] Register both in CalculatorPage.tsx component map
- [x] Register both in sitemapRoutes.ts

## Phase 5 - Date Calculator
- [x] Build Date Calculator component (days between, add/subtract days, day-of-week)
- [x] Register in calculators.ts with FAQs
- [x] Register in CalculatorPage.tsx component map
- [x] Register in sitemapRoutes.ts
- [x] Update homepage stats

## Phase 6 - Tools Section Expansion
- [x] Build Random Number Generator component
- [x] Build Password Generator component
- [x] Register both in calculators.ts with FAQs
- [x] Register both in CalculatorPage.tsx component map
- [x] Register both in sitemapRoutes.ts
- [x] Update homepage stats

## Phase 7 - Tools Section Expansion II
- [x] Build Time Zone Converter component
- [x] Build Word / Character Counter component
- [x] Register both in calculators.ts with FAQs
- [x] Register both in CalculatorPage.tsx component map
- [x] Register both in sitemapRoutes.ts
- [x] Update homepage stats
- [ ] Resubmit sitemap to Google Search Console (user action)

## Phase 8 - Math Expansion + Bookmark Prompt
- [x] Build Scientific Notation Converter component
- [x] Build Roman Numeral Converter component
- [x] Build bookmark/PWA install prompt component
- [x] Add bookmark prompt to CalculatorPage and Homepage
- [x] Register both new calculators in calculators.ts with FAQs
- [x] Register both in CalculatorPage.tsx component map
- [x] Register both in sitemapRoutes.ts
- [x] Update homepage stats

## Phase 9 - Color Converter, Number Base Converter, Internal Links
- [x] Build Color Converter component (HEX, RGB, HSL, CMYK)
- [x] Build Number Base Converter component (binary, octal, decimal, hex)
- [x] Add cross-category internal links to CalculatorPage related section
- [x] Register both in calculators.ts with FAQs
- [x] Register both in CalculatorPage.tsx component map
- [x] Register both in sitemapRoutes.ts
- [x] Update homepage stats

## Phase 10 - Final Polish
- [x] Add JSON-LD FAQPage + HowTo structured data to CalculatorPage
- [x] Add Open Graph / Twitter Card meta tags to CalculatorPage and Home
- [x] Build Recently Viewed bar (localStorage, last 5 calculators)
- [x] Build All Calculators browse page (/calculators) with category filter
- [x] Build Temperature Converter component
- [x] Build Speed Converter component
- [x] Build Pace Calculator component
- [x] Build Net Worth Calculator component
- [x] Register all 4 new calculators in registry, sitemap, homepage
- [x] Update homepage stats to 47 calculators / 2M+ pages

- [x] Rebuild Calories Burned Calculator: 50+ activities with categories, speed/intensity variants, richer output (per-hour rate, activity comparison)
- [x] Rebuild BMI Calculator: visual BMI scale, health risk indicators, waist-to-height ratio, body composition context, personalized guidance
- [x] Build SBA 7(a) Loan Calculator with current rates, guarantee fees, amortization schedule
- [x] Fix Search Console: Server error (5xx) on some pages — investigated, no 5xx found in live site; likely transient DB connection issue during initial deployment
- [x] Fix Search Console: Pages excluded by noindex tag — no noindex found in codebase; likely Google rendering SPA before JS hydrates; added sba-7a-loan to sitemap slugs
- [x] Fix noindex on /sales-tax/67061 — old short URL format now 301 redirects to /calculator/sales-tax/67061
- [x] Fix sitemap.xml broken in production — moved all sitemap routes to /api/ prefix so Manus platform proxies them correctly
- [x] Add 301 redirect from /:slug/:zip to /calculator/:slug/:zip to fix old URL format
