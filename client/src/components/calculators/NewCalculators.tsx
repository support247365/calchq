/**
 * New Calculators -- Phase 2 Expansion
 * GPA, Tip, Fuel Cost, Currency Converter, Inflation
 */
import { useState, useEffect } from "react";

// --- GPA Calculator -----------------------------------------------------------

interface GPACourse {
  id: number;
  name: string;
  grade: string;
  credits: string;
}

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export function GPACalculator() {
  const [courses, setCourses] = useState<GPACourse[]>([
    { id: 1, name: "", grade: "A", credits: "3" },
    { id: 2, name: "", grade: "B", credits: "3" },
    { id: 3, name: "", grade: "A-", credits: "4" },
  ]);
  const [result, setResult] = useState<{ gpa: number; totalCredits: number; totalPoints: number } | null>(null);

  useEffect(() => {
    const valid = courses.filter(c => c.credits && parseFloat(c.credits) > 0 && c.grade in GRADE_POINTS);
    if (valid.length === 0) { setResult(null); return; }
    const totalCredits = valid.reduce((sum, c) => sum + parseFloat(c.credits), 0);
    const totalPoints = valid.reduce((sum, c) => sum + GRADE_POINTS[c.grade] * parseFloat(c.credits), 0);
    const gpa = totalPoints / totalCredits;
    setResult({ gpa, totalCredits, totalPoints });
  }, [courses]);

  const addCourse = () => setCourses(prev => [...prev, { id: Date.now(), name: "", grade: "B", credits: "3" }]);
  const removeCourse = (id: number) => setCourses(prev => prev.filter(c => c.id !== id));
  const updateCourse = (id: number, field: keyof GPACourse, value: string) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-emerald-600";
    if (gpa >= 3.0) return "text-blue-600";
    if (gpa >= 2.0) return "text-amber-600";
    return "text-red-600";
  };

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.7) return "Summa Cum Laude";
    if (gpa >= 3.5) return "Magna Cum Laude";
    if (gpa >= 3.0) return "Cum Laude";
    if (gpa >= 2.0) return "Good Standing";
    return "Below Average";
  };

  return (
    <div className="space-y-6">
      {result && (
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Your GPA</p>
          <p className={`text-6xl font-bold mb-2 ${getGPAColor(result.gpa)}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {result.gpa.toFixed(2)}
          </p>
          <p className="text-sm font-semibold text-gray-600">{getGPALabel(result.gpa)}</p>
          <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
            <span><strong className="text-gray-700">{result.totalCredits}</strong> Total Credits</span>
            <span><strong className="text-gray-700">{result.totalPoints.toFixed(1)}</strong> Quality Points</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 px-1">
          <div className="col-span-5">Course Name (optional)</div>
          <div className="col-span-3">Grade</div>
          <div className="col-span-3">Credits</div>
          <div className="col-span-1"></div>
        </div>
        {courses.map(course => (
          <div key={course.id} className="grid grid-cols-12 gap-2 items-center">
            <input
              className="col-span-5 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Math 101"
              value={course.name}
              onChange={e => updateCourse(course.id, "name", e.target.value)}
            />
            <select
              className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              value={course.grade}
              onChange={e => updateCourse(course.id, "grade", e.target.value)}
            >
              {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>)}
            </select>
            <input
              type="number"
              className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="3"
              min="0.5"
              max="6"
              step="0.5"
              value={course.credits}
              onChange={e => updateCourse(course.id, "credits", e.target.value)}
            />
            <button
              onClick={() => removeCourse(course.id)}
              className="col-span-1 text-gray-400 hover:text-red-500 transition-colors text-lg font-bold"
            >x</button>
          </div>
        ))}
      </div>

      <button
        onClick={addCourse}
        className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
      >
        + Add Course
      </button>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-700 mb-2">GPA Scale Reference</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {[["A / A+", "4.0"], ["A-", "3.7"], ["B+", "3.3"], ["B", "3.0"], ["B-", "2.7"], ["C+", "2.3"], ["C", "2.0"], ["D", "1.0"], ["F", "0.0"]].map(([g, p]) => (
            <div key={g} className="flex justify-between"><span>{g}</span><span className="font-medium">{p}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Tip Calculator -----------------------------------------------------------

export function TipCalculator() {
  const [bill, setBill] = useState("85.00");
  const [tipPct, setTipPct] = useState(18);
  const [people, setPeople] = useState("2");
  const [customTip, setCustomTip] = useState("");

  const billNum = parseFloat(bill) || 0;
  const effectiveTip = customTip !== "" ? parseFloat(customTip) || 0 : tipPct;
  const tipAmount = billNum * (effectiveTip / 100);
  const total = billNum + tipAmount;
  const perPerson = people && parseInt(people) > 0 ? total / parseInt(people) : total;
  const tipPerPerson = people && parseInt(people) > 0 ? tipAmount / parseInt(people) : tipAmount;

  const PRESET_TIPS = [10, 15, 18, 20, 25];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bill Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
            <input
              type="number"
              className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0.00"
              value={bill}
              onChange={e => setBill(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of People</label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="1"
            min="1"
            value={people}
            onChange={e => setPeople(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tip Percentage</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_TIPS.map(pct => (
            <button
              key={pct}
              onClick={() => { setTipPct(pct); setCustomTip(""); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                customTip === "" && tipPct === pct
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {pct}%
            </button>
          ))}
          <input
            type="number"
            className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Custom"
            value={customTip}
            onChange={e => setCustomTip(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs font-medium text-gray-500 mb-1">Tip Amount</p>
            <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ${tipAmount.toFixed(2)}
            </p>
            {parseInt(people) > 1 && (
              <p className="text-xs text-gray-500 mt-1">${tipPerPerson.toFixed(2)} per person</p>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-500 mb-1">Total Bill</p>
            <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ${total.toFixed(2)}
            </p>
            {parseInt(people) > 1 && (
              <p className="text-xs text-gray-500 mt-1">${perPerson.toFixed(2)} per person</p>
            )}
          </div>
        </div>
        {parseInt(people) > 1 && (
          <div className="mt-4 pt-4 border-t border-emerald-100 text-center">
            <p className="text-sm text-gray-600">Each person pays <strong className="text-gray-900">${perPerson.toFixed(2)}</strong> (includes ${tipPerPerson.toFixed(2)} tip)</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Quick Reference -- Tip Guide</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
          {[["10%", "Poor service"], ["15%", "Average service"], ["18%", "Good service"], ["20%", "Great service"], ["25%+", "Exceptional service"]].map(([pct, label]) => (
            <div key={pct} className="flex gap-2"><span className="font-semibold text-gray-700 w-8">{pct}</span><span>{label}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Fuel Cost Calculator -----------------------------------------------------

export function FuelCostCalculator() {
  const [distance, setDistance] = useState("300");
  const [mpg, setMpg] = useState("30");
  const [gasPrice, setGasPrice] = useState("3.50");
  const [unit, setUnit] = useState<"miles" | "km">("miles");

  const distNum = parseFloat(distance) || 0;
  const mpgNum = parseFloat(mpg) || 1;
  const priceNum = parseFloat(gasPrice) || 0;

  const distanceMiles = unit === "km" ? distNum * 0.621371 : distNum;
  const effectiveMpg = unit === "km" ? mpgNum * 0.621371 : mpgNum;
  const gallonsUsed = distanceMiles / effectiveMpg;
  const totalCost = gallonsUsed * priceNum;
  const costPer100 = (100 / distanceMiles) * totalCost;

  return (
    <div className="space-y-5">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {(["miles", "km"] as const).map(u => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${unit === u ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
          >
            {u === "miles" ? "Miles / MPG" : "Kilometers / L/100km"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Distance ({unit === "miles" ? "miles" : "km"})
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={distance}
            onChange={e => setDistance(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {unit === "miles" ? "Fuel Economy (MPG)" : "Fuel Economy (L/100km)"}
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={mpg}
            onChange={e => setMpg(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gas Price (per gallon)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              step="0.01"
              value={gasPrice}
              onChange={e => setGasPrice(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Total Cost</p>
            <p className="text-3xl font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ${totalCost.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Gallons Used</p>
            <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {gallonsUsed.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Cost per 100 {unit}</p>
            <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ${isFinite(costPer100) ? costPer100.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-700 mb-2">Average US Gas Prices (2024)</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {[["Regular", "$3.30 - $3.60"], ["Mid-Grade", "$3.60 - $3.90"], ["Premium", "$3.90 - $4.20"], ["Diesel", "$3.70 - $4.00"]].map(([type, price]) => (
            <div key={type} className="flex justify-between"><span>{type}</span><span className="font-medium">{price}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Currency Converter -------------------------------------------------------

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.36, AUD: 1.53,
  CHF: 0.89, CNY: 7.24, INR: 83.12, MXN: 17.15, BRL: 4.97, KRW: 1325,
  SGD: 1.34, HKD: 7.82, NOK: 10.55, SEK: 10.42, DKK: 6.89, NZD: 1.63,
  ZAR: 18.63, AED: 3.67,
};

const CURRENCY_NAMES: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", JPY: "Japanese Yen",
  CAD: "Canadian Dollar", AUD: "Australian Dollar", CHF: "Swiss Franc",
  CNY: "Chinese Yuan", INR: "Indian Rupee", MXN: "Mexican Peso",
  BRL: "Brazilian Real", KRW: "South Korean Won", SGD: "Singapore Dollar",
  HKD: "Hong Kong Dollar", NOK: "Norwegian Krone", SEK: "Swedish Krona",
  DKK: "Danish Krone", NZD: "New Zealand Dollar", ZAR: "South African Rand",
  AED: "UAE Dirham",
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const amountNum = parseFloat(amount) || 0;
  const rate = EXCHANGE_RATES[to] / EXCHANGE_RATES[from];
  const converted = amountNum * rate;

  const swap = () => { setFrom(to); setTo(from); };

  const currencies = Object.keys(EXCHANGE_RATES);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
        <input
          type="number"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">From</label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={from}
            onChange={e => setFrom(e.target.value)}
          >
            {currencies.map(c => <option key={c} value={c}>{c} - {CURRENCY_NAMES[c]}</option>)}
          </select>
        </div>
        <button
          onClick={swap}
          className="mt-6 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors font-bold text-lg"
          title="Swap currencies"
        >
          &#8644;
        </button>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">To</label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={to}
            onChange={e => setTo(e.target.value)}
          >
            {currencies.map(c => <option key={c} value={c}>{c} - {CURRENCY_NAMES[c]}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-500 mb-1">{amountNum.toLocaleString()} {from} =</p>
        <p className="text-5xl font-bold text-emerald-600 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="text-lg font-semibold text-gray-700">{to} -- {CURRENCY_NAMES[to]}</p>
        <p className="text-xs text-gray-400 mt-3">1 {from} = {rate.toFixed(4)} {to} | Rates are approximate and for reference only</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Popular Conversions from {from}</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
          {currencies.filter(c => c !== from).slice(0, 8).map(c => (
            <div key={c} className="flex justify-between">
              <span>1 {from}</span>
              <span className="font-medium">{(EXCHANGE_RATES[c] / EXCHANGE_RATES[from]).toFixed(4)} {c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Inflation Calculator -----------------------------------------------------

// Historical US CPI annual averages (approximate)
const CPI_DATA: Record<number, number> = {
  1960: 29.6, 1965: 31.5, 1970: 38.8, 1975: 53.8, 1980: 82.4, 1985: 107.6,
  1990: 130.7, 1995: 152.4, 2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0,
  2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.3, 2008: 215.3, 2009: 214.5,
  2010: 218.1, 2011: 224.9, 2012: 229.6, 2013: 233.0, 2014: 236.7, 2015: 237.0,
  2016: 240.0, 2017: 245.1, 2018: 251.1, 2019: 255.7, 2020: 258.8, 2021: 270.9,
  2022: 292.7, 2023: 304.7, 2024: 314.2,
};

export function InflationCalculator() {
  const [amount, setAmount] = useState("1000");
  const [startYear, setStartYear] = useState("2000");
  const [endYear, setEndYear] = useState("2024");

  const amountNum = parseFloat(amount) || 0;
  const startCPI = CPI_DATA[parseInt(startYear)];
  const endCPI = CPI_DATA[parseInt(endYear)];
  const adjustedAmount = startCPI && endCPI ? amountNum * (endCPI / startCPI) : 0;
  const totalInflation = startCPI && endCPI ? ((endCPI - startCPI) / startCPI) * 100 : 0;
  const years = parseInt(endYear) - parseInt(startYear);
  const annualRate = years > 0 ? (Math.pow(endCPI / startCPI, 1 / years) - 1) * 100 : 0;
  const purchasingPower = startCPI && endCPI ? (startCPI / endCPI) * 100 : 100;

  const yearOptions = Object.keys(CPI_DATA).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
          <input
            type="number"
            className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">From Year</label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={startYear}
            onChange={e => setStartYear(e.target.value)}
          >
            {yearOptions.filter(y => y < parseInt(endYear)).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">To Year</label>
          <select
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            value={endYear}
            onChange={e => setEndYear(e.target.value)}
          >
            {yearOptions.filter(y => y > parseInt(startYear)).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {adjustedAmount > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6">
          <div className="text-center mb-5">
            <p className="text-sm text-gray-500 mb-1">
              ${amountNum.toLocaleString()} in {startYear} is worth
            </p>
            <p className="text-5xl font-bold text-emerald-600 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ${adjustedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-500">in {endYear} dollars</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-emerald-100">
            <div>
              <p className="text-xs text-gray-500">Total Inflation</p>
              <p className="text-lg font-bold text-gray-900">{totalInflation.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Annual Rate</p>
              <p className="text-lg font-bold text-gray-900">{annualRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Purchasing Power</p>
              <p className="text-lg font-bold text-gray-900">{purchasingPower.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-700 mb-1">About This Calculator</p>
        <p className="text-xs leading-relaxed">Uses US Bureau of Labor Statistics CPI (Consumer Price Index) data. Rates are based on annual averages. For official calculations, visit <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">bls.gov</a>.</p>
      </div>
    </div>
  );
}
