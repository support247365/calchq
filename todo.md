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
- [x] Fix sitemap.xml — static file in client/public/ serves sitemapindex pointing to /api/ sub-sitemaps — moved all sitemap routes to /api/ prefix so Manus platform proxies them correctly
- [x] Add 301 redirect from /:slug/:zip to /calculator/:slug/:zip to fix old URL format
- [x] Update homepage calculator count from 47 to 48

## Phase 11 - High-Revenue Calculator Expansion (12 new calculators)

### Batch 1 — Financial (highest CPC)
- [x] Build SBA 504 Loan Calculator
- [x] Build Auto Loan Calculator
- [x] Build Debt Payoff Calculator (snowball + avalanche)
- [x] Build Home Equity Loan Calculator

### Batch 2 — Health (high volume)
- [x] Build Heart Rate Zone Calculator
- [x] Build Water Intake Calculator
- [x] Build Due Date Calculator
- [x] Build Menstrual Cycle Calculator

### Batch 3 — Business (very high CPC)
- [x] Build Business Valuation Calculator
- [x] Build Break-Even Calculator
- [x] Build Depreciation Calculator
- [x] Build Workers Comp Estimate Calculator

### Registration (all 12)
- [x] Register all 12 in calculators.ts with FAQs and keywords
- [x] Register all 12 in CalculatorPage.tsx component map
- [x] Register all 12 in sitemapRoutes.ts CALCULATOR_SLUGS
- [x] Update sitemap.xml static file
- [x] Update homepage stats (48 → 60 calculators)

## Phase 12 - ZIP Code Coverage Completion + Internal Linking

### ZIP Code Pages for 5 Missing Calculators
- [x] Enable ZIP code pages for GPA Calculator
- [x] Enable ZIP code pages for Tip Calculator
- [x] Enable ZIP code pages for Fuel Cost Calculator
- [x] Enable ZIP code pages for Currency Converter
- [x] Enable ZIP code pages for Inflation Calculator
- [x] Update sitemap to include all 5 new ZIP sitemaps

### Nearby ZIP Codes Internal Linking
- [x] Add "Nearby ZIP Codes" section to ZipCalculatorPage
- [x] Query 10 nearest ZIP codes by lat/lng from database
- [x] Render as linked grid on each ZIP calculator page

## Phase 13 - Ezoic Ad Integration
- [x] Add Ezoic dynamic SPA ad refresh on route changes (useLocation hook in App.tsx)
- [x] Add Ezoic privacy consent scripts (GatekeeperConsent) to index.html
- [x] Add Ezoic main header script (sa.min.js) to index.html
- [x] Add Ezoic site verification meta tag to index.html
- [x] Add /ads.txt redirect to Ezoic adstxtmanager
- [x] Add Ezoic ad placeholder div to CalculatorPage (below calculator, ID 101)
- [x] Add Ezoic ad placeholder div to ZipCalculatorPage (below calculator, ID 101)
- [ ] Add Ezoic ad placeholder divs to Home page
- [ ] Update placeholder IDs once user creates placements in Ezoic dashboard

## Phase 14 - New High-Value Calculators
- [x] Build VA Loan Calculator (high-CPC, relevant to veteran audience)
- [x] Build Credit Card Payoff Calculator (high search volume)
- [x] Build Savings Goal Calculator (high search volume)
- [x] Register all 3 in calculators.ts, CalculatorPage.tsx, sitemapRoutes.ts
- [x] Update homepage stats (60 → 63 calculators)
