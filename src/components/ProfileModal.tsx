// src/components/ProfileModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type Persona, type UserProfile, useUser } from "@/context/UserContext";

const PERSONAS: { value: Persona; icon: string; label: string }[] = [
  { value: "Student",   icon: "🎓", label: "Student" },
  { value: "Investor",  icon: "📈", label: "Investor" },
  { value: "Business",  icon: "💼", label: "Business Owner" },
  { value: "Homemaker", icon: "🏠", label: "Homemaker" },
  { value: "Retiree",   icon: "🌿", label: "Retiree" },
  { value: "Commoner",  icon: "👤", label: "Commoner" },
];

const INCOME_BRACKETS = [
  "Below ₹2.5 Lakh / year",
  "₹2.5L – ₹5L / year",
  "₹5L – ₹10L / year",
  "₹10L – ₹25L / year",
  "₹25L – ₹50L / year",
  "Above ₹50L / year",
];

const LOAN_AMOUNTS = [
  "Under ₹10 Lakh",
  "₹10L – ₹25L",
  "₹25L – ₹50L",
  "₹50L – ₹1 Crore",
  "Above ₹1 Crore",
];

function ToggleRow({
  icon, label, value, onChange,
}: {
  icon: string; label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
      value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
    }`}>
      <span className="text-sm font-semibold text-foreground">{icon} {label}</span>
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} className="w-4 h-4 accent-primary" />
    </label>
  );
}

export function ProfileModal() {
  const { profile, setProfile, showProfile, setShowProfile } = useUser();

  const [name, setName] = useState("");
  const [persona, setPersona] = useState<Persona>("Student");
  const [hasHomeLoan, setHasHomeLoan] = useState(false);
  const [loanAmount, setLoanAmount] = useState<string>(LOAN_AMOUNTS[0]);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [investsInStocks, setInvestsInStocks] = useState(false);
  const [hasMutualFunds, setHasMutualFunds] = useState(false);
  const [hasFixedDeposits, setHasFixedDeposits] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(INCOME_BRACKETS[0]);
  const [saved, setSaved] = useState(false);

  // Populate from existing profile whenever modal opens
  useEffect(() => {
    if (profile && showProfile) {
      setName(profile.name ?? "");
      setPersona(profile.persona);
      setHasHomeLoan(profile.hasHomeLoan);
      setLoanAmount(LOAN_AMOUNTS[0]);
      setHasBusiness(profile.hasBusiness ?? false);
      setInvestsInStocks(profile.investsInStocks);
      setHasMutualFunds(profile.hasMutualFunds ?? false);
      setHasFixedDeposits(profile.hasFixedDeposits ?? false);
      setHasInsurance(profile.hasInsurance ?? false);
      setAnnualIncome(profile.annualIncome ?? INCOME_BRACKETS[0]);
      setSaved(false);
    }
  }, [profile, showProfile]);

  const handleSave = () => {
    const updated: UserProfile = {
      persona,
      name: name.trim() || "User",
      hasHomeLoan,
      homeLoanAmountLakhs: hasHomeLoan
        ? parseInt(loanAmount.replace(/[^\d]/g, "").slice(0, 4)) || 0
        : 0,
      investsInStocks,
      hasMutualFunds,
      hasBusiness,
      hasFixedDeposits,
      hasInsurance,
      annualIncome,
    };
    setProfile(updated);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowProfile(false); }, 1300);
  };

  if (!showProfile) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="pm-bg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => setShowProfile(false)}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          key="pm-card"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-header text-header-foreground px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-headline font-black">My Profile</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Edit your details anytime</p>
            </div>
            <button
              onClick={() => setShowProfile(false)}
              className="text-muted-foreground hover:text-foreground transition-colors text-lg leading-none">
              ✕
            </button>
          </div>

          {/* Scrollable body */}
          <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">

            {/* Name */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Your Name</p>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Priya, Rahul…"
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-card transition-all"
              />
            </div>

            {/* Persona */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">I am a…</p>
              <div className="grid grid-cols-3 gap-2">
                {PERSONAS.map(p => (
                  <button key={p.value} onClick={() => setPersona(p.value)}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all ${
                      persona === p.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-muted/40 hover:border-primary/40"
                    }`}>
                    <span className="text-xl">{p.icon}</span>
                    <span className={`text-[10px] font-bold leading-tight text-center ${persona === p.value ? "text-primary" : "text-foreground"}`}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loans */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Loans &amp; Business</p>
              <div className="space-y-2">
                <ToggleRow icon="🏡" label="Home Loan" value={hasHomeLoan} onChange={setHasHomeLoan} />
                {hasHomeLoan && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden pl-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">Loan amount</p>
                    <div className="grid grid-cols-1 gap-1">
                      {LOAN_AMOUNTS.map(l => (
                        <button key={l} onClick={() => setLoanAmount(l)}
                          className={`text-left text-xs px-3 py-2 rounded-lg border-2 transition-all ${
                            loanAmount === l ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-muted-foreground hover:border-primary/30"
                          }`}>
                          ₹ {l}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                <ToggleRow icon="🏪" label="Own Business / Shop" value={hasBusiness} onChange={setHasBusiness} />
              </div>
            </div>

            {/* Investments */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Investments</p>
              <div className="space-y-2">
                <ToggleRow icon="📈" label="Stocks / Shares" value={investsInStocks} onChange={setInvestsInStocks} />
                <ToggleRow icon="💰" label="Mutual Funds / SIPs" value={hasMutualFunds} onChange={setHasMutualFunds} />
                <ToggleRow icon="🏦" label="Fixed Deposits (FD)" value={hasFixedDeposits} onChange={setHasFixedDeposits} />
                <ToggleRow icon="🛡️" label="Life / Health Insurance" value={hasInsurance} onChange={setHasInsurance} />
              </div>
            </div>

            {/* Income */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Annual Income</p>
              <div className="grid grid-cols-1 gap-1.5">
                {INCOME_BRACKETS.map(b => (
                  <button key={b} onClick={() => setAnnualIncome(b)}
                    className={`text-left text-sm px-4 py-2.5 rounded-xl border-2 transition-all ${
                      annualIncome === b
                        ? "border-primary bg-primary/5 text-primary font-bold"
                        : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                    }`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Save footer */}
          <div className="px-6 pb-6 pt-3 border-t border-border">
            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-xl text-sm font-bold font-headline transition-all ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}>
              {saved ? "✓ Saved!" : "💾 Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}