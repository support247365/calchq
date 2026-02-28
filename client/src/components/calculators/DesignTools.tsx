/**
 * Design & Developer Tools
 * - ColorConverter: HEX <-> RGB <-> HSL <-> CMYK with live preview
 * - NumberBaseConverter: binary, octal, decimal, hexadecimal
 */
import { useState, useCallback } from "react";

// ============================================================
// COLOR CONVERTER
// ============================================================

interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }
interface CMYK { c: number; m: number; y: number; k: number }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 3 && clean.length !== 6) return null;
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  const n = parseInt(full, 16);
  if (isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  const kn = k / 100;
  return {
    r: Math.round(255 * (1 - c / 100) * (1 - kn)),
    g: Math.round(255 * (1 - m / 100) * (1 - kn)),
    b: Math.round(255 * (1 - y / 100) * (1 - kn)),
  };
}

function luminance({ r, g, b }: RGB): number {
  const toLinear = (v: number) => {
    const n = v / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(rgb: RGB): { ratio: number; onWhite: string; onBlack: string } {
  const L = luminance(rgb);
  const white = 1.0, black = 0.0;
  const ratioWhite = (white + 0.05) / (L + 0.05);
  const ratioBlack = (L + 0.05) / (black + 0.05);
  const grade = (r: number) => r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA Large" : "Fail";
  return {
    ratio: Math.round(Math.max(ratioWhite, ratioBlack) * 10) / 10,
    onWhite: grade(ratioWhite),
    onBlack: grade(ratioBlack),
  };
}

const NAMED_COLORS: [string, string][] = [
  ["Red", "#FF0000"], ["Orange", "#FF8000"], ["Yellow", "#FFFF00"],
  ["Lime", "#00FF00"], ["Cyan", "#00FFFF"], ["Blue", "#0000FF"],
  ["Magenta", "#FF00FF"], ["White", "#FFFFFF"], ["Black", "#000000"],
  ["Gray", "#808080"], ["Navy", "#000080"], ["Teal", "#008080"],
  ["Emerald", "#10B981"], ["Violet", "#7C3AED"], ["Rose", "#F43F5E"],
];

export function ColorConverter() {
  const [hex, setHex] = useState("#10B981");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const rgb = hexToRgb(hex) ?? { r: 16, g: 185, b: 129 };
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);
  const contrast = contrastRatio(rgb);
  const textColor = luminance(rgb) > 0.179 ? "#000000" : "#FFFFFF";

  const updateFromHex = (val: string) => {
    setError("");
    const clean = val.startsWith("#") ? val : "#" + val;
    setHex(clean.toUpperCase());
    if (clean.replace("#", "").length > 0 && !hexToRgb(clean)) {
      setError("Invalid hex color");
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setError("");
    const clamped = { r: Math.max(0, Math.min(255, r)), g: Math.max(0, Math.min(255, g)), b: Math.max(0, Math.min(255, b)) };
    setHex(rgbToHex(clamped));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setError("");
    const rgb2 = hslToRgb({ h: Math.max(0, Math.min(360, h)), s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) });
    setHex(rgbToHex(rgb2));
  };

  const updateFromCmyk = (c: number, m: number, y: number, k: number) => {
    setError("");
    const rgb2 = cmykToRgb({ c: Math.max(0, Math.min(100, c)), m: Math.max(0, Math.min(100, m)), y: Math.max(0, Math.min(100, y)), k: Math.max(0, Math.min(100, k)) });
    setHex(rgbToHex(rgb2));
  };

  const copy = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    });
  }, []);

  const validHex = hexToRgb(hex) !== null;

  return (
    <div className="space-y-6">
      {/* Color preview + HEX input */}
      <div className="flex gap-4 items-stretch">
        <div
          className="w-24 h-24 rounded-2xl border border-gray-200 shadow-sm flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors"
          style={{ backgroundColor: validHex ? hex : "#ccc", color: textColor }}
        >
          {validHex ? hex : "?"}
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">HEX</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={validHex ? hex : "#10B981"}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                maxLength={7}
                placeholder="#RRGGBB"
              />
              <button
                onClick={() => copy(hex, "hex")}
                className="px-3 py-2 bg-gray-100 hover:bg-emerald-50 text-xs font-semibold rounded-xl transition-colors"
              >
                {copied === "hex" ? "Copied!" : "Copy"}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>
      </div>

      {/* RGB */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">RGB</p>
          <button onClick={() => copy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "rgb")} className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">
            {copied === "rgb" ? "Copied!" : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["r", "g", "b"] as const).map((ch, i) => (
            <div key={ch}>
              <label className="block text-xs text-gray-500 mb-1">{["Red", "Green", "Blue"][i]} (0-255)</label>
              <input
                type="number"
                value={rgb[ch]}
                min={0} max={255}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  updateFromRgb(ch === "r" ? v : rgb.r, ch === "g" ? v : rgb.g, ch === "b" ? v : rgb.b);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* HSL */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">HSL</p>
          <button onClick={() => copy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "hsl")} className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">
            {copied === "hsl" ? "Copied!" : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {([["h", "Hue", 360], ["s", "Saturation %", 100], ["l", "Lightness %", 100]] as const).map(([ch, label, max]) => (
            <div key={ch}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type="number"
                value={hsl[ch]}
                min={0} max={max}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  updateFromHsl(ch === "h" ? v : hsl.h, ch === "s" ? v : hsl.s, ch === "l" ? v : hsl.l);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CMYK */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">CMYK</p>
          <button onClick={() => copy(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`, "cmyk")} className="text-xs text-gray-400 hover:text-emerald-600 transition-colors">
            {copied === "cmyk" ? "Copied!" : `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(["c", "m", "y", "k"] as const).map((ch, i) => (
            <div key={ch}>
              <label className="block text-xs text-gray-500 mb-1">{["Cyan", "Magenta", "Yellow", "Black"][i]}</label>
              <input
                type="number"
                value={cmyk[ch]}
                min={0} max={100}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  updateFromCmyk(ch === "c" ? v : cmyk.c, ch === "m" ? v : cmyk.m, ch === "y" ? v : cmyk.y, ch === "k" ? v : cmyk.k);
                }}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility contrast */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Accessibility (WCAG Contrast)</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-gray-900">{contrast.ratio}:1</p>
            <p className="text-xs text-gray-500">Contrast Ratio</p>
          </div>
          <div>
            <p className={`text-lg font-bold ${contrast.onWhite === "Fail" ? "text-red-500" : "text-green-600"}`}>{contrast.onWhite}</p>
            <p className="text-xs text-gray-500">On White</p>
          </div>
          <div>
            <p className={`text-lg font-bold ${contrast.onBlack === "Fail" ? "text-red-500" : "text-green-600"}`}>{contrast.onBlack}</p>
            <p className="text-xs text-gray-500">On Black</p>
          </div>
        </div>
      </div>

      {/* Quick color swatches */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Colors</p>
        <div className="flex flex-wrap gap-2">
          {NAMED_COLORS.map(([name, color]) => (
            <button
              key={color}
              onClick={() => updateFromHex(color)}
              title={name}
              className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
              style={{ backgroundColor: color, borderColor: hex === color ? "#10B981" : "transparent" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// NUMBER BASE CONVERTER
// ============================================================

const BASES = [
  { label: "Binary", base: 2, prefix: "0b", placeholder: "e.g. 1010" },
  { label: "Octal", base: 8, prefix: "0o", placeholder: "e.g. 17" },
  { label: "Decimal", base: 10, prefix: "", placeholder: "e.g. 255" },
  { label: "Hexadecimal", base: 16, prefix: "0x", placeholder: "e.g. FF" },
];

const VALID_CHARS: Record<number, RegExp> = {
  2: /^[01]*$/,
  8: /^[0-7]*$/,
  10: /^[0-9]*$/,
  16: /^[0-9A-Fa-f]*$/,
};

function formatBinary(bin: string): string {
  // Group binary in nibbles (4 bits) for readability
  const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, "0");
  return padded.match(/.{1,4}/g)?.join(" ") ?? bin;
}

export function NumberBaseConverter() {
  const [values, setValues] = useState<Record<number, string>>({ 2: "", 8: "", 10: "", 16: "" });
  const [activeBase, setActiveBase] = useState<number>(10);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const handleChange = (base: number, raw: string) => {
    const val = raw.toUpperCase().replace(/\s/g, "");
    setError("");
    if (val === "") {
      setValues({ 2: "", 8: "", 10: "", 16: "" });
      setActiveBase(base);
      return;
    }
    if (!VALID_CHARS[base].test(val)) {
      setError(`Invalid character for base ${base}`);
      setValues((prev) => ({ ...prev, [base]: val }));
      setActiveBase(base);
      return;
    }
    const decimal = parseInt(val, base);
    if (isNaN(decimal) || decimal < 0) {
      setError("Invalid number");
      return;
    }
    if (decimal > 2 ** 53) {
      setError("Number too large (max 2^53)");
      return;
    }
    setActiveBase(base);
    setValues({
      2: decimal.toString(2),
      8: decimal.toString(8),
      10: decimal.toString(10),
      16: decimal.toString(16).toUpperCase(),
    });
  };

  const copy = (base: number, val: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopied(base);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  const decimal = parseInt(values[10] || "0", 10);
  const hasValue = values[10] !== "";

  // Bit length info
  const bitInfo = hasValue ? [
    { label: "8-bit (byte)", max: 255, fits: decimal <= 255 },
    { label: "16-bit", max: 65535, fits: decimal <= 65535 },
    { label: "32-bit", max: 4294967295, fits: decimal <= 4294967295 },
    { label: "64-bit", max: Number.MAX_SAFE_INTEGER, fits: true },
  ] : [];

  return (
    <div className="space-y-5">
      {/* Input fields */}
      {BASES.map(({ label, base, prefix, placeholder }) => (
        <div key={base}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">
              {label} <span className="text-xs font-normal text-gray-400">(base {base})</span>
            </label>
            {values[base] && (
              <button
                onClick={() => copy(base, values[base])}
                className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
              >
                {copied === base ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {prefix && (
              <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-xl text-xs font-mono text-gray-500 border-r-0 rounded-r-none">
                {prefix}
              </span>
            )}
            <input
              type="text"
              value={activeBase === base ? values[base] : values[base]}
              onChange={(e) => handleChange(base, e.target.value)}
              placeholder={placeholder}
              className={`flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase ${
                prefix ? "rounded-l-none" : ""
              } ${activeBase === base ? "bg-emerald-50 border-emerald-200" : "bg-white"}`}
            />
          </div>
          {/* Binary grouping hint */}
          {base === 2 && values[2] && values[2].length > 4 && (
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Grouped: {formatBinary(values[2])}
            </p>
          )}
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      {/* Bit length info */}
      {hasValue && !error && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bit Length Compatibility</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {bitInfo.map(({ label, fits }) => (
              <div key={label} className={`text-center p-2 rounded-lg text-xs font-semibold ${fits ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                {label}<br />
                <span className="font-bold">{fits ? "Fits" : "Overflow"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pt-4 pb-2">Quick Reference Table</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-semibold text-gray-600">Decimal</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600">Binary</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600">Octal</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-600">Hex</th>
              </tr>
            </thead>
            <tbody>
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,32,64,128,255,256,512,1024].map((n) => (
                <tr
                  key={n}
                  onClick={() => handleChange(10, String(n))}
                  className="border-t border-gray-50 hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-1.5 font-mono">{n}</td>
                  <td className="px-3 py-1.5 font-mono text-blue-600">{n.toString(2)}</td>
                  <td className="px-3 py-1.5 font-mono text-purple-600">{n.toString(8)}</td>
                  <td className="px-3 py-1.5 font-mono text-orange-600">{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
