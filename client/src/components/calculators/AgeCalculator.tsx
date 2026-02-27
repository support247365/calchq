import { useState, useEffect } from "react";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  nextBirthday: number;
  nextBirthdayDate: string;
  dayOfWeekBorn: string;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [result, setResult] = useState<AgeResult | null>(null);

  useEffect(() => {
    if (!birthDate || !toDate) return;

    const birth = new Date(birthDate);
    const to = new Date(toDate);

    if (birth > to) {
      setResult(null);
      return;
    }

    // Calculate exact age
    let years = to.getFullYear() - birth.getFullYear();
    let months = to.getMonth() - birth.getMonth();
    let days = to.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total calculations
    const totalDays = Math.floor((to.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBirthdayThisYear = new Date(to.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthdayThisYear <= to) {
      nextBirthdayThisYear.setFullYear(to.getFullYear() + 1);
    }
    const nextBirthdayDays = Math.ceil(
      (nextBirthdayThisYear.getTime() - to.getTime()) / (1000 * 60 * 60 * 24)
    );
    const nextBirthdayDate = nextBirthdayThisYear.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Day of week born
    const dayOfWeekBorn = birth.toLocaleDateString("en-US", { weekday: "long" });

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      nextBirthday: nextBirthdayDays,
      nextBirthdayDate,
      dayOfWeekBorn,
    });
  }, [birthDate, toDate]);

  return (
    <div className="space-y-6">
      <div className="calc-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="calc-label">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={toDate}
              className="calc-input"
            />
          </div>
          <div>
            <label className="calc-label">Age At Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={birthDate}
              className="calc-input"
            />
          </div>
        </div>

        {result ? (
          <div className="mt-6 space-y-4">
            {/* Primary result */}
            <div className="result-box">
              <p className="text-sm text-gray-500 mb-1">Your Age</p>
              <p className="text-3xl font-bold text-emerald-600">
                {result.years} years, {result.months} months, {result.days} days
              </p>
              <p className="text-sm text-gray-500 mt-1">
                You were born on a <span className="font-medium text-gray-700">{result.dayOfWeekBorn}</span>
              </p>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Days", value: result.totalDays.toLocaleString() },
                { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
                { label: "Total Months", value: result.totalMonths.toLocaleString() },
                { label: "Total Hours", value: result.totalHours.toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Next birthday */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700">Next Birthday</p>
                <p className="text-base font-semibold text-gray-800">{result.nextBirthdayDate}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{result.nextBirthday}</p>
                <p className="text-xs text-gray-500">days away</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-600 text-sm">
            Date of birth must be before the "Age At" date.
          </div>
        )}
      </div>
    </div>
  );
}
