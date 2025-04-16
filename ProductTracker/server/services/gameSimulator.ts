import { 
  Business, 
  Competitor, InsertCompetitor, 
  InsertEvent, 
  InsertDecision, 
  InsertMentorAdvice, 
  InsertFinancialRecord 
} from "@shared/schema";
import { decisionEngine } from "./decisionEngine";
import { aiMentor } from "./aiMentor";

interface AdvanceTimeResult {
  business: Business;
  financialRecord: InsertFinancialRecord;
  newEvents: InsertEvent[];
  newDecisions: InsertDecision[];
  newAdvice: InsertMentorAdvice[];
  competitors: Competitor[];
}

class GameSimulator {
  /**
   * Generate initial competitors for a new business
   */
  async generateCompetitors(business: Business): Promise<InsertCompetitor[]> {
    const competitorNames = ["TechSolutions", "InnovateCorp", "NextGenSystems"];
    const competitorTypes = ["product", "marketing", "price"];
    const totalMarketShare = 0.95; // Leave 5% for the player's business
    
    // Distribute market share - larger share for first competitor
    const marketShares = [0.5, 0.3, 0.15];
    
    return competitorNames.map((name, index) => ({
      companyId: business.id,
      name,
      type: business.type,
      marketShare: 5 + Math.random() * 15,
      strength: 50 + Math.floor(Math.random() * 50),
      focus: this.getCompetitorFocus(business.type)
    }));
  }
  
  /**
   * Advance the game by one quarter
   */
  async advanceTime(business: Business): Promise<AdvanceTimeResult> {
    // Update quarter/year
    let updatedBusiness = { ...business };
    updatedBusiness.currentQuarter += 1;
    
    // Reset quarter and increment year if needed
    if (updatedBusiness.currentQuarter > 4) {
      updatedBusiness.currentQuarter = 1;
      updatedBusiness.currentYear += 1;
    }
    
    // Run business simulation
    const simulationResult = await this.simulateBusinessQuarter(updatedBusiness);
    updatedBusiness = simulationResult.business;
    
    // Generate new decisions for the next quarter
    const newDecisions = await decisionEngine.generateQuarterlyDecisions(updatedBusiness);
    
    // Generate AI mentor advice
    const newAdvice = await aiMentor.generateQuarterlyAdvice(
      updatedBusiness, 
      simulationResult.financialRecord
    );
    
    return {
      business: updatedBusiness,
      financialRecord: simulationResult.financialRecord,
      newEvents: simulationResult.events,
      newDecisions,
      newAdvice,
      competitors: simulationResult.competitors
    };
  }
  
  /**
   * Simulate a quarter of business operations
   */
  private async simulateBusinessQuarter(business: Business) {
    // Deep clone the business object to avoid mutation
    const updatedBusiness = { ...business };
    const events: InsertEvent[] = [];
    
    // Get competitors
    const competitors = await this.simulateCompetitors(business);
    
    // 1. Update product progress
    updatedBusiness.productProgress = Math.min(100, updatedBusiness.productProgress + this.calculateProductProgressRate(business));
    
    // 2. Calculate revenue
    const prevRevenue = updatedBusiness.revenue;
    updatedBusiness.revenue = this.calculateQuarterlyRevenue(updatedBusiness);
    
    // 3. Calculate expenses
    const prevExpenses = updatedBusiness.expenses;
    updatedBusiness.expenses = this.calculateQuarterlyExpenses(updatedBusiness);
    
    // 4. Update customer count
    const prevCustomers = updatedBusiness.customers;
    updatedBusiness.customers = this.calculateCustomerCount(updatedBusiness);
    
    // 5. Update market share
    const prevMarketShare = updatedBusiness.marketShare;
    updatedBusiness.marketShare = this.calculateMarketShare(updatedBusiness, competitors);
    
    // 6. Update valuation
    updatedBusiness.valuation = this.calculateValuation(updatedBusiness);
    
    // 7. Update cash position
    const quarterlyProfit = updatedBusiness.revenue - updatedBusiness.expenses;
    updatedBusiness.currentCash += quarterlyProfit;
    
    // 8. Update burn rate
    updatedBusiness.quarterlyBurnRate = updatedBusiness.expenses;
    
    // 9. Generate events based on business changes
    
    // Revenue change event
    if (updatedBusiness.revenue > prevRevenue * 1.2) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Revenue Milestone Reached",
        description: `Quarterly revenue increased by ${Math.round((updatedBusiness.revenue / prevRevenue - 1) * 100)}% this quarter`,
        impact: { revenue: updatedBusiness.revenue, prevRevenue },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-chart-line",
        iconColor: "success"
      });
    } else if (updatedBusiness.revenue < prevRevenue * 0.8) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Revenue Decline",
        description: `Quarterly revenue decreased by ${Math.round((1 - updatedBusiness.revenue / prevRevenue) * 100)}% this quarter`,
        impact: { revenue: updatedBusiness.revenue, prevRevenue },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-chart-line-down",
        iconColor: "danger"
      });
    }
    
    // Customer milestone event
    if (updatedBusiness.customers >= 100 && prevCustomers < 100) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Customer Milestone Reached",
        description: "Your business has reached 100 customers!",
        impact: { customers: updatedBusiness.customers },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-users",
        iconColor: "success"
      });
    }
    
    // Market share event
    if (updatedBusiness.marketShare >= 0.1 && prevMarketShare < 0.1) {
      events.push({
        businessId: updatedBusiness.id,
        type: "market",
        title: "Market Share Milestone",
        description: "Your business now holds 10% of the market share",
        impact: { marketShare: updatedBusiness.marketShare },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-chart-pie",
        iconColor: "primary"
      });
    }
    
    // Random market events (20% chance each quarter)
    if (Math.random() < 0.2) {
      const marketEvents = [
        {
          type: "market",
          title: "Market Growth",
          description: "The overall market for your product has grown by 15%",
          impact: { marketGrowth: 0.15 },
          icon: "fa-solid fa-arrow-trend-up",
          iconColor: "success"
        },
        {
          type: "competitor",
          title: "Competitor Price Drop",
          description: "A major competitor has reduced their prices by 10%",
          impact: { competitorPriceDrop: 0.1 },
          icon: "fa-solid fa-tag",
          iconColor: "warning"
        },
        {
          type: "market",
          title: "New Market Regulations",
          description: "New industry regulations have increased compliance costs",
          impact: { expenseIncrease: 0.05 },
          icon: "fa-solid fa-scale-balanced",
          iconColor: "warning"
        },
        {
          type: "crisis",
          title: "Supply Chain Disruption",
          description: "A supply chain disruption has affected your industry",
          impact: { expenseIncrease: 0.08 },
          icon: "fa-solid fa-truck",
          iconColor: "danger"
        }
      ];
      
      const randomEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      events.push({
        businessId: updatedBusiness.id,
        type: randomEvent.type as any,
        title: randomEvent.title,
        description: randomEvent.description,
        impact: randomEvent.impact,
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: randomEvent.icon,
        iconColor: randomEvent.iconColor
      });
    }
    
    // Product milestone event
    if (updatedBusiness.productProgress >= 25 && business.productProgress < 25) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Product Development Milestone",
        description: "Your product has reached 25% completion - MVP is taking shape",
        impact: { productProgress: updatedBusiness.productProgress },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-code",
        iconColor: "primary"
      });
    } else if (updatedBusiness.productProgress >= 50 && business.productProgress < 50) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Product Development Milestone",
        description: "Your product has reached 50% completion - MVP is ready for testing",
        impact: { productProgress: updatedBusiness.productProgress },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-code",
        iconColor: "primary"
      });
    } else if (updatedBusiness.productProgress >= 75 && business.productProgress < 75) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Product Development Milestone",
        description: "Your product has reached 75% completion - preparing for launch",
        impact: { productProgress: updatedBusiness.productProgress },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-code",
        iconColor: "primary"
      });
    } else if (updatedBusiness.productProgress >= 100 && business.productProgress < 100) {
      events.push({
        businessId: updatedBusiness.id,
        type: "internal",
        title: "Product Launch",
        description: "Your product is now complete and fully launched to the market",
        impact: { productProgress: updatedBusiness.productProgress },
        quarter: updatedBusiness.currentQuarter,
        year: updatedBusiness.currentYear,
        icon: "fa-solid fa-rocket",
        iconColor: "success"
      });
    }
    
    // Create financial record for this quarter
    const financialRecord: InsertFinancialRecord = {
      businessId: updatedBusiness.id,
      quarter: updatedBusiness.currentQuarter,
      year: updatedBusiness.currentYear,
      revenue: updatedBusiness.revenue,
      expenses: updatedBusiness.expenses,
      profit: quarterlyProfit,
      cash: updatedBusiness.currentCash,
      marketingCost: Math.round(updatedBusiness.expenses * 0.3),
      developmentCost: Math.round(updatedBusiness.expenses * 0.4),
      operationsCost: Math.round(updatedBusiness.expenses * 0.1),
      hrCost: Math.round(updatedBusiness.expenses * 0.15),
      otherCosts: Math.round(updatedBusiness.expenses * 0.05),
      valuation: updatedBusiness.valuation,
      customers: updatedBusiness.customers
    };
    
    return {
      business: updatedBusiness,
      financialRecord,
      events,
      competitors
    };
  }
  
  /**
   * Calculate the rate of product development progress
   */
  private calculateProductProgressRate(business: Business): number {
    const baseRate = 10; // Base quarterly progress rate
    const employeeFactor = Math.sqrt(business.employees) * 2; // More employees = faster progress
    const cashFactor = Math.min(1.5, Math.max(0.5, business.currentCash / (business.initialCapital * 2))); // Cash position affects development
    
    return Math.round(baseRate * employeeFactor * cashFactor);
  }
  
  /**
   * Calculate quarterly revenue based on business state
   */
  private calculateQuarterlyRevenue(business: Business): number {
    // Base revenue depends on customers and product progress
    let baseRevenue = business.customers * this.getRevenuePerCustomer(business);
    
    // Adjust based on product completion - less revenue if product isn't complete
    const productFactor = 0.5 + (business.productProgress / 200); // 0.5 to 1.0
    
    // Growth factor based on previous revenue (momentum)
    const growthFactor = business.revenue > 0 ? 1.05 : 1; // 5% growth if already generating revenue
    
    return Math.round(baseRevenue * productFactor * growthFactor);
  }
  
  /**
   * Get average revenue per customer based on business type
   */
  private getRevenuePerCustomer(business: Business): number {
    const baseRevenue = 100; // Base revenue per customer (can be adjusted)
    
    switch (business.type) {
      case "Tech":
        return baseRevenue * 1.2;
      case "E-commerce":
        return baseRevenue * 1.1;
      case "Service":
        return baseRevenue * 0.9;
      case "Manufacturing":
        return baseRevenue * 1.0;
      default:
        return baseRevenue;
    }
  }
  
  /**
   * Calculate quarterly expenses
   */
  private calculateQuarterlyExpenses(business: Business): number {
    // Base expenses based on employees, development, and operations
    const employeeCost = business.employees * 7000; // Average quarterly cost per employee
    
    // Fixed costs (rent, services, etc.)
    const fixedCosts = 10000 + (business.initialCapital * 0.01); // Higher initial capital = higher fixed costs
    
    // Variable costs based on customer count (support, infrastructure, etc.)
    const variableCosts = business.customers * 50;
    
    // Scaling factor based on company growth
    const scalingFactor = Math.sqrt(business.employees) * 0.2;
    
    return Math.round((employeeCost + fixedCosts + variableCosts) * (1 + scalingFactor));
  }
  
  /**
   * Calculate customer count based on business performance
   */
  private calculateCustomerCount(business: Business): number {
    // Base new customers acquisition depends on product progress
    const productReadiness = Math.min(1, business.productProgress / 75); // Product needs to be at least 75% done for full effect
    
    // New customers this quarter (marketing effectiveness and product readiness)
    const baseNewCustomers = Math.round(10 * productReadiness * Math.sqrt(business.expenses * 0.3 / 10000)); // Marketing spend effectiveness
    
    // Retention rate for existing customers (between 85% and 95%)
    const retentionRate = 0.85 + (business.productProgress / 1000); // Better product = better retention
    
    // Calculate total customers
    const retainedCustomers = Math.round(business.customers * retentionRate);
    const totalCustomers = retainedCustomers + baseNewCustomers;
    
    return totalCustomers;
  }
  
  /**
   * Calculate market share based on business and competitors
   */
  private calculateMarketShare(business: Business, competitors: Competitor[]): number {
    // Total market share of all competitors
    const competitorShare = competitors.reduce((sum, comp) => sum + comp.marketShare, 0);
    
    // Market share cannot exceed 100%
    const maxShare = 1 - competitorShare;
    
    // Factors affecting market share growth
    const customerFactor = business.customers / 1000; // Number of customers (normalized)
    const productFactor = business.productProgress / 100; // Product completeness
    const revenueFactor = business.revenue / 100000; // Revenue (normalized)
    
    // Calculate new market share
    const baseGrowth = 0.01 * (customerFactor + productFactor + revenueFactor) / 3;
    const newShare = Math.min(maxShare, business.marketShare + baseGrowth);
    
    return parseFloat(newShare.toFixed(4));
  }
  
  /**
   * Calculate business valuation
   */
  private calculateValuation(business: Business): number {
    // For early stage startups, valuation is often based on a multiple of revenue
    const annualRevenue = business.revenue * 4; // Convert quarterly to annual
    
    // Valuation multiple depends on business type and growth
    let revenueMultiple = 4; // Base multiple
    
    // Adjust multiple based on business type
    switch (business.type) {
      case "Tech":
        revenueMultiple = 8; // Tech companies often have higher multiples
        break;
      case "E-commerce":
        revenueMultiple = 3;
        break;
      case "Service":
        revenueMultiple = 2;
        break;
      case "Manufacturing":
        revenueMultiple = 1.5;
        break;
    }
    
    // Calculate valuation based on revenue multiple
    let valuation = annualRevenue * revenueMultiple;
    
    // If revenue is still very low, use a baseline valuation
    if (valuation < business.initialCapital * 2) {
      valuation = business.initialCapital * 2;
    }
    
    return Math.round(valuation);
  }
  
  /**
   * Simulate competitors' performance
   */
  private async simulateCompetitors(business: Business): Promise<Competitor[]> {
    // This would typically come from storage, but for this demo we'll create some
    const competitors: Competitor[] = [
      {
        id: 1,
        businessId: business.id,
        name: "TechSolutions",
        type: business.type,
        marketShare: 0.5,
        strength: 8,
        focus: "product",
        createdAt: new Date()
      },
      {
        id: 2,
        businessId: business.id,
        name: "InnovateCorp",
        type: business.type,
        marketShare: 0.3,
        strength: 7,
        focus: "marketing",
        createdAt: new Date()
      },
      {
        id: 3,
        businessId: business.id,
        name: "NextGenSystems",
        type: business.type,
        marketShare: 0.15,
        strength: 9,
        focus: "price",
        createdAt: new Date()
      }
    ];
    
    // Adjust competitor market shares based on player's growth
    if (business.marketShare > 0.05) {
      // Determine how much market share to take from competitors
      const marketShareGain = business.marketShare - 0.05; // The amount above starting 5%
      
      // Distribute the loss proportionally among competitors
      const totalCompetitorShare = competitors.reduce((sum, comp) => sum + comp.marketShare, 0);
      
      competitors.forEach(comp => {
        const proportion = comp.marketShare / totalCompetitorShare;
        comp.marketShare -= marketShareGain * proportion;
        
        // Ensure no negative market share
        comp.marketShare = Math.max(0.01, comp.marketShare);
      });
    }
    
    // Normalize market shares to ensure they sum to 1 - business.marketShare
    const totalCompetitorShare = competitors.reduce((sum, comp) => sum + comp.marketShare, 0);
    const targetShare = 1 - business.marketShare;
    
    competitors.forEach(comp => {
      comp.marketShare = (comp.marketShare / totalCompetitorShare) * targetShare;
    });
    
    return competitors;
  }
}

export const gameSimulator = new GameSimulator();
