import { useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartData } from "@/lib/types";

export default function PerformanceChart() {
  const { state } = useGameContext();
  const { formatCurrency } = useBusinessContext();
  
  const [chartType, setChartType] = useState<"revenue" | "expenses" | "profit">("revenue");
  
  // Use financial records to generate chart data
  const chartData: ChartData[] = state.financials
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.quarter - b.quarter;
    })
    .map(record => ({
      name: `Q${record.quarter} Y${record.year}`,
      revenue: record.revenue,
      expenses: record.expenses,
      profit: record.profit
    }));
  
  // If no data, provide sample data for demonstration
  if (chartData.length === 0 && state.business) {
    chartData.push({
      name: `Q${state.business.currentQuarter} Y${state.business.currentYear}`,
      revenue: state.business.revenue,
      expenses: state.business.expenses,
      profit: state.business.revenue - state.business.expenses
    });
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-heading font-semibold text-lg text-gray-900">Business Performance</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              chartType === "revenue" 
                ? "text-gray-700 bg-gray-100" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => setChartType("revenue")}
          >
            Revenue
          </button>
          <button 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              chartType === "expenses" 
                ? "text-gray-700 bg-gray-100" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => setChartType("expenses")}
          >
            Expenses
          </button>
          <button 
            className={`px-2 py-1 text-xs font-medium rounded-md ${
              chartType === "profit" 
                ? "text-gray-700 bg-gray-100" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
            onClick={() => setChartType("profit")}
          >
            Profit
          </button>
        </div>
      </div>
      <div className="h-64 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value as number)}
              />
              {chartType === "revenue" && (
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--chart-1))" 
                  fill="hsl(var(--chart-1))" 
                  fillOpacity={0.3} 
                />
              )}
              {chartType === "expenses" && (
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(var(--chart-2))" 
                  fill="hsl(var(--chart-2))" 
                  fillOpacity={0.3} 
                />
              )}
              {chartType === "profit" && (
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="hsl(var(--chart-3))" 
                  fill="hsl(var(--chart-3))" 
                  fillOpacity={0.3} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <i className="fa-solid fa-chart-line text-4xl mb-2"></i>
              <p className="text-sm">No financial data available yet</p>
              <p className="text-xs text-gray-500">Data will appear as your business progresses</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
