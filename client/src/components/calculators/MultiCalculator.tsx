/**
 * CalcHQ Multi-Mode Calculator
 * Standard | Scientific | Engineering
 * Design: "Clean Utility" — Space Grotesk + Inter, emerald accent, clean card layout
 */
import { useState, useCallback } from "react";

type Mode = "standard" | "scientific" | "engineering";

const MODE_LABELS: Record<Mode, string> = {
  standard: "Standard",
  scientific: "Scientific",
  engineering: "Engineering",
};

function evaluate(expr: string): string {
  try {
    // Replace display symbols with JS equivalents
    let e = expr
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/π/g, String(Math.PI))
      .replace(/e(?![0-9])/g, String(Math.E))
      .replace(/\^/g, "**")
      .replace(/√\(([^)]+)\)/g, (_, n) => String(Math.sqrt(parseFloat(n))))
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/asin\(/g, "Math.asin(")
      .replace(/acos\(/g, "Math.acos(")
      .replace(/atan\(/g, "Math.atan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/abs\(/g, "Math.abs(")
      .replace(/ceil\(/g, "Math.ceil(")
      .replace(/floor\(/g, "Math.floor(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/(\d+)!/g, (_, n) => {
        const num = parseInt(n);
        if (num > 20) return "Infinity";
        let f = 1;
        for (let i = 2; i <= num; i++) f *= i;
        return String(f);
      });

    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + e + ")")();
    if (typeof result !== "number" || isNaN(result)) return "Error";
    if (!isFinite(result)) return result > 0 ? "Infinity" : "-Infinity";
    // Engineering notation if needed
    const abs = Math.abs(result);
    if (abs !== 0 && (abs >= 1e15 || abs < 1e-9)) {
      return result.toExponential(6).replace(/\.?0+e/, "e");
    }
    // Trim floating point noise
    const str = parseFloat(result.toPrecision(12)).toString();
    return str;
  } catch {
    return "Error";
  }
}

interface ButtonDef {
  label: string;
  value: string;
  type: "number" | "op" | "fn" | "action" | "mem";
  wide?: boolean;
}

const STANDARD_BUTTONS: ButtonDef[] = [
  { label: "AC", value: "AC", type: "action" },
  { label: "+/-", value: "+/-", type: "action" },
  { label: "%", value: "%", type: "op" },
  { label: "÷", value: "÷", type: "op" },
  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "×", value: "×", type: "op" },
  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "−", value: "-", type: "op" },
  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "+", value: "+", type: "op" },
  { label: "0", value: "0", type: "number", wide: true },
  { label: ".", value: ".", type: "number" },
  { label: "=", value: "=", type: "action" },
];

const SCIENTIFIC_BUTTONS: ButtonDef[] = [
  { label: "AC", value: "AC", type: "action" },
  { label: "(", value: "(", type: "op" },
  { label: ")", value: ")", type: "op" },
  { label: "⌫", value: "DEL", type: "action" },
  { label: "sin", value: "sin(", type: "fn" },
  { label: "cos", value: "cos(", type: "fn" },
  { label: "tan", value: "tan(", type: "fn" },
  { label: "π", value: "π", type: "fn" },
  { label: "√", value: "√(", type: "fn" },
  { label: "x²", value: "^2", type: "fn" },
  { label: "xⁿ", value: "^", type: "fn" },
  { label: "e", value: "e", type: "fn" },
  { label: "log", value: "log(", type: "fn" },
  { label: "ln", value: "ln(", type: "fn" },
  { label: "n!", value: "!", type: "fn" },
  { label: "%", value: "%", type: "op" },
  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "÷", value: "÷", type: "op" },
  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "×", value: "×", type: "op" },
  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "−", value: "-", type: "op" },
  { label: "0", value: "0", type: "number", wide: true },
  { label: ".", value: ".", type: "number" },
  { label: "=", value: "=", type: "action" },
  { label: "+", value: "+", type: "op" },
];

const ENGINEERING_BUTTONS: ButtonDef[] = [
  { label: "AC", value: "AC", type: "action" },
  { label: "(", value: "(", type: "op" },
  { label: ")", value: ")", type: "op" },
  { label: "⌫", value: "DEL", type: "action" },
  { label: "sin", value: "sin(", type: "fn" },
  { label: "cos", value: "cos(", type: "fn" },
  { label: "tan", value: "tan(", type: "fn" },
  { label: "asin", value: "asin(", type: "fn" },
  { label: "acos", value: "acos(", type: "fn" },
  { label: "atan", value: "atan(", type: "fn" },
  { label: "√", value: "√(", type: "fn" },
  { label: "∛", value: "^(1/3)", type: "fn" },
  { label: "log", value: "log(", type: "fn" },
  { label: "ln", value: "ln(", type: "fn" },
  { label: "exp", value: "exp(", type: "fn" },
  { label: "abs", value: "abs(", type: "fn" },
  { label: "ceil", value: "ceil(", type: "fn" },
  { label: "floor", value: "floor(", type: "fn" },
  { label: "x²", value: "^2", type: "fn" },
  { label: "xⁿ", value: "^", type: "fn" },
  { label: "π", value: "π", type: "fn" },
  { label: "e", value: "e", type: "fn" },
  { label: "n!", value: "!", type: "fn" },
  { label: "%", value: "%", type: "op" },
  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "÷", value: "÷", type: "op" },
  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "×", value: "×", type: "op" },
  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "−", value: "-", type: "op" },
  { label: "0", value: "0", type: "number", wide: true },
  { label: ".", value: ".", type: "number" },
  { label: "=", value: "=", type: "action" },
  { label: "+", value: "+", type: "op" },
];

const BUTTONS: Record<Mode, ButtonDef[]> = {
  standard: STANDARD_BUTTONS,
  scientific: SCIENTIFIC_BUTTONS,
  engineering: ENGINEERING_BUTTONS,
};

const GRID_COLS: Record<Mode, string> = {
  standard: "grid-cols-4",
  scientific: "grid-cols-4",
  engineering: "grid-cols-4",
};

export default function MultiCalculator() {
  const [mode, setMode] = useState<Mode>("standard");
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [history, setHistory] = useState<{ expr: string; result: string }[]>([]);

  const handleButton = useCallback(
    (btn: ButtonDef) => {
      if (btn.value === "AC") {
        setDisplay("0");
        setExpression("");
        setJustEvaluated(false);
        return;
      }

      if (btn.value === "DEL") {
        if (justEvaluated) {
          setDisplay("0");
          setExpression("");
          setJustEvaluated(false);
          return;
        }
        const newExpr = expression.slice(0, -1);
        setExpression(newExpr);
        setDisplay(newExpr || "0");
        return;
      }

      if (btn.value === "=") {
        const exprToEval = justEvaluated ? expression : expression || display;
        const result = evaluate(exprToEval);
        setHistory((h) => [{ expr: exprToEval, result }, ...h.slice(0, 9)]);
        setDisplay(result);
        setExpression(result === "Error" ? "" : result);
        setJustEvaluated(true);
        return;
      }

      if (btn.value === "+/-") {
        if (display.startsWith("-")) {
          const pos = display.slice(1);
          setDisplay(pos);
          setExpression(pos);
        } else {
          const neg = "-" + display;
          setDisplay(neg);
          setExpression(neg);
        }
        return;
      }

      // Normal input
      const isOp = btn.type === "op" || btn.type === "fn";
      let newExpr: string;

      if (justEvaluated && btn.type === "number") {
        // Start fresh number after evaluation
        newExpr = btn.value;
        setJustEvaluated(false);
      } else if (justEvaluated && isOp) {
        // Continue with result as operand
        newExpr = expression + btn.value;
        setJustEvaluated(false);
      } else {
        newExpr = expression + btn.value;
        setJustEvaluated(false);
      }

      setExpression(newExpr);
      setDisplay(newExpr);
    },
    [display, expression, justEvaluated]
  );

  const buttons = BUTTONS[mode];
  const gridCols = GRID_COLS[mode];

  const getButtonStyle = (btn: ButtonDef) => {
    const base =
      "flex items-center justify-center rounded-xl font-medium text-sm transition-all duration-100 active:scale-95 select-none cursor-pointer h-12 ";
    if (btn.value === "=")
      return base + "bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm col-span-1";
    if (btn.type === "action" && btn.value !== "=")
      return base + "bg-gray-200 hover:bg-gray-300 text-gray-800";
    if (btn.type === "op")
      return base + "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold";
    if (btn.type === "fn")
      return base + "bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold";
    return base + "bg-white hover:bg-gray-50 text-gray-900 border border-gray-100 shadow-sm";
  };

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(["standard", "scientific", "engineering"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setDisplay("0");
              setExpression("");
              setJustEvaluated(false);
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === m
                ? "bg-white text-emerald-700 shadow-sm font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Calculator body */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl max-w-sm">
        {/* Display */}
        <div className="px-5 pt-5 pb-3 min-h-[90px] flex flex-col justify-end items-end">
          <p className="text-gray-400 text-xs truncate w-full text-right mb-1 h-4">
            {justEvaluated && history[0] ? history[0].expr : ""}
          </p>
          <p
            className={`text-white font-light text-right w-full break-all leading-tight ${
              display.length > 14
                ? "text-lg"
                : display.length > 10
                ? "text-2xl"
                : "text-4xl"
            }`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {display}
          </p>
        </div>

        {/* Buttons */}
        <div className={`grid ${gridCols} gap-px bg-gray-700 p-px`}>
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleButton(btn)}
              className={`${getButtonStyle(btn)} ${btn.wide ? "col-span-2" : ""} rounded-none`}
              style={{ borderRadius: 0 }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calculation history */}
      {history.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              History
            </p>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setDisplay(h.result);
                  setExpression(h.result);
                  setJustEvaluated(true);
                }}
              >
                <span className="text-xs text-gray-500 truncate max-w-[60%]">{h.expr}</span>
                <span className="text-sm font-semibold text-gray-800">{h.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
