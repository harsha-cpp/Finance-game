import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";

export default function BusinessMetrics() {
  const { state } = useGameContext();
  const { formatCurrency, formatPercentage } = useBusinessContext();
  
  if (!state.metrics) return null;
  
  const metrics = state.metrics;
  const { cash, revenue, valuation, burnRate, runway, mrrGrowth, customers, revenueMultiple } = metrics;
  
  // Calculate growth percentages (in a real app, would come from state)
  const cashGrowth = 8.2;
  const revenueGrowth = 12.4;
  const valuationGrowth = 5.3;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Cash Position */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-500">Cash Position</h3>
          <div className="relative group">
            <i className="fa-solid fa-circle-info text-gray-400"></i>
            <div className="hidden group-hover:block absolute z-10 w-60 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
              Your available cash for day-to-day operations
              <div className="absolute w-2 h-2 -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 bg-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(cash)}</span>
          <span className="ml-2 text-sm font-medium text-success-500">+{formatPercentage(cashGrowth / 100)}</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Runway: <span className="font-medium text-gray-700">{Math.round(runway)} months</span></span>
          <span>Burn rate: <span className="font-medium text-gray-700">{formatCurrency(burnRate)}/mo</span></span>
        </div>
      </div>
      
      {/* Revenue */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
          <div className="relative group">
            <i className="fa-solid fa-circle-info text-gray-400"></i>
            <div className="hidden group-hover:block absolute z-10 w-60 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
              Your company's income before expenses
              <div className="absolute w-2 h-2 -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 bg-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(revenue / 3)}</span>
          <span className="ml-2 text-sm font-medium text-success-500">+{formatPercentage(revenueGrowth / 100)}</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>MRR Growth: <span className="font-medium text-gray-700">{formatCurrency(mrrGrowth)}</span></span>
          <span>Customers: <span className="font-medium text-gray-700">{customers}</span></span>
        </div>
      </div>
      
      {/* Company Value */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-500">Company Valuation</h3>
          <div className="relative group">
            <i className="fa-solid fa-circle-info text-gray-400"></i>
            <div className="hidden group-hover:block absolute z-10 w-60 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1">
              Estimated value based on revenue and growth
              <div className="absolute w-2 h-2 -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 bg-gray-900"></div>
            </div>
          </div>
        </div>
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(valuation)}</span>
          <span className="ml-2 text-sm font-medium text-success-500">+{formatPercentage(valuationGrowth / 100)}</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Revenue Multiple: <span className="font-medium text-gray-700">{revenueMultiple.toFixed(1)}x</span></span>
          <span>Next Milestone: <span className="font-medium text-gray-700">{formatCurrency(valuation * 1.5)}</span></span>
        </div>
      </div>
    </div>
  );
}
