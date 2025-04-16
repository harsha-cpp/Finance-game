import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";

export default function FinancePage() {
  const { state } = useGameContext();
  const { formatCurrency, formatPercentage } = useBusinessContext();
  
  if (!state.business) return null;
  
  const business = state.business;
  
  // Sort financial records by date (latest first)
  const sortedFinancials = [...state.financials].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.quarter - a.quarter;
  });
  
  // Sort financial records by date (oldest first) for charts
  const chartData = [...state.financials].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.quarter - b.quarter;
  }).map(record => ({
    name: `Q${record.quarter} Y${record.year}`,
    revenue: record.revenue,
    expenses: record.expenses,
    profit: record.profit,
    cash: record.cash,
    marketing: record.marketingCost,
    development: record.developmentCost,
    operations: record.operationsCost,
    hr: record.hrCost,
    other: record.otherCosts
  }));
  
  // If no financial records, use current business state
  if (chartData.length === 0 && business) {
    chartData.push({
      name: `Q${business.currentQuarter} Y${business.currentYear}`,
      revenue: business.revenue,
      expenses: business.expenses,
      profit: business.revenue - business.expenses,
      cash: business.currentCash,
      marketing: Math.round(business.expenses * 0.3),
      development: Math.round(business.expenses * 0.4),
      operations: Math.round(business.expenses * 0.1),
      hr: Math.round(business.expenses * 0.15),
      other: Math.round(business.expenses * 0.05)
    });
  }
  
  // Current quarter expense breakdown for pie chart
  const expenseBreakdown = [
    { name: "Marketing", value: chartData[chartData.length - 1]?.marketing || 0 },
    { name: "Development", value: chartData[chartData.length - 1]?.development || 0 },
    { name: "Operations", value: chartData[chartData.length - 1]?.operations || 0 },
    { name: "HR", value: chartData[chartData.length - 1]?.hr || 0 },
    { name: "Other", value: chartData[chartData.length - 1]?.other || 0 }
  ];
  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  
  // Calculate runway in months
  const monthlyBurnRate = business.quarterlyBurnRate / 3;
  const runway = monthlyBurnRate > 0 ? Math.round(business.currentCash / monthlyBurnRate) : 999;
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Financial Management
        </h1>
        <p className="text-gray-600">
          Track your company's financial health and performance over time
        </p>
      </div>
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Current Cash</div>
            <div className="text-2xl font-bold">{formatCurrency(business.currentCash)}</div>
            <div className="text-xs text-gray-500 mt-2">
              Runway: <span className="font-medium text-gray-700">{runway} months</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Quarterly Revenue</div>
            <div className="text-2xl font-bold">{formatCurrency(business.revenue)}</div>
            <div className="text-xs text-gray-500 mt-2">
              Monthly: <span className="font-medium text-gray-700">{formatCurrency(business.revenue / 3)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Quarterly Expenses</div>
            <div className="text-2xl font-bold">{formatCurrency(business.expenses)}</div>
            <div className="text-xs text-gray-500 mt-2">
              Burn Rate: <span className="font-medium text-gray-700">{formatCurrency(monthlyBurnRate)}/mo</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Quarterly Profit/Loss</div>
            <div className={`text-2xl font-bold ${(business.revenue - business.expenses) >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {formatCurrency(business.revenue - business.expenses)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Margin: <span className="font-medium text-gray-700">
                {business.revenue > 0 ? formatPercentage((business.revenue - business.expenses) / business.revenue) : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Charts & Data */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income Statement</TabsTrigger>
          <TabsTrigger value="expenses">Expense Breakdown</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue vs. Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--chart-1))" />
                        <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--chart-3))" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <i className="fa-solid fa-chart-bar text-4xl mb-2"></i>
                        <p className="text-sm">No financial data available yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <i className="fa-solid fa-chart-pie text-4xl mb-2"></i>
                        <p className="text-sm">No expense data available yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="income" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Income Statements</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedFinancials.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium text-gray-500">Period</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Revenue</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Expenses</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Profit/Loss</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Margin</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-500">Customers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedFinancials.map((record, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-3 whitespace-nowrap">Q{record.quarter}, Year {record.year}</td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(record.revenue)}</td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(record.expenses)}</td>
                          <td className={`px-4 py-3 text-right whitespace-nowrap ${record.profit >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                            {formatCurrency(record.profit)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {record.revenue > 0 ? formatPercentage(record.profit / record.revenue) : '0%'}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">{record.customers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-table text-2xl mb-2"></i>
                  <p>No financial records available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Records will appear as your business progresses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      stackOffset="expand"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Tooltip 
                        formatter={(value, name) => [formatCurrency(value as number), name]} 
                        labelFormatter={(label) => `Quarter: ${label}`}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="marketing" name="Marketing" stackId="1" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" />
                      <Area type="monotone" dataKey="development" name="Development" stackId="1" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" />
                      <Area type="monotone" dataKey="operations" name="Operations" stackId="1" fill="hsl(var(--chart-3))" stroke="hsl(var(--chart-3))" />
                      <Area type="monotone" dataKey="hr" name="HR" stackId="1" fill="hsl(var(--chart-4))" stroke="hsl(var(--chart-4))" />
                      <Area type="monotone" dataKey="other" name="Other" stackId="1" fill="hsl(var(--chart-5))" stroke="hsl(var(--chart-5))" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <i className="fa-solid fa-chart-area text-4xl mb-2"></i>
                      <p className="text-sm">No expense data available yet</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Area type="monotone" dataKey="cash" name="Cash Balance" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="profit" name="Profit/Loss" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <i className="fa-solid fa-chart-line text-4xl mb-2"></i>
                      <p className="text-sm">No cash flow data available yet</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle>Key Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Company Valuation</h3>
              <p className="text-xl font-bold">{formatCurrency(business.valuation)}</p>
              <p className="text-xs text-gray-500 mt-1">Based on revenue multiple and growth rate</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Revenue Multiple</h3>
              <p className="text-xl font-bold">{(business.valuation / (business.revenue * 4 || 1)).toFixed(1)}x</p>
              <p className="text-xs text-gray-500 mt-1">Valuation / Annual Revenue</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Acquisition Cost</h3>
              <p className="text-xl font-bold">
                {business.customers > 0 
                  ? formatCurrency((chartData[chartData.length - 1]?.marketing || 0) / (business.customers || 1)) 
                  : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Marketing spend / New customers</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Revenue Per Customer</h3>
              <p className="text-xl font-bold">
                {business.customers > 0 
                  ? formatCurrency(business.revenue / business.customers) 
                  : 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Quarterly revenue / Total customers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
