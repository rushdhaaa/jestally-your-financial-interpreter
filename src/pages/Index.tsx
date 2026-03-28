import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { NewsCard } from "@/components/NewsCard";
import { MarketSidebar } from "@/components/MarketSidebar";
import { ChatBot } from "@/components/ChatBot";
import { JestallyPanel } from "@/components/JestallyPanel";
import { BulletinStories } from "@/components/BulletinStories";
import { IndustrySidebar } from "@/components/IndustrySidebar";
import { generateNewsItem } from "@/lib/newsEngine";
import { NewsItem } from "@/types/news";

const INDUSTRY_TO_CATEGORY: Record<string, string[]> = {
  featured:       [],
  auto:           ["Auto"],
  banking:        ["Banking", "Finance", "Economy"],
  cons:           ["Consumer", "Retail"],
  energy:         ["Energy", "Commodities"],
  renewables:     ["Renewables", "Energy"],
  industrial:     ["Industrial", "Infrastructure"],
  internet:       ["Internet", "Technology"],
  healthcare:     ["Healthcare"],
  jobs:           ["Jobs", "Employment"],
  retail:         ["Retail", "Consumer"],
  services:       ["Services"],
  rise:           ["Markets", "Economy"],
  media:          ["Media"],
  tech:           ["Technology"],
  telecom:        ["Telecom"],
  transportation: ["Transportation", "Auto"],
};

const Index = () => {
  const { t, i18n } = useTranslation();
  const [activeIndustry, setActiveIndustry] = useState("featured");

  const makeNews = useCallback((count: number): NewsItem[] => {
    const items: NewsItem[] = [];
    for (let i = 0; i < count; i++) items.push(generateNewsItem(i18n.language));
    return items;
  }, [i18n.language]);

  const [news, setNews] = useState<NewsItem[]>(() => makeNews(12));
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);
  const [islPanelOpen, setIslPanelOpen] = useState(false);
  const [islPanelText, setIslPanelText] = useState("");

  useEffect(() => {
    setNews(makeNews(12));
    setActiveNews(null);
  }, [i18n.language, makeNews]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNews(prev => {
        const next = [generateNewsItem(i18n.language), ...prev];
        return next.slice(0, 25);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [i18n.language]);

  const handleSetActive = useCallback((item: NewsItem) => setActiveNews(item), []);
  const handlePlayISL = useCallback((item: NewsItem) => {
    setIslPanelText(item.concepts.join(" "));
    setIslPanelOpen(true);
  }, []);
  const handleOpenISLFromChat = useCallback((text: string) => {
    setIslPanelText(text);
    setIslPanelOpen(true);
  }, []);

  // Filter news by selected industry
  const filteredNews = activeIndustry === "featured"
    ? news
    : news.filter(item => {
        const cats = INDUSTRY_TO_CATEGORY[activeIndustry] ?? [];
        return cats.some(c => item.category.toLowerCase().includes(c.toLowerCase()));
      });

  // If filter returns too few items show all (fallback)
  const displayNews = filteredNews.length >= 2 ? filteredNews : news;

  // Hero = first High priority, rest = remaining
  const heroItem = displayNews.find(n => n.priority === "High") ?? displayNews[0];
  const restNews = displayNews.filter(n => n.id !== heroItem?.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Bulletin Stories row — full width below header */}
      <BulletinStories />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 min-h-0">

        {/* Industry Sidebar — hidden on mobile */}
        <div className="hidden lg:flex" style={{ width: "196px", flexShrink: 0 }}>
          <div className="sticky top-0 h-screen overflow-y-auto w-full" style={{ scrollbarWidth: "none" }}>
            <IndustrySidebar activeIndustry={activeIndustry} onSelect={setActiveIndustry} />
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Feed — 2/3 width */}
              <div className="lg:col-span-2 space-y-0">

                {/* Section heading */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-headline font-bold text-lg text-foreground flex items-center gap-2">
                    <span
                      className="w-3 h-5 rounded-sm inline-block"
                      style={{ background: "#E8192C" }}
                    />
                    {activeIndustry === "featured" ? t("trendingNow") : (
                      activeIndustry.charAt(0).toUpperCase() + activeIndustry.slice(1)
                    )}
                  </h2>
                  <span className="text-xs text-muted-foreground font-body">
                    {displayNews.length} {t("stories", { defaultValue: "stories" })}
                  </span>
                </div>

                {/* Hero card — first item, full width */}
                {heroItem && (
                  <div className="mb-4">
                    <NewsCard
                      key={heroItem.id}
                      item={heroItem}
                      onSetActive={handleSetActive}
                      onPlayISL={handlePlayISL}
                    />
                  </div>
                )}

                {/* Divider with section label */}
                {restNews.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">More Stories</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}

                {/* Rest of news cards */}
                <div className="space-y-4">
                  {restNews.map(item => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      onSetActive={handleSetActive}
                      onPlayISL={handlePlayISL}
                    />
                  ))}
                </div>

              </div>

              {/* Right sidebar — 1/3 width */}
              <div className="hidden lg:block">
                <div className="sticky top-4">
                  <MarketSidebar trendingNews={news.filter(n => n.priority === "High")} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <JestallyPanel
        isOpen={islPanelOpen}
        onClose={() => setIslPanelOpen(false)}
        initialText={islPanelText}
      />

      <ChatBot activeNews={activeNews} onOpenISLPanel={handleOpenISLFromChat} />
    </div>
  );
};

export default Index;
