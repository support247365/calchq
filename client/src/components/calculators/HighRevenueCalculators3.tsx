/**
 * CalcHQ — High-Revenue Business Calculators Batch 3
 * Business Valuation, Break-Even, Depreciation, Workers Comp
 */
import { useState, useMemo } from "react";

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmt$c(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
function fmtNum(n: number, d = 1) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(n);
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
        type="number" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} min={min} max={max} step={step}
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
// BUSINESS VALUATION CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function BusinessValuationCalculator() {
  const [method, setMethod] = useState<"earnings" | "revenue" | "assets" | "dcf">("earnings");
  const [annualRevenue, setAnnualRevenue] = useState("500000");
  const [netIncome, setNetIncome] = useState("100000");
  const [ebitda, setEbitda] = useState("120000");
  const [industry, setIndustry] = useState("general");
  const [totalAssets, setTotalAssets] = useState("300000");
  const [totalLiabilities, setTotalLiabilities] = useState("100000");
  const [growthRate, setGrowthRate] = useState("10");
  const [discountRate, setDiscountRate] = useState("15");
  const [projectionYears, setProjectionYears] = useState("5");

  const INDUSTRY_MULTIPLES: Record<string, { revenue: number; ebitda: number; label: string }> = {
    general: { revenue: 1.5, ebitda: 5, label: "General Business" },
    saas: { revenue: 6, ebitda: 15, label: "SaaS / Software" },
    retail: { revenue: 0.5, ebitda: 4, label: "Retail" },
    restaurant: { revenue: 0.4, ebitda: 3, label: "Restaurant / Food Service" },
    manufacturing: { revenue: 0.8, ebitda: 5, label: "Manufacturing" },
    services: { revenue: 1.2, ebitda: 5, label: "Professional Services" },
    healthcare: { revenue: 1.5, ebitda: 7, label: "Healthcare" },
    construction: { revenue: 0.5, ebitda: 4, label: "Construction" },
    ecommerce: { revenue: 2, ebitda: 8, label: "E-commerce" },
    tech: { revenue: 4, ebitda: 12, label: "Technology" },
  };

  const result = useMemo(() => {
    const revenue = parseFloat(annualRevenue.replace(/,/g, "")) || 0;
    const income = parseFloat(netIncome.replace(/,/g, "")) || 0;
    const ebitdaVal = parseFloat(ebitda.replace(/,/g, "")) || 0;
    const assets = parseFloat(totalAssets.replace(/,/g, "")) || 0;
    const liabilities = parseFloat(totalLiabilities.replace(/,/g, "")) || 0;
    const growth = parseFloat(growthRate) / 100 || 0.1;
    const discount = parseFloat(discountRate) / 100 || 0.15;
    const years = parseInt(projectionYears) || 5;

    const mult = INDUSTRY_MULTIPLES[industry];
    const netAssets = assets - liabilities;

    // Earnings-based (SDE multiple for small biz, EBITDA for larger)
    const sdeMultiple = income < 200000 ? 2.5 : income < 500000 ? 3.5 : 4.5;
    const earningsVal = income * sdeMultiple;
    const ebitdaVal2 = ebitdaVal * mult.ebitda;

    // Revenue multiple
    const revenueVal = revenue * mult.revenue;

    // Asset-based
    const assetVal = netAssets;

    // DCF
    let dcfVal = 0;
    let cashFlow = income;
    for (let y = 1; y <= years; y++) {
      cashFlow *= (1 + growth);
      dcfVal += cashFlow / Math.pow(1 + discount, y);
    }
    // Terminal value (Gordon Growth Model)
    const terminalGrowth = 0.03;
    const terminalValue = (cashFlow * (1 + terminalGrowth)) / (discount - terminalGrowth);
    dcfVal += terminalValue / Math.pow(1 + discount, years);

    const valuations = [
      { method: "Earnings Multiple (SDE)", value: earningsVal, multiple: `${sdeMultiple}x net income` },
      { method: "EBITDA Multiple", value: ebitdaVal2, multiple: `${mult.ebitda}x EBITDA` },
      { method: "Revenue Multiple", value: revenueVal, multiple: `${mult.revenue}x revenue` },
      { method: "Asset-Based", value: assetVal, multiple: "Net assets" },
      { method: "DCF (5-year)", value: dcfVal, multiple: `${(parseFloat(growthRate))}% growth, ${(parseFloat(discountRate))}% discount` },
    ];

    const avg = valuations.reduce((s, v) => s + v.value, 0) / valuations.length;
    const low = Math.min(...valuations.map(v => v.value));
    const high = Math.max(...valuations.map(v => v.value));

    return { valuations, avg, low, high, mult };
  }, [annualRevenue, netIncome, ebitda, industry, totalAssets, totalLiabilities, growthRate, discountRate, projectionYears]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { value: "earnings", label: "All Methods" },
        ].map(m => (
          <div key={m.value} className="text-sm text-gray-500 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
            Showing all 5 valuation methods simultaneously for a complete picture
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField label="Industry" value={industry} onChange={setIndustry}
          options={Object.entries(INDUSTRY_MULTIPLES).map(([k, v]) => ({ value: k, label: v.label }))} />
        <InputField label="Annual Revenue ($)" value={annualRevenue} onChange={setAnnualRevenue} placeholder="500,000" />
        <InputField label="Net Income / SDE ($)" value={netIncome} onChange={setNetIncome} placeholder="100,000" />
        <InputField label="EBITDA ($)" value={ebitda} onChange={setEbitda} placeholder="120,000" />
        <InputField label="Total Assets ($)" value={totalAssets} onChange={setTotalAssets} placeholder="300,000" />
        <InputField label="Total Liabilities ($)" value={totalLiabilities} onChange={setTotalLiabilities} placeholder="100,000" />
        <InputField label="Annual Growth Rate (%)" value={growthRate} onChange={setGrowthRate} step="1" min="0" max="100" />
        <InputField label="Discount Rate (%)" value={discountRate} onChange={setDiscountRate} step="1" min="5" max="50" />
      </div>

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Estimated Business Value</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <ResultCard label="Valuation Range (Low)" value={fmt$(result.low)} />
              <ResultCard label="Average Across Methods" value={fmt$(result.avg)} highlight />
              <ResultCard label="Valuation Range (High)" value={fmt$(result.high)} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Breakdown by Method</h3>
            {result.valuations.map(v => (
              <div key={v.method} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{v.method}</p>
                  <p className="text-xs text-gray-500">{v.multiple}</p>
                </div>
                <p className="text-xl font-bold text-emerald-600">{fmt$(v.value)}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>Disclaimer:</strong> Business valuation is complex and depends on many factors including market conditions, growth prospects, customer concentration, and intangibles. This calculator provides estimates for reference only. Consult a certified business valuator (CBV) or M&A advisor for an accurate valuation.
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BREAK-EVEN CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState("10000");
  const [variableCostPerUnit, setVariableCostPerUnit] = useState("25");
  const [pricePerUnit, setPricePerUnit] = useState("50");
  const [targetProfit, setTargetProfit] = useState("5000");

  const result = useMemo(() => {
    const fixed = parseFloat(fixedCosts.replace(/,/g, "")) || 0;
    const variable = parseFloat(variableCostPerUnit) || 0;
    const price = parseFloat(pricePerUnit) || 0;
    const target = parseFloat(targetProfit.replace(/,/g, "")) || 0;

    if (price <= variable) return null;

    const contributionMargin = price - variable;
    const contributionMarginPct = (contributionMargin / price) * 100;
    const breakEvenUnits = fixed / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * price;
    const targetUnits = (fixed + target) / contributionMargin;
    const targetRevenue = targetUnits * price;

    // Chart data: revenue and cost at various unit levels
    const maxUnits = Math.ceil(targetUnits * 1.5);
    const step = Math.max(1, Math.floor(maxUnits / 10));
    const chartData = [];
    for (let u = 0; u <= maxUnits; u += step) {
      chartData.push({
        units: u,
        revenue: u * price,
        totalCost: fixed + u * variable,
        profit: u * price - (fixed + u * variable),
      });
    }

    return {
      contributionMargin, contributionMarginPct,
      breakEvenUnits, breakEvenRevenue,
      targetUnits, targetRevenue,
      chartData, fixed, variable, price,
    };
  }, [fixedCosts, variableCostPerUnit, pricePerUnit, targetProfit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InputField label="Fixed Costs / Month ($)" value={fixedCosts} onChange={setFixedCosts} placeholder="10,000" />
        <InputField label="Variable Cost per Unit ($)" value={variableCostPerUnit} onChange={setVariableCostPerUnit} placeholder="25" step="0.01" />
        <InputField label="Selling Price per Unit ($)" value={pricePerUnit} onChange={setPricePerUnit} placeholder="50" step="0.01" />
        <InputField label="Target Monthly Profit ($)" value={targetProfit} onChange={setTargetProfit} placeholder="5,000" />
      </div>

      {result === null && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700">
          ⚠️ Selling price must be higher than variable cost per unit to achieve break-even.
        </div>
      )}

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Break-Even Analysis</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard label="Break-Even Units" value={fmtNum(result.breakEvenUnits, 0) + " units"} highlight />
              <ResultCard label="Break-Even Revenue" value={fmt$(result.breakEvenRevenue)} />
              <ResultCard label="Contribution Margin" value={fmt$c(result.contributionMargin) + " / unit"} sub={result.contributionMarginPct.toFixed(1) + "% margin"} />
              <ResultCard label="Units for Target Profit" value={fmtNum(result.targetUnits, 0) + " units"} sub={fmt$(result.targetRevenue) + " revenue"} />
            </div>
          </div>

          {/* Profit table */}
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Units Sold", "Revenue", "Total Cost", "Profit / Loss"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.chartData.map(row => (
                  <tr key={row.units} className={`hover:bg-gray-50 ${row.profit >= 0 ? "" : "bg-red-50/30"}`}>
                    <td className="px-4 py-2 text-gray-600">{fmtNum(row.units, 0)}</td>
                    <td className="px-4 py-2 font-medium">{fmt$(row.revenue)}</td>
                    <td className="px-4 py-2">{fmt$(row.totalCost)}</td>
                    <td className={`px-4 py-2 font-semibold ${row.profit >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {row.profit >= 0 ? "+" : ""}{fmt$(row.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEPRECIATION CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function DepreciationCalculator() {
  const [assetCost, setAssetCost] = useState("50000");
  const [salvageValue, setSalvageValue] = useState("5000");
  const [usefulLife, setUsefulLife] = useState("5");
  const [method, setMethod] = useState<"straight" | "declining" | "sum" | "units">("straight");
  const [totalUnits, setTotalUnits] = useState("100000");
  const [unitsPerYear, setUnitsPerYear] = useState("20000");

  const result = useMemo(() => {
    const cost = parseFloat(assetCost.replace(/,/g, "")) || 0;
    const salvage = parseFloat(salvageValue.replace(/,/g, "")) || 0;
    const life = parseInt(usefulLife) || 5;
    const depreciableBase = cost - salvage;

    if (cost <= 0 || life <= 0 || salvage >= cost) return null;

    const schedule: { year: number; depreciation: number; accumulated: number; bookValue: number }[] = [];

    if (method === "straight") {
      const annualDep = depreciableBase / life;
      let accumulated = 0;
      for (let y = 1; y <= life; y++) {
        accumulated += annualDep;
        schedule.push({ year: y, depreciation: annualDep, accumulated, bookValue: cost - accumulated });
      }
    } else if (method === "declining") {
      const rate = 2 / life; // 200% declining balance (double declining)
      let bookValue = cost;
      let accumulated = 0;
      for (let y = 1; y <= life; y++) {
        let dep = bookValue * rate;
        // Switch to straight-line when it gives higher deduction
        const remainingLife = life - y + 1;
        const slDep = (bookValue - salvage) / remainingLife;
        if (slDep > dep) dep = slDep;
        dep = Math.min(dep, bookValue - salvage);
        accumulated += dep;
        bookValue -= dep;
        schedule.push({ year: y, depreciation: dep, accumulated, bookValue });
      }
    } else if (method === "sum") {
      const sumOfYears = (life * (life + 1)) / 2;
      let accumulated = 0;
      for (let y = 1; y <= life; y++) {
        const fraction = (life - y + 1) / sumOfYears;
        const dep = depreciableBase * fraction;
        accumulated += dep;
        schedule.push({ year: y, depreciation: dep, accumulated, bookValue: cost - accumulated });
      }
    } else {
      // Units of production
      const total = parseFloat(totalUnits) || 100000;
      const perYear = parseFloat(unitsPerYear) || 20000;
      const depPerUnit = depreciableBase / total;
      let accumulated = 0;
      const years = Math.ceil(total / perYear);
      for (let y = 1; y <= years; y++) {
        const units = Math.min(perYear, total - (y - 1) * perYear);
        const dep = units * depPerUnit;
        accumulated += dep;
        schedule.push({ year: y, depreciation: dep, accumulated, bookValue: cost - accumulated });
      }
    }

    const totalDepreciation = schedule.reduce((s, r) => s + r.depreciation, 0);

    return { schedule, totalDepreciation, depreciableBase };
  }, [assetCost, salvageValue, usefulLife, method, totalUnits, unitsPerYear]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InputField label="Asset Cost ($)" value={assetCost} onChange={setAssetCost} placeholder="50,000" />
        <InputField label="Salvage Value ($)" value={salvageValue} onChange={setSalvageValue} placeholder="5,000" min="0" />
        <InputField label="Useful Life (years)" value={usefulLife} onChange={setUsefulLife} placeholder="5" min="1" max="40" />
        <SelectField label="Depreciation Method" value={method} onChange={v => setMethod(v as typeof method)} options={[
          { value: "straight", label: "Straight-Line (SL)" },
          { value: "declining", label: "Double Declining Balance (DDB)" },
          { value: "sum", label: "Sum of Years Digits (SYD)" },
          { value: "units", label: "Units of Production" },
        ]} />
      </div>

      {method === "units" && (
        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <InputField label="Total Estimated Units" value={totalUnits} onChange={setTotalUnits} placeholder="100,000" />
          <InputField label="Units Per Year" value={unitsPerYear} onChange={setUnitsPerYear} placeholder="20,000" />
        </div>
      )}

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ResultCard label="Depreciable Base" value={fmt$(result.depreciableBase)} />
              <ResultCard label="Total Depreciation" value={fmt$(result.totalDepreciation)} highlight />
              <ResultCard label="Salvage Value" value={fmt$(parseFloat(salvageValue) || 0)} sub="remaining book value" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Year", "Depreciation", "Accumulated", "Book Value"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.schedule.map(row => (
                  <tr key={row.year} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{row.year}</td>
                    <td className="px-4 py-2 font-medium text-red-600">({fmt$c(row.depreciation)})</td>
                    <td className="px-4 py-2 text-gray-600">{fmt$(row.accumulated)}</td>
                    <td className="px-4 py-2 font-semibold text-gray-800">{fmt$(row.bookValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKERS COMP CALCULATOR (Estimate)
// ─────────────────────────────────────────────────────────────────────────────
// NCCI class codes and approximate rates per $100 payroll
const WC_CLASSES: Record<string, { label: string; rate: number; risk: string }> = {
  "8810": { label: "Clerical / Office (8810)", rate: 0.18, risk: "Very Low" },
  "8742": { label: "Sales / Outside (8742)", rate: 0.55, risk: "Low" },
  "8748": { label: "Auto Dealer (8748)", rate: 0.60, risk: "Low" },
  "7380": { label: "Trucking (7380)", rate: 8.50, risk: "High" },
  "5403": { label: "Carpentry (5403)", rate: 12.00, risk: "High" },
  "5183": { label: "Plumbing (5183)", rate: 7.50, risk: "High" },
  "5190": { label: "Electrical (5190)", rate: 4.50, risk: "Medium" },
  "8017": { label: "Retail Store (8017)", rate: 1.20, risk: "Low" },
  "9082": { label: "Restaurant (9082)", rate: 2.50, risk: "Medium" },
  "8832": { label: "Medical Office (8832)", rate: 0.90, risk: "Low" },
  "5645": { label: "Residential Construction (5645)", rate: 15.00, risk: "Very High" },
  "8227": { label: "Logging (8227)", rate: 25.00, risk: "Very High" },
  "8829": { label: "Nursing Home (8829)", rate: 4.50, risk: "Medium" },
  "9014": { label: "Janitorial (9014)", rate: 3.80, risk: "Medium" },
  "7520": { label: "Concrete Work (7520)", rate: 9.00, risk: "High" },
};

export function WorkersCompCalculator() {
  const [classCode, setClassCode] = useState("8810");
  const [annualPayroll, setAnnualPayroll] = useState("250000");
  const [numEmployees, setNumEmployees] = useState("5");
  const [experienceMod, setExperienceMod] = useState("1.0");
  const [state, setState] = useState("national");

  const result = useMemo(() => {
    const payroll = parseFloat(annualPayroll.replace(/,/g, "")) || 0;
    const employees = parseInt(numEmployees) || 1;
    const xMod = parseFloat(experienceMod) || 1.0;

    const cls = WC_CLASSES[classCode];
    if (!cls || payroll <= 0) return null;

    const baseRate = cls.rate / 100; // per dollar of payroll
    const basePremium = payroll * baseRate;
    const adjustedPremium = basePremium * xMod;

    // Typical additional charges
    const stateSurcharge = adjustedPremium * 0.05; // ~5% state surcharge
    const totalPremium = adjustedPremium + stateSurcharge;

    const perEmployee = totalPremium / employees;
    const perPayrollDollar = totalPremium / payroll;

    return {
      cls, basePremium, adjustedPremium, stateSurcharge, totalPremium,
      perEmployee, perPayrollDollar, payroll, xMod,
    };
  }, [classCode, annualPayroll, numEmployees, experienceMod]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
        <strong>Estimate Only:</strong> Workers' compensation rates vary significantly by state, insurer, claims history, and payroll audit results. This calculator uses approximate NCCI base rates for illustration. Get quotes from licensed insurers for accurate pricing.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField label="Job Classification" value={classCode} onChange={setClassCode}
          options={Object.entries(WC_CLASSES).map(([k, v]) => ({ value: k, label: v.label }))} />
        <InputField label="Annual Payroll ($)" value={annualPayroll} onChange={setAnnualPayroll} placeholder="250,000" />
        <InputField label="Number of Employees" value={numEmployees} onChange={setNumEmployees} placeholder="5" min="1" />
        <InputField label="Experience Modifier (X-Mod)" value={experienceMod} onChange={setExperienceMod}
          placeholder="1.0" step="0.01" min="0.5" max="3.0" />
      </div>

      {result && (
        <>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4">Estimated Annual Premium</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResultCard label="Estimated Annual Premium" value={fmt$(result.totalPremium)} highlight />
              <ResultCard label="Base Premium" value={fmt$(result.basePremium)} sub={`Rate: $${result.cls.rate} per $100 payroll`} />
              <ResultCard label="After X-Mod ({result.xMod}x)" value={fmt$(result.adjustedPremium)} />
              <ResultCard label="Cost per Employee" value={fmt$(result.perEmployee)} sub="per year" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Risk Level</p>
              <p className={`font-semibold ${
                result.cls.risk === "Very Low" || result.cls.risk === "Low" ? "text-green-700" :
                result.cls.risk === "Medium" ? "text-yellow-700" : "text-red-700"
              }`}>{result.cls.risk}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Rate per $100 Payroll</p>
              <p className="font-semibold text-gray-800">${result.cls.rate.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">Monthly Premium</p>
              <p className="font-semibold text-gray-800">{fmt$(result.totalPremium / 12)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs">% of Payroll</p>
              <p className="font-semibold text-gray-800">{(result.perPayrollDollar * 100).toFixed(2)}%</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
