import { 
  Business, 
  InsertMentorAdvice, 
  FinancialRecord 
} from "@shared/schema";

class AIMentor {
  /**
   * Generate initial advice for a new business
   */
  async generateInitialAdvice(business: Business): Promise<InsertMentorAdvice[]> {
    const advice: InsertMentorAdvice[] = [];
    
    // General welcome advice
    advice.push({
      businessId: business.id,
      advice: "Welcome to your new business venture! I'll be your AI mentor, helping you make strategic decisions.",
      type: "general" as const,
      title: "Welcome",
      content: "Let's start building your business together!",
      quarter: business.currentQuarter,
      year: business.currentYear
    });
    
    // Business type specific advice
    switch (business.type) {
      case "Tech":
        advice.push({
          businessId: business.id,
          advice: "Focus on rapid product development and innovation. Tech moves fast!",
          type: "product" as const,
          title: "Tech Strategy",
          content: "Consider investing in R&D and hiring skilled developers.",
          quarter: business.currentQuarter,
          year: business.currentYear
        });
        break;
      case "E-commerce":
        advice.push({
          businessId: business.id,
          advice: "Build a strong online presence and optimize your customer acquisition funnel.",
          type: "marketing" as const,
          title: "E-commerce Strategy",
          content: "Focus on digital marketing and customer experience.",
          quarter: business.currentQuarter,
          year: business.currentYear
        });
        break;
      case "Service":
        advice.push({
          businessId: business.id,
          advice: "Quality service delivery and customer satisfaction should be your top priorities.",
          type: "operations" as const,
          title: "Service Strategy",
          content: "Invest in training and customer service infrastructure.",
          quarter: business.currentQuarter,
          year: business.currentYear
        });
        break;
      case "Manufacturing":
        advice.push({
          businessId: business.id,
          advice: "Optimize your production processes and maintain quality control.",
          type: "operations" as const,
          title: "Manufacturing Strategy",
          content: "Focus on efficiency and quality control systems.",
          quarter: business.currentQuarter,
          year: business.currentYear
        });
        break;
    }
    
    // Funding advice based on type
    if (business.fundingType === "Bootstrap") {
      advice.push({
        businessId: business.id,
        advice: "Manage your cash flow carefully. Every dollar counts when bootstrapping.",
        type: "financial" as const,
        title: "Bootstrap Strategy",
        content: "Focus on revenue generation and cost control.",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.fundingType === "Seed" || business.fundingType === "Series A") {
      advice.push({
        businessId: business.id,
        advice: "Use your funding wisely. Focus on growth and hitting key milestones.",
        type: "financial" as const,
        title: "Funding Strategy",
        content: "Balance growth with runway management.",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    return advice;
  }
  
  /**
   * Generate quarterly advice based on business performance
   */
  async generateQuarterlyAdvice(business: Business, financialRecord: InsertFinancialRecord): Promise<InsertMentorAdvice[]> {
    const advice: InsertMentorAdvice[] = [];
    
    // Financial health advice
    advice.push(...this.generateFinancialAdvice(business, financialRecord));
    
    // Product development advice
    advice.push(...this.generateProductAdvice(business));
    
    // Marketing advice
    advice.push(...this.generateMarketingAdvice(business));
    
    // HR and team advice
    advice.push(...this.generateHRAdvice(business));
    
    // Select 2-3 pieces of advice randomly to avoid overwhelming the user
    return this.selectRandomAdvice(advice, 2 + Math.floor(Math.random() * 2));
  }
  
  /**
   * Generate financial advice based on business metrics
   */
  private generateFinancialAdvice(business: Business, financialRecord: InsertFinancialRecord): InsertMentorAdvice[] {
    const advice: InsertMentorAdvice[] = [];
    
    // Calculate runway in months
    const monthlyBurnRate = business.quarterlyBurnRate / 3;
    const runway = monthlyBurnRate > 0 ? Math.round(business.currentCash / monthlyBurnRate) : 999;
    
    // Burn rate advice
    if (runway < 6) {
      advice.push({
        businessId: business.id,
        type: "financial",
        title: "Critical Cash Runway Warning",
        content: `Your current runway is only ${runway} months. Consider immediate cost-cutting measures or accelerating your fundraising timeline to avoid a cash crisis.`,
        relatedTo: "burn_rate",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (runway < 12) {
      advice.push({
        businessId: business.id,
        type: "financial",
        title: "Cash Runway Attention Required",
        content: `With ${runway} months of runway, you should begin planning your next fundraising round or identify paths to profitability within the next 1-2 quarters.`,
        relatedTo: "burn_rate",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // Profitability advice
    const isProfit = financialRecord.profit > 0;
    if (isProfit && financialRecord.profit > financialRecord.profit * 0.15) {
      advice.push({
        businessId: business.id,
        type: "financial",
        title: "Profitability Achievement",
        content: "Congratulations on achieving profitability! Consider reinvesting these profits in growth areas or building a cash reserve for future opportunities or downturns.",
        relatedTo: "profitability",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (!isProfit && Math.abs(financialRecord.profit) > financialRecord.revenue * 0.5) {
      advice.push({
        businessId: business.id,
        type: "financial",
        title: "Significant Losses Concern",
        content: "Your losses are over 50% of revenue, which is concerning. Review your cost structure and consider reducing non-essential expenses to improve your financial position.",
        relatedTo: "profitability",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // Customer acquisition cost (CAC) advice
    const marketingSpend = financialRecord.marketingCost;
    const newCustomers = financialRecord.customers - (business.customers - financialRecord.customers);
    const cac = newCustomers > 0 ? marketingSpend / newCustomers : 0;
    
    if (cac > 0) {
      const revenuePerCustomer = financialRecord.revenue / financialRecord.customers;
      const cltv = revenuePerCustomer * 4; // Simple estimation of customer lifetime value
      
      if (cac > cltv) {
        advice.push({
          businessId: business.id,
          type: "marketing",
          title: "Unsustainable Customer Acquisition",
          content: `Your customer acquisition cost (${cac.toFixed(2)}) exceeds your estimated customer lifetime value. Optimize your marketing channels or reconsider your pricing strategy to improve this ratio.`,
          relatedTo: "cac",
          quarter: business.currentQuarter,
          year: business.currentYear
        });
      } else if (cac * 3 < cltv) {
        advice.push({
          businessId: business.id,
          type: "marketing",
          title: "Excellent CAC to LTV Ratio",
          content: `Your CAC to LTV ratio is very healthy (${(cltv/cac).toFixed(2)}:1). Consider accelerating customer acquisition by increasing marketing spend while this efficiency persists.`,
          relatedTo: "cac",
          quarter: business.currentQuarter,
          year: business.currentYear
        });
      }
    }
    
    return advice;
  }
  
  /**
   * Generate product development advice based on business state
   */
  private generateProductAdvice(business: Business): InsertMentorAdvice[] {
    const advice: InsertMentorAdvice[] = [];
    
    // Product progress advice
    if (business.productProgress < 25) {
      advice.push({
        businessId: business.id,
        type: "product",
        title: "Early Product Development Focus",
        content: "At this early stage, focus on validating core features with real users. Consider implementing user testing sessions and collecting qualitative feedback to guide development priorities.",
        relatedTo: "product_development",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.productProgress >= 25 && business.productProgress < 50) {
      advice.push({
        businessId: business.id,
        type: "product",
        title: "MVP Refinement Strategy",
        content: "Your MVP is taking shape. Now is the time to collect detailed user feedback and make iterative improvements before investing in additional features.",
        relatedTo: "product_development",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.productProgress >= 50 && business.productProgress < 75) {
      advice.push({
        businessId: business.id,
        type: "product",
        title: "Product Expansion Considerations",
        content: "With your core product established, carefully evaluate which additional features will provide the highest ROI. Prioritize based on user demand and strategic value rather than ease of implementation.",
        relatedTo: "product_development",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.productProgress >= 75 && business.productProgress < 100) {
      advice.push({
        businessId: business.id,
        type: "product",
        title: "Product Launch Preparation",
        content: "Your product is nearly complete. Focus on polishing the user experience, preparing comprehensive documentation, and developing a rollout plan that includes customer onboarding support.",
        relatedTo: "product_development",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.productProgress >= 100) {
      advice.push({
        businessId: business.id,
        type: "product",
        title: "Post-Launch Product Strategy",
        content: "With your product launched, establish a systematic process for gathering and prioritizing user feedback. Consider implementing feature usage analytics to guide your future development roadmap.",
        relatedTo: "product_development",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // User growth advice based on product state
    if (business.productProgress >= 50 && business.customers < 50) {
      advice.push({
        businessId: business.id,
        type: "product",
        title: "Product-Market Fit Concerns",
        content: "Your product is well-developed but user growth is lagging. This may indicate a product-market fit issue. Consider conducting user interviews to understand why adoption is slower than expected.",
        relatedTo: "product_market_fit",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    return advice;
  }
  
  /**
   * Generate marketing advice based on business metrics
   */
  private generateMarketingAdvice(business: Business): InsertMentorAdvice[] {
    const advice: InsertMentorAdvice[] = [];
    
    // Market share advice
    if (business.marketShare < 0.05) {
      advice.push({
        businessId: business.id,
        type: "marketing",
        title: "Market Penetration Strategy",
        content: "Your market share is still small. Consider focusing on a specific niche segment where you can establish a stronger position before expanding to broader markets.",
        relatedTo: "market_share",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.marketShare >= 0.15) {
      advice.push({
        businessId: business.id,
        type: "marketing",
        title: "Market Leadership Opportunity",
        content: `With ${Math.round(business.marketShare * 100)}% market share, you're becoming a significant player. Consider how to leverage this position through thought leadership content and industry partnerships.`,
        relatedTo: "market_share",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // Customer growth rate advice
    if (business.customers > 0 && business.customers < 10) {
      advice.push({
        businessId: business.id,
        type: "marketing",
        title: "Early Customer Acquisition Focus",
        content: "At this early stage, focus on highly personalized outreach to potential customers. Each early customer provides valuable feedback and potential case studies for future marketing.",
        relatedTo: "customer_acquisition",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.customers >= 100) {
      advice.push({
        businessId: business.id,
        type: "marketing",
        title: "Customer Segmentation Opportunity",
        content: "With over 100 customers, you now have enough data to identify patterns. Consider segmenting your customer base to develop more targeted marketing campaigns and product features.",
        relatedTo: "customer_acquisition",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // Marketing spend efficiency
    const marketingSpendRatio = (business.expenses * 0.3) / business.revenue;
    if (business.revenue > 0 && marketingSpendRatio > 0.5) {
      advice.push({
        businessId: business.id,
        type: "marketing",
        title: "High Marketing Spend Alert",
        content: "Your marketing spend exceeds 50% of revenue, which is unusually high. Audit your marketing channels to identify which are delivering the best ROI and consider reallocating budget accordingly.",
        relatedTo: "marketing_efficiency",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    return advice;
  }
  
  /**
   * Generate HR and team advice based on business state
   */
  private generateHRAdvice(business: Business): InsertMentorAdvice[] {
    const advice: InsertMentorAdvice[] = [];
    
    // Team size advice
    if (business.employees <= 1) {
      advice.push({
        businessId: business.id,
        type: "hr",
        title: "First Hiring Decisions",
        content: "As a solo founder or very small team, your first hires are critical. Prioritize versatile candidates who can handle multiple responsibilities and share your vision for the company.",
        relatedTo: "team_building",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.employees > 10 && business.employees <= 15) {
      advice.push({
        businessId: business.id,
        type: "hr",
        title: "Team Structure Evolution",
        content: "As your team grows beyond 10 people, informal communication becomes less effective. Consider implementing more structured processes for decision-making, documentation, and knowledge sharing.",
        relatedTo: "team_building",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    } else if (business.employees > 20) {
      advice.push({
        businessId: business.id,
        type: "hr",
        title: "Organizational Culture Focus",
        content: "With your growing team size, consciously developing your organizational culture becomes crucial. Codify your company values and ensure they're reflected in hiring, performance reviews, and daily operations.",
        relatedTo: "team_building",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // Productivity and overhead
    const revenuePerEmployee = business.revenue / business.employees;
    const expensePerEmployee = business.expenses / business.employees;
    
    if (business.revenue > 0 && revenuePerEmployee < expensePerEmployee) {
      advice.push({
        businessId: business.id,
        type: "hr",
        title: "Team Productivity Concerns",
        content: "Your revenue per employee is below your cost per employee, which indicates potential productivity issues. Review your hiring strategy and team structure to ensure alignment with revenue goals.",
        relatedTo: "team_productivity",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    // Growth stage specific advice
    if (business.employees >= 5 && business.employees <= 10 && business.currentYear === 1) {
      advice.push({
        businessId: business.id,
        type: "hr",
        title: "Early Management Structures",
        content: "As you transition from a founding team to a larger organization, begin introducing basic management structures and clear reporting lines to maintain team alignment and productivity.",
        relatedTo: "management",
        quarter: business.currentQuarter,
        year: business.currentYear
      });
    }
    
    return advice;
  }
  
  /**
   * Randomly select a subset of advice to avoid overwhelming the user
   */
  private selectRandomAdvice(advice: InsertMentorAdvice[], count: number): InsertMentorAdvice[] {
    if (advice.length <= count) {
      return advice;
    }
    
    const shuffled = this.shuffleArray([...advice]);
    return shuffled.slice(0, count);
  }
  
  /**
   * Utility: Shuffle an array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

export const aiMentor = new AIMentor();
