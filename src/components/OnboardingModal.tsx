// src/components/OnboardingModal.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { type Persona, type UserProfile, useUser } from "@/context/UserContext";

const PERSONAS: { value: Persona; icon: string; label: string; desc: string }[] = [
  { value: "Student",   icon: "🎓", label: "Student",       desc: "College / School student" },
  { value: "Investor",  icon: "📈", label: "Investor",      desc: "Active in markets & finance" },
  { value: "Business",  icon: "💼", label: "Business Owner",desc: "Running own business or shop" },
  { value: "Homemaker", icon: "🏠", label: "Homemaker",     desc: "Managing household finances" },
  { value: "Retiree",   icon: "🌿", label: "Retiree",       desc: "Retired professional" },
  { value: "Commoner",  icon: "👤", label: "Commoner",      desc: "General public" },
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

const STEPS = ["Who are you?", "Loans & Business", "Investments", "Your Income", "All Set!"];

type Step = 1 | 2 | 3 | 4 | 5;

// ── small reusable toggle row ─────────────────────────────────────────────────
function ToggleRow({
  icon, label, desc, value, onChange,
}: {
  icon: string; label: string; desc?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
      value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
    }`}>
      <div>
        <span className="text-sm font-semibold text-foreground block">{icon} {label}</span>
        {desc && <span className="text-[10px] text-muted-foreground">{desc}</span>}
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 accent-primary"
      />
    </label>
  );
}

// ── progress dots ─────────────────────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`rounded-full transition-all duration-300 ${
          i < current ? "w-2 h-2 bg-primary" : i === current ? "w-3 h-2 bg-primary/60" : "w-2 h-2 bg-muted-foreground/30"
        }`} />
      ))}
    </div>
  );
}

export function OnboardingModal() {
  const { t } = useTranslation();
  const { showOnboarding, setProfile, dismissOnboarding } = useUser();

  const [step, setStep] = useState<Step>(1);
  const [name, setName] = useState("");
  const [persona, setPersona] = useState<Persona | null>(null);
  const [hasHomeLoan, setHasHomeLoan] = useState(false);
  const [loanAmount, setLoanAmount] = useState<string | null>(null);
  const [hasBusiness, setHasBusiness] = useState(false);
  const [investsInStocks, setInvestsInStocks] = useState(false);
  const [hasMutualFunds, setHasMutualFunds] = useState(false);
  const [hasFixedDeposits, setHasFixedDeposits] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [annualIncome, setAnnualIncome] = useState<string | null>(null);

  const canAdvance = (): boolean => {
    if (step === 1) return !!persona;
    if (step === 3) return investsInStocks !== undefined;
    if (step === 4) return !!annualIncome;
    return true;
  };

  const handleFinish = () => {
    if (!persona) return;
    const profile: UserProfile = {
      persona,
      name: name.trim() || "User",
      hasHomeLoan,
      homeLoanAmountLakhs: hasHomeLoan && loanAmount
        ? parseInt(loanAmount.replace(/[^\d]/g, "").slice(0, 4)) || 0
        : 0,
      investsInStocks,
      hasMutualFunds,
      hasBusiness,
      hasFixedDeposits,
      hasInsurance,
      annualIncome: annualIncome ?? INCOME_BRACKETS[0],
    };
    setProfile(profile);
  };

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="ob-bg"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          key="ob-card"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* ── Header ── */}
          <div className="bg-header text-header-foreground px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤟</span>
                <h2 className="text-lg font-headline font-black">{t("onboardingTitle", { defaultValue: "Jestally Insight" })}</h2>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-full">
                {step}/{STEPS.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {STEPS[step - 1]}
            </p>
            {/* progress bar */}
            <div className="w-full bg-muted/30 rounded-full h-1">
              <motion.div
                className="bg-primary h-1 rounded-full"
                animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Persona + Name ── */}
              {step === 1 && (
                <motion.div key="s1"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                    {t("iAmA", { defaultValue: "I am a…" })}
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {PERSONAS.map(p => (
                      <button key={p.value} onClick={() => setPersona(p.value)}
                        className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${
                          persona === p.value
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-muted/40 hover:border-primary/40"
                        }`}>
                        <span className="text-2xl block mb-1">{p.icon}</span>
                        <span className="text-sm font-headline font-bold text-foreground block">{p.label}</span>
                        <span className="text-[10px] text-muted-foreground leading-relaxed">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mb-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                      Your Name <span className="normal-case font-normal">(optional)</span>
                    </p>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priya, Rahul…"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:bg-card transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Loans & Business ── */}
              {step === 2 && (
                <motion.div key="s2"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Loans &amp; Business
                  </p>
                  <div className="space-y-3">
                    <ToggleRow icon="🏡" label="Home Loan" desc="Do you have an active home loan?" value={hasHomeLoan} onChange={setHasHomeLoan} />
                    {hasHomeLoan && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 mt-1 pl-1">
                          Loan amount
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {LOAN_AMOUNTS.map(l => (
                            <button key={l} onClick={() => setLoanAmount(l)}
                              className={`text-left text-xs px-4 py-2.5 rounded-xl border-2 transition-all ${
                                loanAmount === l
                                  ? "border-primary bg-primary/5 text-primary font-semibold"
                                  : "border-border text-muted-foreground hover:border-primary/40"
                              }`}>
                              ₹ {l}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <ToggleRow icon="🏪" label="Own Business / Shop" desc="Self-employed or running a business?" value={hasBusiness} onChange={setHasBusiness} />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Investments ── */}
              {step === 3 && (
                <motion.div key="s3"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Your Investments
                  </p>
                  <div className="space-y-3">
                    <ToggleRow icon="📈" label="Stocks / Shares" desc="Direct equity investments" value={investsInStocks} onChange={setInvestsInStocks} />
                    <ToggleRow icon="💰" label="Mutual Funds / SIPs" desc="MF investments or monthly SIPs" value={hasMutualFunds} onChange={setHasMutualFunds} />
                    <ToggleRow icon="🏦" label="Fixed Deposits (FD)" desc="Bank FDs or recurring deposits" value={hasFixedDeposits} onChange={setHasFixedDeposits} />
                    <ToggleRow icon="🛡️" label="Life / Health Insurance" desc="LIC, term plan, health cover" value={hasInsurance} onChange={setHasInsurance} />
                  </div>
                </motion.div>
              )}

              {/* ── Step 4: Income ── */}
              {step === 4 && (
                <motion.div key="s4"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
                    Annual Income
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {INCOME_BRACKETS.map(b => (
                      <button key={b} onClick={() => setAnnualIncome(b)}
                        className={`text-left text-sm px-4 py-3 rounded-xl border-2 transition-all ${
                          annualIncome === b
                            ? "border-primary bg-primary/5 text-primary font-bold"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                        }`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Step 5: Done ── */}
              {step === 5 && (
                <motion.div key="s5"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-4 space-y-4">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                    ✅
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-headline font-bold text-foreground">
                      {name ? `Welcome, ${name}!` : "You're all set!"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      News is now personalised for you as a{" "}
                      <span className="text-primary font-bold">{persona}</span>.
                    </p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4 w-full text-left space-y-1.5 text-xs text-muted-foreground">
                    {[
                      ["🏡 Home Loan", hasHomeLoan ? "Yes" : "No"],
                      ["📈 Stocks", investsInStocks ? "Yes" : "No"],
                      ["💰 Mutual Funds", hasMutualFunds ? "Yes" : "No"],
                      ["🏪 Business", hasBusiness ? "Yes" : "No"],
                      ["💵 Income", annualIncome ?? "—"],
                    ].map(([label, val]) => (
                      <p key={label as string}>{label}: <span className="text-foreground font-medium">{val}</span></p>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Footer buttons ── */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <div className="flex gap-2">
              {step > 1 && step < 5 && (
                <button onClick={() => setStep(s => (s - 1) as Step)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
                  ← Back
                </button>
              )}
              {step < 4 && (
                <button
                  disabled={!canAdvance()}
                  onClick={() => setStep(s => (s + 1) as Step)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold font-headline disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                  Continue →
                </button>
              )}
              {step === 4 && (
                <button
                  disabled={!canAdvance()}
                  onClick={() => setStep(5)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold font-headline disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors">
                  Review & Finish
                </button>
              )}
              {step === 5 && (
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-base font-bold font-headline hover:bg-primary/90 transition-colors">
                  Start Reading →
                </button>
              )}
            </div>
            {step === 1 && (
              <button onClick={dismissOnboarding}
                className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                {t("skipNow", { defaultValue: "Skip for now" })}
              </button>
            )}
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}