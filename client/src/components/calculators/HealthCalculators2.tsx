/*
 * CalcHQ — New Health & Fitness Calculators (Phase 1 Expansion)
 * Design: "Clean Utility" — Space Grotesk headings, Inter body, emerald green accent
 * Calculators: Pregnancy Due Date, Ovulation, Calorie Deficit, Ideal Weight, Sleep
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

// ─── 1. Pregnancy Due Date Calculator ────────────────────────────────────────
export function PregnancyCalculator() {
  const [method, setMethod] = useState<"lmp" | "conception">("lmp");
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().split("T")[0];
  });

  const calcDueDate = () => {
    if (!date) return null;
    const d = new Date(date);
    if (method === "lmp") {
      d.setDate(d.getDate() + 280); // Naegele's rule: LMP + 280 days
    } else {
      d.setDate(d.getDate() + 266); // Conception + 266 days
    }
    return d;
  };

  const dueDate = calcDueDate();

  const getWeeksPregnant = () => {
    if (!date) return null;
    const start = method === "lmp" ? new Date(date) : new Date(new Date(date).getTime() - 14 * 86400000);
    const today = new Date();
    const diff = today.getTime() - start.getTime();
    const weeks = Math.floor(diff / (7 * 86400000));
    const days = Math.floor((diff % (7 * 86400000)) / 86400000);
    return { weeks, days };
  };

  const progress = getWeeksPregnant();

  const MILESTONES = [
    { week: 6, label: "Heartbeat detectable" },
    { week: 12, label: "End of 1st trimester" },
    { week: 20, label: "Anatomy scan / gender reveal" },
    { week: 28, label: "End of 2nd trimester" },
    { week: 37, label: "Full term begins" },
    { week: 40, label: "Due date" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className={labelClass}>Calculation Method</p>
        <div className="flex gap-2">
          {[
            { key: "lmp", label: "Last Menstrual Period" },
            { key: "conception", label: "Conception Date" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMethod(m.key as typeof method)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                method === m.key
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          {method === "lmp" ? "First Day of Last Period" : "Conception Date"}
        </label>
        <input className={inputClass} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {dueDate && (
        <>
          <div className={resultCard}>
            <p className={resultLabel}>Estimated Due Date</p>
            <p className={resultValue}>
              {dueDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {progress && progress.weeks >= 0 && progress.weeks <= 42 && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className={resultLabel}>Currently Pregnant</p>
              <p className="text-lg font-bold text-blue-600">
                {progress.weeks} weeks, {progress.days} days
              </p>
              <div className="mt-2 bg-blue-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (progress.weeks / 40) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-blue-400 mt-1">{Math.min(100, Math.round((progress.weeks / 40) * 100))}% of 40 weeks</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Milestones</p>
            <div className="space-y-1.5">
              {MILESTONES.map((m) => {
                const mDate = new Date(method === "lmp" ? date : new Date(date).getTime() - 14 * 86400000);
                mDate.setDate(mDate.getDate() + m.week * 7);
                const isPast = progress ? progress.weeks >= m.week : false;
                return (
                  <div key={m.week} className={`flex justify-between items-center text-sm py-1.5 border-b border-gray-50 ${isPast ? "opacity-50" : ""}`}>
                    <span className="text-gray-600">Week {m.week} — {m.label}</span>
                    <span className="font-medium text-gray-800 text-xs">
                      {mDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── 2. Ovulation Calculator ──────────────────────────────────────────────────
export function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    return d.toISOString().split("T")[0];
  });
  const [cycleLength, setCycleLength] = useState("28");

  const cycle = parseInt(cycleLength) || 28;
  const lmp = new Date(lastPeriod);

  const ovulationDay = new Date(lmp);
  ovulationDay.setDate(lmp.getDate() + cycle - 14);

  const fertileStart = new Date(ovulationDay);
  fertileStart.setDate(ovulationDay.getDate() - 5);

  const fertileEnd = new Date(ovulationDay);
  fertileEnd.setDate(ovulationDay.getDate() + 1);

  const nextPeriod = new Date(lmp);
  nextPeriod.setDate(lmp.getDate() + cycle);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const today = new Date();
  const daysToOvulation = Math.round((ovulationDay.getTime() - today.getTime()) / 86400000);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Day of Last Period</label>
          <input className={inputClass} type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Average Cycle Length (days)</label>
          <input className={inputClass} type="number" min="21" max="45" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} />
        </div>
      </div>

      <div className={resultCard}>
        <p className={resultLabel}>Estimated Ovulation Date</p>
        <p className={resultValue}>{fmt(ovulationDay)}</p>
        {Math.abs(daysToOvulation) <= 30 && (
          <p className="text-xs text-emerald-500 mt-1">
            {daysToOvulation > 0 ? `In ${daysToOvulation} days` : daysToOvulation === 0 ? "Today!" : `${Math.abs(daysToOvulation)} days ago`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
          <p className={resultLabel}>Fertile Window</p>
          <p className="text-sm font-bold text-pink-600">{fmt(fertileStart)} – {fmt(fertileEnd)}</p>
          <p className="text-xs text-pink-400 mt-0.5">6 days of peak fertility</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <p className={resultLabel}>Next Period Expected</p>
          <p className="text-sm font-bold text-purple-600">{fmt(nextPeriod)}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400">
        This calculator provides estimates based on a regular cycle. Actual ovulation can vary. Consult a healthcare provider for medical advice.
      </p>
    </div>
  );
}

// ─── 3. Calorie Deficit / Weight Loss Calculator ──────────────────────────────
export function CalorieDeficitCalculator() {
  const [weight, setWeight] = useState("180");
  const [height, setHeight] = useState("70");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState("male");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("1"); // lbs per week
  const [unit, setUnit] = useState("imperial");

  const weightKg = unit === "imperial" ? parseFloat(weight) * 0.453592 : parseFloat(weight);
  const heightCm = unit === "imperial" ? parseFloat(height) * 2.54 : parseFloat(height);
  const ageVal = parseFloat(age) || 25;

  // Mifflin-St Jeor BMR
  let bmr = 0;
  if (sex === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageVal + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageVal - 161;
  }

  const tdee = bmr * parseFloat(activity);
  const deficitPerDay = parseFloat(goal) * 500; // 500 cal deficit = 1 lb/week
  const targetCalories = tdee - deficitPerDay;
  const weeksToGoal = 10; // illustrative
  const lbsLost = parseFloat(goal) * weeksToGoal;

  return (
    <div className="space-y-4">
      <div>
        <p className={labelClass}>Unit System</p>
        <div className="flex gap-2">
          {[{ key: "imperial", label: "Imperial (lbs/in)" }, { key: "metric", label: "Metric (kg/cm)" }].map((u) => (
            <button
              key={u.key}
              onClick={() => setUnit(u.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                unit === u.key ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Weight ({unit === "imperial" ? "lbs" : "kg"})</label>
          <input className={inputClass} type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Height ({unit === "imperial" ? "inches" : "cm"})</label>
          <input className={inputClass} type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Age</label>
          <input className={inputClass} type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Biological Sex</label>
          <select className={inputClass} value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Activity Level</label>
          <select className={inputClass} value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="1.2">Sedentary (little/no exercise)</option>
            <option value="1.375">Lightly Active (1–3 days/week)</option>
            <option value="1.55">Moderately Active (3–5 days/week)</option>
            <option value="1.725">Very Active (6–7 days/week)</option>
            <option value="1.9">Super Active (physical job + exercise)</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Weight Loss Goal (lbs per week)</label>
          <select className={inputClass} value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="0.5">0.5 lbs/week (mild deficit)</option>
            <option value="1">1 lb/week (recommended)</option>
            <option value="1.5">1.5 lbs/week (aggressive)</option>
            <option value="2">2 lbs/week (maximum safe)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className={resultLabel}>Maintenance (TDEE)</p>
          <p className="text-lg font-bold text-gray-700">{Math.round(tdee).toLocaleString()} cal</p>
        </div>
        <div className={resultCard}>
          <p className={resultLabel}>Daily Target</p>
          <p className={resultValueSm}>{Math.round(targetCalories).toLocaleString()} cal</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className={resultLabel}>Daily Deficit</p>
          <p className="text-lg font-bold text-blue-600">{Math.round(deficitPerDay).toLocaleString()} cal</p>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        Based on Mifflin-St Jeor equation. A deficit of 500 cal/day = ~1 lb/week of fat loss. Do not go below 1,200 cal/day (women) or 1,500 cal/day (men) without medical supervision.
      </p>
    </div>
  );
}

// ─── 4. Ideal Weight Calculator ───────────────────────────────────────────────
export function IdealWeightCalculator() {
  const [height, setHeight] = useState("70");
  const [sex, setSex] = useState("male");
  const [unit, setUnit] = useState("imperial");

  const heightIn = unit === "imperial" ? parseFloat(height) : parseFloat(height) / 2.54;
  const heightCm = unit === "imperial" ? parseFloat(height) * 2.54 : parseFloat(height);

  // Multiple formulas
  const robinson = sex === "male"
    ? 52 + 1.9 * (heightIn - 60)
    : 49 + 1.7 * (heightIn - 60);

  const miller = sex === "male"
    ? 56.2 + 1.41 * (heightIn - 60)
    : 53.1 + 1.36 * (heightIn - 60);

  const devine = sex === "male"
    ? 50 + 2.3 * (heightIn - 60)
    : 45.5 + 2.3 * (heightIn - 60);

  const hamwi = sex === "male"
    ? 48 + 2.7 * (heightIn - 60)
    : 45.5 + 2.2 * (heightIn - 60);

  const avg = (robinson + miller + devine + hamwi) / 4;

  const toDisplay = (kg: number) =>
    unit === "imperial"
      ? `${(kg * 2.20462).toFixed(1)} lbs`
      : `${kg.toFixed(1)} kg`;

  const bmiLow = (18.5 * Math.pow(heightCm / 100, 2));
  const bmiHigh = (24.9 * Math.pow(heightCm / 100, 2));

  return (
    <div className="space-y-4">
      <div>
        <p className={labelClass}>Unit System</p>
        <div className="flex gap-2">
          {[{ key: "imperial", label: "Imperial (lbs/in)" }, { key: "metric", label: "Metric (kg/cm)" }].map((u) => (
            <button
              key={u.key}
              onClick={() => setUnit(u.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                unit === u.key ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Height ({unit === "imperial" ? "inches" : "cm"})</label>
          <input className={inputClass} type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Biological Sex</label>
          <select className={inputClass} value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className={resultCard}>
        <p className={resultLabel}>Ideal Weight (Average of 4 formulas)</p>
        <p className={resultValue}>{toDisplay(avg)}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">By Formula</p>
        {[
          { name: "Robinson (1983)", val: robinson },
          { name: "Miller (1983)", val: miller },
          { name: "Devine (1974)", val: devine },
          { name: "Hamwi (1964)", val: hamwi },
        ].map((f) => (
          <div key={f.name} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
            <span className="text-gray-600">{f.name}</span>
            <span className="font-semibold text-gray-800">{toDisplay(f.val)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm py-1.5 border-b border-gray-50">
          <span className="text-gray-600">Healthy BMI Range (18.5–24.9)</span>
          <span className="font-semibold text-gray-800">{toDisplay(bmiLow)} – {toDisplay(bmiHigh)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── 5. Sleep Calculator ──────────────────────────────────────────────────────
export function SleepCalculator() {
  const [mode, setMode] = useState<"wakeup" | "bedtime">("wakeup");
  const [time, setTime] = useState("07:00");

  const SLEEP_CYCLE = 90; // minutes
  const FALL_ASLEEP = 15; // minutes to fall asleep

  const calcTimes = () => {
    const [h, m] = time.split(":").map(Number);
    const baseMinutes = h * 60 + m;
    const times: string[] = [];

    for (let cycles = 6; cycles >= 3; cycles--) {
      let targetMinutes: number;
      if (mode === "wakeup") {
        // Bedtimes that result in waking up at the given time
        targetMinutes = baseMinutes - cycles * SLEEP_CYCLE - FALL_ASLEEP;
      } else {
        // Wake-up times if going to bed at the given time
        targetMinutes = baseMinutes + FALL_ASLEEP + cycles * SLEEP_CYCLE;
      }

      // Normalize to 0–1440
      let normalized = ((targetMinutes % 1440) + 1440) % 1440;
      const hh = Math.floor(normalized / 60);
      const mm = normalized % 60;
      const period = hh >= 12 ? "PM" : "AM";
      const displayH = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh;
      times.push(`${displayH}:${mm.toString().padStart(2, "0")} ${period} (${cycles} cycles — ${(cycles * 1.5).toFixed(1)}h)`);
    }
    return times;
  };

  const times = calcTimes();
  const recommended = times[0]; // 6 cycles = 9h, but first in list after reversing

  return (
    <div className="space-y-4">
      <div>
        <p className={labelClass}>I want to calculate my…</p>
        <div className="flex gap-2">
          {[
            { key: "wakeup", label: "Wake-Up Time → Bedtimes" },
            { key: "bedtime", label: "Bedtime → Wake-Up Times" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key as typeof mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === m.key ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          {mode === "wakeup" ? "I need to wake up at" : "I plan to go to bed at"}
        </label>
        <input className={inputClass} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      <div className={resultCard}>
        <p className={resultLabel}>
          {mode === "wakeup" ? "Best bedtimes (wake up feeling refreshed):" : "Best wake-up times:"}
        </p>
        <div className="space-y-2 mt-2">
          {times.map((t, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm font-semibold ${
                i === 0 ? "text-emerald-700" : "text-gray-600"
              }`}
            >
              {i === 0 && <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">Best</span>}
              {t}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">
        Based on 90-minute sleep cycles and ~15 minutes to fall asleep. Adults need 5–6 complete cycles (7.5–9 hours) for optimal rest.
      </p>
    </div>
  );
}
