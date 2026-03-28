import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Send, X, Loader2 } from "lucide-react";
import { NewsItem } from "@/types/news";
import { useUser } from "@/context/UserContext";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface ChatBotProps {
  activeNews: NewsItem | null;
  onOpenISLPanel?: (text: string) => void;
}
interface Message {
  role: "user" | "assistant";
  content: string;
  signText?: string;
  isLoading?: boolean;
}

const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu", bn: "Bengali",
};

function buildSystemPrompt(news: NewsItem | null, profile: ReturnType<typeof useUser>["profile"], lang: string): string {
  const outputLang = LANG_NAMES[lang] ?? "English";
  const personaCtx = profile
    ? `The user is a ${profile.persona}${profile.hasHomeLoan ? " with an active home loan" : ""}${profile.investsInStocks ? " who actively invests in stocks/mutual funds" : ""}. Personalise ALL answers to their situation and life context.`
    : "No persona selected — give general but helpful answers.";
  const newsCtx = news
    ? `Active article: "${news.headline}". Category: ${news.category}. Priority: ${news.priority}. Summary: ${news.summary}. Key concepts: ${news.concepts?.join(", ")}.`
    : "No article selected.";
  return `You are Jestally AI, an expert Indian news analyst and financial advisor embedded in a multilingual Indian news platform.

**LANGUAGE RULE — NON NEGOTIABLE**: Your ENTIRE response must be in ${outputLang}. Every word. No exceptions.

USER: ${personaCtx}
NEWS: ${newsCtx}

RULES:
- Answer fast, accurately, and in full detail
- Structure answers: What happened → Why → How → Impact → What should the user do
- Personalise to the user's persona and finances
- Use **bold** for section labels, bullet points for lists
- Be thorough but not repetitive
- For Indian economic/financial topics: give specific actionable advice for Indian households
- Never say you cannot answer — always provide the best analysis possible`;
}

async function callGroq(history: { role: string; content: string }[], sys: string): Promise<string> {
  if (!GROQ_API_KEY) return "⚠️ Add VITE_GROQ_API_KEY=gsk_... to your .env file to enable AI.";
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_API_KEY}` },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "system", content: sys }, ...history],
      max_tokens: 900,
      temperature: 0.45,
    }),
  });
  if (!res.ok) { const t = await res.text().catch(() => ""); throw new Error(`Groq ${res.status}: ${t.slice(0, 100)}`); }
  const d = await res.json();
  return d.choices?.[0]?.message?.content ?? "No response.";
}

function MsgContent({ text }: { text: string }) {
  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        return (
          <p key={i} className="leading-relaxed">
            {line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={j}>{p.slice(2, -2)}</strong>
                : <span key={j}>{p}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

export function ChatBot({ activeNews, onOpenISLPanel }: ChatBotProps) {
  const { t, i18n } = useTranslation();
  const { profile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<{ role: string; content: string }[]>([]);

  const greeting = useCallback(() =>
    profile ? `${t("chatGreeting")} 👤 ${profile.persona}` : t("chatGreeting"),
  [profile, t]);

  // Instant reset when language or persona changes
  useEffect(() => {
    historyRef.current = [];
    setMessages([{ role: "assistant", content: greeting() }]);
    setLoading(false);
  }, [i18n.language, profile]);

  useEffect(() => {
    if (activeNews && isOpen) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `${t("contextUpdated")} **${activeNews.headline}**\n\n${t("askExplain")}`,
      }]);
    }
  }, [activeNews]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }, { role: "assistant", content: "", isLoading: true }]);
    setLoading(true);
    historyRef.current.push({ role: "user", content: text });
    try {
      const reply = await callGroq(historyRef.current, buildSystemPrompt(activeNews, profile, i18n.language));
      historyRef.current.push({ role: "assistant", content: reply });
      if (historyRef.current.length > 16) historyRef.current = historyRef.current.slice(-16);
      setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: reply, signText: activeNews?.concepts?.join(" ") }]);
    } catch (err: any) {
      setMessages(prev => [...prev.slice(0, -1), { role: "assistant", content: `❌ ${err.message}` }]);
    } finally { setLoading(false); }
  }, [input, loading, activeNews, profile, i18n.language]);

  return (
    <>
      <button onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center text-xl hover:scale-110 transition-transform">
        {isOpen ? <X className="w-5 h-5" /> : "🤟"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] md:w-[420px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: "76vh" }}>
            {/* Header */}
            <div className="bg-header text-header-foreground px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <span className="text-2xl">🤟</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-headline font-bold">{t("assistantName")}</h3>
                <p className="text-[10px] text-muted-foreground truncate">
                  {profile ? `${profile.persona}${activeNews ? ` · ${activeNews.category}` : ""}` : t("noArticle")}
                </p>
              </div>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${GROQ_API_KEY ? "bg-green-400" : "bg-amber-400"}`}
                title={GROQ_API_KEY ? "Groq AI active" : "API key missing"} />
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[88%]">
                    <div className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed font-body ${
                      msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"
                    }`}>
                      {msg.isLoading
                        ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" />{t("thinking")}</span>
                        : <MsgContent text={msg.content} />}
                    </div>
                    {msg.role === "assistant" && !msg.isLoading && msg.signText && onOpenISLPanel && (
                      <button onClick={() => onOpenISLPanel(msg.signText!)}
                        className="mt-1 text-[10px] font-semibold text-primary hover:underline">{t("seeInSign")}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2 items-center flex-shrink-0">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder={t("chatPlaceholder")} disabled={loading}
                className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-input bg-background font-body focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50" />
              <button onClick={send} disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-all flex-shrink-0">
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}