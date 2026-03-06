/**
 * ZIP Code Calculator Page — Programmatic SEO Template
 * URL: /calculator/:slug/:zip
 * Example: /calculator/mortgage/32765
 * 
 * Each page is unique with:
 * - Local city/state context
 * - Live weather (from Open-Meteo API)
 * - Current local time
 * - Census median income & home value
 * - Calculator pre-loaded and ready
 * - Full SEO content: explanation, how-to, FAQs, related calculators
 */
import { useParams, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Calculator, MapPin, Clock, Cloud, TrendingUp, Home } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCalculatorBySlug, CALCULATORS, CATEGORIES } from "@/lib/calculators";
import { trpc } from "@/lib/trpc";
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
};

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800 pr-4">{question}</span>
        <span className={`text-gray-400 flex-shrink-0 transition-transform text-lg ${open ? "rotate-180 inline-block" : ""}`}>›</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function ZipCalculatorPage() {
  const params = useParams<{ slug: string; zip: string }>();
  const [, navigate] = useLocation();
  const slug = params.slug;
  const zip = params.zip;

  const calc = getCalculatorBySlug(slug);
  const CalculatorComponent = slug ? CALCULATOR_COMPONENTS[slug] : undefined;

  const { data: zipData, isLoading } = trpc.zip.getByZip.useQuery(
    { zip: zip || '' },
    { enabled: !!zip && zip.length === 5 }
  );

  const { data: nearbyZips } = trpc.zip.getNearby.useQuery(
    { zip: zip || '', limit: 10 },
    { enabled: !!zip && zip.length === 5 }
  );

  // Inject SEO meta tags
  useEffect(() => {
    if (!calc || !zipData) return;
    const cityState = `${zipData.city}, ${zipData.stateName}`;
    document.title = `${calc.title} for ${cityState} (${zip}) — CalcHQ`;
    
    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `Free ${calc.title.toLowerCase()} for ${cityState}. Current weather: ${zipData.weather?.description || 'N/A'}, ${zipData.weather?.tempF || 'N/A'}°F. Local time: ${zipData.localTime}. Median household income: ${formatCurrency(zipData.medianIncome || 0)}. No sign-up required.`;

    // Structured data
    document.getElementById('zip-schema')?.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `${calc.title} for ${cityState}`,
      "description": metaDesc.content,
      "url": `https://calchq.io/calculator/${slug}/${zip}`,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calchq.io" },
          { "@type": "ListItem", "position": 2, "name": calc.title, "item": `https://calchq.io/calculator/${slug}` },
          { "@type": "ListItem", "position": 3, "name": cityState, "item": `https://calchq.io/calculator/${slug}/${zip}` },
        ]
      }
    };
    const s = document.createElement('script');
    s.id = 'zip-schema';
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);

    return () => {
      document.title = 'CalcHQ - Free Online Calculators for Finance, Health & Math';
      document.getElementById('zip-schema')?.remove();
    };
  }, [calc, zipData, slug, zip]);

  if (!calc || !CalculatorComponent) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 container py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Calculator Not Found
          </h1>
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All Calculators
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const catInfo = CATEGORIES[calc.category];
  const related = CALCULATORS.filter(c => c.category === calc.category && c.slug !== slug).slice(0, 4);
  const cityState = zipData ? `${zipData.city}, ${zipData.stateName}` : zip;
  const isFinancial = calc.category === 'financial';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap" aria-label="Breadcrumb">
            <button onClick={() => navigate("/")} className="hover:text-emerald-600 transition-colors">Home</button>
            <span>/</span>
            <span className={catInfo.color}>{catInfo.label}</span>
            <span>/</span>
            <button onClick={() => navigate(`/calculator/${slug}`)} className="hover:text-emerald-600 transition-colors">{calc.title}</button>
            <span>/</span>
            <span className="text-gray-800 font-medium">{cityState}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1 container py-10">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(`/calculator/${slug}`)}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {calc.title}
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${catInfo.bgColor} ${catInfo.color}`}>
              <MapPin className="w-3 h-3" /> {catInfo.label}
            </div>
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {calc.title} for {isLoading ? `ZIP Code ${zip}` : cityState}
            </h1>
            <p className="text-gray-500 leading-relaxed">
              {isLoading
                ? `Loading local data for ZIP code ${zip}...`
                : `Free ${calc.title.toLowerCase()} for residents of ${cityState} (ZIP ${zip}). ${calc.description}`
              }
            </p>
          </div>

          {/* Local context cards */}
          {zipData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {/* Local Time */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Local Time
                </div>
                <p className="text-sm font-bold text-gray-900">{zipData.localTime}</p>
                <p className="text-xs text-gray-400 mt-0.5">{zipData.timezone?.replace('America/', '').replace('_', ' ')}</p>
              </div>

              {/* Weather */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Cloud className="w-3.5 h-3.5" /> Weather
                </div>
                {zipData.weather ? (
                  <>
                    <p className="text-sm font-bold text-gray-900">{zipData.weather.tempF}°F</p>
                    <p className="text-xs text-gray-400 mt-0.5">{zipData.weather.description}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Unavailable</p>
                )}
              </div>

              {/* Median Income */}
              {isFinancial && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Median Income
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(zipData.medianIncome || 0)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">per year</p>
                </div>
              )}

              {/* Median Home Value */}
              {isFinancial && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Home className="w-3.5 h-3.5" /> Median Home
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatCurrency(zipData.medianHomeValue || 0)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">home value</p>
                </div>
              )}

              {/* For health calculators, show humidity and wind instead */}
              {!isFinancial && zipData.weather && (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <Cloud className="w-3.5 h-3.5" /> Humidity
                    </div>
                    <p className="text-sm font-bold text-gray-900">{zipData.weather.humidity}%</p>
                    <p className="text-xs text-gray-400 mt-0.5">relative</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <Cloud className="w-3.5 h-3.5" /> Wind
                    </div>
                    <p className="text-sm font-bold text-gray-900">{zipData.weather.windMph} mph</p>
                    <p className="text-xs text-gray-400 mt-0.5">speed</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Calculator widget */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
            <CalculatorComponent />
          </div>

          {/* Local context paragraph */}
          {zipData && (
            <section className="mb-8 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <h2
                className="text-base font-bold text-emerald-800 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Using This {calc.title} in {zipData.city}, {zipData.stateName}
              </h2>
              <p className="text-sm text-emerald-700 leading-relaxed">
                {isFinancial
                  ? `Residents of ${zipData.city}, ${zipData.stateName} (ZIP ${zip}) have a median household income of ${formatCurrency(zipData.medianIncome || 0)} per year and a median home value of ${formatCurrency(zipData.medianHomeValue || 0)}. ${zipData.county ? `${zipData.city} is located in ${zipData.county} County. ` : ''}Use this ${calc.title.toLowerCase()} to make informed financial decisions based on local economic conditions.`
                  : `${zipData.city}, ${zipData.stateName} (ZIP ${zip}) is located in the ${zipData.timezone?.replace('America/', '').replace('_', ' ')} timezone. Current local time is ${zipData.localTime}${zipData.weather ? ` and the current weather is ${zipData.weather.description} at ${zipData.weather.tempF}°F` : ''}. ${zipData.county ? `${zipData.city} is in ${zipData.county} County. ` : ''}Use this free ${calc.title.toLowerCase()} for accurate, instant results.`
                }
              </p>
            </section>
          )}

          {/* Explanation */}
          {(calc as any).explanation && (
            <section className="mb-8">
              <h2
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                What is a {calc.title}?
              </h2>
              {((calc as any).explanation as string[]).map((para: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-3 text-sm">{para}</p>
              ))}
            </section>
          )}

          {/* How to Use */}
          {(calc as any).howTo && (
            <section className="mb-8">
              <h2
                className="text-xl font-bold text-gray-900 mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                How to Use the {calc.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{(calc as any).howTo.intro}</p>
              <ol className="space-y-3">
                {((calc as any).howTo.steps as { title: string; text: string }[]).map((step, i) => (
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

          {/* Ezoic Ad Slot 101 — Below Calculator */}
          <div id="ezoic-pub-ad-placeholder-101" className="mb-8" />

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
                {/* ZIP-specific FAQ */}
                {zipData && (
                  <FAQItem
                    question={`Is this ${calc.title.toLowerCase()} accurate for ${zipData.city}, ${zipData.stateName}?`}
                    answer={`Yes. This ${calc.title.toLowerCase()} uses standard formulas that apply nationwide. For ${zipData.city}, ${zipData.stateName} specifically, we display the local median household income (${formatCurrency(zipData.medianIncome || 0)}) and ${isFinancial ? `median home value (${formatCurrency(zipData.medianHomeValue || 0)})` : `current weather conditions`} to help you contextualize your results within local economic conditions.`}
                  />
                )}
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
                More {catInfo.label} Calculators for {zipData?.city || zip}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((rel) => (
                  <button
                    key={rel.slug}
                    onClick={() => navigate(zip ? `/calculator/${rel.slug}/${zip}` : `/calculator/${rel.slug}`)}
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
            </section>
          )}
          {/* Nearby ZIP Codes — internal linking for SEO */}
          {nearbyZips && nearbyZips.length > 0 && (
            <section className="mt-10 pt-8 border-t border-gray-100">
              <h2
                className="text-xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Nearby ZIP Codes
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Use the {calc?.title} for ZIP codes near {zipData?.city || zip}:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {nearbyZips.map((nearby) => (
                  <button
                    key={nearby.zip}
                    onClick={() => navigate(`/calculator/${slug}/${nearby.zip}`)}
                    className="flex flex-col items-start p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-all text-left group"
                  >
                    <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{nearby.zip}</span>
                    <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">{nearby.city}, {nearby.state}</span>
                    <span className="text-xs text-gray-400 mt-1">{nearby.dist_miles} mi away</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
