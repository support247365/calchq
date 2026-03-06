/**
 * CalcHQ — Phase 14 High-Value Calculators
 * VA Loan Calculator, Credit Card Payoff Calculator, Savings Goal Calculator
 */
import { useState, useMemo } from "react";

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmt$c(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function fmtPct(n: number) {
  return n.toFixed(2) + "%";
}
function fmtNum(n: number, d = 1) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(n);
}

function InputField({ label, value, onChange, unit, min, max, step, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; min?: string; max?: string; step?: string; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{unit && <span className="text-gray-400 font-normal"> ({unit})</span>}
      </label>
      <input
        type="number" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} min={min} max={max} step={step}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
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
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
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

// ─────────────────────────────────────────────────────────────────────────────
// VA LOAN CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export function VALoanCalculator() {
  const [homePrice, setHomePrice] = useState("350000");
  const [downPayment, setDownPayment] = useState("0");
  const [interestRate, setInterestRate] = useState("6.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [serviceType, setServiceType] = useState("regular");
  const [loanUse, setLoanUse] = useState("first");
  const [disabilityExempt, setDisabilityExempt] = useState(false);

  const results = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseInt(loanTerm) || 30;

    if (price <= 0 || rate <= 0) return null;

    const loanAmount = price - down;
    const downPct = price > 0 ? (down / price) * 100 : 0;

    // VA Funding Fee table (2024 rates)
    let fundingFeePct = 0;
    if (!disabilityExempt) {
      if (serviceType === "regular") {
        if (loanUse === "first") {
          if (downPct < 5) fundingFeePct = 2.15;
          else if (downPct < 10) fundingFeePct = 1.5;
          else fundingFeePct = 1.25;
        } else {
          if (downPct < 5) fundingFeePct = 3.3;
          else if (downPct < 10) fundingFeePct = 1.5;
          else fundingFeePct = 1.25;
        }
      } else {
        // Reserves/National Guard
        if (loanUse === "first") {
          if (downPct < 5) fundingFeePct = 2.4;
          else if (downPct < 10) fundingFeePct = 1.75;
          else fundingFeePct = 1.5;
        } else {
          if (downPct < 5) fundingFeePct = 3.3;
          else if (downPct < 10) fundingFeePct = 1.75;
          else fundingFeePct = 1.5;
        }
      }
    }

    const fundingFee = loanAmount * (fundingFeePct / 100);
    const totalLoan = loanAmount + fundingFee;

    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    const monthlyPayment = totalLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - totalLoan;

    // Compare to conventional with 5% down + PMI
    const convDown = price * 0.05;
    const convLoan = price - convDown;
    const convMonthly = convLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const pmi = (convLoan * 0.01) / 12; // ~1% PMI annually
    const convTotal = convMonthly + pmi;
    const monthlySavings = convTotal - monthlyPayment;

    return {
      loanAmount, fundingFeePct, fundingFee, totalLoan,
      monthlyPayment, totalPaid, totalInterest,
      monthlySavings, downPct
    };
  }, [homePrice, downPayment, interestRate, loanTerm, serviceType, loanUse, disabilityExempt]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Home Purchase Price" value={homePrice} onChange={setHomePrice} unit="$" min="0" step="1000" placeholder="350000" />
        <InputField label="Down Payment" value={downPayment} onChange={setDownPayment} unit="$" min="0" step="1000" placeholder="0" hint="VA loans allow $0 down" />
        <InputField label="Interest Rate" value={interestRate} onChange={setInterestRate} unit="%" min="0" max="20" step="0.05" placeholder="6.5" />
        <SelectField label="Loan Term" value={loanTerm} onChange={setLoanTerm}
          options={[{ value: "30", label: "30 Years" }, { value: "20", label: "20 Years" }, { value: "15", label: "15 Years" }, { value: "10", label: "10 Years" }]} />
        <SelectField label="Service Type" value={serviceType} onChange={setServiceType}
          options={[{ value: "regular", label: "Regular Military / Veterans" }, { value: "reserves", label: "Reserves / National Guard" }]} />
        <SelectField label="Loan Use" value={loanUse} onChange={setLoanUse}
          options={[{ value: "first", label: "First VA Loan Use" }, { value: "subsequent", label: "Subsequent VA Loan Use" }]} />
      </div>

      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <input type="checkbox" id="disability" checked={disabilityExempt} onChange={(e) => setDisabilityExempt(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded" />
        <label htmlFor="disability" className="text-sm text-blue-800 font-medium">
          Exempt from VA Funding Fee (service-connected disability rating ≥ 10%)
        </label>
      </div>

      {results ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultCard label="Monthly Payment" value={fmt$c(results.monthlyPayment)} highlight />
              <ResultCard label="VA Funding Fee" value={disabilityExempt ? "Exempt" : fmt$(results.fundingFee)} sub={disabilityExempt ? "Disability exemption" : `${fmtPct(results.fundingFeePct)} of loan`} />
              <ResultCard label="Total Loan Amount" value={fmt$(results.totalLoan)} sub="Including funding fee" />
              <ResultCard label="Total Interest" value={fmt$(results.totalInterest)} sub="Over loan life" />
            </div>
          </div>

          {results.monthlySavings > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm font-bold text-emerald-800 mb-1">VA Loan Advantage</p>
              <p className="text-sm text-emerald-700">
                Compared to a conventional loan with 5% down + PMI, your VA loan saves approximately{" "}
                <strong>{fmt$c(results.monthlySavings)}/month</strong> — that is{" "}
                <strong>{fmt$(results.monthlySavings * 12)}/year</strong> in savings.
              </p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Loan Summary</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Home Price:</span><span className="font-medium">{fmt$(parseFloat(homePrice) || 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Down Payment:</span><span className="font-medium">{fmt$(parseFloat(downPayment) || 0)} ({fmtPct(results.downPct)})</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Base Loan:</span><span className="font-medium">{fmt$(results.loanAmount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Funding Fee:</span><span className="font-medium">{disabilityExempt ? "$0 (Exempt)" : fmt$c(results.fundingFee)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Paid:</span><span className="font-medium">{fmt$(results.totalPaid)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">No PMI Required:</span><span className="font-medium text-emerald-600">✓ Saves ~{fmt$(results.loanAmount * 0.01)}/yr</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">Enter home price and interest rate to calculate</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREDIT CARD PAYOFF CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("20");
  const [mode, setMode] = useState<"payment" | "date">("payment");
  const [monthlyPayment, setMonthlyPayment] = useState("200");
  const [targetMonths, setTargetMonths] = useState("24");

  const results = useMemo(() => {
    const bal = parseFloat(balance) || 0;
    const rate = parseFloat(apr) || 0;
    if (bal <= 0 || rate <= 0) return null;

    const monthlyRate = rate / 100 / 12;

    if (mode === "payment") {
      const pmt = parseFloat(monthlyPayment) || 0;
      if (pmt <= bal * monthlyRate) return { error: "Payment too low — must exceed monthly interest charge of " + fmt$c(bal * monthlyRate) };

      let remaining = bal;
      let months = 0;
      let totalInterest = 0;

      while (remaining > 0.01 && months < 1200) {
        const interest = remaining * monthlyRate;
        totalInterest += interest;
        const principal = Math.min(pmt - interest, remaining);
        remaining -= principal;
        months++;
      }

      // Minimum payment scenario (2% of balance or $25, whichever is higher)
      let minRemaining = bal;
      let minMonths = 0;
      let minInterest = 0;
      while (minRemaining > 0.01 && minMonths < 1200) {
        const minPmt = Math.max(minRemaining * 0.02, 25);
        const interest = minRemaining * monthlyRate;
        minInterest += interest;
        const principal = Math.min(minPmt - interest, minRemaining);
        if (principal <= 0) break;
        minRemaining -= principal;
        minMonths++;
      }

      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      const timeStr = years > 0 ? `${years}y ${remMonths}m` : `${months} months`;

      return {
        mode: "payment" as const,
        months, timeStr, totalInterest,
        totalPaid: bal + totalInterest,
        minMonths, minInterest,
        interestSaved: minInterest - totalInterest,
        monthsSaved: minMonths - months,
      };
    } else {
      const tMonths = parseInt(targetMonths) || 24;
      // Required payment formula: P * r * (1+r)^n / ((1+r)^n - 1)
      const required = bal * (monthlyRate * Math.pow(1 + monthlyRate, tMonths)) /
        (Math.pow(1 + monthlyRate, tMonths) - 1);
      const totalPaid = required * tMonths;
      const totalInterest = totalPaid - bal;

      return {
        mode: "date" as const,
        required, totalPaid, totalInterest,
        months: tMonths,
      };
    }
  }, [balance, apr, mode, monthlyPayment, targetMonths]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Current Balance" value={balance} onChange={setBalance} unit="$" min="0" step="100" placeholder="5000" />
        <InputField label="Annual Percentage Rate (APR)" value={apr} onChange={setApr} unit="%" min="0" max="50" step="0.1" placeholder="20" />
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button onClick={() => setMode("payment")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === "payment" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          I'll Pay a Fixed Amount
        </button>
        <button onClick={() => setMode("date")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === "date" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          I Have a Target Date
        </button>
      </div>

      {mode === "payment" ? (
        <InputField label="Monthly Payment" value={monthlyPayment} onChange={setMonthlyPayment} unit="$" min="0" step="10" placeholder="200"
          hint={`Minimum interest charge: ${fmt$c((parseFloat(balance) || 0) * (parseFloat(apr) || 0) / 100 / 12)}/month`} />
      ) : (
        <InputField label="Pay Off In" value={targetMonths} onChange={setTargetMonths} unit="months" min="1" max="360" step="1" placeholder="24"
          hint="How many months until you want to be debt-free?" />
      )}

      {results && !("error" in results) ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-5 border border-red-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {results.mode === "payment" ? (
                <>
                  <ResultCard label="Payoff Time" value={results.timeStr} highlight />
                  <ResultCard label="Total Interest" value={fmt$(results.totalInterest)} sub="You'll pay this extra" />
                  <ResultCard label="Total Paid" value={fmt$(results.totalPaid)} />
                  <ResultCard label="Interest Saved vs Min" value={fmt$(results.interestSaved)} sub={`${results.monthsSaved} months faster`} />
                </>
              ) : (
                <>
                  <ResultCard label="Required Monthly Payment" value={fmt$c(results.required)} highlight />
                  <ResultCard label="Total Interest" value={fmt$(results.totalInterest)} />
                  <ResultCard label="Total Paid" value={fmt$(results.totalPaid)} />
                  <ResultCard label="Payoff Timeline" value={`${Math.floor(results.months / 12)}y ${results.months % 12}m`} />
                </>
              )}
            </div>
          </div>

          {results.mode === "payment" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-bold text-amber-800 mb-1">Minimum Payment Warning</p>
              <p className="text-sm text-amber-700">
                Paying only the minimum (2% of balance) would take{" "}
                <strong>{Math.floor(results.minMonths / 12)} years {results.minMonths % 12} months</strong> and cost{" "}
                <strong>{fmt$(results.minInterest)}</strong> in interest — {fmt$(results.interestSaved)} more than your plan.
              </p>
            </div>
          )}
        </div>
      ) : results && "error" in results ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{results.error}</div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">Enter your balance and APR to calculate</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVINGS GOAL CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────

export function SavingsGoalCalculator() {
  const [mode, setMode] = useState<"time" | "amount">("time");
  const [goalAmount, setGoalAmount] = useState("20000");
  const [currentSavings, setCurrentSavings] = useState("1000");
  const [monthlyContribution, setMonthlyContribution] = useState("500");
  const [annualReturn, setAnnualReturn] = useState("4.5");
  const [targetMonths, setTargetMonths] = useState("36");

  const results = useMemo(() => {
    const goal = parseFloat(goalAmount) || 0;
    const current = parseFloat(currentSavings) || 0;
    const rate = parseFloat(annualReturn) || 0;
    if (goal <= 0) return null;

    const monthlyRate = rate / 100 / 12;

    if (mode === "time") {
      const pmt = parseFloat(monthlyContribution) || 0;
      if (pmt <= 0 && current >= goal) {
        return { mode: "time" as const, months: 0, timeStr: "Already reached!", totalContributions: 0, totalInterest: 0, finalAmount: current };
      }

      // Find months needed
      let balance = current;
      let months = 0;
      let totalContributions = 0;

      while (balance < goal && months < 1200) {
        balance = balance * (1 + monthlyRate) + pmt;
        totalContributions += pmt;
        months++;
      }

      const totalInterest = balance - current - totalContributions;
      const years = Math.floor(months / 12);
      const remMonths = months % 12;
      const timeStr = months === 0 ? "Already reached!" : years > 0 ? `${years} year${years !== 1 ? "s" : ""} ${remMonths} month${remMonths !== 1 ? "s" : ""}` : `${months} month${months !== 1 ? "s" : ""}`;

      // Build milestone data
      const milestones = [];
      let bal = current;
      for (let m = 1; m <= months; m++) {
        bal = bal * (1 + monthlyRate) + pmt;
        if (m % Math.max(1, Math.floor(months / 5)) === 0 || m === months) {
          milestones.push({ month: m, balance: bal });
        }
      }

      return { mode: "time" as const, months, timeStr, totalContributions, totalInterest, finalAmount: balance, milestones };
    } else {
      const tMonths = parseInt(targetMonths) || 36;
      const needed = goal - current;

      // Required monthly contribution: PMT = (FV - PV*(1+r)^n) / (((1+r)^n - 1) / r)
      let required: number;
      if (monthlyRate === 0) {
        required = needed / tMonths;
      } else {
        const factor = (Math.pow(1 + monthlyRate, tMonths) - 1) / monthlyRate;
        required = (needed - current * (Math.pow(1 + monthlyRate, tMonths) - 1)) / factor;
      }

      const totalContributions = required * tMonths;
      const totalInterest = goal - current - totalContributions;

      return {
        mode: "date" as const,
        required: Math.max(0, required),
        totalContributions: Math.max(0, totalContributions),
        totalInterest,
        months: tMonths,
      };
    }
  }, [goalAmount, currentSavings, monthlyContribution, annualReturn, targetMonths, mode]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Savings Goal" value={goalAmount} onChange={setGoalAmount} unit="$" min="0" step="1000" placeholder="20000" />
        <InputField label="Current Savings" value={currentSavings} onChange={setCurrentSavings} unit="$" min="0" step="100" placeholder="1000" />
        <InputField label="Annual Interest Rate (APY)" value={annualReturn} onChange={setAnnualReturn} unit="%" min="0" max="20" step="0.1" placeholder="4.5"
          hint="High-yield savings accounts: 4-5% APY (2024)" />
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button onClick={() => setMode("time")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === "time" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          How Long Will It Take?
        </button>
        <button onClick={() => setMode("amount")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${mode === "amount" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
          How Much Do I Need to Save?
        </button>
      </div>

      {mode === "time" ? (
        <InputField label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} unit="$" min="0" step="50" placeholder="500" />
      ) : (
        <InputField label="Target Timeframe" value={targetMonths} onChange={setTargetMonths} unit="months" min="1" max="600" step="1" placeholder="36"
          hint="How many months until you need the money?" />
      )}

      {results ? (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {results.mode === "time" ? (
                <>
                  <ResultCard label="Time to Goal" value={results.timeStr} highlight />
                  <ResultCard label="Total Contributions" value={fmt$(results.totalContributions)} />
                  <ResultCard label="Interest Earned" value={fmt$(results.totalInterest)} sub="Free money from APY" />
                  <ResultCard label="Final Balance" value={fmt$(results.finalAmount)} />
                </>
              ) : (
                <>
                  <ResultCard label="Required Monthly Savings" value={fmt$c(results.required)} highlight />
                  <ResultCard label="Total You'll Contribute" value={fmt$(results.totalContributions)} />
                  <ResultCard label="Interest Earned" value={fmt$(results.totalInterest)} sub="Compound growth" />
                  <ResultCard label="Timeframe" value={`${Math.floor(results.months / 12)}y ${results.months % 12}m`} />
                </>
              )}
            </div>
          </div>

          {results.mode === "time" && results.months > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Savings Progress</p>
              <div className="space-y-2">
                {results.milestones?.map((m, i) => {
                  const pct = Math.min(100, (m.balance / (parseFloat(goalAmount) || 1)) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16 text-right">Month {m.month}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-700 w-20">{fmt$(m.balance)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm font-bold text-blue-800 mb-1">💡 Pro Tip: High-Yield Savings</p>
            <p className="text-sm text-blue-700">
              Top online banks (Ally, Marcus, SoFi) currently offer 4-5% APY — 10x the national average of 0.46%.
              At 4.5% APY vs 0.46%, you'd earn{" "}
              <strong>{fmt$((parseFloat(goalAmount) || 0) * (0.045 - 0.0046))}</strong> more interest on your goal amount per year.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">Enter your savings goal to calculate</div>
      )}
    </div>
  );
}
