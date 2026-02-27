/*
 * Loan Calculator — CalcHQ "Clean Utility" Design
 * Live calculation on every keystroke
 */
import { useState, useMemo } from "react";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (P <= 0 || r <= 0 || n <= 0) return null;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    const interest = total - P;
    return { monthly, total, interest };
  }, [principal, rate, years]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Loan Amount ($)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="10000"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="7"
            min="0"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Loan Term (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="5"
            min="0"
          />
        </div>
      </div>

      {result && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-800 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Monthly Payment</p>
              <p className="text-2xl font-bold text-emerald-600 result-value">{formatCurrency(result.monthly)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Interest</p>
              <p className="text-2xl font-bold text-gray-800 result-value">{formatCurrency(result.interest)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-gray-800 result-value">{formatCurrency(result.total)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
