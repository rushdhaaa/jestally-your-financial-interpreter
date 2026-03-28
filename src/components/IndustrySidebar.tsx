import { useState } from "react";

const INDUSTRIES = [
  { id: "featured", label: "★ Featured", icon: "⭐" },
  { id: "auto", label: "Auto", icon: "🚗" },
  { id: "banking", label: "Banking / Finance", icon: "🏦" },
  { id: "cons", label: "Cons. Products", icon: "🛒" },
  { id: "energy", label: "Energy", icon: "⚡" },
  { id: "renewables", label: "Renewables", icon: "☀️" },
  { id: "industrial", label: "Ind'l Goods / Svs", icon: "🏭" },
  { id: "internet", label: "Internet", icon: "🌐" },
  { id: "healthcare", label: "Healthcare", icon: "💊" },
  { id: "jobs", label: "Jobs", icon: "💼" },
  { id: "retail", label: "Retail", icon: "🛍️" },
  { id: "services", label: "Services", icon: "🤝" },
  { id: "rise", label: "Rise", icon: "📈" },
  { id: "media", label: "Media", icon: "📺" },
  { id: "tech", label: "Tech", icon: "💻" },
  { id: "telecom", label: "Telecom", icon: "📡" },
  { id: "transportation", label: "Transportation", icon: "🚂" },
];

interface IndustrySidebarProps {
  activeIndustry: string;
  onSelect: (id: string) => void;
}

export function IndustrySidebar({ activeIndustry, onSelect }: IndustrySidebarProps) {
  return (
    <aside
      className="bg-card border-r border-border h-full overflow-y-auto"
      style={{ width: "196px", flexShrink: 0, scrollbarWidth: "none" }}
    >
      <div
        className="px-4 py-3 border-b border-border sticky top-0 bg-card z-10"
        style={{ color: "#E8192C" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest">News by Industry</p>
      </div>

      <nav className="py-1">
        {INDUSTRIES.map(ind => {
          const isActive = activeIndustry === ind.id;
          return (
            <button
              key={ind.id}
              onClick={() => onSelect(ind.id)}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-left transition-all text-xs font-medium"
              style={{
                borderLeft: isActive ? "3px solid #E8192C" : "3px solid transparent",
                background: isActive ? "#fff0f0" : "transparent",
                color: isActive ? "#E8192C" : "var(--color-text-secondary)",
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <span style={{ fontSize: "13px" }}>{ind.icon}</span>
              <span className="leading-tight">{ind.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
