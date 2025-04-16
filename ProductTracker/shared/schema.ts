import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Business types and industries
export const businessTypes = ["Tech", "E-commerce", "Service", "Manufacturing"] as const;
export type BusinessType = typeof businessTypes[number];

export const fundingTypes = ["Bootstrap", "Seed", "Series A", "Bank Loan", "Strategic Partnership"] as const;
export type FundingType = typeof fundingTypes[number];

// Company schema
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull().$type<BusinessType>(),
  fundingType: text("funding_type").notNull().$type<FundingType>(),
  fundingAmount: doublePrecision("funding_amount").notNull(),
  valuation: doublePrecision("valuation").notNull(),
  cash: doublePrecision("cash").notNull(),
  revenue: doublePrecision("revenue").notNull(),
  expenses: doublePrecision("expenses").notNull(),
  marketShare: doublePrecision("market_share").notNull(),
  employees: integer("employees").notNull(),
  currentQuarter: integer("current_quarter").notNull(),
  currentYear: integer("current_year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

// Decision types
export const decisionTypes = ["marketing", "hiring", "product", "funding"] as const;
export type DecisionType = typeof decisionTypes[number];

// Metrics schema
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  quarter: integer("quarter").notNull(),
  year: integer("year").notNull(),
  revenue: doublePrecision("revenue").notNull(),
  expenses: doublePrecision("expenses").notNull(),
  profit: doublePrecision("profit").notNull(),
  cash: doublePrecision("cash").notNull(),
  marketShare: doublePrecision("market_share").notNull(),
  valuation: doublePrecision("valuation").notNull(),
  employees: integer("employees").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
  createdAt: true,
});

// Decision schema
export const decisions = pgTable("decisions", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  quarter: integer("quarter").notNull(),
  year: integer("year").notNull(),
  type: text("type").notNull().$type<DecisionType>(),
  decision: text("decision").notNull(),
  cost: doublePrecision("cost").notNull(),
  impact: jsonb("impact").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDecisionSchema = createInsertSchema(decisions).omit({
  id: true,
  createdAt: true,
});

// Market events
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  quarter: integer("quarter").notNull(),
  year: integer("year").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  impact: jsonb("impact").notNull(),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  resolved: true,
});

// Competitors
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  name: text("name").notNull(),
  type: text("type").notNull().$type<BusinessType>(),
  marketShare: doublePrecision("market_share").notNull(),
  strength: integer("strength").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Metrics = typeof metrics.$inferSelect;
export type InsertMetrics = z.infer<typeof insertMetricsSchema>;

export type Decision = typeof decisions.$inferSelect;
export type InsertDecision = z.infer<typeof insertDecisionSchema>;

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;

export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;

// Decision options
export const marketingOptions = [
  { id: "content", name: "Content Marketing", cost: 25000 },
  { id: "paid", name: "Paid Advertising", cost: 40000 },
  { id: "influencer", name: "Influencer Partnerships", cost: 35000 },
  { id: "conference", name: "Conference Sponsorships", cost: 50000 },
];

export const hiringOptions = [
  { id: "engineers", name: "Engineers", roles: 2, cost: 220000 },
  { id: "sales", name: "Sales Team", roles: 3, cost: 240000 },
  { id: "support", name: "Customer Support", roles: 2, cost: 110000 },
  { id: "none", name: "No hiring this quarter", roles: 0, cost: 0 },
];

export const productOptions = [
  { id: "features", name: "New Features", cost: 80000 },
  { id: "performance", name: "Performance Improvements", cost: 60000 },
  { id: "mobile", name: "Mobile App Development", cost: 100000 },
  { id: "enterprise", name: "Enterprise Features", cost: 75000 },
];

export const fundingOptions = [
  { id: "series_a", name: "Series A Funding Round", equity: 15, amount: 2000000 },
  { id: "loan", name: "Bank Loan", interest: 8, amount: 500000 },
  { id: "bootstrap", name: "Bootstrap with current revenue", equity: 0, amount: 0 },
  { id: "partnership", name: "Strategic Partnership", equity: 10, amount: 1000000 },
];

// Extended types for the business game
export interface FinancialRecord {
  id: number;
  businessId: number;
  quarter: number;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  marketingCost: number;
  developmentCost: number;
  operationsCost: number;
  hrCost: number;
  otherCosts: number;
  createdAt: Date;
}

export interface MentorAdvice {
  id: number;
  businessId: number;
  type: "financial" | "marketing" | "product" | "hr";
  title: string;
  content: string;
  advice: string;
  relatedTo: string;
  quarter: number;
  year: number;
  createdAt: Date;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  cost: number;
  impact: {
    cash?: number;
    revenue?: number;
    customers?: number;
    marketShare?: number;
    employees?: number;
    valuation?: number;
    productProgress?: number;
    expenses?: number;
    other?: Record<string, unknown>;
  };
}

export interface DecisionConsequence {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: {
    cash?: number;
    revenue?: number;
    customers?: number;
    marketShare?: number;
    employees?: number;
    valuation?: number;
    productProgress?: number;
    expenses?: number;
    other?: Record<string, unknown>;
  };
}

export interface DecisionWithDetails extends Decision {
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  options: DecisionOption[];
  consequences: DecisionConsequence[];
  isCompleted: boolean;
}

export interface EventWithDetails extends Event {
  title: string;
  icon: string;
  iconColor: string;
}

export interface CompetitorWithDetails extends Competitor {
  focus: string;
}

export type InsertMentorAdvice = Omit<MentorAdvice, "id" | "createdAt">;
export type InsertFinancialRecord = Omit<FinancialRecord, "id" | "createdAt">;
export type InsertDecision = Omit<Decision, "id" | "createdAt">;
export type InsertEvent = Omit<Event, "id" | "createdAt">;
export type InsertCompetitor = Omit<Competitor, "id" | "createdAt">;

// Business interface
export interface Business extends Company {
  currentCash: number;
  initialCapital: number;
  quarterlyBurnRate: number;
  customers: number;
  productProgress: number;
}

// AI Recommendation interface
export interface AIRecommendation {
  recommendation: string;
  confidence: number;
  reasoning: string;
}

export function getAIRecommendation(decision: DecisionWithDetails): AIRecommendation {
  // Implementation can be added later
  return {
    recommendation: '',
    confidence: 0,
    reasoning: ''
  };
}
