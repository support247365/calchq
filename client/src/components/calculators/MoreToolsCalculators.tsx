/**
 * More Tools Calculators
 * - TimeZoneConverter: convert time across world time zones
 * - WordCounter: count words, characters, sentences, paragraphs, reading time
 */
import { useState, useMemo } from "react";

// ============================================================
// TIME ZONE CONVERTER
// ============================================================

interface TZInfo {
  name: string;
  offset: number; // UTC offset in minutes
  abbr: string;
  region: string;
}

const TIME_ZONES: TZInfo[] = [
  { name: "UTC (Coordinated Universal Time)", offset: 0, abbr: "UTC", region: "World" },
  { name: "GMT (Greenwich Mean Time)", offset: 0, abbr: "GMT", region: "Europe" },
  { name: "EST (Eastern Standard Time)", offset: -300, abbr: "EST", region: "Americas" },
  { name: "EDT (Eastern Daylight Time)", offset: -240, abbr: "EDT", region: "Americas" },
  { name: "CST (Central Standard Time)", offset: -360, abbr: "CST", region: "Americas" },
  { name: "CDT (Central Daylight Time)", offset: -300, abbr: "CDT", region: "Americas" },
  { name: "MST (Mountain Standard Time)", offset: -420, abbr: "MST", region: "Americas" },
  { name: "MDT (Mountain Daylight Time)", offset: -360, abbr: "MDT", region: "Americas" },
  { name: "PST (Pacific Standard Time)", offset: -480, abbr: "PST", region: "Americas" },
  { name: "PDT (Pacific Daylight Time)", offset: -420, abbr: "PDT", region: "Americas" },
  { name: "AKST (Alaska Standard Time)", offset: -540, abbr: "AKST", region: "Americas" },
  { name: "HST (Hawaii Standard Time)", offset: -600, abbr: "HST", region: "Americas" },
  { name: "AST (Atlantic Standard Time)", offset: -240, abbr: "AST", region: "Americas" },
  { name: "BRT (Brasilia Time)", offset: -180, abbr: "BRT", region: "Americas" },
  { name: "ART (Argentina Time)", offset: -180, abbr: "ART", region: "Americas" },
  { name: "CLT (Chile Standard Time)", offset: -240, abbr: "CLT", region: "Americas" },
  { name: "WET (Western European Time)", offset: 0, abbr: "WET", region: "Europe" },
  { name: "CET (Central European Time)", offset: 60, abbr: "CET", region: "Europe" },
  { name: "CEST (Central European Summer Time)", offset: 120, abbr: "CEST", region: "Europe" },
  { name: "EET (Eastern European Time)", offset: 120, abbr: "EET", region: "Europe" },
  { name: "EEST (Eastern European Summer Time)", offset: 180, abbr: "EEST", region: "Europe" },
  { name: "MSK (Moscow Standard Time)", offset: 180, abbr: "MSK", region: "Europe" },
  { name: "TRT (Turkey Time)", offset: 180, abbr: "TRT", region: "Europe" },
  { name: "GST (Gulf Standard Time)", offset: 240, abbr: "GST", region: "Middle East" },
  { name: "AST (Arabia Standard Time)", offset: 180, abbr: "AST+3", region: "Middle East" },
  { name: "IST (India Standard Time)", offset: 330, abbr: "IST", region: "Asia" },
  { name: "NPT (Nepal Time)", offset: 345, abbr: "NPT", region: "Asia" },
  { name: "BST (Bangladesh Standard Time)", offset: 360, abbr: "BST", region: "Asia" },
  { name: "ICT (Indochina Time)", offset: 420, abbr: "ICT", region: "Asia" },
  { name: "CST (China Standard Time)", offset: 480, abbr: "CST+8", region: "Asia" },
  { name: "HKT (Hong Kong Time)", offset: 480, abbr: "HKT", region: "Asia" },
  { name: "SGT (Singapore Time)", offset: 480, abbr: "SGT", region: "Asia" },
  { name: "JST (Japan Standard Time)", offset: 540, abbr: "JST", region: "Asia" },
  { name: "KST (Korea Standard Time)", offset: 540, abbr: "KST", region: "Asia" },
  { name: "AEST (Australian Eastern Standard Time)", offset: 600, abbr: "AEST", region: "Pacific" },
  { name: "AEDT (Australian Eastern Daylight Time)", offset: 660, abbr: "AEDT", region: "Pacific" },
  { name: "ACST (Australian Central Standard Time)", offset: 570, abbr: "ACST", region: "Pacific" },
  { name: "AWST (Australian Western Standard Time)", offset: 480, abbr: "AWST", region: "Pacific" },
  { name: "NZST (New Zealand Standard Time)", offset: 720, abbr: "NZST", region: "Pacific" },
  { name: "NZDT (New Zealand Daylight Time)", offset: 780, abbr: "NZDT", region: "Pacific" },
  { name: "PKT (Pakistan Standard Time)", offset: 300, abbr: "PKT", region: "Asia" },
  { name: "WIB (Western Indonesian Time)", offset: 420, abbr: "WIB", region: "Asia" },
  { name: "CAT (Central Africa Time)", offset: 120, abbr: "CAT", region: "Africa" },
  { name: "EAT (East Africa Time)", offset: 180, abbr: "EAT", region: "Africa" },
  { name: "WAT (West Africa Time)", offset: 60, abbr: "WAT", region: "Africa" },
  { name: "SAST (South Africa Standard Time)", offset: 120, abbr: "SAST", region: "Africa" },
];

const REGIONS = ["All", "World", "Americas", "Europe", "Middle East", "Asia", "Pacific", "Africa"];

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function convertTime(
  inputDate: string,
  inputTime: string,
  fromOffset: number,
  toOffset: number
): { date: string; time: string; day: string } {
  const [year, month, day] = inputDate.split("-").map(Number);
  const [hours, minutes] = inputTime.split(":").map(Number);

  // Convert to UTC
  const utcMs =
    Date.UTC(year, month - 1, day, hours, minutes) - fromOffset * 60 * 1000;
  // Convert to target
  const targetMs = utcMs + toOffset * 60 * 1000;
  const d = new Date(targetMs);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return {
    date: d.toISOString().slice(0, 10),
    time: `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`,
    day: days[d.getUTCDay()],
  };
}

export function TimeZoneConverter() {
  const now = new Date();
  const [inputDate, setInputDate] = useState(now.toISOString().slice(0, 10));
  const [inputTime, setInputTime] = useState(
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  );
  const [fromTZ, setFromTZ] = useState(0); // UTC index
  const [toTZList, setToTZList] = useState<number[]>([4, 18, 29, 34]); // EST, CEST, CST+8, JST
  const [region, setRegion] = useState("All");
  const [search, setSearch] = useState("");

  const filteredZones = useMemo(() => {
    return TIME_ZONES.filter((tz) => {
      const matchRegion = region === "All" || tz.region === region;
      const matchSearch =
        !search ||
        tz.name.toLowerCase().includes(search.toLowerCase()) ||
        tz.abbr.toLowerCase().includes(search.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [region, search]);

  const fromZone = TIME_ZONES[fromTZ];

  const toggleToZone = (idx: number) => {
    setToTZList((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const results = toTZList.map((idx) => {
    const tz = TIME_ZONES[idx];
    const converted = convertTime(inputDate, inputTime, fromZone.offset, tz.offset);
    return { tz, converted, idx };
  });

  return (
    <div className="space-y-6">
      {/* Source time input */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-5">
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-3">Convert From</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
            <input
              type="time"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Source Time Zone</label>
          <select
            value={fromTZ}
            onChange={(e) => setFromTZ(parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            {TIME_ZONES.map((tz, i) => (
              <option key={i} value={i}>
                {tz.abbr} -- {tz.name} ({formatOffset(tz.offset)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Converted Times</p>
          {results.map(({ tz, converted, idx }) => (
            <div key={idx} className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4">
              <div>
                <p className="text-xs font-semibold text-gray-500">{tz.region} -- {tz.abbr}</p>
                <p className="text-sm text-gray-600 truncate max-w-xs">{tz.name}</p>
                <p className="text-xs text-gray-400">{formatOffset(tz.offset)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {converted.time}
                </p>
                <p className="text-xs text-gray-500">{converted.day}</p>
                <p className="text-xs text-gray-400">{converted.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone picker */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Select Target Time Zones</p>
        {/* Region filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                region === r
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {/* Search */}
        <input
          type="text"
          placeholder="Search time zones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
        />
        {/* Zone list */}
        <div className="max-h-64 overflow-y-auto space-y-1 border border-gray-100 rounded-xl p-2">
          {filteredZones.map((tz) => {
            const idx = TIME_ZONES.indexOf(tz);
            const selected = toTZList.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleToZone(idx)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  selected
                    ? "bg-orange-50 border border-orange-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-gray-700">{tz.abbr}</span>
                  <span className="text-xs text-gray-500 ml-2 truncate">{tz.name}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatOffset(tz.offset)}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">{toTZList.length} zone{toTZList.length !== 1 ? "s" : ""} selected. Click to toggle.</p>
      </div>
    </div>
  );
}

// ============================================================
// WORD / CHARACTER COUNTER
// ============================================================

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === "" ? 0 : (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
    const lines = text === "" ? 0 : text.split("\n").length;

    // Reading time (avg 238 wpm)
    const readingSeconds = Math.ceil((words / 238) * 60);
    const readingMin = Math.floor(readingSeconds / 60);
    const readingSec = readingSeconds % 60;
    const readingTime =
      readingMin > 0
        ? `${readingMin} min ${readingSec > 0 ? readingSec + " sec" : ""}`.trim()
        : `${readingSec} sec`;

    // Speaking time (avg 130 wpm)
    const speakingSeconds = Math.ceil((words / 130) * 60);
    const speakingMin = Math.floor(speakingSeconds / 60);
    const speakingSec = speakingSeconds % 60;
    const speakingTime =
      speakingMin > 0
        ? `${speakingMin} min ${speakingSec > 0 ? speakingSec + " sec" : ""}`.trim()
        : `${speakingSec} sec`;

    // Top words
    const wordList = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set([
      "the", "and", "for", "are", "but", "not", "you", "all", "any", "can",
      "her", "was", "one", "our", "out", "day", "get", "has", "him", "his",
      "how", "its", "may", "new", "now", "old", "see", "two", "way", "who",
      "boy", "did", "its", "let", "put", "say", "she", "too", "use", "that",
      "this", "with", "have", "from", "they", "will", "been", "more", "when",
      "your", "said", "each", "which", "their", "time", "about", "would",
      "there", "could", "other", "into", "than", "then", "some", "these",
    ]);
    const freq: Record<string, number> = {};
    for (const w of wordList) {
      if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    }
    const topWords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Avg word length
    const wordTokens = text.trim() === "" ? [] : text.trim().split(/\s+/);
    const avgWordLen =
      wordTokens.length === 0
        ? 0
        : Math.round(
            (wordTokens.reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, "").length, 0) /
              wordTokens.length) *
              10
          ) / 10;

    // Syllables (approximate)
    const syllables = wordTokens.reduce((s, w) => s + countSyllables(w), 0);

    // Flesch-Kincaid readability (approximate)
    const fk =
      words > 0 && sentences > 0
        ? Math.round(
            (206.835 -
              1.015 * (words / sentences) -
              84.6 * (syllables / words)) *
              10
          ) / 10
        : null;

    let fkLabel = "";
    if (fk !== null) {
      if (fk >= 90) fkLabel = "Very Easy (5th grade)";
      else if (fk >= 80) fkLabel = "Easy (6th grade)";
      else if (fk >= 70) fkLabel = "Fairly Easy (7th grade)";
      else if (fk >= 60) fkLabel = "Standard (8th-9th grade)";
      else if (fk >= 50) fkLabel = "Fairly Difficult (10th-12th grade)";
      else if (fk >= 30) fkLabel = "Difficult (College level)";
      else fkLabel = "Very Difficult (Professional)";
    }

    return {
      chars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
      topWords,
      avgWordLen,
      syllables,
      fk,
      fkLabel,
    };
  }, [text]);

  const STAT_CARDS = [
    { label: "Words", value: stats.words.toLocaleString(), color: "text-orange-600" },
    { label: "Characters", value: stats.chars.toLocaleString(), color: "text-blue-600" },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces.toLocaleString(), color: "text-indigo-600" },
    { label: "Sentences", value: stats.sentences.toLocaleString(), color: "text-green-600" },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString(), color: "text-purple-600" },
    { label: "Lines", value: stats.lines.toLocaleString(), color: "text-pink-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Text input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Paste or type your text</label>
          {text && (
            <button
              onClick={() => setText("")}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Start typing or paste your text here..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none leading-relaxed"
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Time estimates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Reading Time</p>
          <p className="text-xl font-bold text-orange-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.words === 0 ? "--" : stats.readingTime}
          </p>
          <p className="text-xs text-orange-400 mt-1">at 238 wpm</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">Speaking Time</p>
          <p className="text-xl font-bold text-blue-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stats.words === 0 ? "--" : stats.speakingTime}
          </p>
          <p className="text-xs text-blue-400 mt-1">at 130 wpm</p>
        </div>
      </div>

      {/* Readability */}
      {stats.fk !== null && stats.words > 10 && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Readability</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Flesch Reading Ease: {stats.fk}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stats.fkLabel}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Avg word: {stats.avgWordLen} chars</p>
              <p>Syllables: {stats.syllables.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top words */}
      {stats.topWords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Top Keywords</p>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map(([word, count]) => (
              <span
                key={word}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg text-sm"
              >
                <span className="font-semibold text-gray-800">{word}</span>
                <span className="text-xs text-orange-500 font-bold">{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
