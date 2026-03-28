import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, AlertTriangle, Eye, Users, BarChart2, Zap } from "lucide-react";
import { NewsItem } from "@/types/news";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// Unsplash image slideshow - derive queries from headline keywords
function getImageQueries(headline: string, category: string): string[] {
  const words = headline.toLowerCase().replace(/[^\w\s]/g, "").split(" ")
    .filter(w => w.length > 3 && !["that","this","with","from","have","will","been","were","they","their","than","after","before"].includes(w));
  const main = words.slice(0, 2).join(" ");
  return [
    `${main} india`,
    `${category.toLowerCase()} india economy`,
    `india business finance market`,
    "india economy growth chart",
  ];
}

// ── Image Slideshow ─────────────────────────────────────────────────────────

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=700&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=700&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=700&q=80",
  "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=700&q=80",
];

function ImageSlideshow({ headline, category }: { headline: string; category: string }) {
  const [current, setCurrent] = useState(0);
  const images = FALLBACK_IMAGES; // Use stable fallbacks (Unsplash API needs auth key)

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden mb-5" style={{ height: "200px" }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={headline}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover absolute inset-0"
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK_IMAGES[0]; }}
        />
      </AnimatePresence>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
        <div className="flex gap-1">
          {images.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
          ))}
        </div>
        <div className="flex gap-1.5">
          <button onClick={prev} className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="absolute top-3 left-3">
        <span className="text-[10px] font-bold text-white bg-black/40 px-2 py-0.5 rounded uppercase tracking-wide">{category}</span>
      </div>
    </div>
  );
}

// ── Types ───────────────────────────────────────────────────────────────────

interface StoryArc {
  storyTitle: string;
  timeline: { date: string; event: string; sentiment: "positive" | "negative" | "neutral" }[];
  keyPlayers: { name: string; role: string; stance: "pro" | "against" | "neutral" }[];
  sentimentShifts: { phase: string; score: number; reason: string }[];
  contrarianViews: { perspective: string; argument: string }[];
  watchNext: { prediction: string; probability: string; timeframe: string }[];
}

// ── AI Fetch ────────────────────────────────────────────────────────────────

async function fetchStoryArc(item: NewsItem): Promise<StoryArc> {
  const prompt = `You are a financial news narrative analyst. Build a Story Arc for this Indian business news article.

HEADLINE: "${item.headline}"
CATEGORY: ${item.category}
SUMMARY: ${item.summary}

STRICT RULES:
1. Respond with ONE valid JSON object only. No markdown, no preamble, nothing before { or after }.
2. Keep all text concise — max 1 sentence per field unless specified.

Return this exact JSON structure:
{
  "storyTitle": "Short dramatic 5-word title for this story arc",
  "timeline": [
    {"date": "6 months ago", "event": "Brief event that preceded this", "sentiment": "neutral"},
    {"date": "3 months ago", "event": "What changed or escalated", "sentiment": "negative"},
    {"date": "1 month ago", "event": "Immediate trigger / buildup", "sentiment": "negative"},
    {"date": "This week", "event": "The current news event", "sentiment": "positive"},
    {"date": "Next quarter", "event": "Likely next development", "sentiment": "positive"}
  ],
  "keyPlayers": [
    {"name": "Entity or Person Name", "role": "Their role in this story", "stance": "pro"},
    {"name": "Entity or Person Name", "role": "Their role in this story", "stance": "against"},
    {"name": "Entity or Person Name", "role": "Their role in this story", "stance": "neutral"}
  ],
  "sentimentShifts": [
    {"phase": "Pre-announcement", "score": 30, "reason": "Why sentiment was this way"},
    {"phase": "Announcement", "score": 65, "reason": "Why sentiment changed"},
    {"phase": "Market reaction", "score": 75, "reason": "Why sentiment moved here"},
    {"phase": "Outlook", "score": 60, "reason": "Forward-looking sentiment"}
  ],
  "contrarianViews": [
    {"perspective": "Bear Case / Critic", "argument": "What critics say about this news"},
    {"perspective": "Structural Risk", "argument": "A deeper systemic concern this ignores"}
  ],
  "watchNext": [
    {"prediction": "Specific thing to monitor next", "probability": "High", "timeframe": "Next 30 days"},
    {"prediction": "Second key signal to watch for", "probability": "Medium", "timeframe": "Next quarter"},
    {"prediction": "Long-term structural outcome", "probability": "Low", "timeframe": "12–18 months"}
  ]
}`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a JSON-only API. Return a single valid JSON object. No markdown, no text outside JSON." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON");
  return JSON.parse(raw.slice(start, end + 1)) as StoryArc;
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SentimentDot({ s }: { s: "positive" | "negative" | "neutral" }) {
  if (s === "positive") return <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />;
  if (s === "negative") return <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />;
  return <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />;
}

function StancePill({ stance }: { stance: "pro" | "against" | "neutral" }) {
  const map = {
    pro: { label: "Pro", bg: "#d4edda", color: "#155724" },
    against: { label: "Against", bg: "#f8d7da", color: "#721c24" },
    neutral: { label: "Neutral", bg: "#fff3cd", color: "#856404" },
  };
  const s = map[stance];
  return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label}</span>;
}

function SentimentBar({ score, phase, reason }: { score: number; phase: string; reason: string }) {
  const color = score >= 60 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-foreground">{phase}</span>
        <span className="text-xs font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{reason}</p>
    </div>
  );
}

const PROBABILITY_COLOR: Record<string, string> = {
  High: "#E8192C", Medium: "#f59e0b", Low: "#6b7280"
};

// ── Main Component ───────────────────────────────────────────────────────────

interface StoryArcTrackerProps {
  item: NewsItem;
}

export function StoryArcTracker({ item }: StoryArcTrackerProps) {
  const [arc, setArc] = useState<StoryArc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const result = await fetchStoryArc(item);
      setArc(result);
      setLoaded(true);
    } catch (e) {
      setError("Failed to build Story Arc. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  // Lazy-load on mount
  useEffect(() => {
    if (!loaded) load();
  }, [item.headline]);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3"
        style={{ background: "linear-gradient(135deg, #E8192C 0%, #ff4d6d 100%)" }}
      >
        <Zap className="w-4 h-4 text-white" />
        <div>
          <h4 className="text-sm font-headline font-bold text-white">Story Arc Tracker</h4>
          <p className="text-[10px] text-white/75">AI-built narrative · Timeline · Players · Predictions</p>
        </div>
        {!loading && !loaded && (
          <button onClick={load} className="ml-auto text-[10px] bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg font-semibold transition-colors">
            Build Arc
          </button>
        )}
        {loading && <Loader2 className="ml-auto w-4 h-4 text-white animate-spin" />}
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Building story arc with AI…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-5 flex flex-col items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <p className="text-xs text-destructive">{error}</p>
          <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: "#E8192C" }}>Retry</button>
        </div>
      )}

      {arc && !loading && (
        <div className="p-4 space-y-5">
          {/* Image Slideshow */}
          <ImageSlideshow headline={item.headline} category={item.category} />

          {/* Story Title */}
          <div className="text-center pb-2 border-b border-border">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">Narrative</p>
            <h3 className="text-base font-headline font-bold text-foreground">{arc.storyTitle}</h3>
          </div>

          {/* TIMELINE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#E8192C" }}>
                <span className="text-white text-[9px] font-bold">1</span>
              </div>
              <h5 className="text-xs font-headline font-bold text-foreground uppercase tracking-wide">Interactive Timeline</h5>
            </div>
            <div className="relative pl-5">
              <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
              {arc.timeline.map((evt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative mb-4 last:mb-0"
                >
                  <div className="absolute -left-5 top-1 flex items-center justify-center">
                    <SentimentDot s={evt.sentiment} />
                  </div>
                  <div className="bg-muted/40 rounded-lg px-3 py-2.5 border border-border/60">
                    <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wide">{evt.date}</p>
                    <p className="text-xs text-foreground leading-relaxed">{evt.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* KEY PLAYERS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#E8192C" }}>
                <span className="text-white text-[9px] font-bold">2</span>
              </div>
              <h5 className="text-xs font-headline font-bold text-foreground uppercase tracking-wide">Key Players</h5>
            </div>
            <div className="grid gap-2">
              {arc.keyPlayers.map((player, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/30"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: player.stance === "pro" ? "#22c55e" : player.stance === "against" ? "#ef4444" : "#f59e0b" }}
                  >
                    {player.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-foreground">{player.name}</span>
                      <StancePill stance={player.stance} />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{player.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* SENTIMENT SHIFTS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#E8192C" }}>
                <span className="text-white text-[9px] font-bold">3</span>
              </div>
              <h5 className="text-xs font-headline font-bold text-foreground uppercase tracking-wide">Sentiment Shifts</h5>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border">
              {arc.sentimentShifts.map((s, i) => (
                <SentimentBar key={i} score={s.score} phase={s.phase} reason={s.reason} />
              ))}
            </div>
          </div>

          {/* CONTRARIAN VIEWS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#E8192C" }}>
                <span className="text-white text-[9px] font-bold">4</span>
              </div>
              <h5 className="text-xs font-headline font-bold text-foreground uppercase tracking-wide">Contrarian Perspectives</h5>
            </div>
            <div className="space-y-2">
              {arc.contrarianViews.map((view, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border-l-4 px-3 py-2.5 bg-amber-50 border-amber-400"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">{view.perspective}</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">{view.argument}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* WHAT TO WATCH NEXT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#E8192C" }}>
                <span className="text-white text-[9px] font-bold">5</span>
              </div>
              <h5 className="text-xs font-headline font-bold text-foreground uppercase tracking-wide">What to Watch Next</h5>
            </div>
            <div className="space-y-2">
              {arc.watchNext.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-3 rounded-lg border border-border bg-card"
                >
                  <div
                    className="w-1.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: PROBABILITY_COLOR[item.probability] ?? "#6b7280" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-relaxed mb-1">{item.prediction}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: PROBABILITY_COLOR[item.probability] + "20", color: PROBABILITY_COLOR[item.probability] }}
                      >
                        {item.probability} probability
                      </span>
                      <span className="text-[9px] text-muted-foreground">{item.timeframe}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border text-center">
            <p className="text-[9px] text-muted-foreground">AI-generated narrative · Not financial advice · Refresh for updated arc</p>
          </div>
        </div>
      )}
    </div>
  );
}
