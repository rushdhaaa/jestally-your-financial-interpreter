interface RegionalSummariesProps {
  summaries: Record<string, string>;
}

const LANG_LABELS: Record<string, string> = {
  hi: "🇮🇳 Hindi",
  ta: "🇮🇳 Tamil",
  te: "🇮🇳 Telugu",
  bn: "🇮🇳 Bengali",
};

export function RegionalSummaries({ summaries }: RegionalSummariesProps) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-foreground font-body mb-2">Regional Impact Summaries</h4>
      <div className="space-y-2">
        {Object.entries(summaries).map(([lang, text]) => (
          <div key={lang} className="flex gap-2 items-start">
            <span className="text-[10px] font-semibold text-muted-foreground min-w-[72px] shrink-0">
              {LANG_LABELS[lang] || lang}
            </span>
            <p className="text-xs text-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
