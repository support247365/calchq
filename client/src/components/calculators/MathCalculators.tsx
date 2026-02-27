/**
 * Math Calculators
 * - FractionCalculator: add, subtract, multiply, divide, simplify fractions
 * - ExponentCalculator: square root, nth root, powers, exponents
 */
import { useState } from "react";

// --- Helpers ----------------------------------------------------------------

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(Math.abs(num), Math.abs(den));
  const sign = den < 0 ? -1 : 1;
  return [(sign * num) / g, (sign * den) / g];
}

function formatFraction(num: number, den: number): string {
  if (den === 1) return String(num);
  if (num === 0) return "0";
  return `${num}/${den}`;
}

function toMixedNumber(num: number, den: number): string {
  if (den === 1) return String(num);
  const whole = Math.trunc(num / den);
  const remainder = Math.abs(num % den);
  if (remainder === 0) return String(whole);
  if (whole === 0) return `${num}/${den}`;
  return `${whole} ${remainder}/${den}`;
}

// --- Fraction Calculator -----------------------------------------------------

type FractionOp = "add" | "subtract" | "multiply" | "divide" | "simplify";

const OP_LABELS: Record<FractionOp, string> = {
  add: "Add (+)",
  subtract: "Subtract (-)",
  multiply: "Multiply (x)",
  divide: "Divide (/)",
  simplify: "Simplify",
};

const OP_SYMBOLS: Record<FractionOp, string> = {
  add: "+",
  subtract: "-",
  multiply: "x",
  divide: "/",
  simplify: "",
};

interface FractionInputProps {
  num: string;
  den: string;
  onNum: (v: string) => void;
  onDen: (v: string) => void;
  label: string;
}

function FractionInput({ num, den, onNum, onDen, label }: FractionInputProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
      <input
        type="number"
        value={num}
        onChange={e => onNum(e.target.value)}
        placeholder="0"
        className="w-20 text-center px-2 py-2 border border-gray-200 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <div className="w-20 h-0.5 bg-gray-800 rounded" />
      <input
        type="number"
        value={den}
        onChange={e => onDen(e.target.value)}
        placeholder="1"
        className="w-20 text-center px-2 py-2 border border-gray-200 rounded-lg text-base font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );
}

export function FractionCalculator() {
  const [op, setOp] = useState<FractionOp>("add");
  const [n1, setN1] = useState("1");
  const [d1, setD1] = useState("2");
  const [n2, setN2] = useState("1");
  const [d2, setD2] = useState("3");

  const num1 = parseInt(n1) || 0;
  const den1 = parseInt(d1) || 1;
  const num2 = parseInt(n2) || 0;
  const den2 = parseInt(d2) || 1;

  let resultNum = 0;
  let resultDen = 1;
  let error = "";
  let steps: string[] = [];

  if (op === "simplify") {
    if (den1 === 0) {
      error = "Denominator cannot be zero.";
    } else {
      const [sn, sd] = simplify(num1, den1);
      resultNum = sn;
      resultDen = sd;
      const g = gcd(Math.abs(num1), Math.abs(den1));
      steps = [
        `Find GCD of ${Math.abs(num1)} and ${Math.abs(den1)}: GCD = ${g}`,
        `Divide numerator and denominator by ${g}`,
        `${num1} / ${g} = ${num1 / g}, ${den1} / ${g} = ${den1 / g}`,
        `Result: ${formatFraction(sn, sd)}`,
      ];
    }
  } else if (den1 === 0 || den2 === 0) {
    error = "Denominator cannot be zero.";
  } else {
    if (op === "add") {
      const l = lcm(den1, den2);
      resultNum = (num1 * (l / den1)) + (num2 * (l / den2));
      resultDen = l;
      steps = [
        `Find LCM of ${den1} and ${den2}: LCM = ${l}`,
        `Convert: ${num1}/${den1} = ${num1 * (l / den1)}/${l}`,
        `Convert: ${num2}/${den2} = ${num2 * (l / den2)}/${l}`,
        `Add numerators: ${num1 * (l / den1)} + ${num2 * (l / den2)} = ${resultNum}`,
      ];
    } else if (op === "subtract") {
      const l = lcm(den1, den2);
      resultNum = (num1 * (l / den1)) - (num2 * (l / den2));
      resultDen = l;
      steps = [
        `Find LCM of ${den1} and ${den2}: LCM = ${l}`,
        `Convert: ${num1}/${den1} = ${num1 * (l / den1)}/${l}`,
        `Convert: ${num2}/${den2} = ${num2 * (l / den2)}/${l}`,
        `Subtract numerators: ${num1 * (l / den1)} - ${num2 * (l / den2)} = ${resultNum}`,
      ];
    } else if (op === "multiply") {
      resultNum = num1 * num2;
      resultDen = den1 * den2;
      steps = [
        `Multiply numerators: ${num1} x ${num2} = ${resultNum}`,
        `Multiply denominators: ${den1} x ${den2} = ${resultDen}`,
      ];
    } else if (op === "divide") {
      if (num2 === 0) {
        error = "Cannot divide by zero.";
      } else {
        resultNum = num1 * den2;
        resultDen = den1 * num2;
        steps = [
          `Flip the second fraction: ${num2}/${den2} becomes ${den2}/${num2}`,
          `Multiply: ${num1}/${den1} x ${den2}/${num2}`,
          `= ${num1 * den2} / ${den1 * num2}`,
        ];
      }
    }
    if (!error) {
      const [sn, sd] = simplify(resultNum, resultDen);
      const g = gcd(Math.abs(resultNum), Math.abs(resultDen));
      if (g > 1) {
        steps.push(`Simplify by GCD ${g}: ${formatFraction(sn, sd)}`);
      }
      resultNum = sn;
      resultDen = sd;
    }
  }

  const decimal = !error && resultDen !== 0 ? (resultNum / resultDen) : null;
  const mixed = !error && resultDen !== 0 ? toMixedNumber(resultNum, resultDen) : null;

  return (
    <div className="space-y-6">
      {/* Operation selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Operation</label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(OP_LABELS) as FractionOp[]).map(o => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                op === o
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {OP_LABELS[o]}
            </button>
          ))}
        </div>
      </div>

      {/* Fraction inputs */}
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <FractionInput num={n1} den={d1} onNum={setN1} onDen={setD1} label="First Fraction" />
        {op !== "simplify" && (
          <>
            <span className="text-2xl font-bold text-gray-400 mt-6">{OP_SYMBOLS[op]}</span>
            <FractionInput num={n2} den={d2} onNum={setN2} onDen={setD2} label="Second Fraction" />
          </>
        )}
      </div>

      {/* Result */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center">
          {error}
        </div>
      ) : (
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 space-y-3">
          <div className="text-center">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">Result</p>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-3xl font-bold text-violet-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {formatFraction(resultNum, resultDen)}
              </span>
              {resultDen !== 1 && mixed !== formatFraction(resultNum, resultDen) && (
                <span className="text-sm text-violet-600">Mixed number: {mixed}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-violet-100">
            <div className="text-center">
              <p className="text-xs text-violet-500 mb-0.5">Decimal</p>
              <p className="font-semibold text-gray-800">{decimal !== null ? decimal.toFixed(6).replace(/\.?0+$/, "") : "--"}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-violet-500 mb-0.5">Percentage</p>
              <p className="font-semibold text-gray-800">{decimal !== null ? (decimal * 100).toFixed(4).replace(/\.?0+$/, "") + "%" : "--"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && !error && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Step-by-Step Solution</p>
          <ol className="space-y-1.5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// --- Square Root / Exponent Calculator --------------------------------------

type ExponentMode = "power" | "sqrt" | "nthroot" | "log" | "scientific";

const EXPONENT_MODES: { key: ExponentMode; label: string }[] = [
  { key: "power", label: "Power (x^n)" },
  { key: "sqrt", label: "Square Root" },
  { key: "nthroot", label: "Nth Root" },
  { key: "log", label: "Logarithm" },
  { key: "scientific", label: "Scientific Notation" },
];

export function ExponentCalculator() {
  const [mode, setMode] = useState<ExponentMode>("power");
  const [base, setBase] = useState("2");
  const [exp, setExp] = useState("10");
  const [root, setRoot] = useState("3");
  const [logBase, setLogBase] = useState("10");
  const [sciNum, setSciNum] = useState("299792458");

  const baseVal = parseFloat(base);
  const expVal = parseFloat(exp);
  const rootVal = parseFloat(root);
  const logBaseVal = parseFloat(logBase);
  const sciNumVal = parseFloat(sciNum);

  let result: number | null = null;
  let resultLabel = "";
  let steps: string[] = [];
  let error = "";

  if (mode === "power") {
    if (isNaN(baseVal) || isNaN(expVal)) {
      error = "Please enter valid numbers.";
    } else {
      result = Math.pow(baseVal, expVal);
      resultLabel = `${baseVal}^${expVal}`;
      steps = [
        `Base: ${baseVal}`,
        `Exponent: ${expVal}`,
        `${baseVal} raised to the power of ${expVal}`,
        `= ${result}`,
      ];
      if (expVal === 2) steps.splice(2, 0, `This is the square of ${baseVal}`);
      if (expVal === 3) steps.splice(2, 0, `This is the cube of ${baseVal}`);
      if (expVal === 0.5) steps.splice(2, 0, `An exponent of 0.5 is the same as the square root`);
    }
  } else if (mode === "sqrt") {
    if (isNaN(baseVal)) {
      error = "Please enter a valid number.";
    } else if (baseVal < 0) {
      error = "Cannot take the square root of a negative number (result is imaginary).";
    } else {
      result = Math.sqrt(baseVal);
      resultLabel = `sqrt(${baseVal})`;
      steps = [
        `Find the number that, when multiplied by itself, equals ${baseVal}`,
        `${result.toFixed(8).replace(/\.?0+$/, "")} x ${result.toFixed(8).replace(/\.?0+$/, "")} = ${baseVal}`,
        `sqrt(${baseVal}) = ${result}`,
      ];
    }
  } else if (mode === "nthroot") {
    if (isNaN(baseVal) || isNaN(rootVal)) {
      error = "Please enter valid numbers.";
    } else if (rootVal === 0) {
      error = "Root index cannot be zero.";
    } else if (baseVal < 0 && rootVal % 2 === 0) {
      error = "Cannot take an even root of a negative number.";
    } else {
      result = baseVal < 0
        ? -Math.pow(Math.abs(baseVal), 1 / rootVal)
        : Math.pow(baseVal, 1 / rootVal);
      resultLabel = `${rootVal}th root of ${baseVal}`;
      steps = [
        `Calculate the ${rootVal}th root of ${baseVal}`,
        `This is the same as ${baseVal}^(1/${rootVal})`,
        `= ${baseVal}^${(1 / rootVal).toFixed(6).replace(/\.?0+$/, "")}`,
        `= ${result}`,
      ];
    }
  } else if (mode === "log") {
    if (isNaN(baseVal) || isNaN(logBaseVal)) {
      error = "Please enter valid numbers.";
    } else if (baseVal <= 0) {
      error = "Logarithm input must be greater than zero.";
    } else if (logBaseVal <= 0 || logBaseVal === 1) {
      error = "Log base must be greater than zero and not equal to 1.";
    } else {
      result = Math.log(baseVal) / Math.log(logBaseVal);
      resultLabel = `log_${logBaseVal}(${baseVal})`;
      const ln = Math.log(baseVal);
      const lnBase = Math.log(logBaseVal);
      steps = [
        `Use change of base formula: log_${logBaseVal}(${baseVal}) = ln(${baseVal}) / ln(${logBaseVal})`,
        `ln(${baseVal}) = ${ln.toFixed(8).replace(/\.?0+$/, "")}`,
        `ln(${logBaseVal}) = ${lnBase.toFixed(8).replace(/\.?0+$/, "")}`,
        `= ${ln.toFixed(8).replace(/\.?0+$/, "")} / ${lnBase.toFixed(8).replace(/\.?0+$/, "")}`,
        `= ${result}`,
      ];
    }
  } else if (mode === "scientific") {
    if (isNaN(sciNumVal)) {
      error = "Please enter a valid number.";
    } else {
      const absVal = Math.abs(sciNumVal);
      const exponent = absVal === 0 ? 0 : Math.floor(Math.log10(absVal));
      const coefficient = sciNumVal / Math.pow(10, exponent);
      result = sciNumVal;
      resultLabel = `${sciNumVal} in scientific notation`;
      steps = [
        `Move decimal so one non-zero digit is to the left of the decimal point`,
        `Coefficient: ${coefficient.toFixed(6).replace(/\.?0+$/, "")}`,
        `Exponent: 10^${exponent}`,
        `Scientific notation: ${coefficient.toFixed(6).replace(/\.?0+$/, "")} x 10^${exponent}`,
        `Engineering notation: ${(sciNumVal / Math.pow(10, Math.floor(exponent / 3) * 3)).toFixed(4).replace(/\.?0+$/, "")} x 10^${Math.floor(exponent / 3) * 3}`,
      ];
    }
  }

  const formatResult = (n: number | null): string => {
    if (n === null) return "--";
    if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) {
      return n.toExponential(6);
    }
    const str = n.toFixed(10).replace(/\.?0+$/, "");
    return str;
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Operation</label>
        <div className="flex flex-wrap gap-2">
          {EXPONENT_MODES.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
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
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mode === "power" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Base</label>
              <input
                type="number"
                value={base}
                onChange={e => setBase(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Exponent (n)</label>
              <input
                type="number"
                value={exp}
                onChange={e => setExp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. 10"
              />
            </div>
          </>
        )}
        {mode === "sqrt" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number</label>
            <input
              type="number"
              value={base}
              onChange={e => setBase(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="e.g. 144"
            />
          </div>
        )}
        {mode === "nthroot" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Number</label>
              <input
                type="number"
                value={base}
                onChange={e => setBase(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. 27"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Root Index (n)</label>
              <input
                type="number"
                value={root}
                onChange={e => setRoot(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. 3 for cube root"
              />
            </div>
          </>
        )}
        {mode === "log" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Number</label>
              <input
                type="number"
                value={base}
                onChange={e => setBase(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g. 1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Log Base</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={logBase}
                  onChange={e => setLogBase(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="e.g. 10"
                />
                <button onClick={() => setLogBase("10")} className="px-3 py-2 bg-gray-100 hover:bg-violet-50 text-gray-700 hover:text-violet-700 rounded-xl text-sm font-semibold transition-colors">log10</button>
                <button onClick={() => setLogBase(String(Math.E.toFixed(6)))} className="px-3 py-2 bg-gray-100 hover:bg-violet-50 text-gray-700 hover:text-violet-700 rounded-xl text-sm font-semibold transition-colors">ln</button>
              </div>
            </div>
          </>
        )}
        {mode === "scientific" && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Number</label>
            <input
              type="number"
              value={sciNum}
              onChange={e => setSciNum(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="e.g. 299792458"
            />
          </div>
        )}
      </div>

      {/* Quick presets for power mode */}
      {mode === "power" && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 self-center">Quick:</span>
          {[["2","2"],["2","3"],["2","10"],["10","2"],["10","3"],["e","2"]].map(([b, e]) => (
            <button
              key={`${b}^${e}`}
              onClick={() => { setBase(b === "e" ? String(Math.E.toFixed(6)) : b); setExp(e); }}
              className="px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {b}^{e}
            </button>
          ))}
        </div>
      )}

      {/* Quick presets for sqrt */}
      {mode === "sqrt" && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-500 self-center">Quick:</span>
          {["4","9","16","25","36","49","64","81","100","144","169","196","225"].map(n => (
            <button
              key={n}
              onClick={() => setBase(n)}
              className="px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {/* Result */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center">
          {error}
        </div>
      ) : (
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1 text-center">{resultLabel}</p>
          <p className="text-3xl font-bold text-violet-700 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {formatResult(result)}
          </p>
          {mode === "scientific" && result !== null && (
            <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-violet-100">
              {(() => {
                const absVal = Math.abs(result);
                const exponent = absVal === 0 ? 0 : Math.floor(Math.log10(absVal));
                const coefficient = result / Math.pow(10, exponent);
                return (
                  <>
                    <div className="text-center">
                      <p className="text-xs text-violet-500 mb-0.5">Scientific Notation</p>
                      <p className="font-semibold text-gray-800 text-sm">{coefficient.toFixed(4).replace(/\.?0+$/, "")} x 10^{exponent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-violet-500 mb-0.5">Standard Form</p>
                      <p className="font-semibold text-gray-800 text-sm">{result.toLocaleString()}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && !error && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Step-by-Step Solution</p>
          <ol className="space-y-1.5">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="flex-shrink-0 w-5 h-5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
