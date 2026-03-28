import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Loader2, TrendingUp, TrendingDown, Minus, BarChart2, AlertCircle, MessageCircle, Send, ThumbsUp, Trash2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  LineChart, Line, CartesianGrid,
} from "recharts";
import { NewsItem } from "@/types/news";
import { useUser } from "@/context/UserContext";
import { StoryArcTracker } from "@/components/StoryArcTracker";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

type Persona = "Student" | "Investor" | "Business" | "Homemaker" | "Retiree";
const PERSONAS: Persona[] = ["Student", "Investor", "Business", "Homemaker", "Retiree"];

const PERSONA_ICONS: Record<Persona, string> = {
  Student: "🎓", Investor: "📈", Business: "💼", Homemaker: "🏠", Retiree: "🌿",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMMENT SYSTEM
// ─────────────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  newsId: string;
  authorName: string;
  authorPersona: string;
  text: string;
  timestamp: number;
  likes: string[]; // device IDs that liked this comment
}

// Stable anonymous device ID — persisted in localStorage
function getDeviceId(): string {
  const KEY = "ji_device_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(KEY, id);
  }
  return id;
}

const COMMENTS_KEY = "ji_comments";

function loadAllComments(): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function saveAllComments(comments: Comment[]): void {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  } catch {}
}

function getCommentsForNews(newsId: string): Comment[] {
  return loadAllComments()
    .filter(c => c.newsId === newsId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function addComment(comment: Comment): void {
  const all = loadAllComments();
  all.push(comment);
  if (all.length > 500) all.splice(0, all.length - 500);
  saveAllComments(all);
}

function toggleLike(commentId: string, deviceId: string): void {
  const all = loadAllComments();
  const idx = all.findIndex(c => c.id === commentId);
  if (idx === -1) return;
  const likes = all[idx].likes ?? [];
  all[idx].likes = likes.includes(deviceId)
    ? likes.filter(id => id !== deviceId)
    : [...likes, deviceId];
  saveAllComments(all);
}

function deleteComment(commentId: string, deviceId: string): void {
  const all = loadAllComments().filter(
    c => !(c.id === commentId && c.id.startsWith(deviceId.slice(0, 8)))
  );
  saveAllComments(all);
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const PERSONA_BADGE: Record<string, string> = {
  Student:   "bg-blue-100 text-blue-700",
  Investor:  "bg-green-100 text-green-700",
  Business:  "bg-amber-100 text-amber-700",
  Homemaker: "bg-pink-100 text-pink-700",
  Retiree:   "bg-purple-100 text-purple-700",
  Commoner:  "bg-muted text-muted-foreground",
};

function CommentSection({ newsId }: { newsId: string }) {
  const { profile } = useUser();
  const deviceId = getDeviceId();

  const [comments, setComments] = useState<Comment[]>(() => getCommentsForNews(newsId));
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const PREVIEW = 3;
  const visible = showAll ? comments : comments.slice(0, PREVIEW);
  const isOwn = (c: Comment) => c.id.startsWith(deviceId.slice(0, 8));

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed.length < 2) return;
    const nc: Comment = {
      id: `${deviceId.slice(0, 8)}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      newsId,
      authorName: profile?.name && profile.name !== "User" ? profile.name : "Anonymous",
      authorPersona: profile?.persona ?? "Commoner",
      text: trimmed.slice(0, 500),
      timestamp: Date.now(),
      likes: [],
    };
    addComment(nc);
    setComments(getCommentsForNews(newsId));
    setText("");
    setShowAll(true);
  };

  const handleLike = (id: string) => {
    toggleLike(id, deviceId);
    setComments(getCommentsForNews(newsId));
  };

  const handleDelete = (id: string) => {
    deleteComment(id, deviceId);
    setComments(getCommentsForNews(newsId));
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h4 className="text-xs font-headline font-bold text-foreground">Community Discussion</h4>
        {comments.length > 0 && (
          <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        )}
      </div>

      <div className="p-3 space-y-3">
        {/* Input */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-sm leading-none">
              {PERSONA_ICONS[profile?.persona as Persona] ?? "👤"}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {profile?.name && profile.name !== "User" ? profile.name : "You"}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${PERSONA_BADGE[profile?.persona ?? "Commoner"]}`}>
              {profile?.persona ?? "Commoner"}
            </span>
          </div>
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
              }}
              placeholder="Share your thoughts… (Enter to post, Shift+Enter for new line)"
              rows={2}
              maxLength={500}
              className="w-full resize-none border border-border rounded-xl px-3 py-2.5 pr-10 text-xs bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-card transition-all font-body leading-relaxed"
            />
            <button
              onClick={handleSubmit}
              disabled={text.trim().length < 2}
              className="absolute right-2 bottom-2.5 p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
          {text.length > 400 && (
            <p className="text-[10px] text-muted-foreground text-right">{500 - text.length} chars left</p>
          )}
        </div>

        {/* Comments */}
        {comments.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-xl mb-1">💬</p>
            <p className="text-xs text-muted-foreground font-body">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <>
            <AnimatePresence initial={false}>
              {visible.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  className="flex gap-2.5 group"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted/60 border border-border flex items-center justify-center text-sm leading-none mt-0.5">
                    {PERSONA_ICONS[c.authorPersona as Persona] ?? "👤"}
                  </div>

                  {/* Bubble */}
                  <div className="flex-1 min-w-0">
                    <div className="bg-muted/40 rounded-xl rounded-tl-sm px-3 py-2 border border-border/50">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-foreground">{c.authorName}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${PERSONA_BADGE[c.authorPersona] ?? PERSONA_BADGE["Commoner"]}`}>
                          {c.authorPersona}
                        </span>
                        <span className="text-[9px] text-muted-foreground ml-auto">{timeAgo(c.timestamp)}</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed font-body break-words">{c.text}</p>
                    </div>

                    {/* Like / Delete */}
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <button
                        onClick={() => handleLike(c.id)}
                        className={`flex items-center gap-1 text-[10px] font-semibold transition-colors ${
                          c.likes.includes(deviceId) ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {c.likes.length > 0 && <span>{c.likes.length}</span>}
                        <span>{c.likes.includes(deviceId) ? "Liked" : "Like"}</span>
                      </button>

                      {isOwn(c) && (
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {comments.length > PREVIEW && (
              <button
                onClick={() => setShowAll(v => !v)}
                className="w-full text-[11px] text-primary font-semibold py-1.5 rounded-lg hover:bg-primary/5 transition-colors border border-primary/20"
              >
                {showAll ? "Show less ↑" : `View all ${comments.length} comments ↓`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYSIS ENGINE (unchanged from your previous working version)
// ─────────────────────────────────────────────────────────────────────────────

interface NewsDetailPanelProps {
  item: NewsItem | null;
  onClose: () => void;
}

interface AnalysisResult {
  whatHappened: string;
  whyItHappened: string;
  howItHappened: string;
  impact: string;
  howToResolve: string;
  personaImpacts: Record<Persona, string>;
  sentiment: "positive" | "negative" | "neutral";
  affectedSectors: { name: string; impact: number }[];
  timeline: { label: string; value: number }[];
}

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu", bn: "Bengali",
  mr: "Marathi", gu: "Gujarati", kn: "Kannada", ml: "Malayalam",
  pa: "Punjabi", or: "Odia", as: "Assamese",
};

function buildAnalysisPrompt(item: NewsItem, lang: string): string {
  const outputLang = LANG_NAMES[lang] ?? "English";
  return `You are an expert Indian news analyst. Analyse this news article.

HEADLINE: "${item.headline}"
CATEGORY: ${item.category}
SUMMARY: ${item.summary}
CONCEPTS: ${item.concepts?.join(", ")}

STRICT RULES — FOLLOW EXACTLY:
1. Your ENTIRE response must be one valid JSON object and nothing else.
2. Start with { and end with }. Absolutely nothing before { and nothing after }.
3. No markdown fences, no code blocks, no preamble, no explanation whatsoever.
4. Every text value inside the JSON must be written in ${outputLang}.
5. Keep each text value SHORT — maximum 2 sentences — so the full JSON fits within the token limit.
6. The "sentiment" field value must be exactly one of these three strings: "positive", "negative", "neutral".
7. affectedSectors: exactly 4 objects with "name" (string) and "impact" (integer -100 to 100).
8. timeline: exactly 4 objects with "label" (short string) and "value" (integer 0 to 100).

Return this exact structure:
{
  "whatHappened": "2 sentences in ${outputLang}",
  "whyItHappened": "2 sentences in ${outputLang}",
  "howItHappened": "2 sentences in ${outputLang}",
  "impact": "2 sentences in ${outputLang}",
  "howToResolve": "2 sentences in ${outputLang}",
  "personaImpacts": {
    "Student": "1 sentence in ${outputLang}",
    "Investor": "1 sentence in ${outputLang}",
    "Business": "1 sentence in ${outputLang}",
    "Homemaker": "1 sentence in ${outputLang}",
    "Retiree": "1 sentence in ${outputLang}"
  },
  "sentiment": "positive",
  "affectedSectors": [
    {"name": "sector in ${outputLang}", "impact": 60},
    {"name": "sector in ${outputLang}", "impact": -40},
    {"name": "sector in ${outputLang}", "impact": 30},
    {"name": "sector in ${outputLang}", "impact": -20}
  ],
  "timeline": [
    {"label": "label in ${outputLang}", "value": 20},
    {"label": "label in ${outputLang}", "value": 45},
    {"label": "label in ${outputLang}", "value": 70},
    {"label": "label in ${outputLang}", "value": 90}
  ]
}`;
}

function extractJSON(raw: string): string {
  const s = raw.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
  const start = s.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");
  const end = s.lastIndexOf("}");
  if (end === -1 || end < start) throw new Error("JSON object not closed in response");
  return s.slice(start, end + 1);
}

function fallbackResult(): AnalysisResult {
  const msg = "Analysis unavailable. Please try again.";
  return {
    whatHappened: msg, whyItHappened: msg, howItHappened: msg,
    impact: msg, howToResolve: msg,
    personaImpacts: { Student: msg, Investor: msg, Business: msg, Homemaker: msg, Retiree: msg },
    sentiment: "neutral",
    affectedSectors: [
      { name: "General", impact: 0 }, { name: "Economy", impact: 0 },
      { name: "Market", impact: 0 },  { name: "Policy", impact: 0 },
    ],
    timeline: [
      { label: "Phase 1", value: 25 }, { label: "Phase 2", value: 50 },
      { label: "Phase 3", value: 75 }, { label: "Phase 4", value: 100 },
    ],
  };
}

async function fetchAnalysis(item: NewsItem, lang: string): Promise<AnalysisResult> {
  if (!GROQ_API_KEY) throw new Error("VITE_GROQ_API_KEY not set in .env");
  const prompt = buildAnalysisPrompt(item, lang);

  for (let attempt = 1; attempt <= 2; attempt++) {
    let raw = "";
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content: "You are a JSON-only API. Respond with a single valid JSON object. Never include text outside the JSON. Never use markdown. Start with { and end with }.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 2500,
          temperature: 0.2,
        }),
      });

      if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
      const data = await res.json();
      raw = data.choices?.[0]?.message?.content ?? "";
      if (!raw.trim()) throw new Error("Empty response from Groq");

      const parsed = JSON.parse(extractJSON(raw)) as AnalysisResult;
      if (!parsed.whatHappened || !parsed.personaImpacts) throw new Error("Incomplete JSON");
      if (!["positive", "negative", "neutral"].includes(parsed.sentiment)) parsed.sentiment = "neutral";
      if (!Array.isArray(parsed.affectedSectors) || !parsed.affectedSectors.length)
        parsed.affectedSectors = fallbackResult().affectedSectors;
      if (!Array.isArray(parsed.timeline) || !parsed.timeline.length)
        parsed.timeline = fallbackResult().timeline;
      return parsed;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed:`, err instanceof Error ? err.message : err);
      if (attempt === 2) throw new Error("analysisError");
      await new Promise(r => setTimeout(r, 800));
    }
  }
  return fallbackResult();
}

function SentimentBadge({ s }: { s: "positive" | "negative" | "neutral" }) {
  if (s === "positive") return <span className="flex items-center gap-1 text-green-600 text-xs font-semibold"><TrendingUp className="w-3.5 h-3.5" /> Positive</span>;
  if (s === "negative") return <span className="flex items-center gap-1 text-red-500 text-xs font-semibold"><TrendingDown className="w-3.5 h-3.5" /> Negative</span>;
  return <span className="flex items-center gap-1 text-amber-500 text-xs font-semibold"><Minus className="w-3.5 h-3.5" /> Neutral</span>;
}

function Section({ label, content, icon }: { label: string; content: string; icon: string }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
        <span className="text-base">{icon}</span>
        <h4 className="text-xs font-headline font-bold text-foreground">{label}</h4>
      </div>
      <p className="px-3 py-2.5 text-xs text-foreground leading-relaxed font-body">{content}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function NewsDetailPanel({ item, onClose }: NewsDetailPanelProps) {
  const { t, i18n } = useTranslation();
  const { profile } = useUser();

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState<Persona>((profile?.persona as Persona) ?? "Student");

  const load = useCallback(async () => {
    if (!item) return;
    setLoading(true); setError(null); setAnalysis(null);
    try {
      setAnalysis(await fetchAnalysis(item, i18n.language));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "analysisError";
      // If it's a known i18n key, translate it; otherwise show as-is
      setError(t(msg as any) !== msg ? t(msg as any) : msg);
    } finally {
      setLoading(false);
    }
  }, [item?.headline, i18n.language]);

  useEffect(() => { if (item) load(); }, [item?.headline, i18n.language]);
  useEffect(() => { if (profile?.persona) setActivePersona(profile.persona as Persona); }, [profile]);

  if (!item) return null;

  const priorityColor = item.priority === "High" ? "text-primary" : item.priority === "Medium" ? "text-secondary-foreground" : "text-muted-foreground";
  const borderColor   = item.priority === "High" ? "border-l-primary" : item.priority === "Medium" ? "border-l-secondary" : "border-l-border";

  return (
    <AnimatePresence>
      <motion.div
        key="detail-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 pt-8 overflow-y-auto"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="detail-card"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={`w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden border-l-4 ${borderColor}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-header text-header-foreground px-5 py-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-sm font-medium">{item.category}</span>
                <span className={`text-[10px] font-bold ${priorityColor}`}>{item.priority}</span>
                {item.isLive && (
                  <span className="flex items-center gap-1 text-[10px] text-primary font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-live-pulse" />{t("live")}
                  </span>
                )}
                {analysis && <SentimentBadge s={analysis.sentiment} />}
              </div>
              <h2 className="text-base md:text-lg font-headline font-black leading-snug">{item.headline}</h2>
            </div>
            <button onClick={onClose} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground font-body">{t("loadingAnalysis")}</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center gap-3 py-8">
                <AlertCircle className="w-6 h-6 text-destructive" />
                <p className="text-xs text-destructive text-center">{error}</p>
                <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  {t("retry")}
                </button>
              </div>
            )}

            {analysis && !loading && (
              <>
                {/* Analysis sections */}
                <div className="grid gap-3">
                  <Section label={t("whatHappened")} content={analysis.whatHappened} icon="📰" />
                  <Section label={t("whyItHappened")} content={analysis.whyItHappened} icon="🔍" />
                  <Section label={t("howItHappened")} content={analysis.howItHappened} icon="⚙️" />
                  <Section label={t("impact")} content={analysis.impact} icon="💥" />
                  <Section label={t("howToResolve")} content={analysis.howToResolve} icon="✅" />
                </div>

                {/* Data Snapshot */}
                {analysis.affectedSectors?.length > 0 && (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-headline font-bold text-foreground">{t("dataSnapshot")}</h4>
                    </div>
                    <div className="p-3 grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Sector Impact</p>
                        <ResponsiveContainer width="100%" height={160}>
                          <BarChart data={analysis.affectedSectors} layout="vertical" margin={{ left: 8, right: 16 }}>
                            <XAxis type="number" domain={[-100, 100]} tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={72} tickLine={false} axisLine={false} />
                            <Tooltip formatter={(v: number) => [`${v > 0 ? "+" : ""}${v}`, "Impact"]} contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                            <Bar dataKey="impact" radius={3} fill="hsl(var(--primary))" isAnimationActive={true} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      {analysis.timeline?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-muted-foreground font-semibold mb-2 uppercase tracking-wide">Development Timeline</p>
                          <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={analysis.timeline} margin={{ left: 0, right: 8 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis dataKey="label" tick={{ fontSize: 8 }} tickLine={false} />
                              <YAxis tick={{ fontSize: 8 }} tickLine={false} axisLine={false} />
                              <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} />
                              <Line type="monotone" dataKey="value" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 3 }} isAnimationActive={true} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Persona Impact Tabs */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
                    <span className="text-base">👥</span>
                    <h4 className="text-xs font-headline font-bold text-foreground">{t("impactByPersona")}</h4>
                  </div>
                  <div className="flex gap-1.5 p-3 pb-0 flex-wrap">
                    {PERSONAS.map(p => (
                      <button key={p} onClick={() => setActivePersona(p)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all border ${
                          activePersona === p
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                        }`}>
                        {PERSONA_ICONS[p]} {t(p.toLowerCase() as any)}
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-3">
                    <AnimatePresence mode="wait">
                      <motion.p key={activePersona}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-foreground leading-relaxed font-body">
                        {analysis.personaImpacts[activePersona] ?? "No specific impact data."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Radar Chart */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted/60 border-b border-border">
                    <span className="text-base">🎯</span>
                    <h4 className="text-xs font-headline font-bold">Who Is Most Affected</h4>
                  </div>
                  <div className="p-3">
                    <ResponsiveContainer width="100%" height={180}>
                      <RadarChart data={PERSONAS.map(p => ({ persona: PERSONA_ICONS[p] + " " + p, impact: analysis.personaImpacts[p]?.length ?? 0 }))}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="persona" tick={{ fontSize: 9 }} />
                        <Radar name="Impact" dataKey="impact" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
                        <Tooltip contentStyle={{ fontSize: 10, borderRadius: 6 }} formatter={(v) => [`${v}`, "Impact depth"]} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}

            {/* ── Story Arc Tracker — below AI analysis ── */}
            {analysis && !loading && (
              <StoryArcTracker item={item} />
            )}

            {/* ── Comment Section — always shown regardless of analysis state ── */}
            <CommentSection newsId={item.id} />

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}