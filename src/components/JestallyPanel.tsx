import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Send, Play, Square } from "lucide-react";
import { useTranslation } from "react-i18next";
import { resolveISLText, ISLGif, translateToEnglish } from "@/lib/islEngine";

interface JestallyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
}

export function JestallyPanel({ isOpen, onClose, initialText }: JestallyPanelProps) {
  const { t, i18n } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [islPreview, setIslPreview] = useState("");
  const [stage, setStage] = useState<"listen" | "load" | "playing" | "error">("listen");
  const [errorMsg, setErrorMsg] = useState("");
  const [micActive, setMicActive] = useState(false);
  const [gifQueue, setGifQueue] = useState<ISLGif[]>([]);
  const [gifIdx, setGifIdx] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const recognitionRef = useRef<any>(null);

  // Handle initialText from external triggers (chatbot "See in Sign Language")
  useEffect(() => {
    if (initialText && isOpen) {
      setInputText(initialText);
      handleResolve(initialText);
    }
  }, [initialText, isOpen]);

  const handleResolve = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setStage("load");
    setTranscript(text.slice(-80));

    let english = text;
    if (i18n.language !== "en") {
      english = await translateToEnglish(text, i18n.language);
    }

    const gifs = await resolveISLText(english);
    if (gifs.length > 0) {
      setIslPreview(english.toUpperCase());
      setGifQueue(gifs);
      setGifIdx(0);
      setStage("playing");
    } else {
      setErrorMsg("No signs found for this text.");
      setStage("error");
      setTimeout(() => setStage("listen"), 4000);
    }
  }, [i18n.language]);

  const handleSend = () => {
    if (inputText.trim()) {
      handleResolve(inputText.trim());
      setInputText("");
    }
  };

  // Video playback
  useEffect(() => {
    if (stage !== "playing" || gifQueue.length === 0) return;
    const gif = gifQueue[gifIdx];
    if (!gif) return;

    const isGifUrl = gif.url.toLowerCase().split("?")[0].endsWith(".gif");
    if (isGifUrl) {
      if (videoRef.current) videoRef.current.style.display = "none";
      if (imgRef.current) {
        imgRef.current.style.display = "block";
        imgRef.current.src = gif.url;
      }
      const timer = setTimeout(() => {
        if (imgRef.current) imgRef.current.style.display = "none";
        advanceGif();
      }, gifQueue.length === 1 ? 2500 : 2000);
      return () => clearTimeout(timer);
    } else {
      if (imgRef.current) imgRef.current.style.display = "none";
      const v = videoRef.current;
      if (!v) return;
      v.style.display = "block";
      v.src = gif.url;
      v.load();
      v.play().catch(() => {
        const timer = setTimeout(advanceGif, 2000);
        return () => clearTimeout(timer);
      });
    }
  }, [stage, gifIdx, gifQueue]);

  const advanceGif = useCallback(() => {
    setGifIdx(prev => {
      if (prev < gifQueue.length - 1) return prev + 1;
      setStage("listen");
      setIslPreview("");
      return 0;
    });
  }, [gifQueue.length]);

  const handleVideoEnded = () => advanceGif();
  const handleVideoError = () => advanceGif();

  // Mic / Speech Recognition
  const toggleMic = () => {
    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    const langMap: Record<string, string> = { en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", bn: "bn-IN" };
    rec.lang = langMap[i18n.language] || "en-IN";
    rec.onstart = () => setMicActive(true);
    rec.onresult = (e: SpeechRecognitionEvent) => {
      let fin = "", int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        e.results[i].isFinal ? (fin += t) : (int += t);
      }
      const d = (fin || int).slice(0, 400);
      setTranscript(d.slice(-80));
      setInputText(d);
      if (fin) {
        setTimeout(() => handleResolve(fin), 750);
      }
    };
    rec.onerror = () => setMicActive(false);
    rec.onend = () => setMicActive(false);
    recognitionRef.current = rec;
    rec.start();
  };

  const stopPlaying = () => {
    setStage("listen");
    setGifQueue([]);
    setGifIdx(0);
    setIslPreview("");
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.style.display = "none"; }
    if (imgRef.current) imgRef.current.style.display = "none";
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        className="fixed top-0 right-0 z-50 h-full w-[360px] max-w-full bg-[#1a1730] border-l border-[#a78bfa40] shadow-2xl flex flex-col text-[#e2d9f3] font-body"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#a78bfa10] border-b border-[#a78bfa20]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤟</span>
            <span className="font-bold text-sm text-[#c4b5fd]">Jestally ISL</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#a78bfa20] text-[#a78bfa]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stage Area */}
        <div className="flex-1 flex flex-col p-3 gap-3 overflow-y-auto">
          {/* ISL Stage */}
          <div className="min-h-[180px] rounded-xl bg-[#ffffff08] border border-[#a78bfa1a] flex items-center justify-center overflow-hidden relative">
            {stage === "listen" && (
              <div className="flex flex-col items-center gap-2 p-4">
                <div className="flex gap-1 items-center h-7">
                  {[8, 18, 26, 18, 8].map((h, i) => (
                    <span key={i} className="w-[3px] rounded-sm bg-[#a78bfa80] animate-pulse" style={{ height: h, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-xs text-[#c4b5fd99]">Ready — type or speak</p>
              </div>
            )}
            {stage === "load" && (
              <div className="flex flex-col items-center gap-2 p-4 w-full">
                <div className="h-3 rounded-md w-3/4 bg-gradient-to-r from-[#a78bfa1a] via-[#a78bfa4d] to-[#a78bfa1a] bg-[length:200%_100%] animate-pulse" />
                <p className="text-[10px] text-[#c4b5fd66]">Translating…</p>
              </div>
            )}
            {stage === "playing" && (
              <>
                <video
                  ref={videoRef}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  className="w-full max-h-[200px] object-contain rounded-lg"
                  autoPlay
                  muted
                  playsInline
                  style={{ display: "none" }}
                />
                <img
                  ref={imgRef}
                  className="w-full max-h-[200px] object-contain rounded-lg"
                  alt="ISL sign"
                  style={{ display: "none" }}
                />
              </>
            )}
            {stage === "error" && (
              <div className="flex flex-col items-center gap-2 p-4">
                <p className="text-xs text-red-400">{errorMsg}</p>
                <button onClick={() => setStage("listen")} className="text-xs px-3 py-1 rounded-lg bg-red-400/15 border border-red-400/30 text-red-400 hover:bg-red-400/25">
                  {t("retry")}
                </button>
              </div>
            )}
          </div>

          {/* ISL Preview */}
          {islPreview && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#a78bfa14] rounded-lg border border-[#a78bfa26]">
              <span className="text-[9px] text-[#a78bfa80] font-bold tracking-wider">ISL</span>
              <span className="text-xs text-[#c4b5fd] font-semibold break-words">{islPreview}</span>
            </div>
          )}

          {/* Transcript */}
          {transcript && (
            <div className="text-xs text-center text-[#c4b5fd80] px-1">{transcript}</div>
          )}

          {/* Progress dots */}
          {stage === "playing" && gifQueue.length > 1 && (
            <div className="flex items-center justify-center gap-1">
              {gifQueue.slice(0, 20).map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i < gifIdx ? "bg-[#a78bfa80]" : i === gifIdx ? "bg-[#a78bfa] scale-125" : "bg-[#a78bfa33]"}`} />
              ))}
              <span className="text-[10px] text-[#c4b5fd66] ml-2">{gifIdx + 1}/{gifQueue.length}</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-[#a78bfa20] flex gap-2 items-center">
          <button
            onClick={toggleMic}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${micActive ? "bg-red-400/25 animate-pulse" : "bg-[#a78bfa26] hover:bg-[#a78bfa40]"}`}
          >
            {micActive ? <MicOff className="w-3.5 h-3.5 text-red-400" /> : <Mic className="w-3.5 h-3.5 text-[#c4b5fd]" />}
          </button>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={t("chatPlaceholder")}
            className="flex-1 bg-[#ffffff0f] border border-[#a78bfa33] rounded-xl px-3 py-1.5 text-xs text-[#e2d9f3] placeholder:text-[#c4b5fd4d] outline-none focus:border-[#a78bfa80] transition-colors"
          />
          {stage === "playing" ? (
            <button onClick={stopPlaying} className="w-8 h-8 rounded-full bg-red-400/25 flex items-center justify-center flex-shrink-0 hover:bg-red-400/40">
              <Square className="w-3.5 h-3.5 text-red-400" />
            </button>
          ) : (
            <button onClick={handleSend} className="w-8 h-8 rounded-full bg-[#a78bfa40] flex items-center justify-center flex-shrink-0 hover:bg-[#a78bfa66]">
              <Send className="w-3.5 h-3.5 text-[#c4b5fd]" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
