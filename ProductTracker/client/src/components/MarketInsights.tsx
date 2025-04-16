import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface CompetitorWithShare {
  id: number;
  name: string;
  marketShare: number;
  color: string;
}

interface MarketNews {
  title: string;
  description: string;
}

export default function MarketInsights({
  company,
  competitors,
  isLoading
}: {
  company: any;
  competitors: any[];
  isLoading: boolean;
}) {
  const [sortedCompetitors, setSortedCompetitors] = useState<CompetitorWithShare[]>([]);
  const [marketNews, setMarketNews] = useState<MarketNews[]>([]);
  
  // Helper to get a color based on index
  const getColor = (index: number) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ef4444", "#64748b"];
    return colors[index % colors.length];
  };
  
  // Prepare competitor data
  useEffect(() => {
    if (company && competitors && !isLoading) {
      // Add company to the competitors list
      const allPlayers = [
        {
          id: 0,
          name: company.name,
          marketShare: company.marketShare,
          color: "#3b82f6" // Primary color for the company
        },
        ...competitors.map((comp, index) => ({
          id: comp.id,
          name: comp.name,
          marketShare: comp.marketShare,
          color: getColor(index + 1)
        }))
      ];
      
      // Sort by market share in descending order
      const sorted = [...allPlayers].sort((a, b) => b.marketShare - a.marketShare);
      setSortedCompetitors(sorted);
      
      // Set up some market news
      setMarketNews([
        {
          title: `${sorted[0].name} Leads Market with ${sorted[0].marketShare.toFixed(1)}% Share`,
          description: `The market leader continues to dominate with innovative product offerings.`
        },
        {
          title: `Industry Growth Rate at 22%`,
          description: `The ${company.type} market continues to expand, with enterprise adoption accelerating.`
        },
        {
          title: `New Regulations on the Horizon`,
          description: `Upcoming changes to data privacy laws may impact product development strategies.`
        }
      ]);
    }
  }, [company, competitors, isLoading]);

  // Calculate total market size
  const totalMarketSize = sortedCompetitors.reduce((sum, comp) => sum + comp.marketShare, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
        <h2 className="text-lg font-medium text-neutral-800">Market Insights</h2>
        <p className="text-sm text-neutral-500 mt-1">Competitor analysis and market trends</p>
      </div>
      <div className="p-6">
        <div className="mb-5">
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Competitor Analysis</h3>
          <div className="space-y-3">
            {isLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="flex items-center">
                  <Skeleton className="h-5 w-24" />
                  <div className="flex-1 bg-neutral-100 rounded-full h-2.5 mx-2">
                    <Skeleton className="h-2.5 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))
            ) : sortedCompetitors.length > 0 ? (
              sortedCompetitors.map((competitor) => (
                <div key={competitor.id} className="flex items-center">
                  <span className="text-sm font-medium text-neutral-800 w-24 truncate">
                    {competitor.name}
                  </span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-2.5 ml-2">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${(competitor.marketShare / Math.max(...sortedCompetitors.map(c => c.marketShare))) * 100}%`,
                        backgroundColor: competitor.color
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-neutral-600 ml-3">
                    {competitor.marketShare.toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-500">No competitor data available</div>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-5 mb-5">
          <h3 className="text-sm font-medium text-neutral-700 mb-3">Market News</h3>
          <div className="space-y-4">
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-5 w-48 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : marketNews.length > 0 ? (
              marketNews.map((news, index) => (
                <div key={index}>
                  <p className="text-sm font-medium text-neutral-800">{news.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">{news.description}</p>
                </div>
              ))
            ) : (
              <div className="text-sm text-neutral-500">No market news available</div>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-5">
          <h3 className="text-sm font-medium text-neutral-700 mb-3">AI Mentor Insights</h3>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-sm text-neutral-800">
                <span className="font-medium">Strategic Opportunity:</span> {
                  company?.type === "Tech" 
                    ? "Focus on enterprise features to differentiate from competitors targeting small businesses."
                    : company?.type === "E-commerce"
                    ? "Consider expanding your product line to reach more market segments."
                    : company?.type === "Service"
                    ? "Your customer satisfaction rates could be leveraged for referral marketing."
                    : "Investing in automation could significantly reduce your production costs."
                }
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Based on market research and competitor analysis, this approach aligns with your current strengths and market position.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
