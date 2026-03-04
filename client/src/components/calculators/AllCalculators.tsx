/*
 * CalcHQ — All Calculator Components
 * Each calculator is a self-contained React component with live calculation
 */
import { useState, useMemo } from "react";

// ─── Shared helpers ──────────────────────────────────────────────────────────
function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
}
function formatNumber(n: number, decimals = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: decimals }).format(n);
}

function ResultCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold result-value ${highlight ? "text-emerald-600" : "text-gray-800"}`}>{value}</p>
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-emerald-800 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Results</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, min, max, step, type = "number", unit }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  min?: string; max?: string; step?: string; type?: string; unit?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}{unit && <span className="text-gray-400 font-normal"> ({unit})</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
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
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── MORTGAGE ────────────────────────────────────────────────────────────────
export function MortgageCalculator() {
  const [price, setPrice] = useState("350000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("30");
  const [tax, setTax] = useState("3000");
  const [insurance, setInsurance] = useState("1200");

  const result = useMemo(() => {
    const P = (parseFloat(price) || 0) * (1 - (parseFloat(down) || 0) / 100);
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (P <= 0 || r <= 0 || n <= 0) return null;
    const pi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyTax = (parseFloat(tax) || 0) / 12;
    const monthlyIns = (parseFloat(insurance) || 0) / 12;
    const total = pi + monthlyTax + monthlyIns;
    return { pi, monthlyTax, monthlyIns, total, principal: P };
  }, [price, down, rate, years, tax, insurance]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField label="Home Price" value={price} onChange={setPrice} placeholder="350000" unit="$" />
        <InputField label="Down Payment" value={down} onChange={setDown} placeholder="20" unit="%" min="0" max="100" />
        <InputField label="Interest Rate" value={rate} onChange={setRate} placeholder="7.5" unit="%" step="0.1" />
        <InputField label="Loan Term" value={years} onChange={setYears} placeholder="30" unit="years" />
        <InputField label="Annual Property Tax" value={tax} onChange={setTax} placeholder="3000" unit="$" />
        <InputField label="Annual Insurance" value={insurance} onChange={setInsurance} placeholder="1200" unit="$" />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="Monthly Payment (PITI)" value={formatCurrency(result.total)} highlight />
          <ResultCard label="Principal & Interest" value={formatCurrency(result.pi)} />
          <ResultCard label="Loan Amount" value={formatCurrency(result.principal)} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── RENT VS BUY ─────────────────────────────────────────────────────────────
export function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState("400000");
  const [downPct, setDownPct] = useState("20");
  const [mortgageRate, setMortgageRate] = useState("7.5");
  const [rent, setRent] = useState("2000");
  const [years, setYears] = useState("7");
  const [appreciation, setAppreciation] = useState("3");

  const result = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const down = price * ((parseFloat(downPct) || 0) / 100);
    const loan = price - down;
    const r = (parseFloat(mortgageRate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    const totalMonths = n;
    if (loan <= 0 || r <= 0 || totalMonths <= 0) return null;
    const monthly = (loan * r * Math.pow(1 + r, 360)) / (Math.pow(1 + r, 360) - 1);
    const totalMortgage = monthly * totalMonths + down;
    const futureValue = price * Math.pow(1 + (parseFloat(appreciation) || 0) / 100, parseFloat(years) || 0);
    const buyNetCost = totalMortgage - (futureValue - price);
    const totalRent = (parseFloat(rent) || 0) * totalMonths;
    return { buyNetCost, totalRent, monthly, futureValue, winner: buyNetCost < totalRent ? "Buy" : "Rent" };
  }, [homePrice, downPct, mortgageRate, rent, years, appreciation]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <InputField label="Home Price" value={homePrice} onChange={setHomePrice} unit="$" />
        <InputField label="Down Payment" value={downPct} onChange={setDownPct} unit="%" />
        <InputField label="Mortgage Rate" value={mortgageRate} onChange={setMortgageRate} unit="%" step="0.1" />
        <InputField label="Monthly Rent" value={rent} onChange={setRent} unit="$" />
        <InputField label="Time Horizon" value={years} onChange={setYears} unit="years" />
        <InputField label="Annual Appreciation" value={appreciation} onChange={setAppreciation} unit="%" step="0.5" />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="Monthly Mortgage" value={formatCurrency(result.monthly)} />
          <ResultCard label="Net Buy Cost" value={formatCurrency(result.buyNetCost)} />
          <ResultCard label="Total Rent Cost" value={formatCurrency(result.totalRent)} />
          <div className="sm:col-span-2 lg:col-span-3 bg-white rounded-lg p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Recommendation over {years} years</p>
            <p className={`text-2xl font-bold result-value ${result.winner === "Buy" ? "text-emerald-600" : "text-blue-600"}`}>
              {result.winner === "Buy" ? "🏠 Buying is cheaper" : "🏢 Renting is cheaper"}
            </p>
          </div>
        </ResultBox>
      )}
    </div>
  );
}

// ─── SALARY ──────────────────────────────────────────────────────────────────
export function SalaryCalculator() {
  const [amount, setAmount] = useState("75000");
  const [type, setType] = useState("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");

  const result = useMemo(() => {
    const val = parseFloat(amount) || 0;
    const hrs = parseFloat(hoursPerWeek) || 40;
    let annual = 0;
    if (type === "annual") annual = val;
    else if (type === "monthly") annual = val * 12;
    else if (type === "weekly") annual = val * 52;
    else if (type === "hourly") annual = val * hrs * 52;
    if (annual <= 0) return null;
    return {
      annual,
      monthly: annual / 12,
      biweekly: annual / 26,
      weekly: annual / 52,
      daily: annual / 260,
      hourly: annual / (hrs * 52),
    };
  }, [amount, type, hoursPerWeek]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Amount" value={amount} onChange={setAmount} placeholder="75000" />
        <SelectField label="Pay Period" value={type} onChange={setType} options={[
          { value: "annual", label: "Annual" },
          { value: "monthly", label: "Monthly" },
          { value: "weekly", label: "Weekly" },
          { value: "hourly", label: "Hourly" },
        ]} />
        <InputField label="Hours per Week" value={hoursPerWeek} onChange={setHoursPerWeek} placeholder="40" />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="Annual Salary" value={formatCurrency(result.annual)} highlight />
          <ResultCard label="Monthly" value={formatCurrency(result.monthly)} />
          <ResultCard label="Bi-Weekly" value={formatCurrency(result.biweekly)} />
          <ResultCard label="Weekly" value={formatCurrency(result.weekly)} />
          <ResultCard label="Daily" value={formatCurrency(result.daily)} />
          <ResultCard label="Hourly" value={formatCurrency(result.hourly)} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── SALES TAX & TIP ─────────────────────────────────────────────────────────
export function SalesTaxCalculator() {
  const [subtotal, setSubtotal] = useState("50");
  const [taxRate, setTaxRate] = useState("8");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("1");

  const result = useMemo(() => {
    const sub = parseFloat(subtotal) || 0;
    const tax = sub * ((parseFloat(taxRate) || 0) / 100);
    const tip = sub * ((parseFloat(tipPct) || 0) / 100);
    const total = sub + tax + tip;
    const perPerson = total / (parseFloat(people) || 1);
    return { tax, tip, total, perPerson };
  }, [subtotal, taxRate, tipPct, people]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Subtotal" value={subtotal} onChange={setSubtotal} unit="$" />
        <InputField label="Sales Tax Rate" value={taxRate} onChange={setTaxRate} unit="%" step="0.1" />
        <InputField label="Tip Percentage" value={tipPct} onChange={setTipPct} unit="%" />
        <InputField label="Number of People" value={people} onChange={setPeople} min="1" />
      </div>
      <ResultBox>
        <ResultCard label="Tax Amount" value={formatCurrency(result.tax)} />
        <ResultCard label="Tip Amount" value={formatCurrency(result.tip)} />
        <ResultCard label="Total" value={formatCurrency(result.total)} highlight />
        {parseFloat(people) > 1 && <ResultCard label="Per Person" value={formatCurrency(result.perPerson)} />}
      </ResultBox>
    </div>
  );
}

// ─── TDEE ────────────────────────────────────────────────────────────────────
export function TDEECalculator() {
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("170");
  const [height, setHeight] = useState("70");
  const [activity, setActivity] = useState("1.55");
  const [unit, setUnit] = useState("imperial");

  const result = useMemo(() => {
    let weightKg = parseFloat(weight) || 0;
    let heightCm = parseFloat(height) || 0;
    if (unit === "imperial") {
      weightKg = weightKg * 0.453592;
      heightCm = heightCm * 2.54;
    }
    const a = parseFloat(age) || 0;
    const act = parseFloat(activity) || 1.2;
    let bmr = 0;
    if (gender === "male") bmr = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
    else bmr = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
    if (bmr <= 0) return null;
    const tdee = bmr * act;
    return { bmr, tdee, lose: tdee - 500, gain: tdee + 500 };
  }, [age, gender, weight, height, activity, unit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField label="Units" value={unit} onChange={setUnit} options={[
          { value: "imperial", label: "Imperial (lbs/in)" },
          { value: "metric", label: "Metric (kg/cm)" },
        ]} />
        <SelectField label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" />
        <InputField label={unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"} value={weight} onChange={setWeight} />
        <InputField label={unit === "imperial" ? "Height (inches)" : "Height (cm)"} value={height} onChange={setHeight} />
        <SelectField label="Activity Level" value={activity} onChange={setActivity} options={[
          { value: "1.2", label: "Sedentary (desk job)" },
          { value: "1.375", label: "Light (1-3 days/week)" },
          { value: "1.55", label: "Moderate (3-5 days/week)" },
          { value: "1.725", label: "Active (6-7 days/week)" },
          { value: "1.9", label: "Very Active (athlete)" },
        ]} />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="TDEE (Maintenance)" value={`${formatNumber(result.tdee, 0)} cal/day`} highlight />
          <ResultCard label="BMR (at rest)" value={`${formatNumber(result.bmr, 0)} cal/day`} />
          <ResultCard label="Weight Loss (−500)" value={`${formatNumber(result.lose, 0)} cal/day`} />
          <ResultCard label="Weight Gain (+500)" value={`${formatNumber(result.gain, 0)} cal/day`} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── MACRO ───────────────────────────────────────────────────────────────────
export function MacroCalculator() {
  const [calories, setCalories] = useState("2000");
  const [goal, setGoal] = useState("maintain");

  const result = useMemo(() => {
    const cal = parseFloat(calories) || 0;
    if (cal <= 0) return null;
    let proteinPct = 0.3, carbPct = 0.4, fatPct = 0.3;
    if (goal === "lose") { proteinPct = 0.35; carbPct = 0.35; fatPct = 0.3; }
    if (goal === "gain") { proteinPct = 0.3; carbPct = 0.45; fatPct = 0.25; }
    const protein = (cal * proteinPct) / 4;
    const carbs = (cal * carbPct) / 4;
    const fat = (cal * fatPct) / 9;
    return { protein, carbs, fat };
  }, [calories, goal]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Daily Calories" value={calories} onChange={setCalories} unit="kcal" />
        <SelectField label="Goal" value={goal} onChange={setGoal} options={[
          { value: "lose", label: "Lose Weight" },
          { value: "maintain", label: "Maintain Weight" },
          { value: "gain", label: "Gain Muscle" },
        ]} />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="Protein" value={`${formatNumber(result.protein, 0)}g / day`} highlight />
          <ResultCard label="Carbohydrates" value={`${formatNumber(result.carbs, 0)}g / day`} />
          <ResultCard label="Fat" value={`${formatNumber(result.fat, 0)}g / day`} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── BMI ─────────────────────────────────────────────────────────────────────
export function BMICalculator() {
  const [weight, setWeight] = useState("160");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("8");
  const [heightCm, setHeightCm] = useState("172");
  const [unit, setUnit] = useState("imperial");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState("male");

  const result = useMemo(() => {
    let wKg = parseFloat(weight) || 0;
    let hM = 0;
    if (unit === "imperial") {
      wKg = wKg * 0.453592;
      const ft = parseFloat(heightFt) || 0;
      const inches = parseFloat(heightIn) || 0;
      hM = (ft * 12 + inches) * 0.0254;
    } else {
      hM = (parseFloat(heightCm) || 0) / 100;
    }
    if (wKg <= 0 || hM <= 0) return null;
    const bmi = wKg / (hM * hM);
    const hCm = hM * 100;

    // Category & color
    let category = ""; let color = ""; let bgColor = ""; let risk = "";
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-600"; bgColor = "bg-blue-50 border-blue-200"; risk = "Low (but other health risks may be present)"; }
    else if (bmi < 25) { category = "Normal Weight"; color = "text-emerald-600"; bgColor = "bg-emerald-50 border-emerald-200"; risk = "Low"; }
    else if (bmi < 27) { category = "Overweight"; color = "text-yellow-600"; bgColor = "bg-yellow-50 border-yellow-200"; risk = "Increased"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-orange-500"; bgColor = "bg-orange-50 border-orange-200"; risk = "High"; }
    else if (bmi < 35) { category = "Obese (Class I)"; color = "text-red-500"; bgColor = "bg-red-50 border-red-200"; risk = "Very High"; }
    else if (bmi < 40) { category = "Obese (Class II)"; color = "text-red-600"; bgColor = "bg-red-50 border-red-200"; risk = "Extremely High"; }
    else { category = "Obese (Class III)"; color = "text-red-700"; bgColor = "bg-red-50 border-red-200"; risk = "Extremely High"; }

    // Healthy weight range for this height (BMI 18.5–24.9)
    const minHealthyKg = 18.5 * hM * hM;
    const maxHealthyKg = 24.9 * hM * hM;
    const minHealthyLbs = minHealthyKg / 0.453592;
    const maxHealthyLbs = maxHealthyKg / 0.453592;

    // Weight to lose/gain to reach normal
    const wLbs = parseFloat(weight) || 0;
    let weightDiff: number | null = null;
    let weightDiffDir = "";
    if (unit === "imperial") {
      if (bmi >= 25) { weightDiff = wLbs - maxHealthyLbs; weightDiffDir = "lose"; }
      else if (bmi < 18.5) { weightDiff = minHealthyLbs - wLbs; weightDiffDir = "gain"; }
    } else {
      if (bmi >= 25) { weightDiff = wKg - maxHealthyKg; weightDiffDir = "lose"; }
      else if (bmi < 18.5) { weightDiff = minHealthyKg - wKg; weightDiffDir = "gain"; }
    }

    // BMI position on scale (0–100%) — scale from 10 to 45
    const scaleMin = 10; const scaleMax = 45;
    const scalePos = Math.min(100, Math.max(0, ((bmi - scaleMin) / (scaleMax - scaleMin)) * 100));

    // Ponderal Index (alternative to BMI)
    const pi = wKg / (hM * hM * hM);

    return {
      bmi, category, color, bgColor, risk,
      minHealthyLbs, maxHealthyLbs, minHealthyKg, maxHealthyKg,
      weightDiff, weightDiffDir, scalePos, pi, hCm
    };
  }, [weight, heightFt, heightIn, heightCm, unit]);

  const guidance: Record<string, { tips: string[]; note: string }> = {
    "Underweight": {
      tips: ["Increase caloric intake with nutrient-dense foods", "Add strength training to build lean muscle mass", "Consult a dietitian for a personalized meal plan", "Track protein intake — aim for 0.8–1g per lb of body weight"],
      note: "Being underweight can increase risk of bone loss, immune deficiency, and nutritional deficiencies."
    },
    "Normal Weight": {
      tips: ["Maintain regular physical activity (150+ min/week)", "Focus on balanced nutrition with whole foods", "Monitor weight periodically to stay in range", "Prioritize sleep and stress management for metabolic health"],
      note: "A normal BMI is associated with the lowest risk of weight-related health conditions."
    },
    "Overweight": {
      tips: ["Aim for a modest calorie deficit of 300–500 kcal/day", "Increase cardiovascular activity to 200+ min/week", "Reduce ultra-processed foods and added sugars", "Consider tracking meals to increase dietary awareness"],
      note: "Even a 5–10% reduction in body weight can significantly improve metabolic health markers."
    },
    "Obese (Class I)": {
      tips: ["Work with a healthcare provider on a structured weight loss plan", "Start with low-impact exercise (walking, swimming, cycling)", "Focus on sustainable lifestyle changes over crash diets", "Monitor blood pressure, blood sugar, and cholesterol regularly"],
      note: "Class I obesity is associated with increased risk of type 2 diabetes, hypertension, and cardiovascular disease."
    },
    "Obese (Class II)": {
      tips: ["Consult a physician or bariatric specialist", "Medical weight loss programs may be appropriate", "Prioritize sleep apnea screening", "Structured exercise with professional supervision is recommended"],
      note: "Class II obesity carries substantially elevated health risks and often benefits from medical intervention."
    },
    "Obese (Class III)": {
      tips: ["Seek evaluation from a bariatric medicine specialist", "Surgical options (e.g., gastric bypass) may be considered", "Comprehensive lifestyle intervention programs are available", "Mental health support is an important component of treatment"],
      note: "Class III obesity (formerly 'morbid obesity') is associated with significantly reduced life expectancy without intervention."
    },
  };

  const categoryKey = result?.category.startsWith("Overweight") ? "Overweight" : result?.category || "";
  const currentGuidance = guidance[categoryKey];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField label="Units" value={unit} onChange={setUnit} options={[
          { value: "imperial", label: "Imperial (lbs / ft & in)" },
          { value: "metric", label: "Metric (kg / cm)" },
        ]} />
        <InputField label={unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"} value={weight} onChange={setWeight} />
        {unit === "imperial" ? (
          <>
            <InputField label="Height (feet)" value={heightFt} onChange={setHeightFt} min="3" max="8" />
            <InputField label="Height (inches)" value={heightIn} onChange={setHeightIn} min="0" max="11" />
          </>
        ) : (
          <InputField label="Height (cm)" value={heightCm} onChange={setHeightCm} />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
        <InputField label="Age (optional)" value={age} onChange={setAge} unit="years" min="2" max="120" />
        <SelectField label="Sex (optional)" value={sex} onChange={setSex} options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]} />
      </div>

      {result && (
        <div className="space-y-4">
          {/* Primary result card */}
          <div className={`border rounded-xl p-5 ${result.bgColor}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Your BMI</p>
                <p className={`text-4xl font-bold result-value ${result.color}`}>{formatNumber(result.bmi)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className={`text-xl font-bold result-value ${result.color}`}>{result.category}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Disease Risk</p>
                <p className={`text-xl font-bold result-value ${result.color}`}>{result.risk}</p>
              </div>
            </div>

            {/* Visual BMI scale with pointer */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-600 mb-3">BMI Scale</p>
              <div className="relative">
                {/* Color bar */}
                <div className="flex rounded-full overflow-hidden h-4">
                  <div className="bg-blue-300" style={{ width: "24%" }} title="Underweight" />
                  <div className="bg-emerald-400" style={{ width: "20%" }} title="Normal" />
                  <div className="bg-yellow-400" style={{ width: "14%" }} title="Overweight" />
                  <div className="bg-orange-400" style={{ width: "10%" }} title="Obese I" />
                  <div className="bg-red-500" style={{ width: "16%" }} title="Obese II" />
                  <div className="bg-red-700" style={{ width: "16%" }} title="Obese III" />
                </div>
                {/* Pointer */}
                <div
                  className="absolute -top-1 w-0.5 h-6 bg-gray-800"
                  style={{ left: `${result.scalePos}%`, transform: "translateX(-50%)" }}
                />
                <div
                  className="absolute top-5 text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded px-1 py-0.5 shadow-sm"
                  style={{ left: `${result.scalePos}%`, transform: "translateX(-50%)", whiteSpace: "nowrap" }}
                >
                  {formatNumber(result.bmi)}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-7">
                <span>10</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45+</span>
              </div>
              <div className="flex gap-3 flex-wrap mt-3">
                {[
                  { color: "bg-blue-300", label: "Underweight (<18.5)" },
                  { color: "bg-emerald-400", label: "Normal (18.5–24.9)" },
                  { color: "bg-yellow-400", label: "Overweight (25–29.9)" },
                  { color: "bg-red-500", label: "Obese (≥30)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-xs text-gray-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Healthy weight range */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Healthy Weight Range for Your Height</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Minimum (BMI 18.5)</p>
                <p className="text-lg font-bold text-emerald-700">
                  {unit === "imperial" ? `${formatNumber(result.minHealthyLbs, 1)} lbs` : `${formatNumber(result.minHealthyKg, 1)} kg`}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Maximum (BMI 24.9)</p>
                <p className="text-lg font-bold text-emerald-700">
                  {unit === "imperial" ? `${formatNumber(result.maxHealthyLbs, 1)} lbs` : `${formatNumber(result.maxHealthyKg, 1)} kg`}
                </p>
              </div>
              {result.weightDiff !== null && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">To reach healthy range</p>
                  <p className="text-lg font-bold text-blue-700">
                    {result.weightDiffDir === "lose" ? "Lose " : "Gain "}
                    {unit === "imperial" ? `${formatNumber(result.weightDiff!, 1)} lbs` : `${formatNumber(result.weightDiff!, 1)} kg`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* BMI Classification Table */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WHO BMI Classification</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 text-xs font-semibold text-gray-500">Category</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500">BMI Range</th>
                    <th className="text-left py-2 text-xs font-semibold text-gray-500">Health Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: "Underweight", range: "< 18.5", risk: "Low (other risks)", highlight: result.bmi < 18.5 },
                    { cat: "Normal Weight", range: "18.5 – 24.9", risk: "Minimal", highlight: result.bmi >= 18.5 && result.bmi < 25 },
                    { cat: "Overweight", range: "25.0 – 29.9", risk: "Increased", highlight: result.bmi >= 25 && result.bmi < 30 },
                    { cat: "Obese Class I", range: "30.0 – 34.9", risk: "High", highlight: result.bmi >= 30 && result.bmi < 35 },
                    { cat: "Obese Class II", range: "35.0 – 39.9", risk: "Very High", highlight: result.bmi >= 35 && result.bmi < 40 },
                    { cat: "Obese Class III", range: "≥ 40.0", risk: "Extremely High", highlight: result.bmi >= 40 },
                  ].map((row) => (
                    <tr key={row.cat} className={`border-b border-gray-50 ${row.highlight ? "bg-emerald-50" : ""}`}>
                      <td className={`py-2 pr-4 font-medium ${row.highlight ? "text-emerald-700" : "text-gray-700"}`}>
                        {row.cat} {row.highlight && <span className="text-xs">← you</span>}
                      </td>
                      <td className="py-2 pr-4 text-gray-600">{row.range}</td>
                      <td className="py-2 text-gray-600">{row.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Personalized guidance */}
          {currentGuidance && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Guidance for Your Category</h3>
              <p className="text-xs text-gray-500 mb-3 italic">{currentGuidance.note}</p>
              <ul className="space-y-2">
                {currentGuidance.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BMI Limitations note */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-500">
              <strong>Important:</strong> BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, age, sex, or fat distribution. Athletes may have a high BMI with low body fat. Always consult a healthcare provider for a complete health assessment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BODY FAT ────────────────────────────────────────────────────────────────
export function BodyFatCalculator() {
  const [gender, setGender] = useState("male");
  const [waist, setWaist] = useState("34");
  const [neck, setNeck] = useState("15");
  const [hip, setHip] = useState("38");
  const [height, setHeight] = useState("70");

  const result = useMemo(() => {
    const w = parseFloat(waist) || 0;
    const n = parseFloat(neck) || 0;
    const h = parseFloat(height) || 0;
    const hp = parseFloat(hip) || 0;
    if (w <= 0 || n <= 0 || h <= 0) return null;
    let bf = 0;
    if (gender === "male") {
      bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
    } else {
      if (hp <= 0) return null;
      bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
    }
    if (bf < 0 || bf > 70) return null;
    let category = "";
    if (gender === "male") {
      if (bf < 6) category = "Essential Fat";
      else if (bf < 14) category = "Athletic";
      else if (bf < 18) category = "Fitness";
      else if (bf < 25) category = "Average";
      else category = "Obese";
    } else {
      if (bf < 14) category = "Essential Fat";
      else if (bf < 21) category = "Athletic";
      else if (bf < 25) category = "Fitness";
      else if (bf < 32) category = "Average";
      else category = "Obese";
    }
    return { bf, category };
  }, [gender, waist, neck, hip, height]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]} />
        <InputField label="Waist" value={waist} onChange={setWaist} unit="inches" />
        <InputField label="Neck" value={neck} onChange={setNeck} unit="inches" />
        {gender === "female" && <InputField label="Hip" value={hip} onChange={setHip} unit="inches" />}
        <InputField label="Height" value={height} onChange={setHeight} unit="inches" />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="Body Fat %" value={`${formatNumber(result.bf)}%`} highlight />
          <ResultCard label="Category" value={result.category} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── BMR ─────────────────────────────────────────────────────────────────────
export function BMRCalculator() {
  const [age, setAge] = useState("30");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("170");
  const [height, setHeight] = useState("70");
  const [unit, setUnit] = useState("imperial");

  const result = useMemo(() => {
    let wKg = parseFloat(weight) || 0;
    let hCm = parseFloat(height) || 0;
    if (unit === "imperial") { wKg = wKg * 0.453592; hCm = hCm * 2.54; }
    const a = parseFloat(age) || 0;
    if (wKg <= 0 || hCm <= 0 || a <= 0) return null;
    let bmr = 0;
    if (gender === "male") bmr = 10 * wKg + 6.25 * hCm - 5 * a + 5;
    else bmr = 10 * wKg + 6.25 * hCm - 5 * a - 161;
    return { bmr };
  }, [age, gender, weight, height, unit]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SelectField label="Units" value={unit} onChange={setUnit} options={[
          { value: "imperial", label: "Imperial (lbs/in)" },
          { value: "metric", label: "Metric (kg/cm)" },
        ]} />
        <SelectField label="Gender" value={gender} onChange={setGender} options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]} />
        <InputField label="Age" value={age} onChange={setAge} unit="years" />
        <InputField label={unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"} value={weight} onChange={setWeight} />
        <InputField label={unit === "imperial" ? "Height (inches)" : "Height (cm)"} value={height} onChange={setHeight} />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="BMR (Mifflin-St Jeor)" value={`${formatNumber(result.bmr, 0)} cal/day`} highlight />
          <ResultCard label="Calories at rest" value={`${formatNumber(result.bmr, 0)} kcal`} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── ONE REP MAX ─────────────────────────────────────────────────────────────
export function OneRepMaxCalculator() {
  const [weight, setWeight] = useState("225");
  const [reps, setReps] = useState("5");
  const [unit, setUnit] = useState("lbs");

  const result = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const r = parseFloat(reps) || 0;
    if (w <= 0 || r <= 0) return null;
    const epley = w * (1 + r / 30);
    const brzycki = w * (36 / (37 - r));
    const avg = (epley + brzycki) / 2;
    return {
      epley, brzycki, avg,
      pct90: avg * 0.9, pct80: avg * 0.8, pct70: avg * 0.7, pct60: avg * 0.6,
    };
  }, [weight, reps]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Weight Lifted" value={weight} onChange={setWeight} unit={unit} />
        <InputField label="Reps Performed" value={reps} onChange={setReps} min="1" max="20" />
        <SelectField label="Unit" value={unit} onChange={setUnit} options={[
          { value: "lbs", label: "Pounds (lbs)" },
          { value: "kg", label: "Kilograms (kg)" },
        ]} />
      </div>
      {result && (
        <ResultBox>
          <ResultCard label="Estimated 1RM" value={`${formatNumber(result.avg, 1)} ${unit}`} highlight />
          <ResultCard label="90% (3–4 reps)" value={`${formatNumber(result.pct90, 1)} ${unit}`} />
          <ResultCard label="80% (6–8 reps)" value={`${formatNumber(result.pct80, 1)} ${unit}`} />
          <ResultCard label="70% (10–12 reps)" value={`${formatNumber(result.pct70, 1)} ${unit}`} />
        </ResultBox>
      )}
    </div>
  );
}

// ─── CALORIES BURNED ─────────────────────────────────────────────────────────
type ActivityEntry = { met: number; label: string; category: string };

const ACTIVITY_DATA: ActivityEntry[] = [
  // Running
  { met: 6.0, label: "Running — 5 mph (12 min/mile)", category: "Running" },
  { met: 8.3, label: "Running — 6 mph (10 min/mile)", category: "Running" },
  { met: 9.8, label: "Running — 7 mph (8.5 min/mile)", category: "Running" },
  { met: 11.0, label: "Running — 8 mph (7.5 min/mile)", category: "Running" },
  { met: 11.8, label: "Running — 9 mph (6.5 min/mile)", category: "Running" },
  { met: 12.8, label: "Running — 10 mph (6 min/mile)", category: "Running" },
  { met: 14.5, label: "Running — 12 mph (5 min/mile)", category: "Running" },
  { met: 4.5, label: "Jogging (general)", category: "Running" },
  { met: 9.0, label: "Trail Running", category: "Running" },
  { met: 13.3, label: "Running — Uphill (8 mph)", category: "Running" },
  // Walking
  { met: 2.5, label: "Walking — 2 mph (slow)", category: "Walking" },
  { met: 3.5, label: "Walking — 3 mph (moderate)", category: "Walking" },
  { met: 4.3, label: "Walking — 3.5 mph (brisk)", category: "Walking" },
  { met: 5.0, label: "Walking — 4 mph (fast)", category: "Walking" },
  { met: 6.0, label: "Walking — 4.5 mph (very fast)", category: "Walking" },
  { met: 6.0, label: "Hiking (cross-country)", category: "Walking" },
  { met: 5.3, label: "Hiking with backpack", category: "Walking" },
  { met: 3.0, label: "Walking upstairs", category: "Walking" },
  // Cycling
  { met: 4.0, label: "Cycling — < 10 mph (leisure)", category: "Cycling" },
  { met: 6.8, label: "Cycling — 10–12 mph (light)", category: "Cycling" },
  { met: 8.0, label: "Cycling — 12–14 mph (moderate)", category: "Cycling" },
  { met: 10.0, label: "Cycling — 14–16 mph (vigorous)", category: "Cycling" },
  { met: 12.0, label: "Cycling — 16–19 mph (racing)", category: "Cycling" },
  { met: 15.8, label: "Cycling — > 20 mph (elite)", category: "Cycling" },
  { met: 8.5, label: "Mountain Biking", category: "Cycling" },
  { met: 5.5, label: "Stationary Bike (moderate)", category: "Cycling" },
  { met: 8.5, label: "Stationary Bike (vigorous)", category: "Cycling" },
  // Swimming
  { met: 5.8, label: "Swimming — freestyle (moderate)", category: "Swimming" },
  { met: 9.8, label: "Swimming — freestyle (vigorous)", category: "Swimming" },
  { met: 7.0, label: "Swimming — backstroke", category: "Swimming" },
  { met: 10.0, label: "Swimming — breaststroke", category: "Swimming" },
  { met: 13.8, label: "Swimming — butterfly", category: "Swimming" },
  { met: 6.0, label: "Water aerobics", category: "Swimming" },
  // Gym & Strength
  { met: 3.5, label: "Weight Training (general)", category: "Gym & Strength" },
  { met: 6.0, label: "Weight Training (vigorous)", category: "Gym & Strength" },
  { met: 8.0, label: "Circuit Training", category: "Gym & Strength" },
  { met: 10.0, label: "HIIT (high intensity)", category: "Gym & Strength" },
  { met: 7.0, label: "CrossFit", category: "Gym & Strength" },
  { met: 3.8, label: "Pilates", category: "Gym & Strength" },
  { met: 4.0, label: "Yoga (power/vinyasa)", category: "Gym & Strength" },
  { met: 2.5, label: "Yoga (hatha/gentle)", category: "Gym & Strength" },
  { met: 2.3, label: "Stretching", category: "Gym & Strength" },
  { met: 5.0, label: "Rowing Machine (moderate)", category: "Gym & Strength" },
  { met: 8.5, label: "Rowing Machine (vigorous)", category: "Gym & Strength" },
  { met: 5.0, label: "Elliptical (moderate)", category: "Gym & Strength" },
  { met: 8.0, label: "Stair Climber", category: "Gym & Strength" },
  { met: 4.5, label: "Jump Rope (moderate)", category: "Gym & Strength" },
  { met: 10.0, label: "Jump Rope (fast)", category: "Gym & Strength" },
  // Sports
  { met: 8.0, label: "Basketball (game)", category: "Sports" },
  { met: 6.0, label: "Basketball (shooting around)", category: "Sports" },
  { met: 7.0, label: "Soccer (general)", category: "Sports" },
  { met: 10.0, label: "Soccer (competitive)", category: "Sports" },
  { met: 7.0, label: "Tennis (singles)", category: "Sports" },
  { met: 5.0, label: "Tennis (doubles)", category: "Sports" },
  { met: 8.0, label: "Volleyball (competitive)", category: "Sports" },
  { met: 3.5, label: "Volleyball (recreational)", category: "Sports" },
  { met: 7.0, label: "Golf (carrying clubs)", category: "Sports" },
  { met: 4.5, label: "Golf (riding cart)", category: "Sports" },
  { met: 9.0, label: "Football (competitive)", category: "Sports" },
  { met: 8.0, label: "Baseball / Softball", category: "Sports" },
  { met: 7.0, label: "Racquetball", category: "Sports" },
  { met: 12.0, label: "Boxing (sparring)", category: "Sports" },
  { met: 6.0, label: "Martial Arts (moderate)", category: "Sports" },
  { met: 5.5, label: "Dancing (aerobic)", category: "Sports" },
  { met: 3.0, label: "Dancing (ballroom)", category: "Sports" },
  // Outdoor & Recreation
  { met: 7.0, label: "Skiing (downhill, moderate)", category: "Outdoor" },
  { met: 9.0, label: "Skiing (cross-country)", category: "Outdoor" },
  { met: 7.0, label: "Snowboarding", category: "Outdoor" },
  { met: 5.0, label: "Kayaking", category: "Outdoor" },
  { met: 6.0, label: "Rock Climbing (moderate)", category: "Outdoor" },
  { met: 8.0, label: "Rock Climbing (vigorous)", category: "Outdoor" },
  { met: 3.5, label: "Gardening / Yard Work", category: "Outdoor" },
  { met: 5.0, label: "Shoveling Snow", category: "Outdoor" },
  { met: 4.5, label: "Mowing Lawn (push mower)", category: "Outdoor" },
  // Daily Activities
  { met: 1.8, label: "Sitting (desk work)", category: "Daily Life" },
  { met: 2.0, label: "Standing (light activity)", category: "Daily Life" },
  { met: 2.5, label: "Cooking / Food Prep", category: "Daily Life" },
  { met: 3.0, label: "Cleaning / Housework", category: "Daily Life" },
  { met: 3.5, label: "Carrying / Moving Boxes", category: "Daily Life" },
  { met: 2.3, label: "Shopping (grocery)", category: "Daily Life" },
  { met: 3.0, label: "Playing with kids (moderate)", category: "Daily Life" },
];

const ACTIVITY_CATEGORIES = Array.from(new Set(ACTIVITY_DATA.map((a) => a.category)));

export function CaloriesBurnedCalculator() {
  const [weight, setWeight] = useState("160");
  const [duration, setDuration] = useState("30");
  const [unit, setUnit] = useState("imperial");
  const [category, setCategory] = useState("Running");
  const [activityLabel, setActivityLabel] = useState("Running — 6 mph (10 min/mile)");

  const filteredActivities = useMemo(
    () => ACTIVITY_DATA.filter((a) => a.category === category),
    [category]
  );

  const selectedActivity = useMemo(
    () => ACTIVITY_DATA.find((a) => a.label === activityLabel) || filteredActivities[0],
    [activityLabel, filteredActivities]
  );

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const first = ACTIVITY_DATA.find((a) => a.category === cat);
    if (first) setActivityLabel(first.label);
  };

  const result = useMemo(() => {
    let wKg = parseFloat(weight) || 0;
    if (unit === "imperial") wKg = wKg * 0.453592;
    const mins = parseFloat(duration) || 0;
    const met = selectedActivity?.met || 0;
    if (wKg <= 0 || mins <= 0 || met <= 0) return null;
    const calories = met * wKg * (mins / 60);
    const perHour = met * wKg;
    const perMinute = perHour / 60;
    // Estimate equivalents
    const walkingMins = Math.round(calories / (3.5 * wKg / 60));
    const cheeseburgerCals = 550;
    return { calories, perHour, perMinute, walkingMins, cheeseburgerFraction: calories / cheeseburgerCals, met };
  }, [weight, duration, unit, selectedActivity]);

  // Comparison: same duration across 3 intensities for context
  const comparisons = useMemo(() => {
    let wKg = parseFloat(weight) || 0;
    if (unit === "imperial") wKg = wKg * 0.453592;
    const mins = parseFloat(duration) || 0;
    if (wKg <= 0 || mins <= 0) return [];
    const picks = filteredActivities.slice(0, Math.min(5, filteredActivities.length));
    return picks.map((a) => ({
      label: a.label.replace(category + " — ", "").replace(category + " ", ""),
      calories: Math.round(a.met * wKg * (mins / 60)),
      met: a.met,
      isSelected: a.label === activityLabel,
    }));
  }, [weight, duration, unit, filteredActivities, activityLabel, category]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField label="Units" value={unit} onChange={setUnit} options={[
          { value: "imperial", label: "Imperial (lbs)" },
          { value: "metric", label: "Metric (kg)" },
        ]} />
        <InputField label={unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"} value={weight} onChange={setWeight} />
        <InputField label="Duration" value={duration} onChange={setDuration} unit="minutes" />
        <SelectField label="Activity Category" value={category} onChange={handleCategoryChange}
          options={ACTIVITY_CATEGORIES.map((c) => ({ value: c, label: c }))} />
      </div>
      <SelectField label="Specific Activity" value={activityLabel} onChange={setActivityLabel}
        options={filteredActivities.map((a) => ({ value: a.label, label: a.label }))} />

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Primary result */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-800 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Results</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Calories Burned</p>
                <p className="text-3xl font-bold text-emerald-600 result-value">{formatNumber(result.calories, 0)}</p>
                <p className="text-xs text-gray-400 mt-1">kcal total</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Burn Rate</p>
                <p className="text-2xl font-bold text-gray-800 result-value">{formatNumber(result.perHour, 0)}</p>
                <p className="text-xs text-gray-400 mt-1">kcal / hour</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">MET Value</p>
                <p className="text-2xl font-bold text-gray-800 result-value">{result.met.toFixed(1)}</p>
                <p className="text-xs text-gray-400 mt-1">metabolic equivalent</p>
              </div>
            </div>
          </div>

          {/* Equivalents */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What does that equal?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-2xl">🍔</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{(result.cheeseburgerFraction * 100).toFixed(0)}% of a cheeseburger</p>
                  <p className="text-xs text-gray-500">~550 kcal each</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">🚶</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{result.walkingMins} min of walking</p>
                  <p className="text-xs text-gray-500">to burn the same calories</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{formatNumber(result.perMinute, 1)} kcal/min</p>
                  <p className="text-xs text-gray-500">average burn rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity comparison within category */}
          {comparisons.length > 1 && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {category} Intensity Comparison ({duration} min)
              </h3>
              <div className="space-y-2">
                {comparisons.map((c) => {
                  const maxCals = Math.max(...comparisons.map((x) => x.calories));
                  const pct = maxCals > 0 ? (c.calories / maxCals) * 100 : 0;
                  return (
                    <div key={c.label} className={`rounded-lg p-2.5 ${c.isSelected ? "bg-emerald-50 border border-emerald-200" : ""}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-medium ${c.isSelected ? "text-emerald-700" : "text-gray-600"}`}>
                          {c.label} {c.isSelected && "(selected)"}
                        </span>
                        <span className={`text-xs font-bold ${c.isSelected ? "text-emerald-700" : "text-gray-700"}`}>
                          {c.calories} kcal
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${c.isSelected ? "bg-emerald-500" : "bg-gray-300"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── FAT BURNING ZONE ────────────────────────────────────────────────────────
export function FatBurningZoneCalculator() {
  const [age, setAge] = useState("30");

  const result = useMemo(() => {
    const a = parseFloat(age) || 0;
    if (a <= 0 || a > 120) return null;
    const maxHR = 220 - a;
    return {
      maxHR,
      fatBurnLow: Math.round(maxHR * 0.6),
      fatBurnHigh: Math.round(maxHR * 0.7),
      cardioLow: Math.round(maxHR * 0.7),
      cardioHigh: Math.round(maxHR * 0.85),
      peakLow: Math.round(maxHR * 0.85),
      peakHigh: maxHR,
    };
  }, [age]);

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <InputField label="Age" value={age} onChange={setAge} unit="years" min="10" max="100" />
      </div>
      {result && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-emerald-800 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Heart Rate Zones (Max HR: {result.maxHR} bpm)
          </h3>
          <div className="space-y-3">
            {[
              { label: "Fat Burning Zone (60–70%)", low: result.fatBurnLow, high: result.fatBurnHigh, color: "bg-emerald-100 border-emerald-300 text-emerald-800" },
              { label: "Cardio Zone (70–85%)", low: result.cardioLow, high: result.cardioHigh, color: "bg-blue-100 border-blue-300 text-blue-800" },
              { label: "Peak Zone (85–100%)", low: result.peakLow, high: result.peakHigh, color: "bg-red-100 border-red-300 text-red-800" },
            ].map((zone) => (
              <div key={zone.label} className={`flex items-center justify-between p-3 rounded-lg border ${zone.color}`}>
                <span className="text-sm font-medium">{zone.label}</span>
                <span className="text-sm font-bold result-value">{zone.low}–{zone.high} bpm</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UNIT CONVERTER ──────────────────────────────────────────────────────────
type ConversionCategory = "length" | "weight" | "temperature" | "volume";

const CONVERSIONS: Record<ConversionCategory, { label: string; units: { value: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }> = {
  length: {
    label: "Length",
    units: [
      { value: "m", label: "Meters (m)", toBase: (v) => v, fromBase: (v) => v },
      { value: "km", label: "Kilometers (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { value: "cm", label: "Centimeters (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { value: "mm", label: "Millimeters (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: "in", label: "Inches (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { value: "ft", label: "Feet (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { value: "yd", label: "Yards (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { value: "mi", label: "Miles (mi)", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { value: "kg", label: "Kilograms (kg)", toBase: (v) => v, fromBase: (v) => v },
      { value: "g", label: "Grams (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: "lb", label: "Pounds (lb)", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { value: "oz", label: "Ounces (oz)", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { value: "t", label: "Metric Tons (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { value: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      { value: "f", label: "Fahrenheit (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { value: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { value: "l", label: "Liters (L)", toBase: (v) => v, fromBase: (v) => v },
      { value: "ml", label: "Milliliters (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: "gal", label: "Gallons (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { value: "qt", label: "Quarts (qt)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { value: "pt", label: "Pints (pt)", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      { value: "cup", label: "Cups", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { value: "floz", label: "Fluid Ounces (fl oz)", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
};

export function UnitConverter() {
  const [category, setCategory] = useState<ConversionCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("1");

  const catData = CONVERSIONS[category];

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return null;
    const from = catData.units.find((u) => u.value === fromUnit);
    const to = catData.units.find((u) => u.value === toUnit);
    if (!from || !to) return null;
    const base = from.toBase(v);
    const converted = to.fromBase(base);
    return converted;
  }, [value, fromUnit, toUnit, category, catData]);

  const handleCategoryChange = (cat: string) => {
    const c = cat as ConversionCategory;
    setCategory(c);
    setFromUnit(CONVERSIONS[c].units[0].value);
    setToUnit(CONVERSIONS[c].units[1]?.value || CONVERSIONS[c].units[0].value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SelectField label="Category" value={category} onChange={handleCategoryChange} options={
          (Object.keys(CONVERSIONS) as ConversionCategory[]).map((k) => ({ value: k, label: CONVERSIONS[k].label }))
        } />
        <InputField label="Value" value={value} onChange={setValue} type="number" />
        <SelectField label="From" value={fromUnit} onChange={setFromUnit} options={catData.units.map((u) => ({ value: u.value, label: u.label }))} />
        <SelectField label="To" value={toUnit} onChange={setToUnit} options={catData.units.map((u) => ({ value: u.value, label: u.label }))} />
      </div>
      {result !== null && (
        <ResultBox>
          <ResultCard label={`${value} ${fromUnit} equals`} value={`${formatNumber(result, 6)} ${toUnit}`} highlight />
        </ResultBox>
      )}
    </div>
  );
}
