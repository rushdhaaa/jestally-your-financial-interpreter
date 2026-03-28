export type Priority = "High" | "Medium" | "Low";

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  timestamp: Date;
  priority: Priority;
  category: string;
  isLive: boolean;
  impactSummaries: Record<string, string>;
  concepts: string[];
}

export const ISL_VOCABULARY = [
  "0","1","2","3","4","5","6","7","8","9",
  "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "Gold","Change","Up","Down","Work","World","Market","Bank","Price","Stock",
  "Money","Trade","Rise","Fall","Growth","Loss","Rate","Tax","Loan","Profit",
  "Thank You","Hello","Help","Good","Bad"
];
