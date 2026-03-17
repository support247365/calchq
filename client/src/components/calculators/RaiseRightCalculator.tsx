/**
 * CalcHQ — RaiseRight: 401(k) Raise Redirect Calculator
 * Original concept by the CalcHQ team.
 *
 * Core logic: When you receive a raise, increase your 401(k) contribution by
 * the gross raise amount ÷ (1 − effective marginal tax rate). The IRS absorbs
 * the tax savings, so your net take-home pay stays exactly the same.
 *
 * Supports:
 *  - Salaried workers (annual salary entry)
 *  - Hourly workers (hourly rate + hours/week → annual salary calculated)
 *  - Pay stub dollar-amount tax entry (no need to know percentages)
 *  - Silent Social Security wage-base cap handling (no extra questions)
 *  - 2026 IRS 401(k) limit: $23,500
 */
import { useState, useMemo } from "react";
import { TrendingUp, Info } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────
const IRS_401K_LIMIT_2026 = 23500;
const SS_WAGE_BASE_2026 = 168600;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
function fmtPct(n: number, d = 2) {
  return n.toFixed(d) + "%";
}
function fmtNum(n: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

// ─── Shared UI primitives (matching CalcHQ design system) ────────────────────
function InputField({
  label,
  value,
  onChange,
  hint,
  placeholder,
  min,
  max,
  step,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full ${prefix ? "pl-7" : "px-3"} px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
        />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight = false,
  sub,
  green = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 shadow-sm border ${
        green
          ? "bg-emerald-50 border-emerald-100"
          : "bg-white border-gray-50"
      }`}
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-emerald-600" : green ? "text-emerald-700" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Pay frequency options ────────────────────────────────────────────────────
const PAY_FREQ_OPTIONS = [
  { value: "52", label: "Weekly (52×/year)" },
  { value: "26", label: "Bi-Weekly (26×/year)" },
  { value: "24", label: "Semi-Monthly (24×/year)" },
  { value: "12", label: "Monthly (12×/year)" },
];

// ─── Main Calculator ──────────────────────────────────────────────────────────
export function RaiseRightCalculator() {
  // Pay type toggle
  const [payType, setPayType] = useState<"salary" | "hourly">("salary");

  // Step 1 — Current pay info
  const [currentSalary, setCurrentSalary] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [payFrequency, setPayFrequency] = useState("26");

  // Step 1 — Pay stub tax amounts (GROSS period amounts)
  const [grossPayPeriod, setGrossPayPeriod] = useState("");
  const [federalTax, setFederalTax] = useState("");
  const [stateTax, setStateTax] = useState("");
  const [ssTax, setSsTax] = useState("");
  const [medicareTax, setMedicareTax] = useState("");
  const [localTax, setLocalTax] = useState("");
  const [current401k, setCurrent401k] = useState("");

  // Step 2 — New salary
  const [newSalary, setNewSalary] = useState("");
  const [newHourlyRate, setNewHourlyRate] = useState("");

  // ─── Core calculation ─────────────────────────────────────────────────────
  const result = useMemo(() => {
    const periods = parseInt(payFrequency) || 26;

    // Derive current annual salary
    let currentAnnual = 0;
    if (payType === "salary") {
      currentAnnual = parseFloat(currentSalary.replace(/,/g, "")) || 0;
    } else {
      const rate = parseFloat(hourlyRate.replace(/,/g, "")) || 0;
      const hrs = parseFloat(hoursPerWeek) || 0;
      currentAnnual = rate * hrs * 52;
    }

    // Derive new annual salary
    let newAnnual = 0;
    if (payType === "salary") {
      newAnnual = parseFloat(newSalary.replace(/,/g, "")) || 0;
    } else {
      const newRate = parseFloat(newHourlyRate.replace(/,/g, "")) || 0;
      const hrs = parseFloat(hoursPerWeek) || 0;
      newAnnual = newRate * hrs * 52;
    }

    if (currentAnnual <= 0 || newAnnual <= 0 || newAnnual <= currentAnnual) return null;

    // Parse pay stub values
    const gross = parseFloat(grossPayPeriod.replace(/,/g, "")) || 0;
    const fed = parseFloat(federalTax.replace(/,/g, "")) || 0;
    const state = parseFloat(stateTax.replace(/,/g, "")) || 0;
    const ss = parseFloat(ssTax.replace(/,/g, "")) || 0;
    const medicare = parseFloat(medicareTax.replace(/,/g, "")) || 0;
    const local = parseFloat(localTax.replace(/,/g, "")) || 0;
    const current401kAmt = parseFloat(current401k.replace(/,/g, "")) || 0;

    if (gross <= 0) return null;

    // Total taxes this period
    const totalTaxesPeriod = fed + state + ss + medicare + local;

    // Effective tax rate from pay stub
    const effectiveTaxRate = totalTaxesPeriod / gross;

    // ── Marginal rate on the raise ────────────────────────────────────────
    // We use the same rate as the effective rate from the pay stub,
    // but we handle the SS wage base cap silently:
    //
    // Case 1: Both salaries below SS wage base → SS fully applies
    // Case 2: Current salary below, new salary above → SS applies only to
    //         the slice of the raise below the cap (prorated)
    // Case 3: Current salary already above → SS = $0 on stub → drops out naturally
    //
    // For cases 1 & 2, we need to know the SS rate. We derive it from the stub:
    //   ss_rate = ss / gross  (should be ~6.2% if below cap)
    // For case 3, ss = 0 so it naturally contributes 0 to the rate.

    const annualRaise = newAnnual - currentAnnual;
    const raisePerPeriod = annualRaise / periods;

    // Derive component rates from stub
    const fedRate = fed / gross;
    const stateRate = state / gross;
    const localRate = local / gross;
    const medicareRate = medicare / gross; // always 1.45%
    const ssRateFromStub = ss / gross; // ~6.2% if below cap, 0 if above

    // Handle SS proration for raises that cross the wage base
    let effectiveSsRateOnRaise = ssRateFromStub; // default: same rate applies

    if (ss > 0 && currentAnnual < SS_WAGE_BASE_2026) {
      if (newAnnual > SS_WAGE_BASE_2026) {
        // Raise crosses the cap — only the slice below the cap gets SS
        const taxableSlice = SS_WAGE_BASE_2026 - currentAnnual;
        const ssProrationFactor = Math.min(taxableSlice / annualRaise, 1);
        effectiveSsRateOnRaise = ssRateFromStub * ssProrationFactor;
      }
      // else: both below cap — full SS rate applies (already set above)
    }
    // If ss === 0: already above cap, effectiveSsRateOnRaise = 0 (no change needed)

    // Marginal tax rate on the raise
    const marginalRate = fedRate + stateRate + localRate + medicareRate + effectiveSsRateOnRaise;

    // ── Core formula ──────────────────────────────────────────────────────
    // To keep take-home the same:
    //   required_401k_increase = raise_per_period / (1 - marginal_rate)
    // The IRS absorbs: required_401k_increase × marginal_rate
    // Net paycheck change: raise_per_period - required_401k_increase + tax_savings = $0

    if (marginalRate >= 1 || marginalRate <= 0) return null;

    const required401kIncrease = raisePerPeriod / (1 - marginalRate);
    const taxSavings = required401kIncrease * marginalRate;
    const netPaycheckChange = raisePerPeriod - required401kIncrease + taxSavings;

    // New 401k amounts
    const new401kPerPeriod = current401kAmt + required401kIncrease;
    const new401kAnnual = new401kPerPeriod * periods;
    const pctOfIrsLimit = (new401kAnnual / IRS_401K_LIMIT_2026) * 100;
    const remainingIrsRoom = Math.max(0, IRS_401K_LIMIT_2026 - new401kAnnual);

    // Warning if new contribution exceeds IRS limit
    const exceedsLimit = new401kAnnual > IRS_401K_LIMIT_2026;
    const cappedIncrease = exceedsLimit
      ? Math.max(0, (IRS_401K_LIMIT_2026 - current401kAmt * periods) / periods)
      : required401kIncrease;

    return {
      currentAnnual,
      newAnnual,
      annualRaise,
      raisePerPeriod,
      effectiveTaxRate,
      marginalRate,
      required401kIncrease,
      taxSavings,
      netPaycheckChange,
      current401kAmt,
      new401kPerPeriod,
      new401kAnnual,
      pctOfIrsLimit,
      remainingIrsRoom,
      exceedsLimit,
      cappedIncrease,
      periods,
    };
  }, [
    payType,
    currentSalary,
    hourlyRate,
    hoursPerWeek,
    payFrequency,
    grossPayPeriod,
    federalTax,
    stateTax,
    ssTax,
    medicareTax,
    localTax,
    current401k,
    newSalary,
    newHourlyRate,
  ]);

  return (
    <div className="space-y-8">

      {/* Intro banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
        <strong>How RaiseRight works:</strong> When you get a raise, increase your 401(k)
        contribution by the right amount so the IRS tax savings offset the difference — and
        your take-home pay stays exactly the same. Every dollar of your raise goes to your
        future, not your past spending habits.
      </div>

      {/* ── Step 1: Pay Type ─────────────────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Step 1 — Your Pay Type"
          subtitle="Select how you are paid so we can calculate your annual salary."
        />
        <div className="flex gap-3">
          <button
            onClick={() => setPayType("salary")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-all ${
              payType === "salary"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            Salaried
          </button>
          <button
            onClick={() => setPayType("hourly")}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-all ${
              payType === "hourly"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            Hourly
          </button>
        </div>
      </div>

      {/* ── Step 2: Current Pay Info ─────────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Step 2 — Your Current Pay"
          subtitle={
            payType === "salary"
              ? "Enter your current gross annual salary — this is the number before any taxes or deductions."
              : "Enter your current hourly rate and average hours per week. We will calculate your annual salary for you."
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {payType === "salary" ? (
            <InputField
              label="Current Gross Annual Salary ($)"
              value={currentSalary}
              onChange={setCurrentSalary}
              placeholder="e.g. 72000"
              prefix="$"
              hint="GROSS — before taxes or deductions"
            />
          ) : (
            <>
              <InputField
                label="Current Hourly Rate ($)"
                value={hourlyRate}
                onChange={setHourlyRate}
                placeholder="e.g. 24.50"
                prefix="$"
                hint="GROSS — before taxes"
              />
              <InputField
                label="Average Hours Worked Per Week"
                value={hoursPerWeek}
                onChange={setHoursPerWeek}
                placeholder="40"
                hint="Typical full-time = 40 hrs"
              />
            </>
          )}
          <SelectField
            label="Pay Frequency"
            value={payFrequency}
            onChange={setPayFrequency}
            options={PAY_FREQ_OPTIONS}
            hint="How often you receive a paycheck"
          />
        </div>
      </div>

      {/* ── Step 3: Pay Stub Tax Amounts ─────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Step 3 — Your Pay Stub Tax Amounts (This Pay Period)"
          subtitle="Enter the dollar amounts from your most recent pay stub. Only include taxes — do not include health insurance, dental, FSA, HSA, or other benefit deductions."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Gross Pay This Period ($)"
            value={grossPayPeriod}
            onChange={setGrossPayPeriod}
            placeholder="e.g. 2769.23"
            prefix="$"
            hint="GROSS — the top-line number before anything is taken out"
          />
          <InputField
            label="Federal Income Tax Withheld ($)"
            value={federalTax}
            onChange={setFederalTax}
            placeholder="e.g. 385.00"
            prefix="$"
            hint="Labeled 'Federal Tax' or 'FWT' on your stub"
          />
          <InputField
            label="State Income Tax Withheld ($)"
            value={stateTax}
            onChange={setStateTax}
            placeholder="e.g. 110.00"
            prefix="$"
            hint="Enter $0 if your state has no income tax"
          />
          <InputField
            label="Social Security Tax ($)"
            value={ssTax}
            onChange={setSsTax}
            placeholder="e.g. 171.69"
            prefix="$"
            hint="Labeled 'OASDI' or 'SS Tax' — enter $0 if not shown"
          />
          <InputField
            label="Medicare Tax ($)"
            value={medicareTax}
            onChange={setMedicareTax}
            placeholder="e.g. 40.15"
            prefix="$"
            hint="Labeled 'Medicare' or 'MED'"
          />
          <InputField
            label="Local / City Tax ($)"
            value={localTax}
            onChange={setLocalTax}
            placeholder="0.00"
            prefix="$"
            hint="Enter $0 if not applicable"
          />
          <InputField
            label="Current 401(k) Contribution This Period ($)"
            value={current401k}
            onChange={setCurrent401k}
            placeholder="e.g. 200.00"
            prefix="$"
            hint="PRE-TAX deduction — shown on your stub as '401k' or '401(k)'"
          />
        </div>
      </div>

      {/* ── Step 4: New Salary After Raise ───────────────────────────────── */}
      <div>
        <SectionHeader
          title="Step 4 — Your New Salary After Your Raise"
          subtitle={
            payType === "salary"
              ? "Enter your new gross annual salary — this is the number your employer gave you, before taxes."
              : "Enter your new hourly rate after your raise."
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
          {payType === "salary" ? (
            <InputField
              label="New Gross Annual Salary ($)"
              value={newSalary}
              onChange={setNewSalary}
              placeholder="e.g. 76000"
              prefix="$"
              hint="GROSS — before taxes or deductions"
            />
          ) : (
            <InputField
              label="New Hourly Rate ($)"
              value={newHourlyRate}
              onChange={setNewHourlyRate}
              placeholder="e.g. 26.00"
              prefix="$"
              hint="GROSS — your new rate before taxes"
            />
          )}
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {result && (
        <>
          {/* Hero result */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-200" />
              <span className="text-sm font-semibold text-emerald-100 uppercase tracking-wide">
                Your RaiseRight Result
              </span>
            </div>
            <p className="text-emerald-100 text-sm mb-4">
              To keep your take-home pay exactly the same as before your raise:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/15 rounded-xl p-4">
                <p className="text-xs text-emerald-100 mb-1">
                  Increase your 401(k) contribution by
                </p>
                <p className="text-3xl font-bold text-white">
                  {fmt$(result.required401kIncrease)}
                </p>
                <p className="text-xs text-emerald-200 mt-1">per pay period (PRE-TAX)</p>
              </div>
              <div className="bg-white/15 rounded-xl p-4">
                <p className="text-xs text-emerald-100 mb-1">Net change to your paycheck</p>
                <p className="text-3xl font-bold text-white">$0.00</p>
                <p className="text-xs text-emerald-200 mt-1">Your take-home is unchanged</p>
              </div>
            </div>
          </div>

          {/* IRS limit warning */}
          {result.exceedsLimit && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>IRS Limit Note:</strong> The full redirect ({fmt$(result.required401kIncrease)}/period)
              would push your annual 401(k) contribution above the 2026 IRS limit of{" "}
              {fmt$(IRS_401K_LIMIT_2026)}. The maximum additional contribution you can make is{" "}
              <strong>{fmt$(result.cappedIncrease)}/period</strong>. Consider a Roth IRA for the
              remaining amount.
            </div>
          )}

          {/* How the math works */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" />
              How the Math Works
            </h3>
            <div className="space-y-2">
              {[
                {
                  label: "Your gross raise per pay period",
                  value: fmt$(result.raisePerPeriod),
                  sub: `${fmt$(result.annualRaise)}/year`,
                },
                {
                  label: "Your effective tax rate (from pay stub)",
                  value: fmtPct(result.marginalRate * 100),
                  sub: "Calculated from your actual withholding amounts",
                },
                {
                  label: "Required 401(k) increase",
                  value: fmt$(result.required401kIncrease),
                  sub: `Gross raise ÷ (1 − ${fmtPct(result.marginalRate * 100)})`,
                },
                {
                  label: "IRS absorbs (tax savings)",
                  value: fmt$(result.taxSavings),
                  sub: "Reduced withholding on the pre-tax contribution",
                },
                {
                  label: "Net change to your take-home pay",
                  value: "$0.00",
                  sub: "Raise − 401(k) increase + tax savings = $0",
                  highlight: true,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${
                    row.highlight ? "bg-emerald-50 border border-emerald-100" : "bg-white border border-gray-50"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-medium ${row.highlight ? "text-emerald-800" : "text-gray-700"}`}>
                      {row.label}
                    </p>
                    {row.sub && (
                      <p className="text-xs text-gray-400 mt-0.5">{row.sub}</p>
                    )}
                  </div>
                  <p
                    className={`text-sm font-bold ml-4 flex-shrink-0 ${
                      row.highlight ? "text-emerald-600" : "text-gray-800"
                    }`}
                  >
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 401k summary */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">
              Your 401(k) After This Change
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard
                label="New 401(k) per pay period"
                value={fmt$(result.new401kPerPeriod)}
                highlight
                sub="PRE-TAX"
              />
              <ResultCard
                label="New annual 401(k) contribution"
                value={fmt$(result.new401kAnnual)}
                sub={`${result.periods} pay periods × ${fmt$(result.new401kPerPeriod)}`}
              />
              <ResultCard
                label="2026 IRS annual limit"
                value={fmt$(IRS_401K_LIMIT_2026)}
                sub="Maximum pre-tax 401(k) contribution"
              />
              <ResultCard
                label="% of IRS limit you are using"
                value={fmtPct(Math.min(result.pctOfIrsLimit, 100))}
                sub={
                  result.remainingIrsRoom > 0
                    ? `${fmt$(result.remainingIrsRoom)} of room remaining`
                    : "At or above the IRS limit"
                }
                green
              />
            </div>
          </div>

          {/* Salary summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Salary Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ResultCard
                label="Previous gross annual salary"
                value={fmt$(result.currentAnnual)}
                sub="GROSS — before taxes"
              />
              <ResultCard
                label="New gross annual salary"
                value={fmt$(result.newAnnual)}
                sub="GROSS — before taxes"
              />
              <ResultCard
                label="Annual raise amount"
                value={fmt$(result.annualRaise)}
                sub={`${fmt$(result.raisePerPeriod)}/period × ${result.periods} periods`}
                highlight
              />
            </div>
          </div>
        </>
      )}

      {/* Placeholder when inputs are incomplete */}
      {!result && (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
          <TrendingUp className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">
            Fill in Steps 1–4 above to see your personalized RaiseRight result.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            All you need is your pay stub and your new salary — no financial knowledge required.
          </p>
        </div>
      )}
    </div>
  );
}

export default RaiseRightCalculator;
