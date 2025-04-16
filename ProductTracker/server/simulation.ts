import { 
  BusinessType, 
  InsertCompany, 
  InsertCompetitor,
  InsertEvent,
  InsertMetrics,
  Company,
  Decision,
  DecisionType
} from "@shared/schema";

// Helper to generate random numbers within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper to calculate financial impact
const calculateFinancialImpact = (base: number, variation: number) => {
  return base * (1 + (Math.random() * variation * 2 - variation));
};

// Generate a new startup company with initial values based on type
export function generateInitialCompany(
  userId: number, 
  name: string, 
  type: BusinessType, 
  fundingType: string,
  fundingAmount: number
): InsertCompany {
  // Base metrics by business type
  const baseMetrics = {
    Tech: {
      valuation: 2000000,
      employees: 8,
      marketShare: 0.5,
      revenue: 50000,
      expenses: 65000,
    },
    "E-commerce": {
      valuation: 1500000,
      employees: 6,
      marketShare: 0.3,
      revenue: 75000,
      expenses: 70000,
    },
    Service: {
      valuation: 1000000,
      employees: 5,
      marketShare: 0.2,
      revenue: 40000,
      expenses: 35000,
    },
    Manufacturing: {
      valuation: 3000000,
      employees: 15,
      marketShare: 0.2,
      revenue: 100000,
      expenses: 120000,
    },
  };
  
  const metrics = baseMetrics[type];
  
  return {
    userId,
    name,
    type,
    fundingType,
    fundingAmount,
    valuation: metrics.valuation,
    cash: fundingAmount,
    revenue: metrics.revenue,
    expenses: metrics.expenses,
    marketShare: metrics.marketShare,
    employees: metrics.employees,
    currentQuarter: 1,
    currentYear: 1,
  };
}

// Generate initial competitors for a company
export function generateCompetitors(companyId: number, businessType: BusinessType): InsertCompetitor[] {
  const competitorNames = {
    Tech: ["CloudWave", "Appsphere", "TechVision", "ByteWorks", "CodeNova"],
    "E-commerce": ["ShopElite", "CartKing", "MarketMaster", "BuyNow", "DigitalBazaar"],
    Service: ["ServeRight", "ExpertEdge", "ProConsult", "SolutionsHub", "ServicePro"],
    Manufacturing: ["IndusTech", "FactoryFusion", "ManufactureMax", "ProducePro", "AssemblyTech"],
  };
  
  // Select 3-4 competitors
  const numCompetitors = Math.floor(random(3, 5));
  const competitors: InsertCompetitor[] = [];
  
  for (let i = 0; i < numCompetitors; i++) {
    const names = competitorNames[businessType];
    const name = names[Math.floor(random(0, names.length))];
    
    // Avoid duplicate names
    if (competitors.some(c => c.name === name)) continue;
    
    competitors.push({
      companyId,
      name,
      type: businessType,
      marketShare: random(0.5, 10.0),
      strength: Math.floor(random(1, 10)),
    });
  }
  
  return competitors;
}

// Generate initial metrics for a company
export function generateInitialMetrics(company: Company): InsertMetrics {
  return {
    companyId: company.id,
    quarter: company.currentQuarter,
    year: company.currentYear,
    revenue: company.revenue,
    expenses: company.expenses,
    profit: company.revenue - company.expenses,
    cash: company.cash,
    marketShare: company.marketShare,
    valuation: company.valuation,
    employees: company.employees,
  };
}

// Generate initial market events
export function generateMarketEvent(companyId: number, quarter: number, year: number): InsertEvent | null {
  // 30% chance of an event occurring
  if (Math.random() > 0.3) return null;
  
  const events = [
    {
      name: "New Competitor",
      description: "A new competitor with significant funding has entered the market with a similar product at a lower price point.",
      impact: {
        marketShare: -0.2,
        revenue: -0.05,
      },
    },
    {
      name: "Market Growth",
      description: "Your industry is experiencing rapid growth due to increased demand.",
      impact: {
        marketShare: 0.1,
        revenue: 0.1,
        valuation: 0.05,
      },
    },
    {
      name: "Economic Downturn",
      description: "An economic recession is affecting consumer spending and investment.",
      impact: {
        revenue: -0.15,
        valuation: -0.1,
        marketShare: -0.05,
      },
    },
    {
      name: "Technological Breakthrough",
      description: "A new technology has emerged that could disrupt your business model.",
      impact: {
        expenses: 0.1,
        valuation: -0.05,
      },
    },
    {
      name: "Regulatory Changes",
      description: "New regulations are affecting businesses in your industry.",
      impact: {
        expenses: 0.08,
        revenue: -0.03,
      },
    },
  ];
  
  const event = events[Math.floor(random(0, events.length))];
  
  return {
    companyId,
    quarter,
    year,
    name: event.name,
    description: event.description,
    impact: event.impact,
  };
}

// Apply the effects of decisions on company metrics
export function applyDecisionEffects(
  company: Company,
  decisions: Decision[]
): Partial<Company> {
  let updates: Partial<Company> = {};
  
  // Start with base changes to the company
  updates.cash = company.cash;
  updates.revenue = company.revenue;
  updates.expenses = company.expenses;
  updates.marketShare = company.marketShare;
  updates.valuation = company.valuation;
  updates.employees = company.employees;

  // Apply each decision's effects
  for (const decision of decisions) {
    // Reduce cash by decision cost
    updates.cash = (updates.cash || company.cash) - decision.cost;
    
    // Apply specific impacts from the decision
    const impact = decision.impact as Record<string, number>;
    
    if (impact.revenue) {
      updates.revenue = (updates.revenue || company.revenue) * (1 + impact.revenue);
    }
    
    if (impact.expenses) {
      updates.expenses = (updates.expenses || company.expenses) * (1 + impact.expenses);
    }
    
    if (impact.marketShare) {
      updates.marketShare = (updates.marketShare || company.marketShare) + impact.marketShare;
    }
    
    if (impact.valuation) {
      updates.valuation = (updates.valuation || company.valuation) * (1 + impact.valuation);
    }
    
    if (impact.employees) {
      updates.employees = (updates.employees || company.employees) + impact.employees;
    }
    
    if (decision.type === 'funding' && decision.decision !== 'bootstrap') {
      // Handle additional funding
      const fundingImpact = impact as { cash?: number, equity?: number };
      if (fundingImpact.cash) {
        updates.cash = (updates.cash || company.cash) + fundingImpact.cash;
      }
    }
  }

  // Calculate valuation based on revenue multiple and market share
  // This is a simple formula - in real business valuation would be more complex
  updates.valuation = ((updates.revenue || company.revenue) * 12) * 
                      (1 + (updates.marketShare || company.marketShare) / 10);
  
  // Advance to next quarter
  if (company.currentQuarter === 4) {
    updates.currentQuarter = 1;
    updates.currentYear = company.currentYear + 1;
  } else {
    updates.currentQuarter = company.currentQuarter + 1;
  }
  
  return updates;
}

// Get AI recommendation for a decision type based on company state
export function getAIRecommendation(company: Company, decisionType: DecisionType): string {
  // Simple rule-based recommendations
  switch (decisionType) {
    case 'marketing':
      if (company.marketShare < 1.0) {
        return 'paid'; // Paid advertising for low market share
      } else if (company.marketShare < 5.0) {
        return 'influencer'; // Influencer marketing for growing companies
      } else {
        return 'conference'; // Conference sponsorships for established players
      }
      
    case 'hiring':
      if (company.revenue > company.expenses * 1.3) {
        return 'engineers'; // Hire engineers if profitable
      } else if (company.revenue < company.expenses) {
        return 'none'; // Don't hire if losing money
      } else {
        return 'sales'; // Default to sales team
      }
      
    case 'product':
      if (company.type === 'Tech' && company.currentYear === 1) {
        return 'mobile'; // Mobile development for early tech companies
      } else if (company.revenue > 200000) {
        return 'enterprise'; // Enterprise features for larger companies
      } else {
        return 'performance'; // Performance improvements as default
      }
      
    case 'funding':
      if (company.cash < company.expenses * 3) {
        return 'series_a'; // Series A if low on cash
      } else if (company.valuation > 5000000) {
        return 'strategic_partnership'; // Strategic partnership for valuable companies
      } else {
        return 'bootstrap'; // Bootstrap if possible
      }
      
    default:
      return '';
  }
}

// Calculate impact of a decision
export function calculateDecisionImpact(decisionType: DecisionType, decisionId: string): Record<string, number> {
  switch (decisionType) {
    case 'marketing':
      switch (decisionId) {
        case 'content':
          return { revenue: 0.05, marketShare: 0.2 };
        case 'paid':
          return { revenue: 0.08, marketShare: 0.4 };
        case 'influencer':
          return { revenue: 0.1, marketShare: 0.3 };
        case 'conference':
          return { revenue: 0.07, marketShare: 0.5, valuation: 0.03 };
        default:
          return {};
      }
      
    case 'hiring':
      switch (decisionId) {
        case 'engineers':
          return { expenses: 0.15, employees: 2, valuation: 0.05 };
        case 'sales':
          return { expenses: 0.17, employees: 3, revenue: 0.1 };
        case 'support':
          return { expenses: 0.08, employees: 2, revenue: 0.03 };
        case 'none':
          return { expenses: -0.02 };
        default:
          return {};
      }
      
    case 'product':
      switch (decisionId) {
        case 'features':
          return { expenses: 0.05, revenue: 0.08, marketShare: 0.2 };
        case 'performance':
          return { expenses: 0.04, revenue: 0.04 };
        case 'mobile':
          return { expenses: 0.08, revenue: 0.12, marketShare: 0.3 };
        case 'enterprise':
          return { expenses: 0.06, revenue: 0.15, marketShare: 0.1 };
        default:
          return {};
      }
      
    case 'funding':
      switch (decisionId) {
        case 'series_a':
          return { cash: 2000000, equity: 0.15, valuation: 0.2 };
        case 'loan':
          return { cash: 500000, expenses: 0.03 };
        case 'bootstrap':
          return {};
        case 'partnership':
          return { cash: 1000000, equity: 0.1, marketShare: 0.5, valuation: 0.1 };
        default:
          return {};
      }
      
    default:
      return {};
  }
}
