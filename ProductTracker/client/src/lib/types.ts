import { 
  Business, 
  Decision, 
  Event, 
  Competitor, 
  MentorAdvice, 
  FinancialRecord 
} from "@shared/schema";

export type BusinessType = "tech" | "ecommerce" | "service" | "manufacturing";

export type FundingType = "bootstrapped" | "angel" | "seed" | "seriesA" | "seriesB";

export type DecisionType = "marketing" | "operations" | "hr" | "product" | "finance";

export type UrgencyLevel = "urgent" | "normal" | "low";

export type EventType = "market" | "internal" | "competitor" | "crisis";

export type MentorAdviceType = "financial" | "marketing" | "product" | "hr" | "general";

export type BusinessMetrics = {
  cash: number;
  revenue: number;
  valuation: number;
  burnRate: number;
  runway: number;
  mrrGrowth: number;
  customers: number;
  revenueMultiple: number;
  marketShare: number;
};

export type BusinessArea = {
  name: string;
  icon: string;
  color: string;
  metrics: Record<string, string | number>;
  progress?: number;
};

export type DecisionOption = {
  id: number;
  label: string;
  description: string;
  metrics: {
    cost: number;
    timeframe: string;
    roi: string;
    cac?: number;
    other?: Record<string, any>;
  };
};

export type DecisionConsequence = {
  optionId: number;
  effects: {
    cash?: number;
    revenue?: number;
    customers?: number;
    marketShare?: number;
    employees?: number;
    valuation?: number;
    productProgress?: number;
    other?: Record<string, any>;
  };
  description: string;
};

export type ChartData = {
  name: string;
  revenue?: number;
  expenses?: number;
  profit?: number;
  customers?: number;
};

export type TimeControls = {
  isPaused: boolean;
  speed: 'normal' | 'fast';
}

export interface GameState {
  user: {
    id: number;
    displayName: string;
    role: string;
  } | null;
  business: Business | null;
  decisions: Decision[];
  events: Event[];
  competitors: Competitor[];
  mentorAdvice: MentorAdvice[];
  financials: FinancialRecord[];
  metrics: BusinessMetrics | null;
  selectedDecision: Decision | null;
  timeControls: TimeControls;
  showBusinessSetup: boolean;
  showDecisionModal: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
