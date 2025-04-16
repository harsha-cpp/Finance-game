import { createContext, useContext, ReactNode } from 'react';
import { useGameContext } from './GameContext';
import { BusinessType, DecisionType, UrgencyLevel, BusinessArea } from '@/lib/types';

interface BusinessContextType {
  getBusinessTypeName: (type: BusinessType) => string;
  getBusinessTypeDescription: (type: BusinessType) => string;
  getBusinessTypeDetails: (type: BusinessType) => string[];
  getDecisionTypeName: (type: DecisionType) => string;
  getUrgencyLevelDisplay: (level: UrgencyLevel) => { label: string; color: string };
  getBusinessAreas: () => BusinessArea[];
  formatCurrency: (amount: number) => string;
  formatPercentage: (value: number) => string;
  formatNumber: (value: number) => string;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessContextProvider({ children }: { children: ReactNode }) {
  const { state } = useGameContext();
  
  const getBusinessTypeName = (type: BusinessType): string => {
    const types = {
      tech: "Tech Startup",
      ecommerce: "E-commerce",
      service: "Service Business",
      manufacturing: "Manufacturing"
    };
    
    return types[type] || "Business";
  };
  
  const getBusinessTypeDescription = (type: BusinessType): string => {
    const descriptions = {
      tech: "SaaS, mobile apps, web platforms",
      ecommerce: "Online retail, marketplace, D2C",
      service: "Consulting, agency, professional services",
      manufacturing: "Physical product production"
    };
    
    return descriptions[type] || "";
  };
  
  const getBusinessTypeDetails = (type: BusinessType): string[] => {
    const details = {
      tech: [
        "High growth potential",
        "Scalable business model",
        "High development costs"
      ],
      ecommerce: [
        "Consistent revenue model",
        "Inventory/logistics challenges",
        "Competitive market"
      ],
      service: [
        "Lower startup costs",
        "Faster time to market",
        "Limited scalability"
      ],
      manufacturing: [
        "Tangible product IP",
        "High capital requirements",
        "Complex logistics"
      ]
    };
    
    return details[type] || [];
  };
  
  const getDecisionTypeName = (type: DecisionType): string => {
    const types = {
      marketing: "Marketing",
      operations: "Operations",
      hr: "Human Resources",
      product: "Product Development",
      finance: "Finance"
    };
    
    return types[type] || "Decision";
  };
  
  const getUrgencyLevelDisplay = (level: UrgencyLevel) => {
    const displays = {
      urgent: { label: "Urgent", color: "text-warning-600 bg-warning-50" },
      normal: { label: "Normal", color: "text-gray-600 bg-gray-50" },
      low: { label: "Low Priority", color: "text-blue-600 bg-blue-50" }
    };
    
    return displays[level] || displays.normal;
  };
  
  const getBusinessAreas = (): BusinessArea[] => {
    if (!state.business) return [];
    
    const business = state.business;
    
    const areas: BusinessArea[] = [
      {
        name: "Product",
        icon: "fa-solid fa-code",
        color: "text-primary-500",
        progress: business.productProgress,
        metrics: {
          "Current Project": "Mobile App v2.0",
          "ETA": "25 days"
        }
      },
      {
        name: "Marketing",
        icon: "fa-solid fa-bullhorn",
        color: "text-warning-500",
        metrics: {
          "Monthly Budget": formatCurrency(8500),
          "CAC": formatCurrency(250),
          "Active Campaigns": "3"
        }
      },
      {
        name: "Team",
        icon: "fa-solid fa-users",
        color: "text-success-500",
        metrics: {
          "Team Size": `${business.employees} people`,
          "Monthly Payroll": formatCurrency(business.employees * 7100),
          "Open Positions": "2"
        }
      },
      {
        name: "Market Share",
        icon: "fa-solid fa-chart-pie",
        color: "text-danger-500",
        metrics: {
          "Your Company": formatPercentage(business.marketShare),
          "Competitors": formatPercentage(1 - business.marketShare)
        }
      }
    ];
    
    return areas;
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value);
  };
  
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  return (
    <BusinessContext.Provider value={{
      getBusinessTypeName,
      getBusinessTypeDescription,
      getBusinessTypeDetails,
      getDecisionTypeName,
      getUrgencyLevelDisplay,
      getBusinessAreas,
      formatCurrency,
      formatPercentage,
      formatNumber
    }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessContextProvider');
  }
  return context;
}
