/**
 * Math Converters
 * - ScientificNotationConverter: decimal <-> scientific notation, engineering notation
 * - RomanNumeralConverter: decimal <-> Roman numerals with step-by-step breakdown
 */
import { useState } from "react";

// ============================================================
// SCIENTIFIC NOTATION CONVERTER
// ============================================================

type SciMode = "toSci" | "toDecimal" | "engineering";

function toScientific(num: number): { coefficient: number; exponent: number; formatted: string } {
  if (num === 0) return { coefficient: 0, exponent: 0, formatted: "0" };
  const exp = Math.floor(Math.log10(Math.abs(num)));
  const coeff = num / Math.pow(10, exp);
  const formatted = `${parseFloat(coeff.toPrecision(10))} x 10^${exp}`;
  return { coefficient: coeff, exponent: exp, formatted };
}

function toEngineering(num: number): { coefficient: number; exponent: number; formatted: string } {
  if (num === 0) return { coefficient: 0, exponent: 0, formatted: "0" };
  const exp = Math.floor(Math.log10(Math.abs(num)));
  const engExp = Math.floor(exp / 3) * 3;
  const coeff = num / Math.pow(10, engExp);
  const formatted = `${parseFloat(coeff.toPrecision(10))} x 10^${engExp}`;
  return { coefficient: coeff, exponent: engExp, formatted };
}

const SI_PREFIXES: Record<number, string> = {
  24: "yotta (Y)",
  21: "zetta (Z)",
  18: "exa (E)",
  15: "peta (P)",
  12: "tera (T)",
  9: "giga (G)",
  6: "mega (M)",
  3: "kilo (k)",
  0: "(base unit)",
  "-3": "milli (m)",
  "-6": "micro (mu)",
  "-9": "nano (n)",
  "-12": "pico (p)",
  "-15": "femto (f)",
  "-18": "atto (a)",
};

export function ScientificNotationConverter() {
  const [mode, setMode] = useState<SciMode>("toSci");
  const [input, setInput] = useState("");
  const [sciCoeff, setSciCoeff] = useState("1.5");
  const [sciExp, setSciExp] = useState("3");
  const [result, setResult] = useState<string | null>(null);
  const [details, setDetails] = useState<string[]>([]);
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    setResult(null);
    setDetails([]);

    if (mode === "toSci") {
      const num = parseFloat(input);
      if (isNaN(num)) { setError("Please enter a valid number."); return; }
      const sci = toScientific(num);
      const eng = toEngineering(num);
      const siLabel = SI_PREFIXES[eng.exponent] || "";
      setResult(sci.formatted);
      setDetails([
        `Standard form: ${num.toLocaleString("en-US", { maximumSignificantDigits: 15 })}`,
        `Scientific notation: ${sci.formatted}`,
        `Engineering notation: ${eng.formatted}`,
        siLabel ? `SI prefix at 10^${eng.exponent}: ${siLabel}` : "",
        `Coefficient: ${parseFloat(sci.coefficient.toPrecision(10))}`,
        `Exponent: ${sci.exponent}`,
        `Absolute value: ${Math.abs(num).toLocaleString()}`,
      ].filter(Boolean));
    } else if (mode === "toDecimal") {
      const c = parseFloat(sciCoeff);
      const e = parseInt(sciExp);
      if (isNaN(c) || isNaN(e)) { setError("Please enter valid coefficient and exponent."); return; }
      const num = c * Math.pow(10, e);
      const formatted = num.toLocaleString("en-US", { maximumSignificantDigits: 15 });
      setResult(formatted);
      setDetails([
        `${c} x 10^${e}`,
        `= ${c} x ${Math.pow(10, e).toLocaleString()}`,
        `= ${formatted}`,
        e >= 0 ? `This is a large number with ${Math.floor(Math.log10(Math.abs(num))) + 1} digits.` : `This is a small decimal number.`,
      ]);
    } else {
      const num = parseFloat(input);
      if (isNaN(num)) { setError("Please enter a valid number."); return; }
      const eng = toEngineering(num);
      const sci = toScientific(num);
      const siLabel = SI_PREFIXES[eng.exponent] || "";
      setResult(eng.formatted);
      setDetails([
        `Standard form: ${num.toLocaleString("en-US", { maximumSignificantDigits: 15 })}`,
        `Engineering notation: ${eng.formatted}`,
        `Scientific notation: ${sci.formatted}`,
        siLabel ? `SI prefix: 10^${eng.exponent} = ${siLabel}` : "",
        `Note: Engineering notation uses exponents divisible by 3 (matching SI prefixes).`,
      ].filter(Boolean));
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "toSci" as SciMode, label: "Number to Scientific" },
          { key: "toDecimal" as SciMode, label: "Scientific to Number" },
          { key: "engineering" as SciMode, label: "Engineering Notation" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setResult(null); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === m.key
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-violet-50 hover:text-violet-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {(mode === "toSci" || mode === "engineering") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Enter a number (e.g. 0.000045, 6020000000)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder="e.g. 299792458"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      )}

      {mode === "toDecimal" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Enter a number in the form: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">coefficient x 10^exponent</span></p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Coefficient</label>
              <input
                type="text"
                value={sciCoeff}
                onChange={(e) => setSciCoeff(e.target.value)}
                placeholder="e.g. 6.022"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exponent (power of 10)</label>
              <input
                type="text"
                value={sciExp}
                onChange={(e) => setSciExp(e.target.value)}
                placeholder="e.g. 23"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>}

      <button
        onClick={convert}
        className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg rounded-xl transition-colors shadow-sm"
      >
        Convert
      </button>

      {result && (
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-2">Result</p>
          <p className="text-2xl font-bold text-violet-700 font-mono break-all" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {result}
          </p>
          {details.length > 0 && (
            <div className="mt-4 pt-4 border-t border-violet-100 space-y-1.5">
              {details.map((d, i) => (
                <p key={i} className="text-sm text-gray-600">{d}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Common Scientific Notation Examples</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            ["Speed of light", "2.998 x 10^8 m/s"],
            ["Avogadro's number", "6.022 x 10^23"],
            ["Electron charge", "1.602 x 10^-19 C"],
            ["Earth's mass", "5.972 x 10^24 kg"],
            ["Planck's constant", "6.626 x 10^-34 J*s"],
            ["1 nanometer", "1 x 10^-9 m"],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between gap-2">
              <span className="text-gray-500">{label}</span>
              <span className="font-mono text-gray-800 font-semibold">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ROMAN NUMERAL CONVERTER
// ============================================================

const ROMAN_VALUES: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num: number): { result: string; steps: string[] } {
  if (num < 1 || num > 3999) return { result: "", steps: [] };
  let n = num;
  let result = "";
  const steps: string[] = [];
  for (const [val, sym] of ROMAN_VALUES) {
    while (n >= val) {
      result += sym;
      steps.push(`${n} >= ${val} -> add ${sym} (remaining: ${n - val})`);
      n -= val;
    }
  }
  return { result, steps };
}

function fromRoman(str: string): { result: number; steps: string[]; error: string } {
  const s = str.toUpperCase().trim();
  if (!s) return { result: 0, steps: [], error: "" };

  const validChars = /^[IVXLCDM]+$/;
  if (!validChars.test(s)) return { result: 0, steps: [], error: "Invalid characters. Only I, V, X, L, C, D, M are allowed." };

  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  const steps: string[] = [];

  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]];
    const next = map[s[i + 1]];
    if (next && curr < next) {
      steps.push(`${s[i]}(${curr}) before ${s[i + 1]}(${next}) -> subtract: -${curr}`);
      total -= curr;
    } else {
      steps.push(`${s[i]} = ${curr} -> add: +${curr}`);
      total += curr;
    }
  }

  return { result: total, steps, error: "" };
}

type RomanMode = "toRoman" | "fromRoman";

export function RomanNumeralConverter() {
  const [mode, setMode] = useState<RomanMode>("toRoman");
  const [numberInput, setNumberInput] = useState("");
  const [romanInput, setRomanInput] = useState("");
  const [result, setResult] = useState<{ value: string; steps: string[]; error: string } | null>(null);

  const convert = () => {
    if (mode === "toRoman") {
      const n = parseInt(numberInput);
      if (isNaN(n) || n < 1 || n > 3999) {
        setResult({ value: "", steps: [], error: "Please enter a whole number between 1 and 3,999." });
        return;
      }
      const { result: roman, steps } = toRoman(n);
      setResult({ value: roman, steps, error: "" });
    } else {
      const { result: num, steps, error } = fromRoman(romanInput);
      if (error) { setResult({ value: "", steps: [], error }); return; }
      if (!romanInput.trim()) { setResult(null); return; }
      setResult({ value: num.toLocaleString(), steps, error: "" });
    }
  };

  // Quick reference table
  const QUICK_REF = [
    [1, "I"], [4, "IV"], [5, "V"], [9, "IX"], [10, "X"],
    [40, "XL"], [50, "L"], [90, "XC"], [100, "C"], [400, "CD"],
    [500, "D"], [900, "CM"], [1000, "M"],
  ];

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-2">
        {[
          { key: "toRoman" as RomanMode, label: "Number to Roman" },
          { key: "fromRoman" as RomanMode, label: "Roman to Number" },
        ].map((m) => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setResult(null); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              mode === m.key
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-violet-50 hover:text-violet-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Input */}
      {mode === "toRoman" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Enter a number (1 to 3,999)
          </label>
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            min="1"
            max="3999"
            placeholder="e.g. 2024"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Enter Roman numerals (e.g. MMXXIV)
          </label>
          <input
            type="text"
            value={romanInput}
            onChange={(e) => setRomanInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder="e.g. MCMXCIX"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase"
          />
        </div>
      )}

      <button
        onClick={convert}
        className="w-full py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg rounded-xl transition-colors shadow-sm"
      >
        Convert
      </button>

      {result && (
        <div className={`rounded-xl p-5 ${result.error ? "bg-red-50 border border-red-100" : "bg-violet-50 border border-violet-100"}`}>
          {result.error ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <>
              <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-2">Result</p>
              <p className="text-4xl font-bold text-violet-700 font-mono" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {result.value}
              </p>
              {result.steps.length > 0 && (
                <div className="mt-4 pt-4 border-t border-violet-100">
                  <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-2">Step-by-step breakdown</p>
                  <div className="space-y-1">
                    {result.steps.map((step, i) => (
                      <p key={i} className="text-xs font-mono text-gray-600 bg-white/60 px-3 py-1.5 rounded-lg">{step}</p>
                    ))}
                  </div>
                  {mode === "fromRoman" && (
                    <p className="mt-2 text-sm font-semibold text-violet-700">
                      Total: {result.value}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Roman Numeral Reference</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {QUICK_REF.map(([num, roman]) => (
            <button
              key={roman}
              onClick={() => {
                if (mode === "toRoman") {
                  setNumberInput(String(num));
                } else {
                  setRomanInput(String(roman));
                }
              }}
              className="flex flex-col items-center p-2 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors cursor-pointer"
            >
              <span className="text-sm font-bold text-violet-700 font-mono">{roman}</span>
              <span className="text-xs text-gray-500">{num}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Click any symbol to auto-fill the input.</p>
      </div>
    </div>
  );
}
