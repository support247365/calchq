/*
 * CalcHQ — All Calculators Browse Page (/calculators)
 * Full directory with category filter, search, and card grid
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Search, Calculator, ArrowRight, TrendingUp, Heart, Wrench, Sigma } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CALCULATORS, CATEGORIES, type Category } from "@/lib/calculators";

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  financial: <TrendingUp className="w-4 h-4" />,
  health: <Heart className="w-4 h-4" />,
  math: <Sigma className="w-4 h-4" />,
  tools: <Wrench className="w-4 h-4" />,
};

const CATEGORY_ORDER: Category[] = ["financial", "health", "math", "tools"];

export default function AllCalculators() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [, navigate] = useLocation();

  const filtered = useMemo(() => {
    let results = CALCULATORS;
    if (activeCategory !== "all") {
      results = results.filter((c) => c.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return results;
  }, [query, activeCategory]);

  // Group by category for display when no filter active
  const grouped = useMemo(() => {
    if (activeCategory !== "all" || query.trim()) return null;
    return CATEGORY_ORDER.map((cat) => ({
      cat,
      calcs: CALCULATORS.filter((c) => c.category === cat),
    }));
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Page header */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 border-b border-gray-100">
        <div className="container py-10">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            All Calculators
          </h1>
          <p className="text-gray-500 mb-6">
            {CALCULATORS.length} free calculators across finance, health, math, and tools. No sign-up required.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search all calculators..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeCategory === "all"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              All ({CALCULATORS.length})
            </button>
            {CATEGORY_ORDER.map((cat) => {
              const info = CATEGORIES[cat];
              const count = CALCULATORS.filter((c) => c.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeCategory === cat
                      ? `${info.bgColor} ${info.color} border border-transparent`
                      : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  {CATEGORY_ICONS[cat]}
                  {info.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 container py-10">
        {/* Flat filtered results */}
        {(activeCategory !== "all" || query.trim()) && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <Calculator className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">No calculators found for "{query}"</p>
                <button
                  onClick={() => { setQuery(""); setActiveCategory("all"); }}
                  className="mt-4 text-sm text-emerald-600 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((calc) => (
                  <CalcCard key={calc.slug} calc={calc} onNavigate={() => navigate(`/calculator/${calc.slug}`)} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Grouped by category (default view) */}
        {grouped && (
          <div className="space-y-14">
            {grouped.map(({ cat, calcs }) => {
              const info = CATEGORIES[cat];
              return (
                <section key={cat}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${info.bgColor} ${info.color}`}>
                      {CATEGORY_ICONS[cat]}
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold text-gray-900"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {info.label} Calculators
                      </h2>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="ml-auto text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {calcs.map((calc) => (
                      <CalcCard key={calc.slug} calc={calc} onNavigate={() => navigate(`/calculator/${calc.slug}`)} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function CalcCard({ calc, onNavigate }: { calc: (typeof CALCULATORS)[0]; onNavigate: () => void }) {
  return (
    <button
      onClick={onNavigate}
      className="group text-left bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${calc.color} transition-transform group-hover:scale-110`}>
          <Calculator className="w-4 h-4" />
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all mt-0.5" />
      </div>
      <h3
        className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-emerald-700 transition-colors"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {calc.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{calc.description}</p>
    </button>
  );
}
