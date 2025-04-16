import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function BusinessMetrics({ 
  company, 
  metrics, 
  isLoading 
}: { 
  company: any; 
  metrics: any[]; 
  isLoading: boolean;
}) {
  const [chartData, setChartData] = useState<any[]>([]);

  // Prepare chart data from metrics
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      // Sort metrics by year and quarter
      const sortedMetrics = [...metrics].sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return a.quarter - b.quarter;
      });

      // Format for charts
      const formattedData = sortedMetrics.map(metric => ({
        name: `Y${metric.year}-Q${metric.quarter}`,
        valuation: metric.valuation / 1000000, // Convert to millions
        revenue: metric.revenue / 1000,        // Convert to thousands
        marketShare: metric.marketShare,
      }));

      setChartData(formattedData);
    }
  }, [metrics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPercentChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Calculate percentage changes if metrics are available
  let valuationChange = 0;
  let revenueChange = 0;
  let marketShareChange = 0;

  if (metrics && metrics.length >= 2) {
    const currentMetrics = metrics[metrics.length - 1];
    const previousMetrics = metrics[metrics.length - 2];
    
    valuationChange = getPercentChange(currentMetrics.valuation, previousMetrics.valuation);
    revenueChange = getPercentChange(currentMetrics.revenue, previousMetrics.revenue);
    marketShareChange = getPercentChange(currentMetrics.marketShare, previousMetrics.marketShare);
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-5 w-64" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-neutral-800">{company?.name}</h2>
              <p className="text-neutral-500 text-sm mt-1">
                {company?.type} Startup • Founded Q1 Y1 • {company?.employees} Employees
              </p>
            </>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </>
          ) : (
            <>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-primary">
                {company?.type} Industry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {company?.fundingType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                Growing
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company Valuation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-neutral-500 text-sm font-medium">Company Valuation</h3>
              {isLoading ? (
                <Skeleton className="h-8 w-28 mt-1" />
              ) : (
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(company?.valuation || 0)}
                </p>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                valuationChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {valuationChange >= 0 ? '+' : ''}{valuationChange.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="h-[180px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value}M`}
                  />
                  <Tooltip formatter={(value) => [`$${value}M`, "Valuation"]} />
                  <Line 
                    type="monotone" 
                    dataKey="valuation" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-neutral-500 text-sm font-medium">Monthly Revenue</h3>
              {isLoading ? (
                <Skeleton className="h-8 w-28 mt-1" />
              ) : (
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(company?.revenue || 0)}
                </p>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                revenueChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="h-[180px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${value}K`}
                  />
                  <Tooltip formatter={(value) => [`$${value}K`, "Revenue"]} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Market Share */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-neutral-500 text-sm font-medium">Market Share</h3>
              {isLoading ? (
                <Skeleton className="h-8 w-28 mt-1" />
              ) : (
                <p className="text-2xl font-semibold mt-1">
                  {company?.marketShare.toFixed(1)}%
                </p>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                marketShareChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {marketShareChange >= 0 ? '+' : ''}{marketShareChange.toFixed(1)}%
              </span>
            )}
          </div>
          <div className="h-[180px]">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, "Market Share"]} />
                  <Line 
                    type="monotone" 
                    dataKey="marketShare" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
