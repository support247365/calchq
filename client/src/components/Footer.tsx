/*
 * CalcHQ Footer — "Clean Utility" Design
 */
import { Link } from "wouter";
import { Calculator } from "lucide-react";
import { CALCULATORS, CATEGORIES, type Category } from "@/lib/calculators";

const FOOTER_CATEGORIES: Category[] = ["financial", "health", "tools"];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Calc<span className="text-emerald-500">HQ</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Free, fast, and accurate calculators for finance, health, math, and more. No sign-up required.
            </p>
          </div>

          {/* Calculator columns */}
          {FOOTER_CATEGORIES.map((cat) => {
            const calcs = CALCULATORS.filter((c) => c.category === cat);
            const catInfo = CATEGORIES[cat];
            return (
              <div key={cat}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{catInfo.label}</h3>
                <ul className="space-y-2">
                  {calcs.map((calc) => (
                    <li key={calc.slug}>
                      <Link
                        href={`/calculator/${calc.slug}`}
                        className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                      >
                        {calc.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} CalcHQ. All calculators are for informational purposes only.
          </p>
          <p className="text-xs text-gray-400">
            Fast · Free · Private · No sign-up required
          </p>
        </div>
      </div>
    </footer>
  );
}
