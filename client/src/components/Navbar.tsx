/*
 * CalcHQ Navbar — "Clean Utility" Design
 * Top navigation with logo, category dropdowns, and search
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Calculator, ChevronDown, Menu, X } from "lucide-react";
import { CALCULATORS, CATEGORIES, type Category } from "@/lib/calculators";

const NAV_CATEGORIES: Category[] = ["financial", "health", "tools"];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<Category | null>(null);
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-emerald-600 transition-colors">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Calc<span className="text-emerald-500">HQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_CATEGORIES.map((cat) => {
              const calcs = CALCULATORS.filter((c) => c.category === cat);
              const catInfo = CATEGORIES[cat];
              return (
                <div
                  key={cat}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(cat)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                    {catInfo.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === cat ? "rotate-180" : ""}`} />
                  </button>

                  {openDropdown === cat && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-3 py-1.5 mb-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{catInfo.label}</p>
                      </div>
                      {calcs.map((calc) => (
                        <button
                          key={calc.slug}
                          onClick={() => {
                            navigate(`/calculator/${calc.slug}`);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        >
                          {calc.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              All Calculators
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container py-4 space-y-1">
            {NAV_CATEGORIES.map((cat) => {
              const calcs = CALCULATORS.filter((c) => c.category === cat);
              const catInfo = CATEGORIES[cat];
              return (
                <div key={cat}>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{catInfo.label}</p>
                  {calcs.map((calc) => (
                    <button
                      key={calc.slug}
                      onClick={() => {
                        navigate(`/calculator/${calc.slug}`);
                        setMobileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors"
                    >
                      {calc.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
