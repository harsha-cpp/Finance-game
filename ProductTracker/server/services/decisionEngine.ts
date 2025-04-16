import { 
  Business, 
  InsertDecision, 
  Decision, 
  InsertEvent 
} from "@shared/schema";
import { DecisionOption, DecisionConsequence } from "@/lib/types";

interface DecisionResult {
  business: Business;
  newEvents: InsertEvent[];
}

class DecisionEngine {
  /**
   * Generate initial decisions for a new business
   */
  async generateInitialDecisions(business: Business): Promise<InsertDecision[]> {
    const decisions: InsertDecision[] = [];
    
    // Add initial product decision
    decisions.push({
      businessId: business.id,
      type: "product",
      title: "Product Development Approach",
      description: "How would you like to approach your initial product development?",
      options: [
        {
          id: 1,
          label: "Minimum Viable Product (MVP)",
          description: "Focus on building a basic version quickly to validate market fit",
          metrics: {
            cost: 10000,
            timeframe: "Fast (1 quarter)",
            roi: "Medium",
          }
        },
        {
          id: 2,
          label: "Full-Featured Product",
          description: "Develop a comprehensive product with all planned features",
          metrics: {
            cost: 25000,
            timeframe: "Slow (2-3 quarters)",
            roi: "High",
          }
        },
        {
          id: 3,
          label: "Outsource Development",
          description: "Hire external developers to build the product faster",
          metrics: {
            cost: 20000,
            timeframe: "Medium (1-2 quarters)",
            roi: "Low",
          }
        }
      ],
      consequences: [
        {
          optionId: 1,
          effects: {
            cash: -10000,
            productProgress: 20,
            expenses: business.expenses * 1.2
          },
          description: "You've started MVP development. This approach gives you a faster time to market but may require more iterations later."
        },
        {
          optionId: 2,
          effects: {
            cash: -25000,
            productProgress: 15,
            expenses: business.expenses * 1.5
          },
          description: "You've started full-featured development. This will take longer but may result in a more polished product."
        },
        {
          optionId: 3,
          effects: {
            cash: -20000,
            productProgress: 25,
            expenses: business.expenses * 1.3
          },
          description: "You've outsourced development. This is faster but more expensive and may result in less control over the product."
        }
      ],
      deadline: business.currentQuarter + 1,
      urgency: "normal"
    });
    
    // Add initial marketing decision
    decisions.push({
      businessId: business.id,
      type: "marketing",
      title: "Initial Marketing Strategy",
      description: "How will you approach customer acquisition for your startup?",
      options: [
        {
          id: 1,
          label: "Content Marketing",
          description: "Create valuable content to attract and engage your target audience",
          metrics: {
            cost: 5000,
            timeframe: "Slow (2+ quarters)",
            roi: "High",
            cac: 120
          }
        },
        {
          id: 2,
          label: "Paid Advertising",
          description: "Invest in paid ads on search engines and social media",
          metrics: {
            cost: 15000,
            timeframe: "Fast (immediate)",
            roi: "Medium",
            cac: 250
          }
        },
        {
          id: 3,
          label: "Partnership & Referrals",
          description: "Build strategic partnerships and referral programs",
          metrics: {
            cost: 3000,
            timeframe: "Medium (1-2 quarters)",
            roi: "Medium",
            cac: 80
          }
        }
      ],
      consequences: [
        {
          optionId: 1,
          effects: {
            cash: -5000,
            customers: 10,
            expenses: business.expenses + 2000
          },
          description: "You've launched a content marketing strategy. It will take time to build momentum, but can be very cost-effective long-term."
        },
        {
          optionId: 2,
          effects: {
            cash: -15000,
            customers: 35,
            expenses: business.expenses + 5000
          },
          description: "You've launched paid advertising campaigns. This brings immediate traffic but at a higher cost per customer."
        },
        {
          optionId: 3,
          effects: {
            cash: -3000,
            customers: 15,
            expenses: business.expenses + 1000
          },
          description: "You've established partnerships and referral programs. This creates a foundation for sustainable growth through relationships."
        }
      ],
      deadline: business.currentQuarter + 1,
      urgency: "normal"
    });
    
    // Add initial hiring decision
    decisions.push({
      businessId: business.id,
      type: "hr",
      title: "First Hiring Decision",
      description: "It's time to grow your team. What role should you prioritize first?",
      options: [
        {
          id: 1,
          label: "Product Developer",
          description: "Hire a developer to accelerate product development",
          metrics: {
            cost: 15000,
            timeframe: "Immediate",
            roi: "Medium",
          }
        },
        {
          id: 2,
          label: "Marketing Specialist",
          description: "Hire a marketer to improve customer acquisition",
          metrics: {
            cost: 12000,
            timeframe: "Immediate",
            roi: "Medium",
          }
        },
        {
          id: 3,
          label: "Operations Manager",
          description: "Hire someone to handle daily operations and scaling",
          metrics: {
            cost: 14000,
            timeframe: "Immediate",
            roi: "Low",
          }
        }
      ],
      consequences: [
        {
          optionId: 1,
          effects: {
            cash: -15000,
            employees: business.employees + 1,
            productProgress: 5,
            expenses: business.expenses + 5000
          },
          description: "You've hired a Product Developer. Your product development will speed up, helping you get to market faster."
        },
        {
          optionId: 2,
          effects: {
            cash: -12000,
            employees: business.employees + 1,
            customers: 8,
            expenses: business.expenses + 4000
          },
          description: "You've hired a Marketing Specialist. Your customer acquisition efforts will be more effective, helping you grow your user base."
        },
        {
          optionId: 3,
          effects: {
            cash: -14000,
            employees: business.employees + 1,
            expenses: business.expenses + 4500
          },
          description: "You've hired an Operations Manager. Your business operations will be more efficient, reducing potential issues as you scale."
        }
      ],
      deadline: business.currentQuarter + 2,
      urgency: "low"
    });
    
    return decisions;
  }
  
  /**
   * Generate quarterly decisions based on business state
   */
  async generateQuarterlyDecisions(business: Business): Promise<InsertDecision[]> {
    const decisions: InsertDecision[] = [];
    const quarter = business.currentQuarter;
    const year = business.currentYear;
    
    // Randomly select 2-3 decision types for this quarter
    const decisionTypes = ["marketing", "product", "hr", "finance", "operations"];
    const shuffledTypes = this.shuffleArray([...decisionTypes]);
    const selectedTypes = shuffledTypes.slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 types
    
    // Generate decisions based on business state and selected types
    for (const type of selectedTypes) {
      let decision: InsertDecision | null = null;
      
      switch (type) {
        case "marketing":
          decision = this.generateMarketingDecision(business);
          break;
        case "product":
          decision = this.generateProductDecision(business);
          break;
        case "hr":
          decision = this.generateHRDecision(business);
          break;
        case "finance":
          decision = this.generateFinanceDecision(business);
          break;
        case "operations":
          decision = this.generateOperationsDecision(business);
          break;
      }
      
      if (decision) {
        decisions.push(decision);
      }
    }
    
    // Add potential crisis or opportunity decisions (20% chance)
    if (Math.random() < 0.2) {
      const crisisOrOpportunity = this.generateCrisisOrOpportunity(business);
      if (crisisOrOpportunity) {
        decisions.push(crisisOrOpportunity);
      }
    }
    
    return decisions;
  }
  
  /**
   * Generate a marketing decision
   */
  private generateMarketingDecision(business: Business): InsertDecision {
    const urgency = Math.random() < 0.3 ? "urgent" : "normal";
    const decisions = [
      {
        title: "Marketing Campaign Strategy",
        description: "Choose a marketing approach for the upcoming quarter",
        options: [
          {
            id: 1,
            label: "Content Marketing Focus",
            description: "Invest in blog content, SEO, and social media to build organic traffic.",
            metrics: {
              cost: 12000,
              timeframe: "Slow (3+ months)",
              roi: "Medium",
              cac: 180
            }
          },
          {
            id: 2,
            label: "Paid Advertising Campaign",
            description: "Invest in Google Ads and social media advertising for immediate results.",
            metrics: {
              cost: 20000,
              timeframe: "Fast (1 month)",
              roi: "High",
              cac: 250
            }
          },
          {
            id: 3,
            label: "Partnership & Referral Program",
            description: "Develop partnerships with complementary businesses and launch a customer referral program.",
            metrics: {
              cost: 8000,
              timeframe: "Medium (2 months)",
              roi: "Medium",
              cac: 150
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -12000,
              customers: Math.round(12000 / 180),
              expenses: business.expenses + 4000
            },
            description: "Your content marketing strategy is building momentum. Organic traffic has increased and you're seeing steady growth in leads."
          },
          {
            optionId: 2,
            effects: {
              cash: -20000,
              customers: Math.round(20000 / 250),
              expenses: business.expenses + 6500
            },
            description: "Your paid campaigns have driven immediate traffic and conversions, but at a higher cost per acquisition."
          },
          {
            optionId: 3,
            effects: {
              cash: -8000,
              customers: Math.round(8000 / 150),
              expenses: business.expenses + 2500
            },
            description: "Your partnership and referral programs are generating quality leads at a lower cost, though volume is more modest."
          }
        ]
      },
      {
        title: "Brand Positioning Update",
        description: "How should we position our brand in the market?",
        options: [
          {
            id: 1,
            label: "Premium Value",
            description: "Position as a high-quality, premium solution with higher pricing",
            metrics: {
              cost: 10000,
              timeframe: "Medium (2-3 months)",
              roi: "High",
              cac: 300
            }
          },
          {
            id: 2,
            label: "Affordable Solution",
            description: "Position as the best value for money with competitive pricing",
            metrics: {
              cost: 8000,
              timeframe: "Quick (1-2 months)",
              roi: "Medium",
              cac: 200
            }
          },
          {
            id: 3,
            label: "Innovation Leader",
            description: "Position as the most innovative and cutting-edge solution",
            metrics: {
              cost: 15000,
              timeframe: "Longer (3-4 months)",
              roi: "Very High",
              cac: 350
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -10000,
              revenue: business.revenue * 1.15,
              customers: Math.round(10000 / 300),
              expenses: business.expenses + 3000
            },
            description: "Your premium positioning has attracted higher-value customers willing to pay more, though acquisition is slower."
          },
          {
            optionId: 2,
            effects: {
              cash: -8000,
              revenue: business.revenue * 0.95,
              customers: Math.round(8000 / 200),
              expenses: business.expenses + 2500
            },
            description: "Your affordable positioning has attracted more customers at a faster pace, though with lower average revenue per user."
          },
          {
            optionId: 3,
            effects: {
              cash: -15000,
              revenue: business.revenue * 1.25,
              customers: Math.round(15000 / 350),
              expenses: business.expenses + 5000
            },
            description: "Your innovation positioning has attracted early adopters and tech enthusiasts willing to pay premium prices for cutting-edge solutions."
          }
        ]
      }
    ];
    
    const selected = decisions[Math.floor(Math.random() * decisions.length)];
    
    return {
      businessId: business.id,
      type: "marketing",
      title: selected.title,
      description: selected.description,
      options: selected.options,
      consequences: selected.consequences,
      deadline: business.currentQuarter + 1,
      urgency
    };
  }
  
  /**
   * Generate a product decision
   */
  private generateProductDecision(business: Business): InsertDecision {
    const urgency = Math.random() < 0.3 ? "urgent" : "normal";
    const decisions = [
      {
        title: "Product Development Focus",
        description: "Where should we focus our product development resources this quarter?",
        options: [
          {
            id: 1,
            label: "New Features",
            description: "Develop new features to expand product capabilities",
            metrics: {
              cost: 18000,
              timeframe: "Medium (2-3 months)",
              roi: "Medium"
            }
          },
          {
            id: 2,
            label: "User Experience Improvements",
            description: "Enhance the UX/UI to improve user satisfaction and retention",
            metrics: {
              cost: 12000,
              timeframe: "Medium (2 months)",
              roi: "High"
            }
          },
          {
            id: 3,
            label: "Technical Debt & Performance",
            description: "Address technical debt and improve performance",
            metrics: {
              cost: 15000,
              timeframe: "Medium (2 months)",
              roi: "Low"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -18000,
              productProgress: 15,
              expenses: business.expenses + 6000
            },
            description: "Your development team has added several new features that expand your product's capabilities and appeal to a wider audience."
          },
          {
            optionId: 2,
            effects: {
              cash: -12000,
              productProgress: 10,
              expenses: business.expenses + 4000,
              customers: business.customers * 0.1
            },
            description: "The improved user experience has increased customer satisfaction and retention rates, leading to more word-of-mouth referrals."
          },
          {
            optionId: 3,
            effects: {
              cash: -15000,
              productProgress: 5,
              expenses: business.expenses * 0.95
            },
            description: "Addressing technical debt has improved system stability and reduced long-term maintenance costs, though with limited immediate benefits."
          }
        ]
      },
      {
        title: "Product Expansion Strategy",
        description: "How should we expand our product offerings?",
        options: [
          {
            id: 1,
            label: "Enterprise Features",
            description: "Add features targeted at larger enterprise customers",
            metrics: {
              cost: 25000,
              timeframe: "Longer (3-4 months)",
              roi: "Very High"
            }
          },
          {
            id: 2,
            label: "Mobile Application",
            description: "Develop a mobile app version of our product",
            metrics: {
              cost: 20000,
              timeframe: "Medium (2-3 months)",
              roi: "High"
            }
          },
          {
            id: 3,
            label: "API & Integration Ecosystem",
            description: "Build APIs and integrations with popular tools",
            metrics: {
              cost: 15000,
              timeframe: "Medium (2 months)",
              roi: "Medium"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -25000,
              productProgress: 20,
              expenses: business.expenses + 8000,
              valuation: business.valuation * 1.2
            },
            description: "The enterprise features have opened doors to larger clients with bigger budgets, significantly increasing your potential market size."
          },
          {
            optionId: 2,
            effects: {
              cash: -20000,
              productProgress: 15,
              expenses: business.expenses + 6500,
              customers: business.customers * 0.15
            },
            description: "Your mobile app has expanded your reach and engagement, making your product more accessible to users on the go."
          },
          {
            optionId: 3,
            effects: {
              cash: -15000,
              productProgress: 10,
              expenses: business.expenses + 5000,
              valuation: business.valuation * 1.1
            },
            description: "Your API ecosystem has created a platform that other developers can build on, increasing the value and stickiness of your product."
          }
        ]
      }
    ];
    
    const selected = decisions[Math.floor(Math.random() * decisions.length)];
    
    return {
      businessId: business.id,
      type: "product",
      title: selected.title,
      description: selected.description,
      options: selected.options,
      consequences: selected.consequences,
      deadline: business.currentQuarter + 1,
      urgency
    };
  }
  
  /**
   * Generate an HR decision
   */
  private generateHRDecision(business: Business): InsertDecision | null {
    // Only generate HR decisions if the company has at least a few employees
    if (business.employees < 2 && Math.random() > 0.5) {
      return null;
    }
    
    const urgency = Math.random() < 0.3 ? "urgent" : "normal";
    const decisions = [
      {
        title: "Team Expansion Strategy",
        description: "How should we grow our team this quarter?",
        options: [
          {
            id: 1,
            label: "Hire Senior Developer",
            description: "Bring on an experienced developer to lead technical initiatives",
            metrics: {
              cost: 30000,
              timeframe: "Immediate",
              roi: "High"
            }
          },
          {
            id: 2,
            label: "Expand Marketing Team",
            description: "Hire additional marketing specialists to accelerate growth",
            metrics: {
              cost: 22000,
              timeframe: "Immediate",
              roi: "Medium"
            }
          },
          {
            id: 3,
            label: "Customer Support Staff",
            description: "Build a customer support team to improve service",
            metrics: {
              cost: 18000,
              timeframe: "Immediate",
              roi: "Medium"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -30000,
              employees: business.employees + 1,
              expenses: business.expenses + 10000,
              productProgress: 10
            },
            description: "The senior developer has significantly improved your development capacity and code quality, accelerating your product roadmap."
          },
          {
            optionId: 2,
            effects: {
              cash: -22000,
              employees: business.employees + 2,
              expenses: business.expenses + 7500,
              customers: business.customers * 0.2
            },
            description: "Your expanded marketing team has implemented new campaigns and strategies, improving your customer acquisition efforts."
          },
          {
            optionId: 3,
            effects: {
              cash: -18000,
              employees: business.employees + 2,
              expenses: business.expenses + 6000,
              customers: business.customers * 0.05
            },
            description: "The customer support team has improved user satisfaction and retention, reducing churn and increasing referrals."
          }
        ]
      },
      {
        title: "Employee Compensation Strategy",
        description: "How should we approach employee compensation to attract and retain talent?",
        options: [
          {
            id: 1,
            label: "Competitive Salaries",
            description: "Offer above-market salaries to attract top talent",
            metrics: {
              cost: business.employees * 5000,
              timeframe: "Immediate",
              roi: "Medium"
            }
          },
          {
            id: 2,
            label: "Equity-Based Compensation",
            description: "Offer equity packages to align employee interests with company success",
            metrics: {
              cost: business.employees * 2000,
              timeframe: "Long-term",
              roi: "High"
            }
          },
          {
            id: 3,
            label: "Balanced Approach",
            description: "Offer moderate salaries with good benefits and work-life balance",
            metrics: {
              cost: business.employees * 3000,
              timeframe: "Immediate",
              roi: "Medium"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -(business.employees * 5000),
              expenses: business.expenses * 1.15,
              productProgress: 5
            },
            description: "Higher salaries have attracted skilled professionals, improving productivity and reducing turnover, though at a higher operational cost."
          },
          {
            optionId: 2,
            effects: {
              cash: -(business.employees * 2000),
              expenses: business.expenses * 1.05,
              valuation: business.valuation * 0.98
            },
            description: "The equity packages have created a strong sense of ownership and long-term commitment, aligning employee incentives with company success."
          },
          {
            optionId: 3,
            effects: {
              cash: -(business.employees * 3000),
              expenses: business.expenses * 1.1,
              productProgress: 3
            },
            description: "Your balanced approach has created a healthy work culture with reasonable retention rates and moderate productivity improvements."
          }
        ]
      }
    ];
    
    const selected = decisions[Math.floor(Math.random() * decisions.length)];
    
    return {
      businessId: business.id,
      type: "hr",
      title: selected.title,
      description: selected.description,
      options: selected.options,
      consequences: selected.consequences,
      deadline: business.currentQuarter + 1,
      urgency
    };
  }
  
  /**
   * Generate a finance decision
   */
  private generateFinanceDecision(business: Business): InsertDecision {
    const urgency = Math.random() < 0.3 ? "urgent" : "normal";
    const decisions = [
      {
        title: "Funding Strategy",
        description: "How should we address our financial needs for growth?",
        options: [
          {
            id: 1,
            label: "Seek Venture Capital",
            description: "Raise a significant round of funding from VCs",
            metrics: {
              cost: 10000, // Legal and preparation costs
              timeframe: "Medium (3-4 months)",
              roi: "Very High"
            }
          },
          {
            id: 2,
            label: "Bootstrap & Organic Growth",
            description: "Focus on revenue growth and reinvestment without external funding",
            metrics: {
              cost: 0,
              timeframe: "Slow (6+ months)",
              roi: "Medium"
            }
          },
          {
            id: 3,
            label: "Strategic Partnership",
            description: "Secure funding through a strategic partnership with an established company",
            metrics: {
              cost: 5000, // Legal and preparation costs
              timeframe: "Medium (2-3 months)",
              roi: "High"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: business.valuation * 0.2 - 10000, // 20% of valuation minus costs
              valuation: business.valuation * 1.5
            },
            description: "You've successfully raised a venture capital round, significantly increasing your available cash for growth, though you've diluted your ownership."
          },
          {
            optionId: 2,
            effects: {
              expenses: business.expenses * 0.9,
              cash: -business.expenses * 0.1
            },
            description: "By focusing on organic growth, you've maintained full control of your company and developed a sustainable business model, though with slower growth."
          },
          {
            optionId: 3,
            effects: {
              cash: business.valuation * 0.1 - 5000, // 10% of valuation minus costs
              valuation: business.valuation * 1.2,
              customers: business.customers * 0.2
            },
            description: "Your strategic partnership has provided moderate funding along with valuable market access and business development opportunities."
          }
        ]
      },
      {
        title: "Pricing Strategy",
        description: "How should we adjust our pricing strategy?",
        options: [
          {
            id: 1,
            label: "Premium Pricing",
            description: "Increase prices to emphasize quality and value",
            metrics: {
              cost: 5000, // Marketing costs for repositioning
              timeframe: "Quick (1 month)",
              roi: "High"
            }
          },
          {
            id: 2,
            label: "Competitive Pricing",
            description: "Reduce prices to gain market share from competitors",
            metrics: {
              cost: 5000, // Marketing costs for repositioning
              timeframe: "Quick (1 month)",
              roi: "Medium"
            }
          },
          {
            id: 3,
            label: "Tiered Pricing Model",
            description: "Implement multiple pricing tiers to address different market segments",
            metrics: {
              cost: 8000, // Implementation and marketing costs
              timeframe: "Medium (2 months)",
              roi: "Very High"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -5000,
              revenue: business.revenue * 1.2,
              customers: business.customers * 0.9
            },
            description: "Your premium pricing has increased revenue per customer, though you've lost some price-sensitive customers in the process."
          },
          {
            optionId: 2,
            effects: {
              cash: -5000,
              revenue: business.revenue * 0.85,
              customers: business.customers * 1.3
            },
            description: "Your competitive pricing has significantly increased your customer base, though with lower revenue per customer."
          },
          {
            optionId: 3,
            effects: {
              cash: -8000,
              revenue: business.revenue * 1.15,
              customers: business.customers * 1.1
            },
            description: "Your tiered pricing model has allowed you to capture different market segments, optimizing both customer acquisition and revenue generation."
          }
        ]
      }
    ];
    
    const selected = decisions[Math.floor(Math.random() * decisions.length)];
    
    return {
      businessId: business.id,
      type: "finance",
      title: selected.title,
      description: selected.description,
      options: selected.options,
      consequences: selected.consequences,
      deadline: business.currentQuarter + 1,
      urgency
    };
  }
  
  /**
   * Generate an operations decision
   */
  private generateOperationsDecision(business: Business): InsertDecision {
    const urgency = Math.random() < 0.3 ? "urgent" : "normal";
    const decisions = [
      {
        title: "Office Space Decision",
        description: "How should we address our workspace needs as we grow?",
        options: [
          {
            id: 1,
            label: "Upgrade Office Space",
            description: "Lease a larger, modern office space in a prime location",
            metrics: {
              cost: 20000, // Upfront costs (deposit, furnishing, moving)
              timeframe: "Medium (2 months)",
              roi: "Low"
            }
          },
          {
            id: 2,
            label: "Remote-First Approach",
            description: "Minimize office space and embrace remote work",
            metrics: {
              cost: 5000, // Setup costs for remote infrastructure
              timeframe: "Quick (1 month)",
              roi: "High"
            }
          },
          {
            id: 3,
            label: "Coworking Membership",
            description: "Use flexible coworking spaces for the team",
            metrics: {
              cost: 10000, // Initial memberships and setup
              timeframe: "Quick (1 month)",
              roi: "Medium"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -20000,
              expenses: business.expenses + 8000,
              valuation: business.valuation * 1.05
            },
            description: "The new office has impressed clients and improved team collaboration, though with significantly higher monthly expenses."
          },
          {
            optionId: 2,
            effects: {
              cash: -5000,
              expenses: business.expenses * 0.9,
              productProgress: -3
            },
            description: "Your remote-first approach has substantially reduced overhead costs, though with some initial challenges in team coordination."
          },
          {
            optionId: 3,
            effects: {
              cash: -10000,
              expenses: business.expenses * 0.95,
              productProgress: 0
            },
            description: "Coworking spaces provide flexibility as you grow, with moderate monthly costs and good networking opportunities."
          }
        ]
      },
      {
        title: "Technology Infrastructure",
        description: "How should we upgrade our technical infrastructure?",
        options: [
          {
            id: 1,
            label: "Cloud Migration",
            description: "Move all systems to cloud-based infrastructure",
            metrics: {
              cost: 15000,
              timeframe: "Medium (2-3 months)",
              roi: "High"
            }
          },
          {
            id: 2,
            label: "Hybrid Approach",
            description: "Maintain some on-premises systems while migrating others to the cloud",
            metrics: {
              cost: 10000,
              timeframe: "Quick (1-2 months)",
              roi: "Medium"
            }
          },
          {
            id: 3,
            label: "Security & Compliance Focus",
            description: "Invest primarily in security upgrades and compliance certifications",
            metrics: {
              cost: 20000,
              timeframe: "Longer (3-4 months)",
              roi: "Medium"
            }
          }
        ],
        consequences: [
          {
            optionId: 1,
            effects: {
              cash: -15000,
              expenses: business.expenses * 0.95,
              productProgress: 5
            },
            description: "The cloud migration has improved scalability and reduced long-term infrastructure costs, despite the initial investment."
          },
          {
            optionId: 2,
            effects: {
              cash: -10000,
              expenses: business.expenses,
              productProgress: 2
            },
            description: "Your hybrid approach has balanced costs with performance needs, providing a practical transition path to newer technologies."
          },
          {
            optionId: 3,
            effects: {
              cash: -20000,
              expenses: business.expenses * 1.05,
              valuation: business.valuation * 1.1
            },
            description: "The security and compliance investments have opened doors to regulated industries and enterprise clients, despite higher ongoing costs."
          }
        ]
      }
    ];
    
    const selected = decisions[Math.floor(Math.random() * decisions.length)];
    
    return {
      businessId: business.id,
      type: "operations",
      title: selected.title,
      description: selected.description,
      options: selected.options,
      consequences: selected.consequences,
      deadline: business.currentQuarter + 1,
      urgency
    };
  }
  
  /**
   * Generate a crisis or opportunity decision
   */
  private generateCrisisOrOpportunity(business: Business): InsertDecision | null {
    const isCrisis = Math.random() < 0.5;
    const urgency = "urgent"; // These are always urgent
    
    if (isCrisis) {
      const crises = [
        {
          title: "Unexpected Technical Issue",
          description: "A critical bug has been discovered in your product. How will you address it?",
          options: [
            {
              id: 1,
              label: "All Hands Response",
              description: "Redirect all development resources to fix the issue immediately",
              metrics: {
                cost: 5000,
                timeframe: "Immediate",
                roi: "Necessary"
              }
            },
            {
              id: 2,
              label: "Dedicated Team Response",
              description: "Assign a specific team to address the issue while others continue regular work",
              metrics: {
                cost: 3000,
                timeframe: "Quick (3-5 days)",
                roi: "Medium"
              }
            },
            {
              id: 3,
              label: "Temporary Workaround",
              description: "Implement a temporary workaround while planning a more thorough fix",
              metrics: {
                cost: 1000,
                timeframe: "Immediate",
                roi: "Low"
              }
            }
          ],
          consequences: [
            {
              optionId: 1,
              effects: {
                cash: -5000,
                productProgress: -5
              },
              description: "The all-hands approach fixed the issue quickly, but delayed other development work significantly."
            },
            {
              optionId: 2,
              effects: {
                cash: -3000,
                productProgress: -2
              },
              description: "The dedicated team fixed the issue effectively while minimizing disruption to other work."
            },
            {
              optionId: 3,
              effects: {
                cash: -1000,
                customers: business.customers * 0.95,
                productProgress: -1
              },
              description: "The workaround prevented immediate damage but some customers were unhappy with the temporary solution."
            }
          ]
        },
        {
          title: "Competitor Price War",
          description: "Your main competitor has significantly dropped their prices. How will you respond?",
          options: [
            {
              id: 1,
              label: "Match Price Drop",
              description: "Lower your prices to remain competitive",
              metrics: {
                cost: 0,
                timeframe: "Immediate",
                roi: "Necessary"
              }
            },
            {
              id: 2,
              label: "Value-Add Strategy",
              description: "Keep prices stable but add more value to your offering",
              metrics: {
                cost: 10000,
                timeframe: "Medium (1 month)",
                roi: "Medium"
              }
            },
            {
              id: 3,
              label: "Focus on Different Segment",
              description: "Target a different market segment less affected by the price war",
              metrics: {
                cost: 15000,
                timeframe: "Longer (2-3 months)",
                roi: "High"
              }
            }
          ],
          consequences: [
            {
              optionId: 1,
              effects: {
                revenue: business.revenue * 0.8,
                customers: business.customers * 1.1
              },
              description: "Matching the price drop preserved your market share but significantly reduced your profit margins."
            },
            {
              optionId: 2,
              effects: {
                cash: -10000,
                revenue: business.revenue * 0.95,
                customers: business.customers * 0.98
              },
              description: "Adding more value helped retain most customers despite the higher price, maintaining healthier margins."
            },
            {
              optionId: 3,
              effects: {
                cash: -15000,
                revenue: business.revenue * 0.9,
                customers: business.customers * 0.85,
                valuation: business.valuation * 1.05
              },
              description: "Pivoting to a different segment caused short-term disruption but positioned your business in a less price-sensitive market."
            }
          ]
        }
      ];
      
      const selected = crises[Math.floor(Math.random() * crises.length)];
      
      return {
        businessId: business.id,
        type: Math.random() < 0.5 ? "operations" : "finance",
        title: selected.title,
        description: selected.description,
        options: selected.options,
        consequences: selected.consequences,
        deadline: business.currentQuarter,
        urgency
      };
    } else {
      const opportunities = [
        {
          title: "Partnership Opportunity",
          description: "A larger company in your industry has proposed a partnership. How will you proceed?",
          options: [
            {
              id: 1,
              label: "Full Strategic Partnership",
              description: "Enter a comprehensive partnership with deep integration",
              metrics: {
                cost: 10000,
                timeframe: "Longer (3 months)",
                roi: "Very High"
              }
            },
            {
              id: 2,
              label: "Limited Co-Marketing Deal",
              description: "Pursue a narrower partnership focused on co-marketing",
              metrics: {
                cost: 5000,
                timeframe: "Medium (1-2 months)",
                roi: "Medium"
              }
            },
            {
              id: 3,
              label: "Decline Partnership",
              description: "Maintain independence and focus on your own growth path",
              metrics: {
                cost: 0,
                timeframe: "Immediate",
                roi: "Low"
              }
            }
          ],
          consequences: [
            {
              optionId: 1,
              effects: {
                cash: -10000,
                customers: business.customers * 1.3,
                revenue: business.revenue * 1.2,
                valuation: business.valuation * 1.15
              },
              description: "The strategic partnership has significantly accelerated your market access and provided valuable resources."
            },
            {
              optionId: 2,
              effects: {
                cash: -5000,
                customers: business.customers * 1.15,
                revenue: business.revenue * 1.05
              },
              description: "The co-marketing arrangement has brought new customers while maintaining your independence and flexibility."
            },
            {
              optionId: 3,
              effects: {
                valuation: business.valuation * 1.02
              },
              description: "Staying independent has preserved your long-term options and strategic flexibility, though without immediate benefits."
            }
          ]
        },
        {
          title: "Acquisition Offer",
          description: "You've received an acquisition offer from a larger company. How will you respond?",
          options: [
            {
              id: 1,
              label: "Accept the Offer",
              description: "Agree to be acquired at the proposed valuation",
              metrics: {
                cost: 0,
                timeframe: "Medium (2-3 months to close)",
                roi: "Immediate Exit"
              }
            },
            {
              id: 2,
              label: "Negotiate for Better Terms",
              description: "Counter with a higher valuation and better terms",
              metrics: {
                cost: 0,
                timeframe: "Longer (3-4 months)",
                roi: "Potentially Higher"
              }
            },
            {
              id: 3,
              label: "Decline the Offer",
              description: "Reject the acquisition and continue independent growth",
              metrics: {
                cost: 0,
                timeframe: "Immediate",
                roi: "Long-term Potential"
              }
            }
          ],
          consequences: [
            {
              optionId: 1,
              effects: {
                cash: business.valuation * 1.5
              },
              description: "You've successfully sold your company! This simulation will end with this outcome, and you can start a new venture."
            },
            {
              optionId: 2,
              effects: {
                valuation: business.valuation * 1.2
              },
              description: "Your negotiation has increased interest in your company and raised your perceived value, though the acquisition is still pending."
            },
            {
              optionId: 3,
              effects: {
                valuation: business.valuation * 1.1
              },
              description: "Rejecting the offer has reinforced your independence and ambitions, slightly raising your market profile."
            }
          ]
        }
      ];
      
      const selected = opportunities[Math.floor(Math.random() * opportunities.length)];
      
      return {
        businessId: business.id,
        type: Math.random() < 0.5 ? "finance" : "operations",
        title: selected.title,
        description: selected.description,
        options: selected.options,
        consequences: selected.consequences,
        deadline: business.currentQuarter,
        urgency
      };
    }
  }
  
  /**
   * Process a decision choice and apply consequences
   */
  async processDecision(decision: Decision, optionIndex: number, business: Business): Promise<DecisionResult> {
    const options = decision.options as unknown as DecisionOption[];
    const consequences = decision.consequences as unknown as DecisionConsequence[];
    
    // Find the consequence that matches the selected option
    const selectedConsequence = consequences.find(c => c.optionId === options[optionIndex].id);
    
    if (!selectedConsequence) {
      throw new Error("Invalid option selected");
    }
    
    // Apply the consequences to the business
    const updatedBusiness = { ...business };
    const effects = selectedConsequence.effects;
    
    // Update business properties based on effects
    if (effects.cash) {
      updatedBusiness.currentCash += effects.cash;
    }
    
    if (effects.revenue) {
      updatedBusiness.revenue = effects.revenue;
    }
    
    if (effects.expenses) {
      updatedBusiness.expenses = effects.expenses;
    }
    
    if (effects.customers) {
      updatedBusiness.customers = Math.max(0, Math.round(effects.customers));
    }
    
    if (effects.employees) {
      updatedBusiness.employees = Math.max(1, effects.employees);
    }
    
    if (effects.valuation) {
      updatedBusiness.valuation = effects.valuation;
    }
    
    if (effects.productProgress) {
      updatedBusiness.productProgress = Math.min(100, Math.max(0, updatedBusiness.productProgress + effects.productProgress));
    }
    
    if (effects.marketShare) {
      updatedBusiness.marketShare = Math.min(1, Math.max(0, effects.marketShare));
    }
    
    // Create an event based on the decision
    const newEvent: InsertEvent = {
      businessId: business.id,
      type: "internal",
      title: `Decision: ${decision.title}`,
      description: selectedConsequence.description,
      impact: effects,
      quarter: business.currentQuarter,
      year: business.currentYear,
      icon: this.getIconForDecisionType(decision.type),
      iconColor: this.getColorForDecisionType(decision.type)
    };
    
    return {
      business: updatedBusiness,
      newEvents: [newEvent]
    };
  }
  
  /**
   * Get an appropriate icon for the decision type
   */
  private getIconForDecisionType(type: string): string {
    switch (type) {
      case "marketing":
        return "fa-solid fa-bullhorn";
      case "product":
        return "fa-solid fa-code";
      case "hr":
        return "fa-solid fa-users";
      case "finance":
        return "fa-solid fa-chart-line";
      case "operations":
        return "fa-solid fa-cogs";
      default:
        return "fa-solid fa-lightbulb";
    }
  }
  
  /**
   * Get an appropriate color for the decision type
   */
  private getColorForDecisionType(type: string): string {
    switch (type) {
      case "marketing":
        return "warning";
      case "product":
        return "primary";
      case "hr":
        return "success";
      case "finance":
        return "info";
      case "operations":
        return "secondary";
      default:
        return "primary";
    }
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

export const decisionEngine = new DecisionEngine();
