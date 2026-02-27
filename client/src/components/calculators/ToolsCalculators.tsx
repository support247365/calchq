/**
 * Tools Calculators
 * - RandomNumberGenerator: single number, range, multiple numbers, dice, coin flip
 * - PasswordGenerator: customizable password with strength meter
 */
import { useState, useCallback } from "react";

// ============================================================
// RANDOM NUMBER GENERATOR
// ============================================================

type RNGMode = "single" | "multiple" | "dice" | "coin" | "list";

const RNG_MODES: { key: RNGMode; label: string }[] = [
  { key: "single", label: "Single Number" },
  { key: "multiple", label: "Multiple Numbers" },
  { key: "dice", label: "Roll Dice" },
  { key: "coin", label: "Flip Coin" },
  { key: "list", label: "Pick from List" },
];

const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function RandomNumberGenerator() {
  const [mode, setMode] = useState<RNGMode>("single");

  // Single / Multiple
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("5");
  const [unique, setUnique] = useState(false);
  const [singleResult, setSingleResult] = useState<number | null>(null);
  const [multiResults, setMultiResults] = useState<number[]>([]);

  // Dice
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState("2");
  const [diceResults, setDiceResults] = useState<number[]>([]);

  // Coin
  const [coinCount, setCoinCount] = useState("1");
  const [coinResults, setCoinResults] = useState<string[]>([]);

  // List
  const [listInput, setListInput] = useState("Apple\nBanana\nCherry\nDate\nElderberry");
  const [listCount, setListCount] = useState("1");
  const [listResults, setListResults] = useState<string[]>([]);

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generate = useCallback(() => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);
    const countVal = parseInt(count);

    if (mode === "single") {
      if (isNaN(minVal) || isNaN(maxVal) || minVal > maxVal) return;
      setSingleResult(randInt(minVal, maxVal));
    } else if (mode === "multiple") {
      if (isNaN(minVal) || isNaN(maxVal) || minVal > maxVal || isNaN(countVal) || countVal < 1) return;
      const n = Math.min(countVal, 1000);
      if (unique && n > maxVal - minVal + 1) {
        alert("Cannot generate more unique numbers than the range allows.");
        return;
      }
      if (unique) {
        const pool = Array.from({ length: maxVal - minVal + 1 }, (_, i) => minVal + i);
        const results: number[] = [];
        for (let i = 0; i < n; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          results.push(pool[idx]);
          pool.splice(idx, 1);
        }
        setMultiResults(results);
      } else {
        setMultiResults(Array.from({ length: n }, () => randInt(minVal, maxVal)));
      }
    } else if (mode === "dice") {
      const n = Math.min(parseInt(diceCount) || 1, 20);
      setDiceResults(Array.from({ length: n }, () => randInt(1, diceType)));
    } else if (mode === "coin") {
      const n = Math.min(parseInt(coinCount) || 1, 100);
      setCoinResults(Array.from({ length: n }, () => Math.random() < 0.5 ? "Heads" : "Tails"));
    } else if (mode === "list") {
      const items = listInput.split("\n").map(s => s.trim()).filter(Boolean);
      if (items.length === 0) return;
      const n = Math.min(parseInt(listCount) || 1, items.length);
      const pool = [...items];
      const results: string[] = [];
      for (let i = 0; i < n; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        results.push(pool[idx]);
        pool.splice(idx, 1);
      }
      setListResults(results);
    }
  }, [mode, min, max, count, unique, diceType, diceCount, coinCount, listInput, listCount]);

  const diceEmoji: Record<number, string[]> = {
    6: ["1", "2", "3", "4", "5", "6"],
  };

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2">
        {RNG_MODES.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              mode === m.key
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      {(mode === "single" || mode === "multiple") && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum</label>
              <input
                type="number"
                value={min}
                onChange={e => setMin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum</label>
              <input
                type="number"
                value={max}
                onChange={e => setMax(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          {mode === "multiple" && (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">How many numbers?</label>
                <input
                  type="number"
                  value={count}
                  min="1"
                  max="1000"
                  onChange={e => setCount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <label className="flex items-center gap-2 pb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unique}
                  onChange={e => setUnique(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">No duplicates</span>
              </label>
            </div>
          )}
        </div>
      )}

      {mode === "dice" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dice Type</label>
            <div className="flex flex-wrap gap-2">
              {DICE_TYPES.map(d => (
                <button
                  key={d}
                  onClick={() => setDiceType(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    diceType === d
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  d{d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Dice</label>
            <input
              type="number"
              value={diceCount}
              min="1"
              max="20"
              onChange={e => setDiceCount(e.target.value)}
              className="w-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}

      {mode === "coin" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Flips</label>
          <input
            type="number"
            value={coinCount}
            min="1"
            max="100"
            onChange={e => setCoinCount(e.target.value)}
            className="w-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}

      {mode === "list" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Items (one per line)</label>
            <textarea
              value={listInput}
              onChange={e => setListInput(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter items, one per line..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Pick how many?</label>
            <input
              type="number"
              value={listCount}
              min="1"
              onChange={e => setListCount(e.target.value)}
              className="w-32 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={generate}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl transition-colors shadow-sm"
      >
        {mode === "dice" ? "Roll Dice" : mode === "coin" ? "Flip Coin" : "Generate"}
      </button>

      {/* Results */}
      {mode === "single" && singleResult !== null && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-2">Random Number</p>
          <p className="text-6xl font-bold text-orange-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {singleResult.toLocaleString()}
          </p>
          <p className="text-sm text-orange-400 mt-2">Between {parseInt(min).toLocaleString()} and {parseInt(max).toLocaleString()}</p>
          <button
            onClick={() => copyToClipboard(String(singleResult))}
            className="mt-3 px-4 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      {mode === "multiple" && multiResults.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">{multiResults.length} Random Numbers</p>
            <button
              onClick={() => copyToClipboard(multiResults.join(", "))}
              className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {copied ? "Copied!" : "Copy All"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {multiResults.map((n, i) => (
              <span key={i} className="px-3 py-1.5 bg-white border border-orange-200 rounded-lg text-sm font-semibold text-gray-800">
                {n.toLocaleString()}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-orange-100 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-orange-400">Min</p>
              <p className="text-sm font-semibold text-gray-800">{Math.min(...multiResults).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-orange-400">Max</p>
              <p className="text-sm font-semibold text-gray-800">{Math.max(...multiResults).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-orange-400">Sum</p>
              <p className="text-sm font-semibold text-gray-800">{multiResults.reduce((a, b) => a + b, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {mode === "dice" && diceResults.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-3">
            {diceResults.length}d{diceType} Results
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {diceResults.map((r, i) => (
              <div key={i} className="w-14 h-14 bg-white border-2 border-orange-200 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-orange-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-orange-100 text-center">
            <p className="text-xs text-orange-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {diceResults.reduce((a, b) => a + b, 0)}
            </p>
          </div>
        </div>
      )}

      {mode === "coin" && coinResults.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-3">
            {coinResults.length} Flip{coinResults.length > 1 ? "s" : ""}
          </p>
          {coinResults.length === 1 ? (
            <p className="text-5xl font-bold text-orange-600 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {coinResults[0]}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {coinResults.map((r, i) => (
                  <span key={i} className={`px-3 py-1 rounded-lg text-xs font-bold ${r === "Heads" ? "bg-orange-200 text-orange-800" : "bg-gray-200 text-gray-700"}`}>
                    {r}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-orange-100 text-center">
                <div>
                  <p className="text-xs text-orange-400">Heads</p>
                  <p className="text-lg font-bold text-orange-600">{coinResults.filter(r => r === "Heads").length} ({Math.round(coinResults.filter(r => r === "Heads").length / coinResults.length * 100)}%)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Tails</p>
                  <p className="text-lg font-bold text-gray-600">{coinResults.filter(r => r === "Tails").length} ({Math.round(coinResults.filter(r => r === "Tails").length / coinResults.length * 100)}%)</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {mode === "list" && listResults.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-3">
            {listResults.length === 1 ? "Selected Item" : `${listResults.length} Selected Items`}
          </p>
          <div className="space-y-2">
            {listResults.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-orange-100 rounded-lg px-4 py-2.5">
                <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <span className="font-semibold text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PASSWORD GENERATOR
// ============================================================

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
  similar: "iIlL1oO0",
};

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useDigits: boolean,
  useSymbols: boolean,
  excludeSimilar: boolean
): string {
  let pool = "";
  if (useUpper) pool += CHARS.upper;
  if (useLower) pool += CHARS.lower;
  if (useDigits) pool += CHARS.digits;
  if (useSymbols) pool += CHARS.symbols;
  if (excludeSimilar) {
    for (const c of CHARS.similar) pool = pool.replace(c, "");
  }
  if (!pool) return "";

  let pw = "";
  // Ensure at least one of each required type
  if (useUpper) pw += CHARS.upper[Math.floor(Math.random() * CHARS.upper.length)];
  if (useLower) pw += CHARS.lower[Math.floor(Math.random() * CHARS.lower.length)];
  if (useDigits) pw += CHARS.digits[Math.floor(Math.random() * CHARS.digits.length)];
  if (useSymbols) pw += CHARS.symbols[Math.floor(Math.random() * CHARS.symbols.length)];

  while (pw.length < length) {
    pw += pool[Math.floor(Math.random() * pool.length)];
  }

  // Shuffle
  return pw.split("").sort(() => Math.random() - 0.5).join("").slice(0, length);
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "None", color: "bg-gray-200" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 5) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [count, setCount] = useState(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    const n = Math.min(count, 20);
    const pws = Array.from({ length: n }, () =>
      generatePassword(length, useUpper, useLower, useDigits, useSymbols, excludeSimilar)
    );
    setPasswords(pws);
  };

  const copy = (pw: string, idx: number) => {
    navigator.clipboard.writeText(pw).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  const strength = passwords.length > 0 ? passwordStrength(passwords[0]) : null;

  const poolSize = (() => {
    let n = 0;
    if (useUpper) n += 26;
    if (useLower) n += 26;
    if (useDigits) n += 10;
    if (useSymbols) n += CHARS.symbols.length;
    if (excludeSimilar) n -= Math.min(n, CHARS.similar.length);
    return Math.max(n, 0);
  })();

  const entropy = poolSize > 0 ? Math.floor(length * Math.log2(poolSize)) : 0;

  return (
    <div className="space-y-6">
      {/* Length slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Password Length</label>
          <span className="text-lg font-bold text-orange-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{length}</span>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={e => setLength(parseInt(e.target.value))}
          className="w-full accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>4</span>
          <span>16</span>
          <span>32</span>
          <span>64</span>
        </div>
      </div>

      {/* Character options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Character Types</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Uppercase (A-Z)", value: useUpper, set: setUseUpper, example: "ABC" },
            { label: "Lowercase (a-z)", value: useLower, set: setUseLower, example: "abc" },
            { label: "Numbers (0-9)", value: useDigits, set: setUseDigits, example: "123" },
            { label: "Symbols (!@#...)", value: useSymbols, set: setUseSymbols, example: "!@#" },
          ].map(opt => (
            <label key={opt.label} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${opt.value ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}`}>
              <input
                type="checkbox"
                checked={opt.value}
                onChange={e => opt.set(e.target.checked)}
                className="w-4 h-4 accent-orange-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                <p className="text-xs text-gray-400 font-mono">{opt.example}</p>
              </div>
            </label>
          ))}
        </div>
        <label className="flex items-center gap-3 mt-3 p-3 rounded-xl border cursor-pointer transition-colors bg-gray-50 border-gray-200">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={e => setExcludeSimilar(e.target.checked)}
            className="w-4 h-4 accent-orange-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">Exclude similar characters</p>
            <p className="text-xs text-gray-400 font-mono">i, I, l, L, 1, o, O, 0</p>
          </div>
        </label>
      </div>

      {/* Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Generate how many?</label>
        <div className="flex gap-2">
          {[1, 3, 5, 10].map(n => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${count === n ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-700"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={generate}
        disabled={!useUpper && !useLower && !useDigits && !useSymbols}
        className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold text-lg rounded-xl transition-colors shadow-sm"
      >
        Generate Password{count > 1 ? "s" : ""}
      </button>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="space-y-3">
          {/* Strength meter (based on first password) */}
          {strength && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password Strength</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${strength.color}`}>{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${strength.color}`}
                  style={{ width: `${Math.min(100, (strength.score / 7) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Entropy: ~{entropy} bits</span>
                <span>Pool: {poolSize} characters</span>
              </div>
            </div>
          )}

          {/* Password list */}
          <div className="space-y-2">
            {passwords.map((pw, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                <span className="flex-1 font-mono text-sm text-gray-800 break-all">{pw}</span>
                <button
                  onClick={() => copy(pw, i)}
                  className="flex-shrink-0 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  {copiedIdx === i ? "Copied!" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
