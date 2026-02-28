import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Clock, ArrowRight } from "lucide-react";
import { getCalculatorBySlug } from "@/lib/calculators";
import { getRecentlyViewed } from "@/lib/recentlyViewed";

export { trackCalculatorView } from "@/lib/recentlyViewed";

export function RecentlyViewed({ currentSlug }: { currentSlug?: string }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [, navigate] = useLocation();

  useEffect(() => {
    const all = getRecentlyViewed();
    setSlugs(all.filter((s) => s !== currentSlug).slice(0, 4));
  }, [currentSlug]);

  if (slugs.length === 0) return null;

  const calcs = slugs
    .map((s) => getCalculatorBySlug(s))
    .filter(Boolean) as ReturnType<typeof getCalculatorBySlug>[];

  if (calcs.length === 0) return null;

  return (
    <div className="bg-gray-50 border-t border-gray-100 py-4">
      <div className="container">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recently Viewed</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {calcs.map((calc) => (
            <button
              key={calc!.slug}
              onClick={() => navigate(`/calculator/${calc!.slug}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:border-emerald-300 hover:text-emerald-700 transition-colors shadow-sm"
            >
              {calc!.title}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecentlyViewedHomeBanner() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [, navigate] = useLocation();

  useEffect(() => {
    setSlugs(getRecentlyViewed().slice(0, 5));
  }, []);

  if (slugs.length === 0) return null;

  const calcs = slugs
    .map((s) => getCalculatorBySlug(s))
    .filter(Boolean) as ReturnType<typeof getCalculatorBySlug>[];

  if (calcs.length === 0) return null;

  return (
    <div className="bg-emerald-50 border-y border-emerald-100 py-4">
      <div className="container">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Recently Viewed</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {calcs.map((calc) => (
            <button
              key={calc!.slug}
              onClick={() => navigate(`/calculator/${calc!.slug}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors shadow-sm"
            >
              {calc!.title}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
