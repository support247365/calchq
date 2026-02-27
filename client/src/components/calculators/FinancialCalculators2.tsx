/*
 * CalcHQ — New Financial Calculators (Phase 1 Expansion)
 * Design: "Clean Utility" — Space Grotesk headings, Inter body, emerald green accent
 * Calculators: Percentage, Compound Interest, Retirement, Tax/Paycheck, Investment/ROI, Refinance
 */

import { useState } from "react";

// ─── Shared Styles ───────────────────────────────────────────────────────────
const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition";
const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const resultCard = "bg-emerald-50 rounded-xl p-4 border border-emerald-100";
const resultLabel = "text-xs text-gray-500 mb-1";
const resultValue = "text-2xl font-bold text-emerald-600";
const resultValueSm = "text-lg font-bold text-emerald-600";
const sectionTitle = "text-sm font-semibold text-gray-700 mb-3 mt-5 border-b border-gray-100 pb-1";

// ─── 1. Percentage Calculator ─────────────────────────────────────────────────
export function PercentageCalculator() {
  const [mode, setMode] = useState<"whatpct" | "pctof" | "change">("pctof");
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");

  let result = "";
  let resultLabel2 = "";

  if (mode === "pctof") {
    const val = (parseFloat(a) / 100) * parseFloat(b);
    result = isNaN(val) ? "—" : val.toLocaleString("en-US", { maximumFractionDigits: 4 });
    resultLabel2 = `${a}% of ${b}`;
  } else if (mode === "whatpct") {
    const val = (parseFloat(a) / parseFloat(b)) * 100;
    result = isNaN(val) ? "—" : val.toFixed(2) + "%";
    resultLabel2 = `${a} is what % of ${b}`;
  } else {
    const val = ((parseFloat(b) - parseFloat(a)) / parseFloat(a)) * 100;
    result = isNaN(val) ? "—" : (val >= 0 ? "+" : "") + val.toFixed(2) + "%";
    resultLabel2 = `% change from ${a} to ${b}`;
  }

  return (
    <div className="space-y-4">
      <div>
        <p className={labelClass}>Calculation Type</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "pctof", label: "% of a Number" },
            { key: "whatpct", label: "X is What % of Y" },
            { key: "change", label: "% Change" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as typeof mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === m.key
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            {mode === "pctof" ? "Percentage (%)" : mode === "whatpct" ? "Value (X)" : "From Value"}
          </label>
          <input className={inputClass} type="number" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>
            {mode === "pctof" ? "Of Number" : mode === "whatpct" ? "Total (Y)" : "To Value"}
          </label>
          <input className={inputClass} type="number" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
      </div>

      <div className={resultCard}>
        <p className={resultLabel}>{resultLabel2}</p>
        <p className={resultValue}>{result}</p>
      </div>
    </div>
  );
}

// ─── 2. Compound Interest Calculator ─────────────────────────────────────────
export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("10");
  const [compound, setCompound] = useState("12");
  const [monthly, setMonthly] = useState("100");

  const P = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const t = parseFloat(years) || 0;
  const n = parseFloat(compound) || 12;
  const pmt = parseFloat(monthly) || 0;

  // Future value of lump sum + future value of recurring contributions
  const fvLump = P * Math.pow(1 + r / n, n * t);
  const fvPmt = pmt > 0 ? pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) : 0;
  const total = fvLump + fvPmt;
  const totalContributions = P + pmt * 12 * t;
  const interestEarned = total - totalContributions;

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Initial Investment ($)</label>
          <input className={inputClass} type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Annual Interest Rate (%)</label>
          <input className={inputClass} type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Time Period (years)</label>
          <input className={inputClass} type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Compound Frequency</label>
          <select
            className={inputClass}
            value={compound}
            onChange={(e) => setCompound(e.target.value)}
          >
            <option value="1">Annually</option>
            <option value="2">Semi-Annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
            <option value="365">Daily</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Monthly Contribution ($)</label>
          <input className={inputClass} type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={resultCard}>
          <p className={resultLabel}>Future Value</p>
          <p className={resultValueSm}>{fmt(total)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className={resultLabel}>Total Contributed</p>
          <p className="text-lg font-bold text-blue-600">{fmt(totalContributions)}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <p className={resultLabel}>Interest Earned</p>
          <p className="text-lg font-bold text-amber-600">{fmt(interestEarned)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Retirement Calculator ─────────────────────────────────────────────────
export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("30");
  const [retireAge, setRetireAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("50000");
  const [monthlyContrib, setMonthlyContrib] = useState("500");
  const [returnRate, setReturnRate] = useState("7");
  const [withdrawalRate, setWithdrawalRate] = useState("4");

  const yearsToRetire = Math.max(0, parseFloat(retireAge) - parseFloat(currentAge));
  const P = parseFloat(currentSavings) || 0;
  const pmt = parseFloat(monthlyContrib) || 0;
  const r = (parseFloat(returnRate) || 0) / 100;
  const n = 12;
  const t = yearsToRetire;

  const fvLump = P * Math.pow(1 + r / n, n * t);
  const fvPmt = pmt > 0 ? pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) : 0;
  const nest = fvLump + fvPmt;
  const annualIncome = nest * (parseFloat(withdrawalRate) / 100);
  const monthlyIncome = annualIncome / 12;

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Current Age</label>
          <input className={inputClass} type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Retirement Age</label>
          <input className={inputClass} type="number" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Current Savings ($)</label>
          <input className={inputClass} type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Monthly Contribution ($)</label>
          <input className={inputClass} type="number" value={monthlyContrib} onChange={(e) => setMonthlyContrib(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Expected Annual Return (%)</label>
          <input className={inputClass} type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Withdrawal Rate (%)</label>
          <input className={inputClass} type="number" value={withdrawalRate} onChange={(e) => setWithdrawalRate(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={resultCard}>
          <p className={resultLabel}>Nest Egg at {retireAge}</p>
          <p className={resultValueSm}>{fmt(nest)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className={resultLabel}>Annual Income</p>
          <p className="text-lg font-bold text-blue-600">{fmt(annualIncome)}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className={resultLabel}>Monthly Income</p>
          <p className="text-lg font-bold text-purple-600">{fmt(monthlyIncome)}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        Based on {yearsToRetire} years of growth at {returnRate}% annual return, compounded monthly. Withdrawals based on the {withdrawalRate}% rule.
      </p>
    </div>
  );
}

// ─── 4. Paycheck / Tax Calculator ────────────────────────────────────────────
export function PaycheckCalculator() {
  const [grossSalary, setGrossSalary] = useState("75000");
  const [filingStatus, setFilingStatus] = useState("single");
  const [state, setState] = useState("0");
  const [preTax401k, setPreTax401k] = useState("6");

  const gross = parseFloat(grossSalary) || 0;
  const stateRate = parseFloat(state) || 0;
  const k401 = (parseFloat(preTax401k) || 0) / 100;

  const k401Deduction = gross * k401;
  const federalTaxable = gross - k401Deduction;

  // 2024 Federal Tax Brackets (Single)
  let federalTax = 0;
  if (filingStatus === "single") {
    if (federalTaxable > 609350) federalTax = 174238.25 + (federalTaxable - 609350) * 0.37;
    else if (federalTaxable > 243725) federalTax = 55374.25 + (federalTaxable - 243725) * 0.35;
    else if (federalTaxable > 100525) federalTax = 17168.5 + (federalTaxable - 100525) * 0.32;
    else if (federalTaxable > 47150) federalTax = 5426.5 + (federalTaxable - 47150) * 0.22;
    else if (federalTaxable > 11600) federalTax = 1160 + (federalTaxable - 11600) * 0.12;
    else federalTax = federalTaxable * 0.10;
  } else {
    // Married filing jointly
    if (federalTaxable > 731200) federalTax = 196669.5 + (federalTaxable - 731200) * 0.37;
    else if (federalTaxable > 487450) federalTax = 111357 + (federalTaxable - 487450) * 0.35;
    else if (federalTaxable > 201050) federalTax = 34647 + (federalTaxable - 201050) * 0.32;
    else if (federalTaxable > 94300) federalTax = 10294 + (federalTaxable - 94300) * 0.22;
    else if (federalTaxable > 23200) federalTax = 2320 + (federalTaxable - 23200) * 0.12;
    else federalTax = federalTaxable * 0.10;
  }

  const socialSecurity = Math.min(gross * 0.062, 160200 * 0.062);
  const medicare = gross * 0.0145;
  const stateTax = federalTaxable * (stateRate / 100);
  const totalDeductions = federalTax + socialSecurity + medicare + stateTax + k401Deduction;
  const netAnnual = gross - totalDeductions;
  const netMonthly = netAnnual / 12;
  const effectiveRate = (federalTax / gross) * 100;

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Gross Annual Salary ($)</label>
          <input className={inputClass} type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Filing Status</label>
          <select className={inputClass} value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)}>
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>State Income Tax Rate (%)</label>
          <input className={inputClass} type="number" placeholder="e.g. 5.75" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Pre-Tax 401(k) Contribution (%)</label>
          <input className={inputClass} type="number" value={preTax401k} onChange={(e) => setPreTax401k(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={resultCard}>
          <p className={resultLabel}>Take-Home (Annual)</p>
          <p className={resultValueSm}>{fmt(netAnnual)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className={resultLabel}>Take-Home (Monthly)</p>
          <p className="text-lg font-bold text-blue-600">{fmt(netMonthly)}</p>
        </div>
      </div>

      <div className={sectionTitle}>Tax Breakdown</div>
      <div className="space-y-2">
        {[
          { label: "Federal Income Tax", value: federalTax },
          { label: "Social Security (6.2%)", value: socialSecurity },
          { label: "Medicare (1.45%)", value: medicare },
          { label: `State Tax (${state}%)`, value: stateTax },
          { label: `401(k) Contribution (${preTax401k}%)`, value: k401Deduction },
        ].map((row) => (
          <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
            <span className="text-gray-600">{row.label}</span>
            <span className="font-semibold text-gray-800">{fmt(row.value)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm py-1.5 font-bold">
          <span className="text-gray-800">Effective Federal Tax Rate</span>
          <span className="text-emerald-600">{effectiveRate.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── 5. Investment / ROI Calculator ──────────────────────────────────────────
export function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState("10000");
  const [finalValue, setFinalValue] = useState("15000");
  const [years, setYears] = useState("3");

  const initial = parseFloat(initialInvestment) || 0;
  const final = parseFloat(finalValue) || 0;
  const t = parseFloat(years) || 1;

  const roi = initial > 0 ? ((final - initial) / initial) * 100 : 0;
  const annualizedRoi = initial > 0 ? (Math.pow(final / initial, 1 / t) - 1) * 100 : 0;
  const gain = final - initial;

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Initial Investment ($)</label>
          <input className={inputClass} type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Final Value ($)</label>
          <input className={inputClass} type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Investment Period (years)</label>
          <input className={inputClass} type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={resultCard}>
          <p className={resultLabel}>Total ROI</p>
          <p className={resultValueSm}>{roi.toFixed(2)}%</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className={resultLabel}>Annualized ROI</p>
          <p className="text-lg font-bold text-blue-600">{annualizedRoi.toFixed(2)}%</p>
        </div>
        <div className={`${gain >= 0 ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"} rounded-xl p-4 border`}>
          <p className={resultLabel}>Net Gain / Loss</p>
          <p className={`text-lg font-bold ${gain >= 0 ? "text-emerald-600" : "text-red-600"}`}>{fmt(gain)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Mortgage Refinance Calculator ────────────────────────────────────────
export function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState("300000");
  const [currentRate, setCurrentRate] = useState("6.5");
  const [currentRemaining, setCurrentRemaining] = useState("25");
  const [newRate, setNewRate] = useState("5.5");
  const [newTerm, setNewTerm] = useState("30");
  const [closingCosts, setClosingCosts] = useState("5000");

  const calcMonthly = (balance: number, annualRate: number, termYears: number) => {
    const r = annualRate / 100 / 12;
    const n = termYears * 12;
    if (r === 0) return balance / n;
    return (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const balance = parseFloat(currentBalance) || 0;
  const oldMonthly = calcMonthly(balance, parseFloat(currentRate) || 0, parseFloat(currentRemaining) || 1);
  const newMonthly = calcMonthly(balance, parseFloat(newRate) || 0, parseFloat(newTerm) || 1);
  const monthlySavings = oldMonthly - newMonthly;
  const costs = parseFloat(closingCosts) || 0;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(costs / monthlySavings) : Infinity;

  const fmt = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const fmtDec = (v: number) =>
    v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      <div className={sectionTitle}>Current Mortgage</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Remaining Balance ($)</label>
          <input className={inputClass} type="number" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Current Interest Rate (%)</label>
          <input className={inputClass} type="number" value={currentRate} onChange={(e) => setCurrentRate(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Years Remaining</label>
          <input className={inputClass} type="number" value={currentRemaining} onChange={(e) => setCurrentRemaining(e.target.value)} />
        </div>
      </div>

      <div className={sectionTitle}>New Mortgage</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>New Interest Rate (%)</label>
          <input className={inputClass} type="number" value={newRate} onChange={(e) => setNewRate(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>New Loan Term (years)</label>
          <input className={inputClass} type="number" value={newTerm} onChange={(e) => setNewTerm(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Closing Costs ($)</label>
          <input className={inputClass} type="number" value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className={resultLabel}>Current Payment</p>
          <p className="text-lg font-bold text-gray-700">{fmtDec(oldMonthly)}/mo</p>
        </div>
        <div className={resultCard}>
          <p className={resultLabel}>New Payment</p>
          <p className={resultValueSm}>{fmtDec(newMonthly)}/mo</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className={resultLabel}>Monthly Savings</p>
          <p className={`text-lg font-bold ${monthlySavings >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {fmtDec(monthlySavings)}
          </p>
        </div>
      </div>
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
        <p className="text-xs text-gray-500 mb-1">Break-Even Point</p>
        <p className="text-xl font-bold text-amber-600">
          {isFinite(breakEvenMonths)
            ? `${breakEvenMonths} months (${(breakEvenMonths / 12).toFixed(1)} years)`
            : "Refinancing not beneficial"}
        </p>
      </div>
    </div>
  );
}
