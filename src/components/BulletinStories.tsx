import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

interface BulletinEntity {
  id: string;
  name: string;
  label: string;
  color: string;
  bg: string;
  emoji: string;
  stories: {
    headline: string;
    summary: string;
    imageQuery: string;
    imageUrl: string;
    category: string;
    timeAgo: string;
    link?: string;
  }[];
}

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY ?? "";

const ENTITIES: BulletinEntity[] = [
  {
    id: "rbi", name: "RBI", label: "RBI",
    color: "#185FA5", bg: "#E6F1FB", emoji: "🏦",
    stories: [
      { headline: "RBI Holds Repo Rate at 6.5%", summary: "The MPC voted unanimously to hold rates steady amid global uncertainty.", imageQuery: "reserve bank india", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", category: "Economy", timeAgo: "2h ago" },
      { headline: "RBI Issues New UPI Guidelines", summary: "New rules for UPI transaction limits and merchant onboarding kick in.", imageQuery: "digital payment india", imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80", category: "Finance", timeAgo: "5h ago" },
      { headline: "Forex Reserves Touch $640 Billion", summary: "India's foreign exchange reserves hit a new all-time high this week.", imageQuery: "india economy growth", imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80", category: "Economy", timeAgo: "1d ago" },
    ]
  },
  {
    id: "tata", name: "Tata", label: "Tata Group",
    color: "#0e4194", bg: "#e8eef9", emoji: "🏭",
    stories: [
      { headline: "Tata Motors EV Sales Hit 1 Lakh Units", summary: "Nexon EV leads the charge as Tata becomes India's EV market leader.", imageQuery: "tata electric vehicle", imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80", category: "Auto", timeAgo: "3h ago" },
      { headline: "TCS Q3 Net Profit Rises 8.2%", summary: "IT major beats Street estimates, hiring resumes after two-quarter pause.", imageQuery: "software technology office", imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80", category: "Technology", timeAgo: "6h ago" },
    ]
  },
  {
    id: "reliance", name: "Reliance", label: "Reliance",
    color: "#1a3c6e", bg: "#e8f0fb", emoji: "⚡",
    stories: [
      { headline: "Jio Rolls Out 5G in 50 New Cities", summary: "Reliance Jio expands 5G coverage to tier-2 cities ahead of BSNL.", imageQuery: "5g network tower", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", category: "Telecom", timeAgo: "1h ago" },
      { headline: "Reliance Retail Eyes $5B Funding", summary: "Global sovereign funds in talks for a stake in Reliance Retail ahead of IPO.", imageQuery: "retail shopping mall india", imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80", category: "Retail", timeAgo: "4h ago" },
    ]
  },
  {
    id: "sebi", name: "SEBI", label: "SEBI",
    color: "#2d6a4f", bg: "#d8f3dc", emoji: "⚖️",
    stories: [
      { headline: "SEBI Tightens F&O Lot Size Rules", summary: "Regulator raises minimum contract value to curb retail speculation in derivatives.", imageQuery: "stock market trading", imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", category: "Markets", timeAgo: "30m ago" },
      { headline: "SEBI Approves T+0 Settlement Pilot", summary: "Same-day settlement for equities begins pilot for 25 large-cap stocks.", imageQuery: "stock exchange india", imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80", category: "Markets", timeAgo: "8h ago" },
    ]
  },
  {
    id: "adani", name: "Adani", label: "Adani Grp",
    color: "#b5450b", bg: "#fce8dc", emoji: "🌞",
    stories: [
      { headline: "Adani Green Secures ₹18,000 Cr Solar Deal", summary: "The mega deal with SECI will add 4.5 GW of capacity across Rajasthan.", imageQuery: "solar panels india", imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80", category: "Renewables", timeAgo: "2h ago" },
      { headline: "Adani Ports Wins Sri Lanka Contract", summary: "Adani Ports wins a 35-year concession to develop Colombo's West Terminal.", imageQuery: "container port shipping", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", category: "Infrastructure", timeAgo: "1d ago" },
    ]
  },
  {
    id: "sensex", name: "Sensex", label: "Sensex",
    color: "#155724", bg: "#d4edda", emoji: "📈",
    stories: [
      { headline: "Sensex Rallies 620 Points on FII Buying", summary: "Foreign investors net bought ₹4,200 cr as global sentiment improved.", imageQuery: "stock market bull run", imageUrl: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=600&q=80", category: "Markets", timeAgo: "45m ago" },
    ]
  },
  {
    id: "infosys", name: "Infosys", label: "Infosys",
    color: "#007cc3", bg: "#e0f2fe", emoji: "💻",
    stories: [
      { headline: "Infosys Bags $2.3B AI Deal", summary: "Multi-year contract to modernise a global retailer's supply chain using GenAI.", imageQuery: "artificial intelligence technology", imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80", category: "Technology", timeAgo: "5h ago" },
    ]
  },
  {
    id: "govt", name: "Govt", label: "GoI",
    color: "#ff6700", bg: "#fff3e8", emoji: "🇮🇳",
    stories: [
      { headline: "Petrol Cut by ₹2/Litre Across India", summary: "Government announces fuel price relief as crude falls below $78/barrel.", imageQuery: "petrol pump india", imageUrl: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&q=80", category: "Energy", timeAgo: "6h ago" },
      { headline: "Budget 2026: Tax Slab Revised", summary: "Middle class gets relief as income up to ₹10L faces zero tax under new regime.", imageQuery: "india parliament budget", imageUrl: "https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=600&q=80", category: "Economy", timeAgo: "2d ago" },
    ]
  },
];

// ── Story Viewer (Instagram-style) ──────────────────────────────────────────

function StoryViewer({
  entity, onClose, onPrev, onNext, hasPrev, hasNext
}: {
  entity: BulletinEntity;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 6000;
  const TICK = 50;

  const story = entity.stories[storyIdx];
  const totalStories = entity.stories.length;

  const goNext = () => {
    if (storyIdx < totalStories - 1) {
      setStoryIdx(i => i + 1);
      setProgress(0);
    } else {
      if (hasNext) onNext();
      else onClose();
    }
  };

  const goPrev = () => {
    if (storyIdx > 0) {
      setStoryIdx(i => i - 1);
      setProgress(0);
    } else if (hasPrev) {
      onPrev();
    }
  };

  // Auto-advance
  useState(() => {
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          goNext();
          return 0;
        }
        return p + (TICK / DURATION) * 100;
      });
    }, TICK);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  });

  // Reset progress on story change
  useState(() => { setProgress(0); });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-sm bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "90vh" }}
      >
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3">
          {entity.stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < storyIdx ? "100%" : i === storyIdx ? `${progress}%` : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Entity header */}
        <div className="absolute top-7 left-0 right-0 z-20 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: entity.color }}
            >
              {entity.emoji}
            </div>
            <div>
              <p className="text-white text-xs font-bold">{entity.name}</p>
              <p className="text-white/60 text-[10px]">{story.timeAgo}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div className="relative aspect-[9/14]">
          <img
            src={story.imageUrl}
            alt={story.headline}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80`; }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />

          {/* Story content */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span
              className="inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide"
              style={{ background: entity.color, color: "#fff" }}
            >
              {story.category}
            </span>
            <h3 className="text-white text-base font-bold leading-snug mb-2">{story.headline}</h3>
            <p className="text-white/75 text-xs leading-relaxed mb-4">{story.summary}</p>
            {story.link && (
              <a
                href={story.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
                style={{ background: entity.color, color: "#fff" }}
              >
                Read Full Story <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Tap zones */}
          <button className="absolute left-0 top-0 bottom-0 w-1/3" onClick={goPrev} />
          <button className="absolute right-0 top-0 bottom-0 w-1/3" onClick={goNext} />
        </div>
      </motion.div>

      {/* Entity nav */}
      {hasPrev && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          onClick={e => { e.stopPropagation(); onPrev(); }}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
          onClick={e => { e.stopPropagation(); onNext(); }}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </motion.div>
  );
}

// ── Main BulletinStories Row ────────────────────────────────────────────────

export function BulletinStories() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const open = (idx: number) => {
    setActiveIdx(idx);
    setViewed(v => new Set([...v, ENTITIES[idx].id]));
  };

  const close = () => setActiveIdx(null);

  const goNext = () => {
    if (activeIdx !== null && activeIdx < ENTITIES.length - 1) {
      const next = activeIdx + 1;
      open(next);
    }
  };

  const goPrev = () => {
    if (activeIdx !== null && activeIdx > 0) {
      const prev = activeIdx - 1;
      open(prev);
    }
  };

  return (
    <>
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-headline font-bold text-foreground">Bulletin Stories</h2>
          <button className="text-xs font-semibold" style={{ color: "#E8192C" }}>
            See all →
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {ENTITIES.map((entity, idx) => {
            const isViewed = viewed.has(entity.id);
            return (
              <button
                key={entity.id}
                onClick={() => open(idx)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                {/* Ring */}
                <div
                  className="p-[2.5px] rounded-full"
                  style={{
                    background: isViewed
                      ? "#ccc"
                      : `conic-gradient(#E8192C, #ff6b35, #E8192C)`,
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white"
                    style={{ background: entity.bg, color: entity.color }}
                  >
                    {entity.emoji}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium max-w-[60px] truncate text-center">
                  {entity.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeIdx !== null && (
          <StoryViewer
            entity={ENTITIES[activeIdx]}
            onClose={close}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={activeIdx < ENTITIES.length - 1}
            hasPrev={activeIdx > 0}
          />
        )}
      </AnimatePresence>
    </>
  );
}
