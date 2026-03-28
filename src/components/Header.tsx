import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MARKET_DATA } from "@/lib/newsEngine";
import { LANGUAGES } from "@/i18n";
import { useUser } from "@/context/UserContext";
import { ProfileModal } from "@/components/ProfileModal";

const PERSONAS_ICON: Record<string, string> = {
  Student: "🎓",
  Investor: "📈",
  Business: "💼",
  Homemaker: "🏠",
  Retiree: "🌿",
  Commoner: "👤",
};

export function Header() {
  const { t, i18n } = useTranslation();
  const { profile, setShowProfile } = useUser();

  // persist language
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) i18n.changeLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", i18n.language);
  }, [i18n.language]);

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="bg-header px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-black">
            <span className="text-primary">{t("appName")}</span>{" "}
            <span className="text-secondary">{t("appSuffix")}</span>
          </h1>

          <div className="flex items-center gap-3 text-xs">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="border px-2 py-0.5"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>

            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-live-pulse" />
              {t("live")}
            </span>

            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-1 border px-2 py-0.5 rounded"
            >
              <span>
                {profile?.persona
                  ? PERSONAS_ICON[profile.persona]
                  : "👤"}
              </span>
              <span className="hidden sm:inline">
                {profile?.name || "Profile"}
              </span>
            </button>
          </div>
        </div>

        {/* ticker */}
        <div className="bg-ticker overflow-hidden py-1.5">
          <div className="animate-ticker flex whitespace-nowrap">
            {[...MARKET_DATA, ...MARKET_DATA].map((item, i) => (
              <span key={i} className="mx-4 text-xs">
                <b>{item.symbol}</b> {item.value}
                <span className={item.up ? "text-green-400" : "text-red-400"}>
                  {item.change}
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <ProfileModal />
    </>
  );
}