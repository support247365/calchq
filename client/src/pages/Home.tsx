/*
 * CalcHQ Home Page — "Clean Utility" Design
 * Hero with tagline + search, then category sections with calculator cards
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, Calculator, TrendingUp, Heart, Wrench, Sigma } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CALCULATORS, CATEGORIES, type Category } from "@/lib/calculators";

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  financial: <TrendingUp className="w-5 h-5" />,
  health: <Heart className="w-5 h-5" />,
  math: <Sigma className="w-5 h-5" />,
  tools: <Wrench className="w-5 h-5" />,
};

const DISPLAY_CATEGORIES: Category[] = ["financial", "health", "math", "tools"];

export default function Home() {
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return CALCULATORS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 border-b border-gray-100">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Free · Fast · No sign-up required
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Professional Calculator Tools
            </h1>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Fast, accurate, and free — built for speed and privacy. From mortgage payments to calorie counts, find the right calculator instantly.
            </p>

            {/* Search */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search calculators..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Search results */}
            {filtered !== null && (
              <div className="mt-3 max-w-lg bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {filtered.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">No calculators found for "{query}"</div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {filtered.map((calc) => (
                      <li key={calc.slug}>
                        <button
                          onClick={() => navigate(`/calculator/${calc.slug}`)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${calc.color}`}>
                            <Calculator className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{calc.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{calc.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container py-4">
          <div className="flex flex-wrap gap-6 md:gap-10">
            {[
              { value: "32", label: "Free Calculators" },
              { value: "1.3M+", label: "Unique Pages" },
              { value: "100%", label: "Free & Private" },
              { value: "0", label: "Sign-ups Required" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calculator sections */}
      <main className="flex-1 container py-12 space-y-16">
        {DISPLAY_CATEGORIES.map((cat) => {
          const catInfo = CATEGORIES[cat];
          const calcs = CALCULATORS.filter((c) => c.category === cat);
          return (
            <section key={cat}>
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${catInfo.bgColor} ${catInfo.color}`}>
                  {CATEGORY_ICONS[cat]}
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-gray-900"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {catInfo.label} Calculators
                  </h2>
                  <p className="text-sm text-gray-500">{catInfo.description}</p>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {calcs.map((calc) => (
                  <button
                    key={calc.slug}
                    onClick={() => navigate(`/calculator/${calc.slug}`)}
                    className="calc-card group text-left bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${calc.color} transition-transform group-hover:scale-110`}>
                        <Calculator className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all mt-1" />
                    </div>
                    <h3
                      className="font-semibold text-gray-900 mb-1.5 group-hover:text-emerald-700 transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {calc.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{calc.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                      Open Calculator <ArrowRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
