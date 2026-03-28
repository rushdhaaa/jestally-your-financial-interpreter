import { useTranslation } from "react-i18next";
import { MARKET_DATA } from "@/lib/newsEngine";
import { NewsItem } from "@/types/news";

interface MarketSidebarProps {
  trendingNews: NewsItem[];
}

export function MarketSidebar({ trendingNews }: MarketSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="space-y-6">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-header text-header-foreground px-4 py-2">
          <h2 className="text-sm font-headline font-bold">{t("marketHeatmap")}</h2>
        </div>
        <div className="p-3 grid grid-cols-2 gap-2">
          {MARKET_DATA.map(item => (
            <div
              key={item.symbol}
              className={`rounded-md p-2.5 text-center ${
                item.up ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="text-[10px] font-semibold text-muted-foreground truncate">{item.symbol}</div>
              <div className="text-xs font-bold text-foreground">{item.value}</div>
              <div className={`text-[10px] font-bold ${item.up ? "text-green-600" : "text-primary"}`}>
                {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 py-2">
          <h2 className="text-sm font-headline font-bold">{t("trendingNow")}</h2>
        </div>
        <div className="divide-y divide-border">
          {trendingNews.slice(0, 5).map((item, i) => (
            <div key={item.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
              <div className="flex gap-2">
                <span className="text-lg font-headline font-black text-muted-foreground/30">{i + 1}</span>
                <div>
                  <p className="text-xs font-headline font-bold text-foreground leading-snug line-clamp-2">
                    {item.headline}
                  </p>
                  <span className="text-[10px] text-muted-foreground">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
