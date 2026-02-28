/**
 * BookmarkPrompt
 *
 * Two modes:
 * 1. If the browser fires the `beforeinstallprompt` event (Chrome/Edge/Android),
 *    show an "Add to Home Screen" button that triggers the native install dialog.
 * 2. Otherwise, show a lightweight "Bookmark this page" banner with keyboard
 *    shortcut hints for all major browsers/OS combinations.
 *
 * Usage:
 *   <BookmarkPrompt />            -- full banner (homepage, footer)
 *   <BookmarkPrompt compact />    -- small inline strip (bottom of calculator pages)
 */

import { useEffect, useState } from "react";
import { Bookmark, Download, X } from "lucide-react";

interface Props {
  compact?: boolean;
}

type OS = "mac" | "windows" | "ios" | "android" | "other";
type Browser = "chrome" | "firefox" | "safari" | "edge" | "other";

function detectOS(): OS {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Mac/.test(ua)) return "mac";
  if (/Win/.test(ua)) return "windows";
  return "other";
}

function detectBrowser(): Browser {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "edge";
  if (/Chrome\//.test(ua)) return "chrome";
  if (/Firefox\//.test(ua)) return "firefox";
  if (/Safari\//.test(ua)) return "safari";
  return "other";
}

function getBookmarkHint(os: OS, browser: Browser): string {
  if (os === "ios") return "Tap the Share button, then \"Add to Home Screen\"";
  if (os === "android") return "Tap the menu (3 dots), then \"Add to Home screen\"";
  if (os === "mac") {
    if (browser === "safari") return "Press Cmd+D or go to Bookmarks > Add Bookmark";
    if (browser === "firefox") return "Press Cmd+D to bookmark this page";
    return "Press Cmd+D to bookmark this page";
  }
  if (os === "windows") {
    if (browser === "firefox") return "Press Ctrl+D to bookmark this page";
    return "Press Ctrl+D to bookmark this page";
  }
  return "Press Ctrl+D (Windows) or Cmd+D (Mac) to bookmark";
}

// Store the deferred prompt globally so it survives re-renders
let deferredPrompt: Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> } | null = null;

export default function BookmarkPrompt({ compact = false }: Props) {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [os, setOs] = useState<OS>("other");
  const [browser, setBrowser] = useState<Browser>("other");

  useEffect(() => {
    setOs(detectOS());
    setBrowser(detectBrowser());

    // Check if already dismissed this session
    if (sessionStorage.getItem("bpDismissed")) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as typeof deferredPrompt;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setCanInstall(false);
      deferredPrompt = null;
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setCanInstall(false);
    }
    deferredPrompt = null;
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("bpDismissed", "1");
  };

  if (dismissed || installed) return null;

  const hint = getBookmarkHint(os, browser);

  // ---- COMPACT MODE (bottom of calculator pages) ----
  if (compact) {
    return (
      <div className="mt-8 flex items-center justify-between gap-4 bg-emerald-50 border border-emerald-100 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Bookmark className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="text-sm text-emerald-800">
            {canInstall ? (
              <span>Add CalcHQ to your home screen for instant access.</span>
            ) : (
              <span>{hint} to come back quickly.</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canInstall && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Add to Home Screen
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 text-emerald-400 hover:text-emerald-700 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---- FULL BANNER MODE (homepage) ----
  return (
    <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl px-6 py-5">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-emerald-300 hover:text-emerald-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          {canInstall ? (
            <Download className="w-5 h-5 text-emerald-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm mb-0.5">
            {canInstall ? "Install CalcHQ on your device" : "Bookmark CalcHQ for quick access"}
          </p>
          <p className="text-sm text-gray-500">
            {canInstall
              ? "Add CalcHQ to your home screen for one-tap access to all 39 calculators -- no app store required."
              : hint}
          </p>
          {canInstall && (
            <button
              onClick={handleInstall}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Add to Home Screen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
