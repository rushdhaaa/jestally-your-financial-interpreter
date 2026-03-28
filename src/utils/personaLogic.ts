import type { UserProfile } from "@/context/UserContext";

type Persona = UserProfile["persona"];

function hit(text: string, keywords: string[]) {
  const l = text.toLowerCase();
  return keywords.some(k => l.includes(k));
}

const KW = {
  rate: ["rbi", "repo", "interest rate", "monetary policy", "rate hike", "rate cut", "emi", "loan", "credit"],
  gold: ["gold", "silver", "precious metal", "jewellery", "jewelry", "bullion"],
  market: ["nifty", "sensex", "stock", "equity", "market", "bse", "nse", "shares", "portfolio", "mutual fund", "ipo"],
  inflation: ["inflation", "cpi", "wpi", "price rise", "food price", "fuel", "petrol", "diesel"],
  tax: ["tax", "income tax", "gst", "tds", "budget", "fiscal", "itr"],
  edu: ["education", "university", "college", "exam", "scholarship", "fee", "student", "neet", "jee"],
  health: ["health", "hospital", "medicine", "drug", "pharma", "insurance"],
  realty: ["property", "real estate", "home", "house", "flat", "housing"],
};

export function getPersonalImpact(headline: string, profile: UserProfile | null): string | null {
  if (!profile) return null;
  const { persona, hasHomeLoan, investsInStocks } = profile;

  if (hit(headline, KW.rate)) {
    if (hasHomeLoan) return headline.match(/hike|rise|increase/i)
      ? "Your home loan EMI is likely to increase — consider reviewing your repayment plan."
      : "A rate change may affect your home loan EMI — check your bank's revised rates.";
    if (persona === "Student") return "Interest rate changes may affect your education loan costs.";
    if (persona === "Business") return "Changing rates affect your business credit and working capital costs.";
    if (persona === "Retiree") return "Rate changes affect FD returns — compare rates before renewing.";
    if (persona === "Investor") return "Rate changes affect bond yields and equity valuations — review your portfolio.";
  }

  if (hit(headline, KW.gold)) {
    if (persona === "Homemaker") return "Gold price movement affects the value of your jewellery and household savings.";
    if (persona === "Retiree") return "Gold price swings impact your savings-in-gold — review whether to hold or redeem.";
    if (investsInStocks) return "Gold trends often move opposite to equities — watch for portfolio rebalancing signals.";
  }

  if (hit(headline, KW.market)) {
    if (investsInStocks) return headline.match(/crash|fall|slump|down/i)
      ? "Market volatility may impact your portfolio — avoid panic selling and review your risk tolerance."
      : "Market movement may affect your equity holdings — monitor for profit-booking opportunities.";
    if (persona === "Business") return "Market sentiment affects business valuations and fundraising prospects.";
    if (persona === "Retiree") return "Market swings may affect your retirement corpus in equities — consult your advisor.";
  }

  if (hit(headline, KW.inflation)) {
    if (persona === "Student") return "Rising prices mean canteen, hostel, and daily living costs may increase — budget carefully.";
    if (persona === "Homemaker") return "Inflation hits your grocery and household budget directly — prioritise essentials.";
    if (persona === "Business") return "Rising input costs may squeeze margins — review pricing and supplier contracts.";
    if (persona === "Retiree") return "Inflation erodes fixed income purchasing power — ensure returns outpace inflation.";
  }

  if (hit(headline, KW.tax)) {
    if (persona === "Business") return "Tax changes affect compliance costs, GST filings, and net profitability.";
    if (persona === "Student") return "New tax rules may affect education loan deductions under Section 80E.";
    if (persona === "Retiree") return "Tax changes may affect how pension, FD interest, or savings are taxed.";
  }

  if (hit(headline, KW.edu)) {
    if (persona === "Student") return "This education news directly concerns you — stay updated on policy changes.";
    if (persona === "Homemaker") return "Education policy changes may affect your children's schooling costs.";
  }

  if (hit(headline, KW.health)) {
    if (persona === "Retiree") return "Health policy changes are especially relevant — check if your insurance is impacted.";
    if (persona === "Homemaker") return "Medicine and insurance changes directly affect your family's healthcare costs.";
  }

  if (hit(headline, KW.realty)) {
    if (hasHomeLoan) return "Property market shifts can affect your home's value and refinancing options.";
    if (persona === "Business") return "Property market changes impact commercial space costs and business asset values.";
  }

  const fallbacks: Record<Persona, string> = {
    Student: "Staying informed about economic events helps you make smarter financial decisions.",
    Business: "Monitor this development to anticipate market and regulatory changes early.",
    Homemaker: "Tracking economic news helps you manage your household budget more effectively.",
    Retiree: "Economic developments can affect your pension and retirement corpus.",
    Investor: "This development may signal portfolio risks or opportunities worth tracking.",
  };
  return fallbacks[persona];
}
