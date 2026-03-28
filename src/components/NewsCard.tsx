import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronRight, Share2 } from "lucide-react";
import { NewsItem } from "@/types/news";
import { useUser } from "@/context/UserContext";
import { getPersonalImpact } from "@/utils/personaLogic";
import { NewsDetailPanel } from "@/components/NewsDetailPanel";
import { SocialDrawer } from "@/components/SocialDrawer";

interface NewsCardProps {
  item: NewsItem;
  onSetActive: (item: NewsItem) => void;
  onPlayISL?: (item: NewsItem) => void;
}

const priorityStyles: Record<string, string> = {
  High: "bg-red-500/10 text-red-500 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Low: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function NewsCard({ item, onSetActive, onPlayISL }: NewsCardProps) {
  const { t, i18n } = useTranslation();
  const { profile } = useUser();

  const [showDetail, setShowDetail] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const lang = i18n.language as "en" | "hi" | "ta" | "te" | "bn";

  const personalImpact = useMemo(() => {
    return (
      item.impactSummaries?.[lang] ||
      item.impactSummaries?.["en"] ||
      getPersonalImpact(item.headline, profile)
    );
  }, [item, lang, profile]);

  const time = new Date(item.timestamp);

  return (
    <>
      <motion.article
        whileHover={{ y: -6 }}
        className="group bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
        onClick={() => onSetActive(item)}
      >
        {/* IMAGE */}
        <div className="relative h-[180px] overflow-hidden">
          <img
            src={`https://source.unsplash.com/600x400/?${item.category}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* CATEGORY */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs bg-white/90 text-black px-2 py-1 rounded-full font-semibold">
              {item.category}
            </span>
          </div>

          {/* PRIORITY */}
          <div className="absolute top-3 right-3">
            <span
              className={`text-xs px-2 py-1 rounded-full border ${priorityStyles[item.priority]}`}
            >
              {item.priority}
            </span>
          </div>

          {/* LIVE */}
          {item.isLive && (
            <div className="absolute top-3 left-3 text-xs bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
              ● {t("live")}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
            {item.headline}
          </h3>

          {/* PERSONAL IMPACT */}
          {personalImpact && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">👤 {t("personalImpact")}:</span>{" "}
                {personalImpact}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.summary}
          </p>

          {/* TAGS */}
          <div className="flex flex-wrap gap-2">
            {item.concepts.slice(0, 4).map((c) => (
              <span
                key={c}
                className="text-[10px] bg-muted px-2 py-1 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 pt-3 border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayISL?.(item);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-primary text-white hover:opacity-90"
            >
              {t("playISL")}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShare(true);
              }}
              className="text-xs px-3 py-1.5 rounded-full border flex items-center gap-1"
            >
              <Share2 className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetail(true);
              }}
              className="ml-auto text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70 flex items-center gap-1"
            >
              {t("readMore")} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.article>

      {showDetail && (
        <NewsDetailPanel item={item} onClose={() => setShowDetail(false)} />
      )}

      <SocialDrawer
        item={showShare ? item : null}
        onClose={() => setShowShare(false)}
      />
    </>
  );
}