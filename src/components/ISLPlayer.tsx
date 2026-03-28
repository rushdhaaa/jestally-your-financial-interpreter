import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2, AlertCircle } from "lucide-react";

const S3_BASE = "https://jestally-isl-gifs-prod.s3.ap-south-1.amazonaws.com/";
const RESOLVER_API = "https://ahwchrh9z0.execute-api.ap-south-1.amazonaws.com/prod/resolve";

interface ISLPlayerProps {
  concepts: string[];
  headline: string;
  onClose?: () => void;
  floating?: boolean;
}

function buildS3Url(word: string) {
  return `${S3_BASE}${encodeURIComponent(word)}.mp4`;
}

// ── REMOVED: letterFallbackUrls ── Words with no matching .mp4 are skipped,
// not spelled out letter-by-letter. This eliminates all dummy-letter noise.

export function ISLPlayer({ concepts, headline, onClose, floating = false }: ISLPlayerProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [queue, setQueue] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]); // tracks words with no sign
  const [idx, setIdx] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const activeRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);
  const [activeSlot, setActiveSlot] = useState<"a" | "b">("a");

  // Resolve concepts via Lambda → only include URLs for whole words found in S3.
  // If a word is not found, it is recorded in `skipped` and silently omitted.
  const resolveAndPlay = useCallback(async () => {
    setStatus("loading");
    setSkipped([]);
    const toResolve = concepts.filter(c => c && c.trim().length > 1); // ignore single chars
    if (toResolve.length === 0) toResolve.push("Market");

    const urls: string[] = [];
    const missed: string[] = [];

    for (const concept of toResolve) {
      let resolved = false;

      try {
        const res = await fetch(RESOLVER_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concept }),
        });
        if (res.ok) {
          const data = await res.json();

          // Resolver returned a direct URL
          if (data.url) {
            urls.push(data.url);
            resolved = true;
          }
          // Resolver returned an array of whole-word matches
          else if (data.words && Array.isArray(data.words)) {
            const wordUrls = data.words
              .filter((w: string) => w && w.trim().length > 1) // skip single chars
              .map((w: string) => buildS3Url(w));
            if (wordUrls.length > 0) {
              urls.push(...wordUrls);
              resolved = true;
            }
          }
        }
      } catch {
        // Network error → try direct S3
      }

      // Try direct S3 as fallback (whole word, NOT letters)
      if (!resolved) {
        // We push the direct URL; if it 404s the handleError will skip it
        urls.push(buildS3Url(concept));
        // Mark as potentially missing — confirmed by handleError
      }
    }

    if (urls.length > 0) {
      setQueue(urls);
      setIdx(0);
      setActiveSlot("a");
      setStatus("playing");
    } else {
      setStatus("error");
    }
  }, [concepts]);

  // Play current video and preload next
  useEffect(() => {
    if (status !== "playing" || queue.length === 0) return;

    const current = activeSlot === "a" ? activeRef.current : preloadRef.current;
    const next = activeSlot === "a" ? preloadRef.current : activeRef.current;

    if (current) {
      current.src = queue[idx];
      current.style.display = "block";
      current.load();
      current.play().catch(() => {});
    }
    if (next) {
      next.style.display = "none";
      if (idx + 1 < queue.length) {
        next.src = queue[idx + 1];
        next.load();
      }
    }
  }, [status, idx, queue, activeSlot]);

  // Handle video error → SKIP the word entirely (no letter fallback)
  const handleError = useCallback(() => {
    const currentUrl = queue[idx];
    const match = currentUrl.match(/\/([^/]+)\.mp4$/);
    if (match) {
      const word = decodeURIComponent(match[1]);
      setSkipped(prev => [...prev, word]);
    }
    // Simply advance to the next item — no letter spelling
    handleEnded();
  }, [queue, idx]);

  const handleEnded = useCallback(() => {
    if (idx < queue.length - 1) {
      setActiveSlot(s => (s === "a" ? "b" : "a"));
      setIdx(i => i + 1);
    } else {
      setStatus("idle");
      onClose?.();
    }
  }, [idx, queue.length, onClose]);

  // Auto-play on mount for floating mode
  useEffect(() => {
    if (floating && status === "idle") {
      resolveAndPlay();
    }
  }, [floating]);

  const wrapperClass = floating
    ? "fixed bottom-20 right-4 z-50 w-72 shadow-2xl rounded-lg border border-border bg-card overflow-hidden"
    : "bg-card border border-border rounded-lg overflow-hidden";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={wrapperClass}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-foreground/5 border-b border-border">
          <span className="text-xs font-semibold text-foreground font-body truncate flex-1">
            🤟 ISL Player
          </span>
          <div className="flex items-center gap-1">
            {floating && (
              <button
                onClick={() => setMinimized(!minimized)}
                className="p-1 rounded hover:bg-foreground/10 text-muted-foreground"
              >
                {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            )}
            {onClose && (
              <button onClick={onClose} className="p-1 rounded hover:bg-foreground/10 text-muted-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {!minimized && (
          <div className="relative">
            {/* Idle */}
            {status === "idle" && !floating && (
              <div className="p-4">
                <button
                  onClick={resolveAndPlay}
                  className="w-full text-xs px-3 py-2 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  ▶ Play Signs
                </button>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {concepts
                    .filter(c => c && c.trim().length > 1)
                    .map(c => (
                      <span key={c} className="text-[10px] bg-gold-muted text-gold-foreground px-2 py-0.5 rounded-sm">
                        🤟 {c}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Loading */}
            {status === "loading" && (
              <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Resolving signs…
              </div>
            )}

            {/* Playing */}
            {status === "playing" && (
              <div>
                <div className="relative bg-foreground/10 aspect-video">
                  <video
                    ref={activeRef}
                    onEnded={handleEnded}
                    onError={handleError}
                    className="absolute inset-0 w-full h-full object-contain"
                    playsInline
                    muted={false}
                  />
                  <video
                    ref={preloadRef}
                    onEnded={handleEnded}
                    onError={handleError}
                    className="absolute inset-0 w-full h-full object-contain"
                    playsInline
                    muted={false}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground font-body">
                    {idx + 1}/{queue.length}
                  </span>
                  <button
                    onClick={() => { setStatus("idle"); onClose?.(); }}
                    className="text-[10px] text-primary font-semibold hover:underline"
                  >
                    Stop
                  </button>
                </div>
                {/* Skipped words notice (no letter fallback, just transparency) */}
                {skipped.length > 0 && (
                  <div className="mx-3 mb-2 flex items-start gap-1.5 text-[10px] text-muted-foreground bg-muted/50 rounded px-2 py-1.5">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>Sign not available for: {skipped.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="p-4">
                <p className="text-xs text-primary">Unable to load sign videos.</p>
                <button onClick={resolveAndPlay} className="text-xs text-primary font-semibold mt-1 hover:underline">
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
