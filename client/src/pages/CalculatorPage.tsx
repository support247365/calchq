/*
 * CalcHQ Calculator Page — Enhanced for Google Quality Guidelines
 * Sections: Breadcrumb, Header, Widget, Explanation, How-to Guide,
 *           Ad Slot, FAQs, Related Calculators
 * Schema: FAQPage + HowTo structured data
 */
import { useParams, useLocation } from "wouter";
import { ArrowLeft, ChevronDown, ArrowRight, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import BookmarkPrompt from "@/components/BookmarkPrompt";
import Footer from "@/components/Footer";
import { RecentlyViewed, trackCalculatorView } from "@/components/RecentlyViewed";
import { getCalculatorBySlug, CALCULATORS, CATEGORIES } from "@/lib/calculators";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import {
  MortgageCalculator,
  RentVsBuyCalculator,
  SalaryCalculator,
  SalesTaxCalculator,
  TDEECalculator,
  MacroCalculator,
  BMICalculator,
  BodyFatCalculator,
  BMRCalculator,
  OneRepMaxCalculator,
  CaloriesBurnedCalculator,
  FatBurningZoneCalculator,
  UnitConverter,
  SBA7aCalculator,
} from "@/components/calculators/AllCalculators";
import {
  PercentageCalculator,
  CompoundInterestCalculator,
  RetirementCalculator,
  PaycheckCalculator,
  ROICalculator,
  RefinanceCalculator,
} from "@/components/calculators/FinancialCalculators2";
import {
  PregnancyCalculator,
  OvulationCalculator,
  CalorieDeficitCalculator,
  IdealWeightCalculator,
  SleepCalculator,
} from "@/components/calculators/HealthCalculators2";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import MultiCalculator from "@/components/calculators/MultiCalculator";
import {
  GPACalculator,
  TipCalculator,
  FuelCostCalculator,
  CurrencyConverter,
  InflationCalculator,
} from "@/components/calculators/NewCalculators";
import {
  FractionCalculator,
  ExponentCalculator,
} from "@/components/calculators/MathCalculators";
import DateCalculator from "@/components/calculators/DateCalculator";
import {
  RandomNumberGenerator,
  PasswordGenerator,
} from "@/components/calculators/ToolsCalculators";
import {
  TimeZoneConverter,
  WordCounter,
} from "@/components/calculators/MoreToolsCalculators";
import {
  ScientificNotationConverter,
  RomanNumeralConverter,
} from "@/components/calculators/MathConverters";
import {
  ColorConverter,
  NumberBaseConverter,
} from "@/components/calculators/DesignTools";
import {
  TemperatureConverter,
  SpeedConverter,
  PaceCalculator,
  NetWorthCalculator,
} from "@/components/calculators/FinalCalculators";

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  loan: LoanCalculator,
  mortgage: MortgageCalculator,
  "rent-vs-buy": RentVsBuyCalculator,
  salary: SalaryCalculator,
  "sales-tax": SalesTaxCalculator,
  tdee: TDEECalculator,
  macro: MacroCalculator,
  bmi: BMICalculator,
  "body-fat": BodyFatCalculator,
  bmr: BMRCalculator,
  "one-rep-max": OneRepMaxCalculator,
  "calories-burned": CaloriesBurnedCalculator,
  "fat-burning-zone": FatBurningZoneCalculator,
  "unit-converter": UnitConverter,
  percentage: PercentageCalculator,
  "compound-interest": CompoundInterestCalculator,
  retirement: RetirementCalculator,
  paycheck: PaycheckCalculator,
  roi: ROICalculator,
  refinance: RefinanceCalculator,
  pregnancy: PregnancyCalculator,
  ovulation: OvulationCalculator,
  "calorie-deficit": CalorieDeficitCalculator,
  "ideal-weight": IdealWeightCalculator,
  sleep: SleepCalculator,
  age: AgeCalculator,
  calculator: MultiCalculator,
  gpa: GPACalculator,
  tip: TipCalculator,
  "fuel-cost": FuelCostCalculator,
  currency: CurrencyConverter,
  inflation: InflationCalculator,
  fraction: FractionCalculator,
  exponent: ExponentCalculator,
  date: DateCalculator,
  "random-number": RandomNumberGenerator,
  "password-generator": PasswordGenerator,
  timezone: TimeZoneConverter,
  "word-counter": WordCounter,
  "scientific-notation": ScientificNotationConverter,
  "roman-numerals": RomanNumeralConverter,
  color: ColorConverter,
  "number-base": NumberBaseConverter,
  temperature: TemperatureConverter,
  speed: SpeedConverter,
  pace: PaceCalculator,
  "net-worth": NetWorthCalculator,
  "sba-7a-loan": SBA7aCalculator,
};

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800 pr-4">{question}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function CalculatorPage() {
  const params = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug;

  const calc = getCalculatorBySlug(slug);
  const CalculatorComponent = CALCULATOR_COMPONENTS[slug];

  useEffect(() => {
    if (!calc) return;

    // Track this view in localStorage
    trackCalculatorView(calc.slug);

    document.title = `${calc.title} — Free Online Calculator | CalcHQ`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      (metaDesc as HTMLMetaElement).name = 'description';
      document.head.appendChild(metaDesc);
    }
    (metaDesc as HTMLMetaElement).content = `Free ${calc.title.toLowerCase()} — ${calc.description} No sign-up required. Instant results.`;

    // Open Graph + Twitter Card meta tags
    const setMeta = (property: string, content: string, attr = 'property') => {
      let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    const pageUrl = `https://calchq.io/calculator/${calc.slug}`;
    const pageTitle = `${calc.title} — Free Online Calculator | CalcHQ`;
    const pageDesc = `Free ${calc.title.toLowerCase()} — ${calc.description} No sign-up required. Instant results.`;
    setMeta('og:type', 'website');
    setMeta('og:url', pageUrl);
    setMeta('og:title', pageTitle);
    setMeta('og:description', pageDesc);
    setMeta('og:image', 'https://calchq.io/og-image.png');
    setMeta('og:site_name', 'CalcHQ');
    setMeta('twitter:card', 'summary', 'name');
    setMeta('twitter:title', pageTitle, 'name');
    setMeta('twitter:description', pageDesc, 'name');
    setMeta('twitter:image', 'https://calchq.io/og-image.png', 'name');

    // Remove old schemas
    document.getElementById('faq-schema')?.remove();
    document.getElementById('howto-schema')?.remove();

    // BreadcrumbList schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchq.io" },
        { "@type": "ListItem", "position": 2, "name": calc.category.charAt(0).toUpperCase() + calc.category.slice(1), "item": `https://calchq.io/?category=${calc.category}` },
        { "@type": "ListItem", "position": 3, "name": calc.title, "item": pageUrl },
      ],
    };
    let breadcrumbEl = document.getElementById('breadcrumb-schema');
    if (!breadcrumbEl) {
      breadcrumbEl = document.createElement('script');
      breadcrumbEl.id = 'breadcrumb-schema';
      (breadcrumbEl as HTMLScriptElement).type = 'application/ld+json';
      document.head.appendChild(breadcrumbEl);
    }
    breadcrumbEl.textContent = JSON.stringify(breadcrumbSchema);

    // FAQ schema
    if (calc.faqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": calc.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      };
      const s = document.createElement('script');
      s.id = 'faq-schema';
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(s);
    }

    // HowTo schema
    if (calc.howTo && calc.howTo.steps.length > 0) {
      const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to Use the ${calc.title}`,
        "description": calc.howTo.intro,
        "step": calc.howTo.steps.map((step, i) => ({
          "@type": "HowToStep",
          "position": i + 1,
          "name": step.title,
          "text": step.text,
        })),
      };
      const s2 = document.createElement('script');
      s2.id = 'howto-schema';
      s2.type = 'application/ld+json';
      s2.textContent = JSON.stringify(howToSchema);
      document.head.appendChild(s2);
    }

    return () => {
      document.title = 'CalcHQ - Free Online Calculators for Finance, Health & Math';
      document.getElementById('faq-schema')?.remove();
      document.getElementById('howto-schema')?.remove();
      document.getElementById('breadcrumb-schema')?.remove();
    };
  }, [calc]);

  if (!calc || !CalculatorComponent) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Calculator Not Found
          </h1>
          <p className="text-gray-500 mb-6">We couldn't find the calculator you're looking for.</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Calculators
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const catInfo = CATEGORIES[calc.category];

  // Cross-category internal links for key calculators
  const CROSS_LINKS: Record<string, string[]> = {
    mortgage: ["loan", "amortization", "rent-vs-buy", "retirement"],
    loan: ["mortgage", "amortization", "salary", "tip"],
    amortization: ["mortgage", "loan", "rent-vs-buy", "inflation"],
    "rent-vs-buy": ["mortgage", "amortization", "salary", "loan"],
    bmi: ["body-fat", "calorie-deficit", "bmr", "tdee"],
    "body-fat": ["bmi", "calorie-deficit", "bmr", "tdee"],
    "calorie-deficit": ["bmi", "body-fat", "bmr", "calories-burned"],
    bmr: ["tdee", "calorie-deficit", "bmi", "body-fat"],
    tdee: ["bmr", "calorie-deficit", "bmi", "calories-burned"],
    date: ["timezone", "age", "word-counter"],
    timezone: ["date", "word-counter"],
    percentage: ["fraction", "scientific-notation", "calculator"],
    fraction: ["percentage", "exponent", "scientific-notation"],
    "scientific-notation": ["fraction", "exponent", "percentage", "roman-numerals"],
    "roman-numerals": ["scientific-notation", "number-base", "percentage"],
    "number-base": ["scientific-notation", "roman-numerals", "exponent"],
    color: ["number-base", "unit-converter"],
    currency: ["inflation", "tip", "salary"],
    inflation: ["currency", "retirement", "mortgage"],
    salary: ["tax", "loan", "currency", "retirement"],
    tax: ["salary", "tip", "loan"],
    tip: ["tax", "loan", "currency"],
    retirement: ["mortgage", "inflation", "salary", "loan"],
    gpa: ["percentage", "fraction", "calculator"],
    "fuel-cost": ["unit-converter", "tip", "salary"],
    "random-number": ["password-generator", "calculator"],
    "password-generator": ["random-number", "word-counter"],
    "word-counter": ["date", "password-generator"],
    "calories-burned": ["calorie-deficit", "bmi", "bmr", "fat-burning-zone"],
    "fat-burning-zone": ["calories-burned", "bmr", "tdee"],
    "one-rep-max": ["calories-burned", "bmi", "body-fat"],
    "unit-converter": ["fuel-cost", "color", "scientific-notation"],
    calculator: ["percentage", "fraction", "exponent"],
    exponent: ["fraction", "percentage", "scientific-notation"],
    age: ["date", "bmi", "retirement"],
  };

  // Related: same category first, then cross-links, up to 4 total
  const sameCat = CALCULATORS.filter(
    (c) => c.category === calc.category && c.slug !== calc.slug
  ).slice(0, 3);
  const crossSlugs = (CROSS_LINKS[calc.slug] ?? []).filter(
    (s) => !sameCat.find((c) => c.slug === s) && s !== calc.slug
  );
  const crossCalcs = crossSlugs
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter(Boolean) as typeof CALCULATORS;
  const related = [...sameCat, ...crossCalcs].slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
            <button onClick={() => navigate("/")} className="hover:text-emerald-600 transition-colors">Home</button>
            <span>/</span>
            <span className={catInfo.color}>{catInfo.label}</span>
            <span>/</span>
            <span className="text-gray-800 font-medium">{calc.title}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All Calculators
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${catInfo.bgColor} ${catInfo.color}`}>
              {catInfo.label}
            </div>
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {calc.title}
            </h1>
            <p className="text-gray-500 leading-relaxed">{calc.description}</p>
          </div>

          {/* Calculator widget */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
            <CalculatorComponent />
          </div>

          {/* What is / Explanation section */}
          {calc.explanation && (
            <section className="mb-8 prose prose-sm max-w-none">
              <h2
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                What is a {calc.title}?
              </h2>
              {calc.explanation.map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3 text-sm">
                  {para}
                </p>
              ))}
            </section>
          )}

          {/* How to Use section */}
          {calc.howTo && (
            <section className="mb-8">
              <h2
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                How to Use the {calc.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{calc.howTo.intro}</p>
              <ol className="space-y-3">
                {calc.howTo.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Ad slot */}
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Advertisement</p>
          </div>

          {/* FAQs */}
          {calc.faqs.length > 0 && (
            <section className="mb-10">
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {calc.faqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>
          )}

          {/* Related calculators */}
          {related.length > 0 && (
            <section className="mt-2">
              <h2
                className="text-xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Related {catInfo.label} Calculators
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((rel) => (
                  <button
                    key={rel.slug}
                    onClick={() => navigate(`/calculator/${rel.slug}`)}
                    className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all text-left group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${rel.color}`}>
                      <Calculator className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">{rel.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{rel.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 flex-shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/")}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                View All Calculators <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </section>
          )}

          {/* Bookmark prompt */}
          <BookmarkPrompt compact />

        </div>
      </main>

      <RecentlyViewed currentSlug={slug} />
      <Footer />
    </div>
  );
}
