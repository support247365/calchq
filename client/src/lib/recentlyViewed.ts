const STORAGE_KEY = "calchq_recently_viewed";
const MAX_ITEMS = 5;

export function trackCalculatorView(slug: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: string[] = raw ? JSON.parse(raw) : [];
    const updated = [slug, ...existing.filter((s) => s !== slug)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable in private browsing
  }
}

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
