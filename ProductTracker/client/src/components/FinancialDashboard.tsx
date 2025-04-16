import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

interface FinancialData {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export default function FinancialDashboard({
  company,
  metrics,
  isLoading
}: {
  company: any;
  metrics: any[];
  isLoading: boolean;
}) {
  const [chartData, setChartData] = useState<FinancialData[]>([]);
  const [financialRows, setFinancialRows] = useState<any[]>([]);

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

      // Format for charts - show at most last 4 quarters
      const recentMetrics = sortedMetrics.slice(-4);
      const formattedData = recentMetrics.map(metric => ({
        name: `Y${metric.year}-Q${metric.quarter}`,
        revenue: metric.revenue,
        expenses: metric.expenses,
        profit: metric.profit,
      }));

      setChartData(formattedData);

      // Create table data for the financial breakdown
      if (recentMetrics.length > 1) {
        const currentMetrics = recentMetrics[recentMetrics.length - 1];
        const prevMetrics = recentMetrics[recentMetrics.length - 2];

        // Simplified revenue breakdown
        const rows = [
          {
            category: "SaaS Subscriptions",
            previous: prevMetrics.revenue * 0.8, // Simulated breakdown
            current: currentMetrics.revenue * 0.8,
          },
          {
            category: "Consulting Services",
            previous: prevMetrics.revenue * 0.2,
            current: currentMetrics.revenue * 0.2,
          },
          {
            category: "Staff Costs",
            previous: prevMetrics.expenses * 0.6,
            current: currentMetrics.expenses * 0.6,
          },
          {
            category: "Marketing",
            previous: prevMetrics.expenses * 0.15,
            current: currentMetrics.expenses * 0.15,
          },
          {
            category: "Infrastructure",
            previous: prevMetrics.expenses * 0.25,
            current: currentMetrics.expenses * 0.25,
          }
        ];

        setFinancialRows(rows);
      }
    }
  }, [metrics]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Get most recent and previous metrics if available
  const currentMetrics = metrics && metrics.length > 0 ? 
    metrics[metrics.length - 1] : null;
  const prevMetrics = metrics && metrics.length > 1 ? 
    metrics[metrics.length - 2] : null;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
        <h2 className="text-lg font-medium text-neutral-800">Financial Dashboard</h2>
        <p className="text-sm text-neutral-500 mt-1">Current financial status and projections</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Revenue Card */}
          <div className="p-4 border rounded-lg border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-500">Revenue</h3>
            {isLoading ? (
              <Skeleton className="h-7 w-28 mt-1" />
            ) : (
              <p className="mt-1 text-xl font-semibold text-green-600">
                {currentMetrics ? formatCurrency(currentMetrics.revenue) : "$0"}
              </p>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : currentMetrics && prevMetrics ? (
              <span className={`inline-flex items-center text-xs mt-1 ${
                calculatePercentChange(currentMetrics.revenue, prevMetrics.revenue) >= 0 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {calculatePercentChange(currentMetrics.revenue, prevMetrics.revenue) >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(calculatePercentChange(currentMetrics.revenue, prevMetrics.revenue)).toFixed(1)}% vs last quarter
              </span>
            ) : (
              <span className="text-xs text-neutral-500 mt-1">No previous data</span>
            )}
          </div>

          {/* Expenses Card */}
          <div className="p-4 border rounded-lg border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-500">Expenses</h3>
            {isLoading ? (
              <Skeleton className="h-7 w-28 mt-1" />
            ) : (
              <p className="mt-1 text-xl font-semibold text-neutral-800">
                {currentMetrics ? formatCurrency(currentMetrics.expenses) : "$0"}
              </p>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : currentMetrics && prevMetrics ? (
              <span className={`inline-flex items-center text-xs mt-1 ${
                calculatePercentChange(currentMetrics.expenses, prevMetrics.expenses) <= 0 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {calculatePercentChange(currentMetrics.expenses, prevMetrics.expenses) <= 0 ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(calculatePercentChange(currentMetrics.expenses, prevMetrics.expenses)).toFixed(1)}% vs last quarter
              </span>
            ) : (
              <span className="text-xs text-neutral-500 mt-1">No previous data</span>
            )}
          </div>

          {/* Net Profit Card */}
          <div className="p-4 border rounded-lg border-neutral-200">
            <h3 className="text-sm font-medium text-neutral-500">Net Profit</h3>
            {isLoading ? (
              <Skeleton className="h-7 w-28 mt-1" />
            ) : (
              <p className={`mt-1 text-xl font-semibold ${
                currentMetrics && currentMetrics.profit >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {currentMetrics ? formatCurrency(currentMetrics.profit) : "$0"}
              </p>
            )}
            {isLoading ? (
              <Skeleton className="h-4 w-24 mt-1" />
            ) : currentMetrics && prevMetrics ? (
              <span className={`inline-flex items-center text-xs mt-1 ${
                calculatePercentChange(currentMetrics.profit, prevMetrics.profit) >= 0 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {calculatePercentChange(currentMetrics.profit, prevMetrics.profit) >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(calculatePercentChange(currentMetrics.profit, prevMetrics.profit)).toFixed(1)}% vs last quarter
              </span>
            ) : (
              <span className="text-xs text-neutral-500 mt-1">No previous data</span>
            )}
          </div>
        </div>

        {/* Financial Trend Chart */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-700 mb-4">Quarterly Financial Trend</h3>
          <div className="h-64">
            {isLoading ? (
              <Skeleton className="h-full w-full" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, undefined]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="profit" fill="#10b981" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500 border border-dashed rounded-md">
                No financial data available yet
              </div>
            )}
          </div>
        </div>

        {/* Financial Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-3 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  {prevMetrics ? `Q${prevMetrics.quarter} ${prevMetrics.year}` : 'Previous'}
                </th>
                <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  {currentMetrics ? `Q${currentMetrics.quarter} ${currentMetrics.year}` : 'Current'}
                </th>
                <th className="px-3 py-3 bg-neutral-50 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <Skeleton className="h-5 w-40" />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right">
                      <Skeleton className="h-5 w-20 ml-auto" />
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right">
                      <Skeleton className="h-5 w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : financialRows.length > 0 ? (
                financialRows.map((row, index) => (
                  <tr key={index}>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-neutral-800">
                      {row.category}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-neutral-700">
                      {formatCurrency(row.previous)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-neutral-700">
                      {formatCurrency(row.current)}
                    </td>
                    <td className={`px-3 py-3 whitespace-nowrap text-right text-sm ${
                      calculatePercentChange(row.current, row.previous) >= 0 
                        ? row.category.includes("Cost") || row.category.includes("Marketing") || row.category.includes("Infrastructure")
                          ? "text-red-600" 
                          : "text-green-600"
                        : row.category.includes("Cost") || row.category.includes("Marketing") || row.category.includes("Infrastructure")
                          ? "text-green-600"
                          : "text-red-600"
                    }`}>
                      {calculatePercentChange(row.current, row.previous) >= 0 ? "+" : ""}
                      {calculatePercentChange(row.current, row.previous).toFixed(1)}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-sm text-neutral-500">
                    No financial data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
