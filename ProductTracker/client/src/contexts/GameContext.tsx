import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { Business, Decision, Event, Competitor, MentorAdvice, FinancialRecord } from '@shared/schema';
import { GameState, TimeControls, BusinessMetrics } from '@/lib/types';

interface GameContextType {
  state: GameState;
  initialize: () => Promise<void>;
  createBusiness: (businessData: any) => Promise<void>;
  makeDecision: (decisionId: number, optionIndex: number) => Promise<void>;
  advanceTime: () => Promise<void>;
  setTimeControls: (controls: TimeControls) => void;
  openDecisionModal: (decision: Decision) => void;
  closeDecisionModal: () => void;
  openBusinessSetup: () => void;
  closeBusinessSetup: () => void;
}

const initialState: GameState = {
  user: null,
  business: null,
  decisions: [],
  events: [],
  competitors: [],
  mentorAdvice: [],
  financials: [],
  metrics: null,
  selectedDecision: null,
  timeControls: {
    isPaused: true,
    speed: 'normal'
  },
  showBusinessSetup: false,
  showDecisionModal: false,
  isLoading: false,
  isInitialized: false
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameContextProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Initialize game state
  const initialize = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Get initial user data
      const userResponse = await apiRequest('GET', '/api/user');
      const userData = await userResponse.json();
      
      // Check if user has a business
      const businessesResponse = await apiRequest('GET', '/api/businesses');
      const businessesData = await businessesResponse.json();
      
      if (businessesData.length > 0) {
        // User has business, load game state
        const business = businessesData[0];
        
        // Load all related data
        const [decisions, events, competitors, mentorAdvice, financials] = await Promise.all([
          apiRequest('GET', `/api/businesses/${business.id}/decisions`).then(res => res.json()),
          apiRequest('GET', `/api/businesses/${business.id}/events`).then(res => res.json()),
          apiRequest('GET', `/api/businesses/${business.id}/competitors`).then(res => res.json()),
          apiRequest('GET', `/api/businesses/${business.id}/mentor-advice`).then(res => res.json()),
          apiRequest('GET', `/api/businesses/${business.id}/financials`).then(res => res.json())
        ]);
        
        // Calculate metrics based on business data
        const metrics: BusinessMetrics = {
          cash: business.currentCash,
          revenue: business.revenue,
          valuation: business.valuation,
          burnRate: business.quarterlyBurnRate / 3, // Convert to monthly
          runway: business.currentCash / (business.quarterlyBurnRate / 3),
          mrrGrowth: calculateMRRGrowth(financials),
          customers: business.customers,
          revenueMultiple: calculateRevenueMultiple(business),
          marketShare: business.marketShare,
        };
        
        setState({
          user: {
            id: userData.id,
            displayName: userData.displayName,
            role: userData.role
          },
          business,
          decisions,
          events,
          competitors,
          mentorAdvice,
          financials,
          metrics,
          selectedDecision: null,
          timeControls: {
            isPaused: true,
            speed: 'normal'
          },
          showBusinessSetup: false,
          showDecisionModal: false,
          isLoading: false,
          isInitialized: true
        });
        
        // If on setup page, redirect to dashboard
        if (location === '/setup') {
          navigate('/');
        }
      } else {
        // No business found, show setup
        setState({
          ...initialState,
          user: {
            id: userData.id,
            displayName: userData.displayName,
            role: userData.role
          },
          showBusinessSetup: true,
          isLoading: false,
          isInitialized: true
        });
        
        // Redirect to setup page
        if (location !== '/setup') {
          navigate('/setup');
        }
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
      toast({
        title: "Initialization Failed",
        description: "Could not load the game data. Please try again.",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
    }
  }, [location, navigate, toast]);
  
  const calculateMRRGrowth = (financials: FinancialRecord[]): number => {
    if (financials.length < 2) return 0;
    const sorted = [...financials].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.quarter - a.quarter;
    });
    
    const current = sorted[0];
    const previous = sorted[1];
    
    // Calculate monthly revenue
    const currentMRR = current.revenue / 3;
    const previousMRR = previous.revenue / 3;
    
    return currentMRR - previousMRR;
  };
  
  const calculateRevenueMultiple = (business: Business): number => {
    if (business.revenue <= 0) return 0;
    const annualRevenue = business.revenue * 4; // Convert quarterly to annual
    return business.valuation / annualRevenue;
  };
  
  // Create a new business
  const createBusinessMutation = useMutation({
    mutationFn: async (businessData: any) => {
      const response = await apiRequest('POST', '/api/businesses', businessData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/businesses'] });
      initialize();
      toast({
        title: "Business Created",
        description: "Your startup is ready to begin operations!",
      });
    },
    onError: (error) => {
      console.error('Failed to create business:', error);
      toast({
        title: "Creation Failed",
        description: "Could not create your business. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const createBusiness = useCallback(async (businessData: any) => {
    if (!state.user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a business.",
        variant: "destructive"
      });
      return;
    }
    
    await createBusinessMutation.mutateAsync({
      ...businessData,
      userId: state.user.id
    });
  }, [state.user, createBusinessMutation, toast]);
  
  // Make a decision
  const makeDecisionMutation = useMutation({
    mutationFn: async ({ decisionId, optionIndex }: { decisionId: number, optionIndex: number }) => {
      const response = await apiRequest('POST', `/api/decisions/${decisionId}/choose`, { optionIndex });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${state.business?.id}/decisions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${state.business?.id}`] });
      
      // Update state with new data
      setState(prev => ({
        ...prev,
        business: data.business,
        decisions: data.decisions,
        events: [...prev.events, ...(data.newEvents || [])],
        metrics: {
          ...prev.metrics!,
          cash: data.business.currentCash,
          revenue: data.business.revenue,
          valuation: data.business.valuation,
          burnRate: data.business.quarterlyBurnRate / 3,
          runway: data.business.currentCash / (data.business.quarterlyBurnRate / 3),
          customers: data.business.customers,
          marketShare: data.business.marketShare,
        },
        showDecisionModal: false
      }));
      
      toast({
        title: "Decision Made",
        description: "Your decision has been processed.",
      });
    },
    onError: (error) => {
      console.error('Failed to make decision:', error);
      toast({
        title: "Error",
        description: "Could not process your decision. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const makeDecision = useCallback(async (decisionId: number, optionIndex: number) => {
    await makeDecisionMutation.mutateAsync({ decisionId, optionIndex });
  }, [makeDecisionMutation]);
  
  // Advance time
  const advanceTimeMutation = useMutation({
    mutationFn: async () => {
      if (!state.business) return null;
      const response = await apiRequest('POST', `/api/businesses/${state.business.id}/advance-time`);
      return response.json();
    },
    onSuccess: (data) => {
      if (!data) return;
      
      queryClient.invalidateQueries({ queryKey: [`/api/businesses/${state.business?.id}`] });
      
      // Update state with new data
      setState(prev => ({
        ...prev,
        business: data.business,
        decisions: [...prev.decisions, ...(data.newDecisions || [])],
        events: [...prev.events, ...(data.newEvents || [])],
        competitors: data.competitors || prev.competitors,
        mentorAdvice: [...prev.mentorAdvice, ...(data.newAdvice || [])],
        financials: [...prev.financials, data.financialRecord],
        metrics: {
          ...prev.metrics!,
          cash: data.business.currentCash,
          revenue: data.business.revenue,
          valuation: data.business.valuation,
          burnRate: data.business.quarterlyBurnRate / 3,
          runway: data.business.currentCash / (data.business.quarterlyBurnRate / 3),
          mrrGrowth: calculateMRRGrowth([data.financialRecord, ...prev.financials]),
          customers: data.business.customers,
          revenueMultiple: calculateRevenueMultiple(data.business),
          marketShare: data.business.marketShare,
        }
      }));
      
      toast({
        title: `Q${data.business.currentQuarter} Year ${data.business.currentYear}`,
        description: "Time has advanced to the next quarter.",
      });
    },
    onError: (error) => {
      console.error('Failed to advance time:', error);
      toast({
        title: "Error",
        description: "Could not advance time. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const advanceTime = useCallback(async () => {
    await advanceTimeMutation.mutateAsync();
  }, [advanceTimeMutation]);
  
  // Time controls
  const setTimeControls = useCallback((controls: TimeControls) => {
    setState(prev => ({
      ...prev,
      timeControls: controls
    }));
  }, []);
  
  // Decision modal controls
  const openDecisionModal = useCallback((decision: Decision) => {
    setState(prev => ({
      ...prev,
      selectedDecision: decision,
      showDecisionModal: true
    }));
  }, []);
  
  const closeDecisionModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showDecisionModal: false
    }));
  }, []);
  
  // Business setup modal controls
  const openBusinessSetup = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBusinessSetup: true
    }));
  }, []);
  
  const closeBusinessSetup = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBusinessSetup: false
    }));
  }, []);
  
  return (
    <GameContext.Provider value={{
      state,
      initialize,
      createBusiness,
      makeDecision,
      advanceTime,
      setTimeControls,
      openDecisionModal,
      closeDecisionModal,
      openBusinessSetup,
      closeBusinessSetup
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
}
