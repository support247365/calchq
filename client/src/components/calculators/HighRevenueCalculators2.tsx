/**
 * CalcHQ — High-Revenue Health Calculators Batch 2
 * Heart Rate Zone, Water Intake, Due Date, Menstrual Cycle
 */
import { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// HEART RATE ZONE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
const HR_ZONES = [
  { zone: 1, name: "Recovery", pctMin: 50, pctMax: 60, color: "bg-blue-100 text-blue-800 border-blue-200", description: "Very light activity. Active recovery, warm-up, cool-down. Burns fat primarily." },
  { zone: 2, name: "Fat Burn", pctMin: 60, pctMax: 70, color: "bg-green-100 text-green-800 border-green-200", description: "Light aerobic. Best for fat burning and building aerobic base. Can sustain for hours." },
  { zone: 3, name: "Aerobic", pctMin: 70, pctMax: 80, color: "bg-yellow-100 text-yellow-800 border-yellow-200", description: "Moderate aerobic. Improves cardiovascular fitness and endurance. Conversational pace." },
  { zone: 4, name: "Threshold", pctMin: 80, pctMax: 90, color: "bg-orange-100 text-orange-800 border-orange-200", description: "Hard effort near lactate threshold. Improves speed and performance. Hard to speak." },
  { zone: 5, name: "Max Effort", pctMin: 90, pctMax: 100, color: "bg-red-100 text-red-800 border-red-200", description: "Maximum intensity. Short bursts only. Improves VO2 max and peak performance." },
];

export function HeartRateZoneCalculator() {
  const [age, setAge] = useState("35");
  const [restingHR, setRestingHR] = useState("65");
  const [method, setMethod] = useState<"max" | "karvonen">("karvonen");
  const [customMax, setCustomMax] = useState("");

  const result = useMemo(() => {
    const ageNum = parseInt(age) || 35;
    const rhr = parseInt(restingHR) || 65;
    const maxHR = customMax ? parseInt(customMax) : 220 - ageNum;

    if (maxHR <= 0 || rhr >= maxHR) return null;

    const hrr = maxHR - rhr; // Heart Rate Reserve (Karvonen)

    return HR_ZONES.map(z => {
      let low: number, high: number;
      if (method === "karvonen") {
        low = Math.round(rhr + hrr * (z.pctMin / 100));
        high = Math.round(rhr + hrr * (z.pctMax / 100));
      } else {
        low = Math.round(maxHR * (z.pctMin / 100));
        high = Math.round(maxHR * (z.pctMax / 100));
      }
      return { ...z, low, high };
    });
  }, [age, restingHR, method, customMax]);

  const maxHRDisplay = customMax ? parseInt(customMax) : 220 - (parseInt(age) || 35);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)} min="10" max="100"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Resting Heart Rate (bpm)</label>
          <input type="number" value={restingHR} onChange={e => setRestingHR(e.target.value)} min="30" max="120"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Max HR Override (optional)</label>
          <input type="number" value={customMax} onChange={e => setCustomMax(e.target.value)} placeholder={`${maxHRDisplay} (estimated)`} min="100" max="230"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Method</label>
          <select value={method} onChange={e => setMethod(e.target.value as "max" | "karvonen")}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            <option value="karvonen">Karvonen (uses resting HR)</option>
            <option value="max">% of Max HR (simpler)</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm text-gray-600">
        <strong>Estimated Max HR:</strong> {maxHRDisplay} bpm (220 − age formula)
        {method === "karvonen" && <span> &nbsp;|&nbsp; <strong>Heart Rate Reserve:</strong> {maxHRDisplay - (parseInt(restingHR) || 65)} bpm</span>}
      </div>

      {result && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Your 5 Heart Rate Training Zones</h3>
          {result.map(z => (
            <div key={z.zone} className={`rounded-xl p-4 border ${z.color}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">Zone {z.zone}</span>
                  <span className="font-semibold">{z.name}</span>
                  <span className="text-xs opacity-70">{z.pctMin}–{z.pctMax}%</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold">{z.low}–{z.high}</span>
                  <span className="text-sm ml-1 opacity-70">bpm</span>
                </div>
              </div>
              <p className="text-sm opacity-80">{z.description}</p>
              {/* Visual bar */}
              <div className="mt-2 bg-white/50 rounded-full h-2">
                <div
                  className="h-2 rounded-full opacity-60"
                  style={{
                    marginLeft: `${z.pctMin}%`,
                    width: `${z.pctMax - z.pctMin}%`,
                    background: "currentColor",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <strong>Karvonen vs. % Max HR:</strong> The Karvonen method accounts for your resting heart rate (heart rate reserve), making it more personalized and accurate for training. The simple % of max HR method is easier but less precise.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WATER INTAKE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("160");
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [climate, setClimate] = useState("temperate");
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight) || 0;
    if (w <= 0) return null;

    const weightKg = unit === "lbs" ? w * 0.453592 : w;

    // Base: 35ml per kg body weight (WHO recommendation)
    let baseOz = weightKg * 35 / 29.5735; // convert ml to oz

    // Activity adjustments
    const activityAdd: Record<string, number> = {
      sedentary: 0,
      light: 8,
      moderate: 16,
      active: 24,
      very_active: 32,
    };
    baseOz += activityAdd[activityLevel] ?? 0;

    // Climate
    if (climate === "hot") baseOz += 16;
    if (climate === "very_hot") baseOz += 24;

    // Pregnancy / breastfeeding
    if (pregnant) baseOz += 10;
    if (breastfeeding) baseOz += 13;

    const cups = baseOz / 8;
    const liters = baseOz * 0.0295735;
    const glasses = Math.round(cups);

    // Hourly breakdown (assuming 16 waking hours)
    const ozPerHour = baseOz / 16;

    return { oz: baseOz, cups, liters, glasses, ozPerHour };
  }, [weight, unit, activityLevel, climate, pregnant, breastfeeding]);

  const ACTIVITY_OPTIONS = [
    { value: "sedentary", label: "Sedentary (desk job, little exercise)" },
    { value: "light", label: "Light (1–3 days/week exercise)" },
    { value: "moderate", label: "Moderate (3–5 days/week exercise)" },
    { value: "active", label: "Active (6–7 days/week exercise)" },
    { value: "very_active", label: "Very Active (athlete / physical job)" },
  ];

  const CLIMATE_OPTIONS = [
    { value: "cool", label: "Cool / Cold climate" },
    { value: "temperate", label: "Temperate (mild)" },
    { value: "hot", label: "Hot climate or summer" },
    { value: "very_hot", label: "Very hot / humid / desert" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Body Weight</label>
          <div className="flex gap-2">
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} min="50" max="600"
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <select value={unit} onChange={e => setUnit(e.target.value as "lbs" | "kg")}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="lbs">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Activity Level</label>
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Climate</label>
          <select value={climate} onChange={e => setClimate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            {CLIMATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Conditions</label>
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={pregnant} onChange={e => setPregnant(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              Pregnant
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={breastfeeding} onChange={e => setBreastfeeding(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              Breastfeeding
            </label>
          </div>
        </div>
      </div>

      {result && (
        <>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-800 mb-4">Your Daily Water Intake Goal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-3xl font-bold text-blue-600">{result.liters.toFixed(1)}</p>
                <p className="text-sm text-gray-500 mt-1">Liters / day</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-3xl font-bold text-blue-600">{Math.round(result.oz)}</p>
                <p className="text-sm text-gray-500 mt-1">Fluid ounces / day</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-3xl font-bold text-blue-600">{result.glasses}</p>
                <p className="text-sm text-gray-500 mt-1">8 oz glasses / day</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <p className="text-3xl font-bold text-blue-600">{result.ozPerHour.toFixed(1)}</p>
                <p className="text-sm text-gray-500 mt-1">oz per waking hour</p>
              </div>
            </div>
          </div>

          {/* Hydration schedule */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Suggested Hydration Schedule</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { time: "Wake up", amount: "16 oz", tip: "Rehydrate after sleep" },
                { time: "Morning", amount: `${Math.round(result.oz * 0.25)} oz`, tip: "Before/after breakfast" },
                { time: "Afternoon", amount: `${Math.round(result.oz * 0.35)} oz`, tip: "Largest portion of day" },
                { time: "Evening", amount: `${Math.round(result.oz * 0.25)} oz`, tip: "Stop 2hrs before bed" },
              ].map(s => (
                <div key={s.time} className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="font-semibold text-gray-800">{s.time}</p>
                  <p className="text-blue-600 font-bold text-lg">{s.amount}</p>
                  <p className="text-xs text-gray-500">{s.tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>Note:</strong> About 20% of daily water intake comes from food. This calculator estimates total fluid intake needed. Adjust based on urine color — pale yellow indicates good hydration.
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DUE DATE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function DueDateCalculator() {
  const [calcMethod, setCalcMethod] = useState<"lmp" | "conception" | "ivf">("lmp");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [cycleLength, setCycleLength] = useState("28");

  const result = useMemo(() => {
    const d = new Date(date + "T12:00:00");
    if (isNaN(d.getTime())) return null;

    let conceptionDate: Date;
    let lmpDate: Date;

    if (calcMethod === "lmp") {
      lmpDate = d;
      const cycleAdj = (parseInt(cycleLength) || 28) - 28;
      conceptionDate = new Date(d.getTime() + (14 + cycleAdj) * 86400000);
    } else if (calcMethod === "conception") {
      conceptionDate = d;
      lmpDate = new Date(d.getTime() - 14 * 86400000);
    } else {
      // IVF transfer date — add 266 days (38 weeks) from transfer
      const dueDate = new Date(d.getTime() + 266 * 86400000);
      const today = new Date();
      const daysPregnant = Math.floor((today.getTime() - d.getTime()) / 86400000) + 14;
      const weeksPregnant = Math.floor(daysPregnant / 7);
      const daysRemainder = daysPregnant % 7;
      const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);

      return {
        dueDate,
        lmpDate: new Date(d.getTime() - 14 * 86400000),
        conceptionDate: d,
        weeksPregnant,
        daysRemainder,
        daysUntilDue,
        trimester: weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3,
        milestones: getMilestones(new Date(d.getTime() - 14 * 86400000)),
      };
    }

    const dueDate = new Date(lmpDate.getTime() + 280 * 86400000); // Naegele's rule: LMP + 280 days
    const today = new Date();
    const daysPregnant = Math.max(0, Math.floor((today.getTime() - lmpDate.getTime()) / 86400000));
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysRemainder = daysPregnant % 7;
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);

    return {
      dueDate,
      lmpDate,
      conceptionDate,
      weeksPregnant,
      daysRemainder,
      daysUntilDue,
      trimester: weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3,
      milestones: getMilestones(lmpDate),
    };
  }, [date, calcMethod, cycleLength]);

  function getMilestones(lmp: Date) {
    const add = (days: number) => {
      const d = new Date(lmp.getTime() + days * 86400000);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };
    return [
      { week: 6, label: "Heartbeat detectable", date: add(42) },
      { week: 8, label: "First prenatal visit (typical)", date: add(56) },
      { week: 12, label: "End of first trimester", date: add(84) },
      { week: 20, label: "Anatomy scan / gender reveal", date: add(140) },
      { week: 24, label: "Viability milestone", date: add(168) },
      { week: 27, label: "End of second trimester", date: add(189) },
      { week: 36, label: "Full term begins (early)", date: add(252) },
      { week: 40, label: "Due date", date: add(280) },
    ];
  }

  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { value: "lmp", label: "Last Menstrual Period" },
          { value: "conception", label: "Conception Date" },
          { value: "ivf", label: "IVF Transfer Date" },
        ].map(m => (
          <button key={m.value} onClick={() => setCalcMethod(m.value as typeof calcMethod)}
            className={`py-2 px-4 rounded-xl text-sm font-semibold border transition-all ${
              calcMethod === m.value
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-pink-300"
            }`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {calcMethod === "lmp" ? "First Day of Last Period" : calcMethod === "conception" ? "Conception Date" : "IVF Transfer Date"}
          </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        {calcMethod === "lmp" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cycle Length (days)</label>
            <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} min="21" max="45"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
        )}
      </div>

      {result && (
        <>
          <div className="bg-pink-50 border border-pink-100 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-pink-800 mb-4">Estimated Due Date</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm col-span-1 sm:col-span-1 text-center">
                <p className="text-xs text-gray-500 mb-2">Due Date</p>
                <p className="text-lg font-bold text-pink-600">{fmtDate(result.dueDate)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-xs text-gray-500 mb-1">Currently</p>
                <p className="text-2xl font-bold text-gray-800">{result.weeksPregnant}w {result.daysRemainder}d</p>
                <p className="text-xs text-gray-500">Trimester {result.trimester}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-xs text-gray-500 mb-1">Days Until Due</p>
                <p className="text-2xl font-bold text-gray-800">{result.daysUntilDue > 0 ? result.daysUntilDue : "Past due"}</p>
                <p className="text-xs text-gray-500">{result.daysUntilDue > 0 ? `${Math.ceil(result.daysUntilDue / 7)} weeks remaining` : ""}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Pregnancy Milestones</h3>
            <div className="space-y-2">
              {result.milestones.map(m => (
                <div key={m.week} className={`flex items-center justify-between py-2 px-3 rounded-lg text-sm ${
                  result.weeksPregnant >= m.week ? "bg-pink-50 text-pink-800" : "bg-white text-gray-600"
                } border border-gray-100`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      result.weeksPregnant >= m.week ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-500"
                    }`}>{result.weeksPregnant >= m.week ? "✓" : m.week}</span>
                    <span>{m.label}</span>
                  </div>
                  <span className="text-xs font-medium">{m.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>Medical Disclaimer:</strong> This calculator uses Naegele's rule and is for informational purposes only. Only 5% of babies are born on their exact due date. Consult your healthcare provider for accurate dating, which may use ultrasound measurements.
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENSTRUAL CYCLE CALCULATOR
// ─────────────────────────────────────────────────────────────────────────────
export function MenstrualCycleCalculator() {
  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0];
  });
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");
  const [cycles, setCycles] = useState("6");

  const result = useMemo(() => {
    const lmp = new Date(lastPeriod + "T12:00:00");
    if (isNaN(lmp.getTime())) return null;

    const cycle = parseInt(cycleLength) || 28;
    const period = parseInt(periodLength) || 5;
    const numCycles = parseInt(cycles) || 6;
    const lutealPhase = 14; // typically 14 days before next period
    const ovulationDay = cycle - lutealPhase;

    const predictions = [];
    for (let i = 0; i < numCycles; i++) {
      const periodStart = new Date(lmp.getTime() + i * cycle * 86400000);
      const periodEnd = new Date(periodStart.getTime() + (period - 1) * 86400000);
      const ovulation = new Date(periodStart.getTime() + ovulationDay * 86400000);
      const fertileStart = new Date(ovulation.getTime() - 5 * 86400000);
      const fertileEnd = new Date(ovulation.getTime() + 1 * 86400000);
      const nextPeriod = new Date(periodStart.getTime() + cycle * 86400000);

      predictions.push({ periodStart, periodEnd, ovulation, fertileStart, fertileEnd, nextPeriod });
    }

    const today = new Date();
    const currentCycle = predictions.find(p => today >= p.periodStart && today < p.nextPeriod);
    let currentPhase = "Unknown";
    let daysUntilNext = 0;

    if (currentCycle) {
      const dayOfCycle = Math.floor((today.getTime() - currentCycle.periodStart.getTime()) / 86400000) + 1;
      if (dayOfCycle <= period) currentPhase = `Menstruation (day ${dayOfCycle})`;
      else if (today < currentCycle.fertileStart) currentPhase = "Follicular phase";
      else if (today <= currentCycle.fertileEnd) currentPhase = "Fertile window 🌸";
      else currentPhase = "Luteal phase";
      daysUntilNext = Math.floor((currentCycle.nextPeriod.getTime() - today.getTime()) / 86400000);
    }

    return { predictions, currentPhase, daysUntilNext, ovulationDay, cycle };
  }, [lastPeriod, cycleLength, periodLength, cycles]);

  const fmtShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">First Day of Last Period</label>
          <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cycle Length (days)</label>
          <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} min="21" max="45"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Period Length (days)</label>
          <input type="number" value={periodLength} onChange={e => setPeriodLength(e.target.value)} min="1" max="10"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Predict Next</label>
          <select value={cycles} onChange={e => setCycles(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
            {[3, 6, 9, 12].map(n => <option key={n} value={n}>{n} cycles</option>)}
          </select>
        </div>
      </div>

      {result && (
        <>
          {result.currentPhase !== "Unknown" && (
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-pink-600 font-semibold uppercase tracking-wide">Current Phase</p>
                <p className="text-lg font-bold text-pink-800 mt-1">{result.currentPhase}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Next period in</p>
                <p className="text-2xl font-bold text-pink-600">{result.daysUntilNext} days</p>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Cycle", "Period", "Fertile Window", "Ovulation", "Next Period"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.predictions.map((p, i) => (
                  <tr key={i} className="hover:bg-pink-50/30">
                    <td className="px-4 py-3 font-medium text-gray-700">Cycle {i + 1}</td>
                    <td className="px-4 py-3 text-red-600">{fmtShort(p.periodStart)} – {fmtShort(p.periodEnd)}</td>
                    <td className="px-4 py-3 text-green-600">{fmtShort(p.fertileStart)} – {fmtShort(p.fertileEnd)}</td>
                    <td className="px-4 py-3 text-pink-600 font-semibold">{fmtShort(p.ovulation)}</td>
                    <td className="px-4 py-3 text-gray-600">{fmtShort(p.nextPeriod)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
            <strong>Note:</strong> These predictions assume a regular cycle. Cycle length can vary due to stress, illness, diet, and other factors. This calculator is for informational purposes only and should not be used as a contraceptive method.
          </div>
        </>
      )}
    </div>
  );
}
