import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BusinessPage() {
  const { state } = useGameContext();
  const { formatCurrency, formatPercentage, getBusinessTypeName } = useBusinessContext();
  
  if (!state.business) return null;
  
  const business = state.business;
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {business.name}
        </h1>
        <p className="text-gray-600">
          {getBusinessTypeName(business.type as any)} • Founded in Year {business.currentYear - 1}, Quarter {business.currentQuarter}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Business Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Business Type:</dt>
                <dd className="font-medium">{getBusinessTypeName(business.type as any)}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Funding Type:</dt>
                <dd className="font-medium">{business.fundingType || "Bootstrapped"}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Current Quarter:</dt>
                <dd className="font-medium">Q{business.currentQuarter}, Year {business.currentYear}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Employees:</dt>
                <dd className="font-medium">{business.employees}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Customers:</dt>
                <dd className="font-medium">{business.customers}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-600">Market Share:</dt>
                <dd className="font-medium">{formatPercentage(business.marketShare)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Current Cash:</dt>
                <dd className="font-medium">{formatCurrency(business.currentCash)}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Quarterly Revenue:</dt>
                <dd className="font-medium">{formatCurrency(business.revenue)}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Quarterly Expenses:</dt>
                <dd className="font-medium">{formatCurrency(business.expenses)}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Quarterly Profit/Loss:</dt>
                <dd className={`font-medium ${(business.revenue - business.expenses) >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {formatCurrency(business.revenue - business.expenses)}
                </dd>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <dt className="text-gray-600">Monthly Burn Rate:</dt>
                <dd className="font-medium">{formatCurrency(business.quarterlyBurnRate / 3)}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-gray-600">Current Valuation:</dt>
                <dd className="font-medium">{formatCurrency(business.valuation)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Business Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {state.events.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {state.events
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 6)
                    .map((event, index, array) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {index < array.length - 1 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full bg-${event.iconColor || 'primary'}-500 flex items-center justify-center`}>
                                <i className={`${event.icon || 'fa-solid fa-star'} text-white`}></i>
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-900">{event.title}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{event.description}</p>
                              </div>
                              <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                Q{event.quarter}, Year {event.year}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No business milestones yet</p>
                <p className="text-sm text-gray-400 mt-1">Milestones will be recorded as your business grows</p>
              </div>
            )}
            
            {state.events.length > 6 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View All Milestones
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
