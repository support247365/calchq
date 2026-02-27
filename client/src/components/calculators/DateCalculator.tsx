/**
 * Date Calculator
 * Three modes:
 * 1. Days Between Two Dates
 * 2. Add / Subtract Days from a Date
 * 3. Day of the Week Finder
 */
import { useState, useMemo } from "react";

// -- Helpers ------------------------------------------------------------------

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function toInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr(): string {
  return toInputValue(new Date());
}

function diffBreakdown(start: Date, end: Date): { years: number; months: number; days: number; totalDays: number; weeks: number; weekdays: number; weekends: number } {
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  const absTotal = Math.abs(totalDays);

  // Count weekdays/weekends
  let weekdays = 0;
  let weekends = 0;
  const step = totalDays >= 0 ? 1 : -1;
  const cur = new Date(start);
  for (let i = 0; i < absTotal; i++) {
    const dow = cur.getDay();
    if (dow === 0 || dow === 6) weekends++;
    else weekdays++;
    cur.setDate(cur.getDate() + step);
  }

  // Years/months/days breakdown
  let s = new Date(start);
  let e = new Date(end);
  if (s > e) [s, e] = [e, s];
  let years = e.getFullYear() - s.getFullYear();
  let months = e.getMonth() - s.getMonth();
  let days = e.getDate() - s.getDate();
  if (days < 0) {
    months--;
    const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  return { years, months, days, totalDays, weeks: Math.floor(absTotal / 7), weekdays, weekends };
}

// -- Mode tabs ----------------------------------------------------------------

type Mode = "between" | "addsubtract" | "dayofweek";

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: "between", label: "Days Between Dates", desc: "Find the exact number of days between two dates" },
  { key: "addsubtract", label: "Add / Subtract Days", desc: "Calculate a future or past date from any starting date" },
  { key: "dayofweek", label: "Day of the Week", desc: "Find out what day of the week any date falls on" },
];

// -- Sub-components -----------------------------------------------------------

function DaysBetween() {
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return toInputValue(d);
  });
  const [end, setEnd] = useState(todayStr);

  const result = useMemo(() => {
    const s = parseDate(start);
    const e = parseDate(end);
    if (!s || !e) return null;
    return diffBreakdown(s, e);
  }, [start, end]);

  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const swap = () => { setStart(end); setEnd(start); };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
          <input
            type="date"
            value={start}
            onChange={e => setStart(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          {startDate && <p className="text-xs text-gray-500 mt-1">{DAY_NAMES[startDate.getDay()]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
          <input
            type="date"
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          {endDate && <p className="text-xs text-gray-500 mt-1">{DAY_NAMES[endDate.getDay()]}</p>}
        </div>
      </div>

      <button
        onClick={swap}
        className="text-xs font-semibold text-violet-600 hover:text-violet-800 underline underline-offset-2 transition-colors"
      >
        Swap dates
      </button>

      {result && startDate && endDate && (
        <div className="space-y-3">
          {/* Primary result */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">Total Difference</p>
            <p className="text-4xl font-bold text-violet-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {Math.abs(result.totalDays).toLocaleString()}
            </p>
            <p className="text-sm text-violet-600 mt-1">
              {result.totalDays >= 0 ? "days from start to end" : "days (end is before start)"}
            </p>
          </div>

          {/* Breakdown grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Years, Months, Days", value: `${result.years}y ${result.months}m ${result.days}d` },
              { label: "Total Weeks", value: `${result.weeks.toLocaleString()} weeks + ${Math.abs(result.totalDays) % 7} days` },
              { label: "Weekdays", value: result.weekdays.toLocaleString() },
              { label: "Weekend Days", value: result.weekends.toLocaleString() },
              { label: "Start", value: formatShort(startDate) },
              { label: "End", value: formatShort(endDate) },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AddSubtractDays() {
  const [startDate, setStartDate] = useState(todayStr);
  const [days, setDays] = useState("30");
  const [op, setOp] = useState<"add" | "subtract">("add");

  const result = useMemo(() => {
    const s = parseDate(startDate);
    const d = parseInt(days);
    if (!s || isNaN(d) || d < 0) return null;
    const r = new Date(s);
    r.setDate(r.getDate() + (op === "add" ? d : -d));
    return r;
  }, [startDate, days, op]);

  const parsedStart = parseDate(startDate);

  // Quick presets
  const PRESETS = [7, 14, 30, 60, 90, 180, 365];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Starting Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {parsedStart && <p className="text-xs text-gray-500 mt-1">{DAY_NAMES[parsedStart.getDay()]}, {MONTH_NAMES[parsedStart.getMonth()]} {parsedStart.getDate()}, {parsedStart.getFullYear()}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Days</label>
          <input
            type="number"
            value={days}
            min="0"
            onChange={e => setDays(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="e.g. 30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Operation</label>
          <div className="flex h-[46px] mt-0.5">
            <button
              onClick={() => setOp("add")}
              className={`flex-1 px-5 py-2 rounded-l-xl text-sm font-semibold border transition-colors ${op === "add" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-700 border-gray-200 hover:bg-violet-50"}`}
            >
              + Add
            </button>
            <button
              onClick={() => setOp("subtract")}
              className={`flex-1 px-5 py-2 rounded-r-xl text-sm font-semibold border-t border-r border-b transition-colors ${op === "subtract" ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-700 border-gray-200 hover:bg-violet-50"}`}
            >
              - Subtract
            </button>
          </div>
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-gray-500 self-center">Quick:</span>
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => setDays(String(p))}
            className="px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {p} days
          </button>
        ))}
      </div>

      {result && parsedStart && (
        <div className="space-y-3">
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">
              {parseInt(days).toLocaleString()} days {op === "add" ? "after" : "before"} {formatShort(parsedStart)}
            </p>
            <p className="text-2xl font-bold text-violet-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {formatDate(result)}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Day of Week", value: DAY_NAMES[result.getDay()] },
              { label: "Month", value: MONTH_NAMES[result.getMonth()] },
              { label: "Day of Year", value: `Day ${Math.ceil((result.getTime() - new Date(result.getFullYear(), 0, 0).getTime()) / 86400000)}` },
              { label: "Week of Year", value: `Week ${Math.ceil(((result.getTime() - new Date(result.getFullYear(), 0, 1).getTime()) / 86400000 + new Date(result.getFullYear(), 0, 1).getDay() + 1) / 7)}` },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DayOfWeek() {
  const [date, setDate] = useState(todayStr);

  const result = useMemo(() => {
    const d = parseDate(date);
    if (!d) return null;
    const dow = d.getDay();
    const year = d.getFullYear();
    const month = d.getMonth();
    const dayNum = d.getDate();

    // Day of year
    const start = new Date(year, 0, 0);
    const diff = d.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / 86400000);

    // Week of year (ISO-ish)
    const weekOfYear = Math.ceil((dayOfYear + new Date(year, 0, 1).getDay()) / 7);

    // Is leap year?
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    // Days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Days remaining in year
    const daysInYear = isLeap ? 366 : 365;
    const daysRemaining = daysInYear - dayOfYear;

    // Next occurrence of same weekday
    const nextSame = new Date(d);
    nextSame.setDate(nextSame.getDate() + 7);

    return { dow, dayOfYear, weekOfYear, isLeap, daysInMonth, daysRemaining, nextSame, dayNum, month, year };
  }, [date]);

  // Historical facts about days of the week
  const DOW_FACTS: Record<number, string> = {
    0: "Sunday is named after the Sun. In many cultures it is considered the first day of the week.",
    1: "Monday is named after the Moon (\"Moon's day\"). It is the first working day in most countries.",
    2: "Tuesday is named after Tiw (Tyr), the Norse god of single combat and victory.",
    3: "Wednesday is named after Woden (Odin), the chief Norse god. In French it is \"mercredi\" (Mercury's day).",
    4: "Thursday is named after Thor, the Norse god of thunder. In French it is \"jeudi\" (Jupiter's day).",
    5: "Friday is named after Frigg (or Freya), the Norse goddess of love. In French it is \"vendredi\" (Venus's day).",
    6: "Saturday is named after Saturn, the Roman god of wealth and agriculture.",
  };

  const parsedDate = parseDate(date);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select a Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Quick jump buttons */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-gray-500 self-center">Jump to:</span>
        {[
          { label: "Today", fn: () => setDate(todayStr()) },
          { label: "Yesterday", fn: () => { const d = new Date(); d.setDate(d.getDate() - 1); setDate(toInputValue(d)); } },
          { label: "New Year 2025", fn: () => setDate("2025-01-01") },
          { label: "New Year 2026", fn: () => setDate("2026-01-01") },
          { label: "July 4, 2026", fn: () => setDate("2026-07-04") },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.fn}
            className="px-3 py-1 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {result && parsedDate && (
        <div className="space-y-3">
          {/* Primary result */}
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">
              {MONTH_NAMES[result.month]} {result.dayNum}, {result.year}
            </p>
            <p className="text-4xl font-bold text-violet-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {DAY_NAMES[result.dow]}
            </p>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Day of Year", value: `Day ${result.dayOfYear} of ${result.isLeap ? 366 : 365}` },
              { label: "Week of Year", value: `Week ${result.weekOfYear}` },
              { label: "Days in Month", value: `${result.daysInMonth} days` },
              { label: "Days Left in Year", value: `${result.daysRemaining} days` },
              { label: "Leap Year?", value: result.isLeap ? "Yes" : "No" },
              { label: "Next " + DAY_NAMES[result.dow], value: formatShort(result.nextSame) },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Fun fact */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Did You Know?</p>
            <p className="text-sm text-amber-800">{DOW_FACTS[result.dow]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// -- Main export --------------------------------------------------------------

export default function DateCalculator() {
  const [mode, setMode] = useState<Mode>("between");

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex flex-col sm:flex-row gap-2">
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors border ${
              mode === m.key
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-violet-50 hover:border-violet-200"
            }`}
          >
            <span className="block">{m.label}</span>
            <span className={`block text-xs font-normal mt-0.5 ${mode === m.key ? "text-violet-200" : "text-gray-400"}`}>{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Active mode */}
      {mode === "between" && <DaysBetween />}
      {mode === "addsubtract" && <AddSubtractDays />}
      {mode === "dayofweek" && <DayOfWeek />}
    </div>
  );
}
