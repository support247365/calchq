/*
 * CalcHQ Calculator Page — "Clean Utility" Design
 * Individual calculator page with the calculator widget, description, FAQs, and SEO
 */
import { useParams, useLocation } from "wouter";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCalculatorBySlug, CATEGORIES } from "@/lib/calculators";
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
  // Financial expansion
  percentage: PercentageCalculator,
  "compound-interest": CompoundInterestCalculator,
  retirement: RetirementCalculator,
  paycheck: PaycheckCalculator,
  roi: ROICalculator,
  refinance: RefinanceCalculator,
  // Health expansion
  pregnancy: PregnancyCalculator,
  ovulation: OvulationCalculator,
  "calorie-deficit": CalorieDeficitCalculator,
  "ideal-weight": IdealWeightCalculator,
  sleep: SleepCalculator,
  // Tools expansion
  age: AgeCalculator,
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

  // Update page title and meta description for SEO
  useEffect(() => {
    if (calc) {
      document.title = `${calc.title} — Free Online Calculator | CalcHQ`;
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        (metaDesc as HTMLMetaElement).name = 'description';
        document.head.appendChild(metaDesc);
      }
      (metaDesc as HTMLMetaElement).content = `${calc.description} Free, fast, and accurate. No sign-up required.`;

      // Inject FAQ structured data
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) existingScript.remove();
      if (calc.faqs.length > 0) {
        const schema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": calc.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer,
            },
          })),
        };
        const script = document.createElement('script');
        script.id = 'faq-schema';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      }
    }
    return () => {
      document.title = 'CalcHQ - Free Online Calculators for Finance, Health & Math';
      const existingScript = document.getElementById('faq-schema');
      if (existingScript) existingScript.remove();
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
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
          <div className="mb-8">
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

          {/* Ad placeholder — replace with AdSense unit */}
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Advertisement</p>
          </div>

          {/* FAQs */}
          {calc.faqs.length > 0 && (
            <section>
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
          <section className="mt-10">
            <h2
              className="text-xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              More {catInfo.label} Calculators
            </h2>
            <div className="flex flex-wrap gap-2">
              {/* Rendered by parent via category */}
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors"
              >
                View All Calculators →
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
