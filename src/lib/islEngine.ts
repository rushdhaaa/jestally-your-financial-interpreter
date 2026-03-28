// ISL Engine — ported from extension content.js
// Handles ISL grammar normalization, resolver API calls, and translation

const RESOLVER_API = "https://ahwchrh9z0.execute-api.ap-south-1.amazonaws.com/prod/resolve";
const API_KEY = "3t2XrVzJQP4E9x7S3ksWW5PIconSSPH782gu39XS";

const ISL_ALIAS: Record<string, string> = {
  hello: "hello", hi: "hello", hey: "hello", bye: "bye", goodbye: "bye",
  thanks: "thank you", thank: "thank you", ty: "thank you",
  yes: "good", okay: "good", ok: "good", no: "not", nope: "not",
  sorry: "sad", "help me": "help", "please help": "help",
  what: "what", where: "where", when: "when", why: "why", who: "who", how: "how",
  maa: "mother", amma: "mother", baap: "father", pita: "father",
  bhai: "brother", behen: "sister",
};

const DROP = new Set(["a", "an", "the", "is", "are", "was", "were", "am", "be", "been", "do", "does", "did", "will", "would", "could", "should", "very", "really", "just", "please", "of", "in", "at", "to", "for", "with", "by", "from", "on", "about"]);
const WH = new Set(["who", "what", "where", "when", "why", "how", "which"]);
const TIME = new Set(["yesterday", "tomorrow", "today", "now", "later", "morning", "evening", "night", "always", "never"]);
const NEG = new Set(["not", "never", "no", "nobody", "nothing"]);

export function applyISLGrammar(text: string): string {
  const tokens = text.toLowerCase().replace(/[?!.,;:'"]/g, " ").trim().split(/\s+/).filter(Boolean);
  const t: string[] = [], w: string[] = [], n: string[] = [], m: string[] = [];
  for (const tok of tokens) {
    if (DROP.has(tok)) continue;
    if (TIME.has(tok)) t.push(tok);
    else if (WH.has(tok)) w.push(tok);
    else if (NEG.has(tok)) n.push("not");
    else m.push(tok);
  }
  return [...t, ...m, ...n, ...w].filter((x, i, a) => x !== a[i - 1]).join(" ");
}

export function normalizeForISL(text: string): string {
  const lower = text.trim().toLowerCase();
  if (ISL_ALIAS[lower]) return ISL_ALIAS[lower];
  return lower.split(/\s+/).map(w => ISL_ALIAS[w] || w).join(" ");
}

export interface ISLGif {
  word: string;
  url: string;
}

const gifCache = new Map<string, ISLGif[]>();

export async function resolveISLText(rawText: string): Promise<ISLGif[]> {
  if (!rawText?.trim()) return [];

  const cacheKey = rawText.toLowerCase().trim();
  if (gifCache.has(cacheKey)) return gifCache.get(cacheKey)!;

  const normalized = normalizeForISL(applyISLGrammar(rawText));

  try {
    const res = await Promise.race([
      fetch(RESOLVER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ text: normalized, language: "ISL" }),
      }),
      new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), 10000)),
    ]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data?.success && data.gifs?.length) {
      const valid = data.gifs.filter((g: ISLGif) => g.url);
      if (valid.length) {
        if (gifCache.size >= 100) gifCache.delete(gifCache.keys().next().value!);
        gifCache.set(cacheKey, valid);
        return valid;
      }
    }
    // Word-by-word fallback
    return resolveWordByWord(normalized);
  } catch {
    return resolveWordByWord(normalized);
  }
}

async function resolveWordByWord(text: string): Promise<ISLGif[]> {
  const words = text.split(/\s+/).filter(Boolean);
  const results: ISLGif[] = [];
  for (const w of words) {
    try {
      const res = await Promise.race([
        fetch(RESOLVER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
          body: JSON.stringify({ text: w, language: "ISL" }),
        }),
        new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), 5000)),
      ]);
      if (!res.ok) continue;
      const d = await res.json();
      if (d?.success && d.gifs?.length) results.push(...d.gifs.filter((g: ISLGif) => g.url));
    } catch { continue; }
  }
  return results;
}

// Translation via MyMemory API
const translCache = new Map<string, string>();

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === "en") return text;
  const key = `${text}__${targetLang}`;
  if (translCache.has(key)) return translCache.get(key)!;
  try {
    const res = await Promise.race([
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 100))}&langpair=en|${targetLang}`),
      new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), 4000)),
    ]);
    const d = await res.json();
    const t = d?.responseData?.translatedText || "";
    if (t && d?.responseStatus === 200 && !/MYMEMORY|PLEASE SELECT|KINDLY|INVALID/i.test(t)) {
      translCache.set(key, t);
      return t;
    }
  } catch { /* fallback */ }
  return text;
}

export async function translateToEnglish(text: string, fromLang: string): Promise<string> {
  if (fromLang === "en") return text;
  const key = `${text}__${fromLang}__en`;
  if (translCache.has(key)) return translCache.get(key)!;
  try {
    const res = await Promise.race([
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 300))}&langpair=${fromLang}|en`),
      new Promise<never>((_, r) => setTimeout(() => r(new Error("timeout")), 5000)),
    ]);
    const d = await res.json();
    const t = d?.responseData?.translatedText || "";
    if (t && d?.responseStatus === 200 && !/MYMEMORY|PLEASE SELECT|KINDLY|INVALID/i.test(t)) {
      translCache.set(key, t);
      return t;
    }
  } catch { /* fallback */ }
  return text;
}
