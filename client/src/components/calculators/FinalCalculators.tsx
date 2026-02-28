/*
 * CalcHQ -- Final Calculators Batch
 * Temperature Converter, Speed Converter, Pace Calculator, Net Worth Calculator
 */
import { useState } from "react";
import { RefreshCw, Plus, Trash2, DollarSign, TrendingUp } from "lucide-react";

//  Temperature Converter 

export function TemperatureConverter() {
  const [value, setValue] = useState("100");
  const [from, setFrom] = useState<"C" | "F" | "K">("C");

  const num = parseFloat(value);
  const isValid = !isNaN(num);

  function toCelsius(v: number, unit: string): number {
    if (unit === "C") return v;
    if (unit === "F") return (v - 32) * (5 / 9);
    return v - 273.15; // K
  }

  function fromCelsius(c: number, unit: string): number {
    if (unit === "C") return c;
    if (unit === "F") return c * (9 / 5) + 32;
    return c + 273.15; // K
  }

  const celsius = isValid ? toCelsius(num, from) : null;

  const results = celsius !== null
    ? [
        { unit: "Celsius (C)", symbol: "C", value: celsius },
        { unit: "Fahrenheit (F)", symbol: "F", value: fromCelsius(celsius, "F") },
        { unit: "Kelvin (K)", symbol: "K", value: fromCelsius(celsius, "K") },
        { unit: "Rankine (R)", symbol: "R", value: (fromCelsius(celsius, "K")) * (9 / 5) },
        { unit: "Delisle (De)", symbol: "De", value: (100 - celsius) * (3 / 2) },
        { unit: "Newton (N)", symbol: "N", value: celsius * (33 / 100) },
        { unit: "Reaumur (Re)", symbol: "Re", value: celsius * (4 / 5) },
        { unit: "Romer (Ro)", symbol: "Ro", value: celsius * (21 / 40) + 7.5 },
      ]
    : [];

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000) return n.toFixed(2);
    return parseFloat(n.toFixed(4)).toString();
  };

  const QUICK = [
    { label: "Water boils", value: "100", from: "C" as const },
    { label: "Body temp", value: "98.6", from: "F" as const },
    { label: "Water freezes", value: "32", from: "F" as const },
    { label: "Absolute zero", value: "0", from: "K" as const },
    { label: "Room temp", value: "72", from: "F" as const },
    { label: "Oven (350F)", value: "350", from: "F" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Temperature Converter
        </h2>
        <div className="flex gap-3 mb-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-orange-200 rounded-xl text-gray-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Enter temperature"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value as "C" | "F" | "K")}
            className="px-4 py-3 bg-white border border-orange-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="C">Celsius (C)</option>
            <option value="F">Fahrenheit (F)</option>
            <option value="K">Kelvin (K)</option>
          </select>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.label}
              onClick={() => { setValue(q.value); setFrom(q.from); }}
              className="px-3 py-1.5 bg-white border border-orange-200 rounded-full text-xs font-medium text-orange-700 hover:bg-orange-50 transition-colors"
            >
              {q.label} ({q.value}{q.from})
            </button>
          ))}
        </div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {results.map((r) => (
            <div
              key={r.symbol}
              className={`bg-white border rounded-xl p-4 text-center ${r.symbol === from ? "border-orange-400 shadow-sm" : "border-gray-100"}`}
            >
              <div className="text-xs font-semibold text-gray-400 mb-1">{r.unit}</div>
              <div className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {fmt(r.value)}
                <span className="text-sm font-normal text-gray-500 ml-1">{r.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Common reference */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Common Reference Points</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200">
                <th className="text-left pb-2">Description</th>
                <th className="text-right pb-2">C</th>
                <th className="text-right pb-2">F</th>
                <th className="text-right pb-2">K</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Absolute zero", -273.15, -459.67, 0],
                ["Water freezes", 0, 32, 273.15],
                ["Room temperature", 20, 68, 293.15],
                ["Body temperature", 37, 98.6, 310.15],
                ["Water boils", 100, 212, 373.15],
                ["Oven (moderate)", 177, 350, 450.15],
                ["Sun surface", 5505, 9941, 5778],
              ].map(([desc, c, f, k]) => (
                <tr key={String(desc)} className="hover:bg-gray-100 cursor-pointer" onClick={() => { setValue(String(c)); setFrom("C"); }}>
                  <td className="py-2 text-gray-600">{desc}</td>
                  <td className="py-2 text-right font-mono text-gray-800">{c}</td>
                  <td className="py-2 text-right font-mono text-gray-800">{f}</td>
                  <td className="py-2 text-right font-mono text-gray-800">{k}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

//  Speed Converter 

const SPEED_UNITS = [
  { key: "mph", label: "Miles per hour (mph)", toMs: 0.44704 },
  { key: "kph", label: "Kilometers per hour (km/h)", toMs: 1 / 3.6 },
  { key: "ms", label: "Meters per second (m/s)", toMs: 1 },
  { key: "fps", label: "Feet per second (ft/s)", toMs: 0.3048 },
  { key: "knot", label: "Knots (kn)", toMs: 0.514444 },
  { key: "mach", label: "Mach (at sea level)", toMs: 340.29 },
  { key: "c", label: "Speed of light (c)", toMs: 299792458 },
];

export function SpeedConverter() {
  const [value, setValue] = useState("60");
  const [from, setFrom] = useState("mph");

  const num = parseFloat(value);
  const isValid = !isNaN(num) && num >= 0;
  const fromUnit = SPEED_UNITS.find((u) => u.key === from)!;
  const ms = isValid ? num * fromUnit.toMs : null;

  const fmt = (n: number) => {
    if (n === 0) return "0";
    if (n < 0.0001) return n.toExponential(4);
    if (n >= 1e9) return n.toExponential(4);
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return parseFloat(n.toPrecision(6)).toString();
  };

  const QUICK = [
    { label: "Walking (3 mph)", value: "3", from: "mph" },
    { label: "Cycling (15 mph)", value: "15", from: "mph" },
    { label: "Highway (65 mph)", value: "65", from: "mph" },
    { label: "Sound (Mach 1)", value: "1", from: "mach" },
    { label: "Commercial jet", value: "575", from: "mph" },
    { label: "Light", value: "1", from: "c" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Speed Converter
        </h2>
        <div className="flex gap-3 mb-4">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
            className="flex-1 px-4 py-3 bg-white border border-blue-200 rounded-xl text-gray-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter speed"
          />
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-4 py-3 bg-white border border-blue-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {SPEED_UNITS.map((u) => (
              <option key={u.key} value={u.key}>{u.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q.label}
              onClick={() => { setValue(q.value); setFrom(q.from); }}
              className="px-3 py-1.5 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {ms !== null && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SPEED_UNITS.map((u) => {
            const converted = ms / u.toMs;
            return (
              <div
                key={u.key}
                className={`bg-white border rounded-xl p-4 ${u.key === from ? "border-blue-400 shadow-sm" : "border-gray-100"}`}
              >
                <div className="text-xs font-semibold text-gray-400 mb-1">{u.label}</div>
                <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {fmt(converted)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

//  Pace Calculator 

export function PaceCalculator() {
  const [mode, setMode] = useState<"pace" | "time" | "distance">("pace");
  const [distanceMi, setDistanceMi] = useState("3.1");
  const [paceMin, setPaceMin] = useState("10");
  const [paceSec, setPaceSec] = useState("00");
  const [timeHr, setTimeHr] = useState("0");
  const [timeMin, setTimeMin] = useState("31");
  const [timeSec, setTimeSec] = useState("00");
  const [unit, setUnit] = useState<"mi" | "km">("mi");

  const RACES = [
    { name: "5K", mi: 3.10686 },
    { name: "10K", mi: 6.21371 },
    { name: "Half Marathon", mi: 13.1094 },
    { name: "Marathon", mi: 26.2188 },
  ];

  function calcResult() {
    const dist = parseFloat(distanceMi) * (unit === "km" ? 0.621371 : 1);
    const paceSeconds = parseInt(paceMin || "0") * 60 + parseInt(paceSec || "0");
    const totalSeconds = parseInt(timeHr || "0") * 3600 + parseInt(timeMin || "0") * 60 + parseInt(timeSec || "0");

    if (mode === "pace") {
      // Calculate pace from distance + time
      if (!dist || !totalSeconds) return null;
      const pacePerMile = totalSeconds / dist;
      const pacePerKm = totalSeconds / (dist * 1.60934);
      return { pacePerMile, pacePerKm, totalSeconds, dist };
    } else if (mode === "time") {
      // Calculate time from distance + pace
      if (!dist || !paceSeconds) return null;
      const total = dist * paceSeconds;
      const pacePerKm = paceSeconds / 0.621371;
      return { pacePerMile: paceSeconds, pacePerKm, totalSeconds: total, dist };
    } else {
      // Calculate distance from time + pace
      if (!totalSeconds || !paceSeconds) return null;
      const calculatedDist = totalSeconds / paceSeconds;
      const pacePerKm = paceSeconds / 0.621371;
      return { pacePerMile: paceSeconds, pacePerKm, totalSeconds, dist: calculatedDist };
    }
  }

  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.round(s % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const fmtPace = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

  const result = calcResult();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Running Pace Calculator
        </h2>

        {/* Mode tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-green-200 mb-5 w-fit">
          {(["pace", "time", "distance"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${mode === m ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Find {m}
            </button>
          ))}
        </div>

        {/* Unit toggle */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm text-gray-500">Unit:</span>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["mi", "km"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors ${unit === u ? "bg-white shadow-sm text-gray-900" : "text-gray-500"}`}
              >
                {u === "mi" ? "Miles" : "Kilometers"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Distance */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Distance ({unit})
            </label>
            <input
              type="number"
              value={distanceMi}
              onChange={(e) => setDistanceMi(e.target.value)}
              disabled={mode === "distance"}
              className="w-full px-3 py-2.5 bg-white border border-green-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
              placeholder="e.g. 3.1"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {RACES.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setDistanceMi(String(unit === "mi" ? r.mi.toFixed(4) : (r.mi * 1.60934).toFixed(4)))}
                  disabled={mode === "distance"}
                  className="text-xs px-2 py-1 bg-white border border-green-200 rounded-full text-green-700 hover:bg-green-50 disabled:opacity-40 transition-colors"
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pace */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Pace (min:{unit === "mi" ? "mi" : "km"})
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                value={paceMin}
                onChange={(e) => setPaceMin(e.target.value)}
                disabled={mode === "pace"}
                min="0"
                max="59"
                className="w-full px-3 py-2.5 bg-white border border-green-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="min"
              />
              <span className="flex items-center text-gray-400 font-bold">:</span>
              <input
                type="number"
                value={paceSec}
                onChange={(e) => setPaceSec(e.target.value)}
                disabled={mode === "pace"}
                min="0"
                max="59"
                className="w-full px-3 py-2.5 bg-white border border-green-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="sec"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Time (h:mm:ss)
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                value={timeHr}
                onChange={(e) => setTimeHr(e.target.value)}
                disabled={mode === "time"}
                min="0"
                className="w-16 px-2 py-2.5 bg-white border border-green-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="h"
              />
              <input
                type="number"
                value={timeMin}
                onChange={(e) => setTimeMin(e.target.value)}
                disabled={mode === "time"}
                min="0"
                max="59"
                className="w-full px-2 py-2.5 bg-white border border-green-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="min"
              />
              <input
                type="number"
                value={timeSec}
                onChange={(e) => setTimeSec(e.target.value)}
                disabled={mode === "time"}
                min="0"
                max="59"
                className="w-full px-2 py-2.5 bg-white border border-green-200 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 disabled:text-gray-400"
                placeholder="sec"
              />
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <div className="text-xs font-semibold text-emerald-600 mb-1">Pace / Mile</div>
            <div className="text-2xl font-bold text-emerald-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmtPace(result.pacePerMile)}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-xs font-semibold text-blue-600 mb-1">Pace / km</div>
            <div className="text-2xl font-bold text-blue-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmtPace(result.pacePerKm)}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-xs font-semibold text-purple-600 mb-1">Total Time</div>
            <div className="text-2xl font-bold text-purple-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmtTime(result.totalSeconds)}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <div className="text-xs font-semibold text-orange-600 mb-1">Speed (mph)</div>
            <div className="text-2xl font-bold text-orange-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {(result.dist / (result.totalSeconds / 3600)).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Race projections */}
      {result && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Race Finish Time Projections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RACES.map((r) => (
              <div key={r.name} className="bg-white border border-gray-100 rounded-xl p-3 text-center">
                <div className="text-xs font-semibold text-gray-400 mb-1">{r.name}</div>
                <div className="text-base font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {fmtTime(r.mi * result.pacePerMile)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

//  Net Worth Calculator 

type AssetItem = { id: number; label: string; value: string; category: "asset" | "liability" };

const DEFAULT_ITEMS: AssetItem[] = [
  { id: 1, label: "Checking / Savings", value: "15000", category: "asset" },
  { id: 2, label: "Investment Accounts", value: "45000", category: "asset" },
  { id: 3, label: "Retirement (401k/IRA)", value: "80000", category: "asset" },
  { id: 4, label: "Home Value", value: "350000", category: "asset" },
  { id: 5, label: "Vehicle(s)", value: "25000", category: "asset" },
  { id: 6, label: "Mortgage Balance", value: "280000", category: "liability" },
  { id: 7, label: "Auto Loan", value: "12000", category: "liability" },
  { id: 8, label: "Credit Card Debt", value: "5000", category: "liability" },
  { id: 9, label: "Student Loans", value: "20000", category: "liability" },
];

let nextId = 10;

export function NetWorthCalculator() {
  const [items, setItems] = useState<AssetItem[]>(DEFAULT_ITEMS);

  const totalAssets = items.filter((i) => i.category === "asset").reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
  const totalLiabilities = items.filter((i) => i.category === "liability").reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const addItem = (category: "asset" | "liability") => {
    setItems((prev) => [...prev, { id: nextId++, label: "", value: "0", category }]);
  };

  const updateItem = (id: number, field: "label" | "value", val: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: val } : i)));
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const netWorthColor = netWorth >= 0 ? "text-emerald-600" : "text-red-600";
  const netWorthBg = netWorth >= 0 ? "from-emerald-50 to-green-50 border-emerald-100" : "from-red-50 to-pink-50 border-red-100";

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className={`bg-gradient-to-br ${netWorthBg} rounded-2xl p-6 border`}>
        <h2 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Net Worth Summary
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1">Total Assets</div>
            <div className="text-xl font-bold text-emerald-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmt(totalAssets)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1">Total Liabilities</div>
            <div className="text-xl font-bold text-red-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmt(totalLiabilities)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-400 mb-1">Net Worth</div>
            <div className={`text-2xl font-bold ${netWorthColor}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {fmt(netWorth)}
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Debt-to-Asset Ratio: {debtRatio.toFixed(1)}%</span>
            <span>{debtRatio < 30 ? "Excellent" : debtRatio < 50 ? "Good" : debtRatio < 75 ? "Fair" : "High"}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${debtRatio < 30 ? "bg-emerald-500" : debtRatio < 50 ? "bg-yellow-400" : debtRatio < 75 ? "bg-orange-400" : "bg-red-500"}`}
              style={{ width: `${Math.min(debtRatio, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Assets
            </h3>
            <button
              onClick={() => addItem("asset")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {items.filter((i) => i.category === "asset").map((item) => (
              <div key={item.id} className="flex gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, "label", e.target.value)}
                  placeholder="Asset name"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateItem(item.id, "value", e.target.value)}
                    min="0"
                    className="w-32 pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex justify-end pt-1 border-t border-gray-100">
              <span className="text-sm font-bold text-emerald-600">{fmt(totalAssets)}</span>
            </div>
          </div>
        </div>

        {/* Liabilities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-red-400" />
              Liabilities
            </h3>
            <button
              onClick={() => addItem("liability")}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {items.filter((i) => i.category === "liability").map((item) => (
              <div key={item.id} className="flex gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(item.id, "label", e.target.value)}
                  placeholder="Liability name"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={item.value}
                    onChange={(e) => updateItem(item.id, "value", e.target.value)}
                    min="0"
                    className="w-32 pl-6 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex justify-end pt-1 border-t border-gray-100">
              <span className="text-sm font-bold text-red-500">{fmt(totalLiabilities)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
