import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { NewsItem } from "@/types/news";

interface SocialDrawerProps {
  item: NewsItem | null;
  onClose: () => void;
}

const SOCIAL_PLATFORMS = [
  {
    id: "youtube",
    label: "YouTube",
    description: "Watch video coverage",
    color: "#FF0000",
    bg: "#fff0f0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    getUrl: (headline: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(headline + " news")}`,
  },
  {
    id: "twitter",
    label: "X / Twitter",
    description: "See live reactions",
    color: "#000000",
    bg: "#f5f5f5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.738l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (headline: string) => `https://twitter.com/search?q=${encodeURIComponent(headline)}&f=live`,
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Stories & reels",
    color: "#E1306C",
    bg: "#fff0f5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    getUrl: (headline: string) => `https://www.instagram.com/explore/tags/${encodeURIComponent(headline.split(" ")[0].toLowerCase())}/`,
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Community discussions",
    color: "#1877F2",
    bg: "#f0f5ff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    getUrl: (headline: string) => `https://www.facebook.com/search/posts?q=${encodeURIComponent(headline)}`,
  },
  {
    id: "copy",
    label: "Copy Link",
    description: "Share this story",
    color: "#6B7280",
    bg: "#f9fafb",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    getUrl: () => window.location.href,
    isCopy: true,
  },
];

export function SocialDrawer({ item, onClose }: SocialDrawerProps) {
  const handlePlatform = (platform: typeof SOCIAL_PLATFORMS[0]) => {
    if (platform.isCopy) {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      onClose();
      return;
    }
    const url = platform.getUrl(item?.headline ?? "");
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-[81] bg-card rounded-t-2xl shadow-2xl border-t border-border"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-5 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">View & Share on</p>
                  <p className="text-sm font-headline font-bold text-foreground line-clamp-2 leading-snug">
                    {item.headline}
                  </p>
                </div>
                <button onClick={onClose} className="ml-3 p-1.5 rounded-full hover:bg-muted transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-5">
                {SOCIAL_PLATFORMS.map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatform(platform)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-active:scale-90"
                      style={{ background: platform.bg, color: platform.color }}
                    >
                      {platform.icon}
                    </div>
                    <span className="text-[9px] text-muted-foreground font-medium leading-tight text-center">
                      {platform.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-[10px] text-muted-foreground text-center">
                  Opening links in new tab · Jestally is not affiliated with these platforms
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
