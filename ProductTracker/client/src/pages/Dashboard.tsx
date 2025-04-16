import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useBusinessContext } from "@/context/BusinessContext";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import BusinessMetrics from "@/components/BusinessMetrics";
import DecisionPanel from "@/components/DecisionPanel";
import FinancialDashboard from "@/components/FinancialDashboard";
import MarketInsights from "@/components/MarketInsights";
import BusinessTimeline from "@/components/BusinessTimeline";
import EventAlert from "@/components/EventAlert";

export default function Dashboard() {
  const params = useParams<{ id: string }>();
  const companyId = parseInt(params.id);
  const [location, navigate] = useLocation();
  const { isAuthenticated, loadingAuth } = useBusinessContext();

  // Company data
  const {
    data: company,
    isLoading: isLoadingCompany,
    refetch: refetchCompany,
  } = useQuery({
    queryKey: [`/api/companies/${companyId}`],
    enabled: !!companyId && isAuthenticated,
  });

  // Metrics data
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: [`/api/companies/${companyId}/metrics`],
    enabled: !!companyId && isAuthenticated,
  });

  // Competitors data
  const {
    data: competitors,
    isLoading: isLoadingCompetitors,
    refetch: refetchCompetitors,
  } = useQuery({
    queryKey: [`/api/companies/${companyId}/competitors`],
    enabled: !!companyId && isAuthenticated,
  });

  // Events data
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: [`/api/companies/${companyId}/events`],
    enabled: !!companyId && isAuthenticated,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loadingAuth) {
      navigate("/");
    }
  }, [isAuthenticated, loadingAuth, navigate]);

  // Handle refresh of all data
  const refreshData = () => {
    refetchCompany();
    refetchMetrics();
    refetchCompetitors();
    refetchEvents();
  };

  const isLoading = isLoadingCompany || isLoadingMetrics || isLoadingCompetitors || isLoadingEvents;

  if (!companyId || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Header 
        company={company} 
        isLoading={isLoadingCompany} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Business Overview/Metrics */}
        <BusinessMetrics 
          company={company} 
          metrics={metrics} 
          isLoading={isLoading} 
        />

        {/* Active Events Alert */}
        {events && events.length > 0 && (
          <div className="mb-8">
            {events.map((event) => (
              <EventAlert 
                key={event.id} 
                event={event} 
                onResolve={refreshData} 
              />
            ))}
          </div>
        )}

        {/* Strategic Decisions Panel */}
        <DecisionPanel 
          company={company} 
          onDecisionsSubmit={refreshData} 
          isLoading={isLoading} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Financial Dashboard */}
          <div className="lg:col-span-2">
            <FinancialDashboard 
              company={company} 
              metrics={metrics} 
              isLoading={isLoading} 
            />
          </div>

          {/* Market Insights */}
          <div className="lg:col-span-1 space-y-6">
            <MarketInsights 
              company={company} 
              competitors={competitors} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </main>

      {/* Business Timeline */}
      <BusinessTimeline 
        metrics={metrics} 
        isLoading={isLoading} 
      />
    </div>
  );
}
