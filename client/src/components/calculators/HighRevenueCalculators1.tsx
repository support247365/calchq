/**
 * CalcHQ — High-Revenue Financial Calculators Batch 1
 * SBA 504 Loan, Auto Loan, Debt Payoff, Home Equity Loan
 */
import { useState, useMemo } from "react";
import { TrendingDown, RefreshCw } from "lucide-react";

// ─── Shared helpers ──────────────────────────────────────────────────────────
function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmt$c(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function fmtPct(n: number, d = 2) {
  return n.toFixed(d) + "%";
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; min?: string; max?: string; step?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{unit && <span className="text-gray-400 font-normal"> ({unit})</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ResultCard({ label, value, highlight = false, sub }: { label: string; value: string; highlight?: boolean; sub?: string }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-50">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-emerald-600" : "text-gray-800"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function calcMonthlyPayment(principal: number, annualRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// SBA 504 LOAN CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
// SBA 504 structure: 50% bank / 40% SBA CDC / 10% borrower equity
// Current SBA 504 debenture rates (March 2026): ~6.0% for 10yr, ~6.2% for 20yr, ~6.3% for 25yr
const SBA504_RATES: Record<string, number> = {
  "10": 6.0,
  "20": 6.2,
  "25": 6.3,
};

export function SBA504Calculator() {
  const [projectCost, setProjectCost] = useState("1000000");
  const [bankRate, setBankRate] = useState("7.5");
  const [bankTermYears, setBankTermYears] = useState("10");
  const [cdcTerm, setCdcTerm] = useState("20");

  const result = useMemo(() => {
    const total = parseFloat(projectCost.replace(/,/g, "")) || 0;
    if (total <= 0) return null;

    // Standard 504 split: 50% bank, 40% CDC/SBA, 10% equity
    const bankLoan = total * 0.50;
    const cdcLoan = total * 0.40;
    const equity = total * 0.10;

    const bankMonths = parseInt(bankTermYears) * 12;
    const cdcMonths = parseInt(cdcTerm) * 12;
    const cdcRate = SBA504_RATES[cdcTerm] ?? 6.2;
    const bankRateNum = parseFloat(bankRate) || 7.5;

    const bankPayment = calcMonthlyPayment(bankLoan, bankRateNum, bankMonths);
    const cdcPayment = calcMonthlyPayment(cdcLoan, cdcRate, cdcMonths);
    const totalMonthly = bankPayment + cdcPayment;

    const bankTotal = bankPayment * bankMonths;
    const cdcTotal = cdcPayment * cdcMonths;
    const totalInterest = (bankTotal - bankLoan) + (cdcTotal - cdcLoan);

    // SBA 504 fees: ~2.15% of CDC portion (guarantee + servicing)
    const cdcFees = cdcLoan * 0.0215;

    return {
      bankLoan, cdcLoan, equity, bankPayment, cdcPayment, totalMonthly,
      bankTotal, cdcTotal, totalInterest, cdcFees, cdcRate, bankRateNum,
      bankMonths, cdcMonths,
    };
  }, [projectCost, bankRate, bankTermYears, cdcTerm]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>SBA 504 Structure:</strong> 50% conventional bank loan + 40% SBA CDC debenture + 10% borrower equity. Used for owner-occupied commercial real estate and major equipment.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InputField label="Total Project Cost ($)" value={projectCost} onChange={setProjectCost} placeholder="1,000,000" />
        <InputField label="Bank Loan Rate (%)" value={bankRate} onChange={setBankRate} step="0.1" min="3" max="15" />
        <SelectField label="Bank Loan Term" value={bankTermYears} onChange={setBankTermYears} options={[
          { value: "7", label: "7 years" },
          { value: "10", label: "10 years" },
          { value: "15", label: "15 years" },
          { value: "20", label: "20 years" },
          { value: "25", label: "25 years" },
        ]} />
        <SelectField label="SBA CDC Term" value={cdcTerm} onChange={setCdcTerm} options={[
          { value: "10", label: "10 years (~6.0%)" },
          { value: "20", label: "20 years (~6.2%)" },
          { value: "25", label: "25 years (~6.3%)" },
        ]} />
      </div>

      {result && (
        <>
          {/* Loan structure breakdown */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Loan Structure Breakdown</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Bank Loan (50%)</p>
                <p className="text-xl font-bold text-gray-800">{fmt$(result.bankLoan)}</p>
                <p className="text-xs text-gray-400 mt-1">{fmtPct(result.bankRateNum)} for {bankTermYears}yr</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="text-xs text-blue-600 mb-1">SBA CDC Loan (40%)</p>
                <p className="text-xl font-bold text-blue-700">{fmt$(result.cdcLoan)}</p>
                <p className="text-xs text-gray-400 mt-1">{fmtPct(result.cdcRate)} for {cdcTerm}yr</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-emerald-100">
                <p className="text-xs text-emerald-600 mb-1">Your Equity (10%)</p>
                <p className="text-xl font-bold text-emerald-700">{fmt$(result.equity)}</p>
                <p className="text-xs text-gray-400 mt-1">Down payment required</p>
              </div>
            </div>
          </div>

          {/* Monthly payments */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Monthly Payments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard label="Total Monthly Payment" value={fmt$c(result.totalMonthly)} highlight />
              <ResultCard label="Bank Loan Payment" value={fmt$c(result.bankPayment)} sub={`${bankTermYears}-year term`} />
              <ResultCard label="SBA CDC Payment" value={fmt$c(result.cdcPayment)} sub={`${cdcTerm}-year term`} />
              <ResultCard label="Total Interest Paid" value={fmt$(result.totalInterest)} />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>Estimated SBA 504 Fees:</strong> {fmt$c(result.cdcFees)} (approx. 2.15% of CDC portion — includes guarantee fee, funding fee, and annual servicing fee financed into the loan). Actual fees vary by CDC and loan size.
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTO LOAN CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function AutoLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState("35000");
  const [downPayment, setDownPayment] = useState("5000");
  const [tradeIn, setTradeIn] = useState("0");
  const [interestRate, setInterestRate] = useState("7.5");
  const [loanTermMonths, setLoanTermMonths] = useState("60");
  const [salesTaxPct, setSalesTaxPct] = useState("8");
  const [showAmortization, setShowAmortization] = useState(false);

  const result = useMemo(() => {
    const price = parseFloat(vehiclePrice.replace(/,/g, "")) || 0;
    const down = parseFloat(downPayment.replace(/,/g, "")) || 0;
    const trade = parseFloat(tradeIn.replace(/,/g, "")) || 0;
    const rate = parseFloat(interestRate) || 0;
    const months = parseInt(loanTermMonths) || 60;
    const taxPct = parseFloat(salesTaxPct) || 0;

    if (price <= 0) return null;

    const salesTax = price * (taxPct / 100);
    const totalVehicleCost = price + salesTax;
    const principal = Math.max(0, totalVehicleCost - down - trade);
    const monthlyPayment = calcMonthlyPayment(principal, rate, months);
    const totalPayments = monthlyPayment * months;
    const totalInterest = totalPayments - principal;
    const totalCost = down + trade + totalPayments; // total out of pocket

    // Amortization
    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    const r = rate / 100 / 12;
    let balance = principal;
    for (let m = 1; m <= months; m++) {
      const interestCharge = balance * r;
      const principalCharge = monthlyPayment - interestCharge;
      balance = Math.max(0, balance - principalCharge);
      schedule.push({ month: m, payment: monthlyPayment, principal: principalCharge, interest: interestCharge, balance });
    }

    return { price, down, trade, salesTax, totalVehicleCost, principal, monthlyPayment, totalPayments, totalInterest, totalCost, months, schedule };
  }, [vehiclePrice, downPayment, tradeIn, interestRate, loanTermMonths, salesTaxPct]);

  const displaySchedule = result ? [
    ...result.schedule.slice(0, 12),
    ...(result.months > 15 ? [{ month: -1, payment: 0, principal: 0, interest: 0, balance: 0 }] : []),
    ...result.schedule.slice(-3),
  ] : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField label="Vehicle Price ($)" value={vehiclePrice} onChange={setVehiclePrice} placeholder="35,000" />
        <InputField label="Down Payment ($)" value={downPayment} onChange={setDownPayment} placeholder="5,000" min="0" />
        <InputField label="Trade-In Value ($)" value={tradeIn} onChange={setTradeIn} placeholder="0" min="0" />
        <InputField label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} step="0.1" min="0" max="30" />
        <SelectField label="Loan Term" value={loanTermMonths} onChange={setLoanTermMonths} options={[
          { value: "24", label: "24 months (2 years)" },
          { value: "36", label: "36 months (3 years)" },
          { value: "48", label: "48 months (4 years)" },
          { value: "60", label: "60 months (5 years)" },
          { value: "72", label: "72 months (6 years)" },
          { value: "84", label: "84 months (7 years)" },
        ]} />
        <InputField label="Sales Tax Rate (%)" value={salesTaxPct} onChange={setSalesTaxPct} step="0.1" min="0" max="15" />
      </div>

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard label="Monthly Payment" value={fmt$c(result.monthlyPayment)} highlight />
              <ResultCard label="Loan Amount" value={fmt$(result.principal)} sub="after down payment & trade-in" />
              <ResultCard label="Total Interest" value={fmt$(result.totalInterest)} />
              <ResultCard label="Total Cost of Vehicle" value={fmt$(result.totalCost)} sub="including all fees & interest" />
            </div>
          </div>

          {result.salesTax > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Vehicle Price</p>
                <p className="font-semibold text-gray-800">{fmt$(result.price)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Sales Tax ({salesTaxPct}%)</p>
                <p className="font-semibold text-gray-800">{fmt$(result.salesTax)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Down + Trade-In</p>
                <p className="font-semibold text-gray-800">−{fmt$(result.down + result.trade)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs">Amount Financed</p>
                <p className="font-semibold text-gray-800">{fmt$(result.principal)}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowAmortization(!showAmortization)}
            className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1"
          >
            {showAmortization ? "Hide" : "Show"} Amortization Schedule
          </button>

          {showAmortization && (
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Month", "Payment", "Principal", "Interest", "Balance"].map(h => (
                      <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displaySchedule.map((row, i) =>
                    row.month === -1 ? (
                      <tr key={i} className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-2 text-center text-xs text-gray-400">⋯ middle months omitted ⋯</td>
                      </tr>
                    ) : (
                      <tr key={row.month} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-600">{row.month}</td>
                        <td className="px-4 py-2 font-medium">{fmt$c(row.payment)}</td>
                        <td className="px-4 py-2 text-emerald-700">{fmt$c(row.principal)}</td>
                        <td className="px-4 py-2 text-red-500">{fmt$c(row.interest)}</td>
                        <td className="px-4 py-2 text-gray-600">{fmt$(row.balance)}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBT PAYOFF CALCULATOR (Snowball + Avalanche)
// ─────────────────────────────────────────────────────────────────────────────
interface Debt {
  id: number;
  name: string;
  balance: string;
  rate: string;
  minPayment: string;
}

export function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card 1", balance: "5000", rate: "22.99", minPayment: "100" },
    { id: 2, name: "Credit Card 2", balance: "3500", rate: "18.99", minPayment: "70" },
    { id: 3, name: "Personal Loan", balance: "8000", rate: "12.5", minPayment: "200" },
  ]);
  const [extraPayment, setExtraPayment] = useState("200");
  const [method, setMethod] = useState<"snowball" | "avalanche">("avalanche");
  const nextId = Math.max(...debts.map(d => d.id)) + 1;

  function addDebt() {
    setDebts([...debts, { id: nextId, name: `Debt ${nextId}`, balance: "0", rate: "0", minPayment: "0" }]);
  }
  function removeDebt(id: number) {
    setDebts(debts.filter(d => d.id !== id));
  }
  function updateDebt(id: number, field: keyof Debt, value: string) {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  }

  const result = useMemo(() => {
    const parsed = debts.map(d => ({
      name: d.name,
      balance: parseFloat(d.balance) || 0,
      rate: parseFloat(d.rate) || 0,
      minPayment: parseFloat(d.minPayment) || 0,
    })).filter(d => d.balance > 0);

    if (parsed.length === 0) return null;

    const extra = parseFloat(extraPayment) || 0;
    const totalMin = parsed.reduce((s, d) => s + d.minPayment, 0);
    const totalMonthly = totalMin + extra;
    const totalDebt = parsed.reduce((s, d) => s + d.balance, 0);

    function simulate(sortedDebts: typeof parsed) {
      const accounts = sortedDebts.map(d => ({ ...d, remaining: d.balance }));
      let months = 0;
      let totalInterestPaid = 0;
      const payoffOrder: { name: string; month: number }[] = [];

      while (accounts.some(a => a.remaining > 0) && months < 600) {
        months++;
        let availableExtra = extra;

        for (const acc of accounts) {
          if (acc.remaining <= 0) continue;
          const interest = acc.remaining * (acc.rate / 100 / 12);
          totalInterestPaid += interest;
          acc.remaining += interest;
          acc.remaining -= acc.minPayment;
          if (acc.remaining < 0) {
            availableExtra += Math.abs(acc.remaining);
            acc.remaining = 0;
            if (!payoffOrder.find(p => p.name === acc.name)) {
              payoffOrder.push({ name: acc.name, month: months });
            }
          }
        }

        // Apply extra to first non-zero account
        const target = accounts.find(a => a.remaining > 0);
        if (target) {
          target.remaining = Math.max(0, target.remaining - availableExtra);
          if (target.remaining === 0 && !payoffOrder.find(p => p.name === target.name)) {
            payoffOrder.push({ name: target.name, month: months });
          }
        }
      }

      return { months, totalInterestPaid, payoffOrder };
    }

    const sorted = method === "avalanche"
      ? [...parsed].sort((a, b) => b.rate - a.rate)
      : [...parsed].sort((a, b) => a.balance - b.balance);

    const withExtra = simulate(sorted);

    // Minimum only (no extra)
    const minOnly = simulate(parsed.map(d => ({ ...d })));

    const interestSaved = minOnly.totalInterestPaid - withExtra.totalInterestPaid;
    const monthsSaved = minOnly.months - withExtra.months;

    return {
      withExtra, minOnly, interestSaved, monthsSaved,
      totalDebt, totalMonthly, totalMin,
    };
  }, [debts, extraPayment, method]);

  return (
    <div className="space-y-6">
      {/* Method selector */}
      <div className="flex gap-3">
        {(["avalanche", "snowball"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
              method === m
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            {m === "avalanche" ? "⚡ Avalanche (highest rate first)" : "❄️ Snowball (lowest balance first)"}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        {method === "avalanche"
          ? "Avalanche method: pay minimums on all debts, then put extra toward the highest interest rate. Saves the most money."
          : "Snowball method: pay minimums on all debts, then put extra toward the smallest balance. Builds momentum with quick wins."}
      </p>

      {/* Debt list */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-500 px-1">
          <span>Debt Name</span><span>Balance ($)</span><span>Rate (%)</span><span>Min Payment ($)</span>
        </div>
        {debts.map(d => (
          <div key={d.id} className="grid grid-cols-4 gap-2 items-center">
            <input
              type="text"
              value={d.name}
              onChange={e => updateDebt(d.id, "name", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              value={d.balance}
              onChange={e => updateDebt(d.id, "balance", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="0"
            />
            <input
              type="number"
              value={d.rate}
              onChange={e => updateDebt(d.id, "rate", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="0" step="0.1"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={d.minPayment}
                onChange={e => updateDebt(d.id, "minPayment", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="0"
              />
              {debts.length > 1 && (
                <button onClick={() => removeDebt(d.id)} className="text-red-400 hover:text-red-600 px-2">
                  <TrendingDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={addDebt}
          className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1 mt-2"
        >
          + Add another debt
        </button>
      </div>

      <div className="max-w-xs">
        <InputField label="Extra Monthly Payment ($)" value={extraPayment} onChange={setExtraPayment} placeholder="200" min="0" />
      </div>

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Payoff Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Debt-Free In</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {result.withExtra.months < 12
                    ? `${result.withExtra.months} mo`
                    : `${Math.floor(result.withExtra.months / 12)}y ${result.withExtra.months % 12}m`}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Total Interest Paid</p>
                <p className="text-2xl font-bold text-gray-800">{fmt$(result.withExtra.totalInterestPaid)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <p className="text-xs text-emerald-600 mb-1">Interest Saved vs. Min Only</p>
                <p className="text-2xl font-bold text-emerald-600">{fmt$(result.interestSaved)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <p className="text-xs text-emerald-600 mb-1">Months Saved</p>
                <p className="text-2xl font-bold text-emerald-600">{result.monthsSaved} months</p>
              </div>
            </div>
          </div>

          {result.withExtra.payoffOrder.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Payoff Order ({method} method)</h3>
              <div className="space-y-2">
                {result.withExtra.payoffOrder.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      Month {p.month} ({p.month < 12 ? `${p.month} mo` : `${Math.floor(p.month / 12)}y ${p.month % 12}m`})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME EQUITY LOAN CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function HomeEquityCalculator() {
  const [homeValue, setHomeValue] = useState("400000");
  const [mortgageBalance, setMortgageBalance] = useState("250000");
  const [loanAmount, setLoanAmount] = useState("50000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [termYears, setTermYears] = useState("10");
  const [loanType, setLoanType] = useState("heloan"); // heloan or heloc

  const result = useMemo(() => {
    const home = parseFloat(homeValue.replace(/,/g, "")) || 0;
    const mortgage = parseFloat(mortgageBalance.replace(/,/g, "")) || 0;
    const loan = parseFloat(loanAmount.replace(/,/g, "")) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(termYears) || 10;
    const months = years * 12;

    if (home <= 0) return null;

    const equity = home - mortgage;
    const equityPct = (equity / home) * 100;
    // Most lenders allow up to 80-85% LTV combined
    const maxLTV = 0.85;
    const maxBorrow = Math.max(0, home * maxLTV - mortgage);

    const monthlyPayment = loanType === "heloan"
      ? calcMonthlyPayment(loan, rate, months)
      : loan * (rate / 100 / 12); // HELOC: interest-only during draw period

    const totalPayments = loanType === "heloan"
      ? monthlyPayment * months
      : monthlyPayment * 120; // 10-year draw period estimate
    const totalInterest = totalPayments - loan;

    return {
      equity, equityPct, maxBorrow, monthlyPayment, totalPayments, totalInterest,
      combinedLTV: ((mortgage + loan) / home) * 100,
    };
  }, [homeValue, mortgageBalance, loanAmount, interestRate, termYears, loanType]);

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[
          { value: "heloan", label: "Home Equity Loan (fixed)" },
          { value: "heloc", label: "HELOC (line of credit)" },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setLoanType(t.value)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border transition-all ${
              loanType === t.value
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField label="Home Value ($)" value={homeValue} onChange={setHomeValue} placeholder="400,000" />
        <InputField label="Mortgage Balance ($)" value={mortgageBalance} onChange={setMortgageBalance} placeholder="250,000" min="0" />
        <InputField label={loanType === "heloc" ? "Credit Line Amount ($)" : "Loan Amount ($)"} value={loanAmount} onChange={setLoanAmount} placeholder="50,000" min="0" />
        <InputField label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} step="0.1" min="0" max="25" />
        {loanType === "heloan" && (
          <SelectField label="Loan Term" value={termYears} onChange={setTermYears} options={[
            { value: "5", label: "5 years" },
            { value: "10", label: "10 years" },
            { value: "15", label: "15 years" },
            { value: "20", label: "20 years" },
          ]} />
        )}
      </div>

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard
                label={loanType === "heloc" ? "Monthly Interest (draw period)" : "Monthly Payment"}
                value={fmt$c(result.monthlyPayment)}
                highlight
              />
              <ResultCard label="Your Home Equity" value={fmt$(result.equity)} sub={fmtPct(result.equityPct, 1) + " of home value"} />
              <ResultCard label="Combined LTV" value={fmtPct(result.combinedLTV, 1)} sub="should be ≤ 85%" />
              <ResultCard label="Max You Can Borrow" value={fmt$(result.maxBorrow)} sub="at 85% combined LTV" />
            </div>
          </div>

          {result.combinedLTV > 85 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
              ⚠️ Your combined LTV of {fmtPct(result.combinedLTV, 1)} exceeds the typical 85% limit. Most lenders will not approve this loan amount. Consider reducing the loan to {fmt$(result.maxBorrow)} or less.
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            {loanType === "heloan"
              ? "A Home Equity Loan gives you a lump sum at a fixed rate. Interest may be tax-deductible if used for home improvements (consult a tax advisor)."
              : "A HELOC is a revolving credit line. During the draw period (typically 10 years) you pay interest only. After that, you repay principal + interest over the repayment period."}
          </div>
        </>
      )}
    </div>
  );
}
