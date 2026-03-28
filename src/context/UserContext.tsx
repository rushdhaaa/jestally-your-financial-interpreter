// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Persona = "Student" | "Business" | "Homemaker" | "Retiree" | "Investor" | "Commoner";

export interface UserProfile {
  persona: Persona;
  name: string;
  // ── existing fields (unchanged — all existing reads still work) ──
  hasHomeLoan: boolean;
  investsInStocks: boolean;
  // ── new fields ──
  homeLoanAmountLakhs: number;
  hasMutualFunds: boolean;
  hasBusiness: boolean;
  hasFixedDeposits: boolean;
  hasInsurance: boolean;
  annualIncome: string;
}

interface UserContextValue {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  showOnboarding: boolean;
  dismissOnboarding: () => void;
  // ── new: controls ProfileModal ──
  showProfile: boolean;
  setShowProfile: (v: boolean) => void;
}

const UserContext = createContext<UserContextValue>({
  profile: null,
  setProfile: () => {},
  showOnboarding: false,
  dismissOnboarding: () => {},
  showProfile: false,
  setShowProfile: () => {},
});

const KEY = "jestally_user_profile";

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) setProfileState(JSON.parse(s));
      else setShowOnboarding(true);
    } catch {
      setShowOnboarding(true);
    }
  }, []);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
    setShowOnboarding(false);
  };

  return (
    <UserContext.Provider value={{
      profile, setProfile,
      showOnboarding, dismissOnboarding: () => setShowOnboarding(false),
      showProfile, setShowProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() { return useContext(UserContext); }