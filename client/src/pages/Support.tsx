/*
 * CalcHQ Support Page — Three-Tier Support System
 * Level 1: Self-help FAQ search
 * Level 2: AI chat assistant
 * Level 3: Email support@calchq.io
 */
import { useState, useMemo } from "react";
import { Search, Sparkles, Mail, ChevronDown, BookOpen, MessageSquare, LifeBuoy, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatModal from "@/components/ChatModal";
import { CALCULATORS } from "@/lib/calculators";

/* ─── Build a flat FAQ index from all calculators ─── */
interface FaqEntry {
  question: string;
  answer: string;
  calculatorTitle: string;
  calculatorSlug: string;
}

const ALL_FAQS: FaqEntry[] = CALCULATORS.flatMap((calc) =>
  calc.faqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
    calculatorTitle: calc.title,
    calculatorSlug: calc.slug,
  }))
);

/* ─── FAQ Result Card ─── */
function FaqResultCard({ entry }: { entry: FaqEntry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors gap-3"
      >
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-800 block">{entry.question}</span>
          <span className="text-xs text-emerald-600 font-medium mt-0.5 block">{entry.calculatorTitle}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform mt-0.5 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {entry.answer}
        </div>
      )}
    </div>
  );
}

/* ─── Support Level Card ─── */
interface LevelCardProps {
  level: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  accentClass: string;
  badgeClass: string;
}

function LevelCard({ level, icon, title, description, action, accentClass, badgeClass }: LevelCardProps) {
  return (
    <div className={`relative bg-white border rounded-2xl p-6 shadow-sm flex flex-col gap-4 ${accentClass}`}>
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${badgeClass}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
              Level {level}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
}

/* ─── Main Support Page ─── */
export default function Support() {
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.calculatorTitle.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 border-b border-gray-100">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #10b981 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container relative py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700 mb-5">
              <LifeBuoy className="w-3.5 h-3.5" />
              Support Center
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              How can we help?
            </h1>
            <p className="text-base text-gray-500 leading-relaxed">
              Find answers instantly, chat with our AI assistant, or reach our team directly — three levels of support, always free.
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 container py-12 space-y-14">

        {/* ── Level 1: Self-Help Search ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Level 1 — Self-Help Search
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  Instant
                </span>
              </div>
              <p className="text-sm text-gray-500">Search our full FAQ library across all 63 calculators</p>
            </div>
          </div>

          {/* Search input */}
          <div className="relative max-w-xl mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. How do I calculate monthly mortgage payments?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Results */}
          {hasQuery && (
            <div className="max-w-xl space-y-2">
              {results.length === 0 ? (
                <div className="px-5 py-8 text-center bg-gray-50 border border-gray-100 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">No results found for <strong>"{query}"</strong></p>
                  <p className="text-xs text-gray-400">Try Level 2 AI chat or email us below for further help.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400 mb-3">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </p>
                  {results.map((entry, i) => (
                    <FaqResultCard key={i} entry={entry} />
                  ))}
                </>
              )}
            </div>
          )}

          {!hasQuery && (
            <div className="max-w-xl bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
              <p className="text-xs text-gray-500">
                <strong className="text-gray-700">Tip:</strong> Try searching for a calculator name (e.g. "mortgage", "BMI") or a question topic (e.g. "interest rate", "calories").
              </p>
            </div>
          )}
        </section>

        {/* ── Level 2 & 3 Cards ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Need more help?
              </h2>
              <p className="text-sm text-gray-500">Escalate to a higher support level below</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">

            {/* Level 2 */}
            <LevelCard
              level={2}
              icon={<Sparkles className="w-5 h-5 text-violet-600" />}
              title="AI Chat Assistant"
              description="Chat with our AI assistant for instant, personalised help with any calculator or calculation question."
              accentClass="border-violet-100 hover:border-violet-200 transition-colors"
              badgeClass="bg-violet-50 text-violet-700"
              action={
                <button
                  onClick={() => setChatOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start AI Chat
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              }
            />

            {/* Level 3 */}
            <LevelCard
              level={3}
              icon={<Mail className="w-5 h-5 text-blue-600" />}
              title="Email Support"
              description="For issues that can't be resolved through self-help or AI chat, our team is ready to assist via email."
              accentClass="border-blue-100 hover:border-blue-200 transition-colors"
              badgeClass="bg-blue-50 text-blue-700"
              action={
                <a
                  href="mailto:support@calchq.io?subject=CalcHQ%20Support%20Request"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  Email support@calchq.io
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              }
            />
          </div>
        </section>

        {/* ── How support levels work ── */}
        <section className="max-w-2xl">
          <h2 className="text-base font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            How our support levels work
          </h2>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
            {[
              {
                level: "1",
                label: "Self-Help Search",
                desc: "Search our FAQ library — instant answers from hundreds of questions across all 63 calculators. Best for quick how-to questions.",
                color: "bg-emerald-500",
              },
              {
                level: "2",
                label: "AI Chat Assistant",
                desc: "Our AI assistant can explain calculator results, walk you through formulas, and answer complex questions in real time.",
                color: "bg-violet-500",
              },
              {
                level: "3",
                label: "Email Support",
                desc: "For billing, technical bugs, or anything the AI can't resolve, email support@calchq.io and our team will respond within one business day.",
                color: "bg-blue-500",
              },
            ].map((item, i, arr) => (
              <div
                key={item.level}
                className={`flex items-start gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className={`w-7 h-7 ${item.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className="text-xs font-bold text-white">{item.level}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />

      {/* Chat Modal */}
      {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
    </div>
  );
}
