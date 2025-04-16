import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function MentorPage() {
  const { state } = useGameContext();
  const { formatCurrency } = useBusinessContext();
  const [question, setQuestion] = useState("");
  
  if (!state.business) return null;
  
  // Sort mentor advice by date (newest first)
  const sortedAdvice = [...state.mentorAdvice].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Group advice by type
  const groupedAdvice = {
    financial: sortedAdvice.filter(advice => advice.type === 'financial'),
    marketing: sortedAdvice.filter(advice => advice.type === 'marketing'),
    product: sortedAdvice.filter(advice => advice.type === 'product'),
    hr: sortedAdvice.filter(advice => advice.type === 'hr'),
    general: sortedAdvice.filter(advice => advice.type === 'general')
  };
  
  // Get icon for advice type
  const getAdviceTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      financial: "fa-solid fa-chart-line",
      marketing: "fa-solid fa-bullhorn",
      product: "fa-solid fa-code",
      hr: "fa-solid fa-users",
      general: "fa-solid fa-lightbulb"
    };
    
    return icons[type] || "fa-solid fa-lightbulb";
  };
  
  // Get color for advice type
  const getAdviceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      financial: "text-emerald-500",
      marketing: "text-amber-500",
      product: "text-blue-500",
      hr: "text-purple-500",
      general: "text-indigo-500"
    };
    
    return colors[type] || "text-indigo-500";
  };
  
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the question to the backend
    console.log("Question submitted:", question);
    setQuestion("");
  };
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          AI Mentor
        </h1>
        <p className="text-gray-600">
          Get strategic advice and insights for your business
        </p>
      </div>
      
      {/* AI Mentor Introduction */}
      <Card className="mb-6">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-primary-100 rounded-full p-4">
              <i className="fa-solid fa-robot text-primary-600 text-2xl"></i>
            </div>
            <div className="ml-6">
              <h2 className="font-heading font-semibold text-xl text-gray-900 mb-2">Meet Your AI Business Mentor</h2>
              <p className="text-gray-600">
                I analyze your business performance and provide strategic recommendations to help you grow your startup.
                As your company evolves, I'll offer personalized insights based on market trends and your business decisions.
              </p>
              
              <div className="mt-4">
                <form onSubmit={handleSubmitQuestion} className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your business strategy..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!question.trim()}>
                    <i className="fa-solid fa-paper-plane mr-2"></i> Ask
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Insights Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Key Business Insights</CardTitle>
          <CardDescription>Critical metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <i className="fa-solid fa-fire text-amber-500 mr-2"></i>
                  <h3 className="font-medium text-gray-900">Burn Rate Alert</h3>
                </div>
                <p className="text-sm text-gray-600">
                  At your current spend rate of {formatCurrency(state.business.quarterlyBurnRate / 3)} per month, 
                  your runway is {Math.round(state.business.currentCash / (state.business.quarterlyBurnRate / 3))} months.
                  Consider optimizing operational costs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <i className="fa-solid fa-rocket text-emerald-500 mr-2"></i>
                  <h3 className="font-medium text-gray-900">Growth Opportunity</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your customer acquisition rate is increasing by 15% quarterly. 
                  Now is an ideal time to invest in scaling your marketing efforts.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <i className="fa-solid fa-chess text-blue-500 mr-2"></i>
                  <h3 className="font-medium text-gray-900">Competitive Strategy</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your main competitor just raised prices by 10%. Consider a targeted 
                  marketing campaign to highlight your value proposition.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Mentor Advice Tabs */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Advice</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="hr">Human Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Strategic Advice</CardTitle>
              <CardDescription>Insights from your AI mentor across all business areas</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedAdvice.length > 0 ? (
                <div className="space-y-6">
                  {sortedAdvice.slice(0, 6).map((advice) => (
                    <div key={advice.id} className="border rounded-md p-4">
                      <div className="flex">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ${getAdviceTypeColor(advice.type)}`}>
                          <i className={getAdviceTypeIcon(advice.type)}></i>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">{advice.title}</h3>
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full capitalize">
                              {advice.type}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">{advice.content}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Q{advice.quarter}, Year {advice.year}
                            {advice.relatedTo && ` • Related to: ${advice.relatedTo}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-lightbulb text-2xl mb-2"></i>
                  <p>No mentor advice available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Insights will appear as your business progresses</p>
                </div>
              )}
            </CardContent>
            {sortedAdvice.length > 6 && (
              <CardFooter>
                <Button variant="outline" className="ml-auto">View All Advice</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Advice</CardTitle>
              <CardDescription>Strategic insights about your company's finances</CardDescription>
            </CardHeader>
            <CardContent>
              {groupedAdvice.financial.length > 0 ? (
                <div className="space-y-6">
                  {groupedAdvice.financial.map((advice) => (
                    <div key={advice.id} className="border rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-emerald-500">
                          <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{advice.title}</h3>
                          <p className="mt-1 text-gray-600">{advice.content}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Q{advice.quarter}, Year {advice.year}
                            {advice.relatedTo && ` • Related to: ${advice.relatedTo}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-chart-line text-2xl mb-2"></i>
                  <p>No financial advice available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Financial insights will appear as your business progresses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marketing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Advice</CardTitle>
              <CardDescription>Strategic insights about your marketing efforts</CardDescription>
            </CardHeader>
            <CardContent>
              {groupedAdvice.marketing.length > 0 ? (
                <div className="space-y-6">
                  {groupedAdvice.marketing.map((advice) => (
                    <div key={advice.id} className="border rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-amber-500">
                          <i className="fa-solid fa-bullhorn"></i>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{advice.title}</h3>
                          <p className="mt-1 text-gray-600">{advice.content}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Q{advice.quarter}, Year {advice.year}
                            {advice.relatedTo && ` • Related to: ${advice.relatedTo}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-bullhorn text-2xl mb-2"></i>
                  <p>No marketing advice available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Marketing insights will appear as your business progresses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="product" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Advice</CardTitle>
              <CardDescription>Strategic insights about your product development</CardDescription>
            </CardHeader>
            <CardContent>
              {groupedAdvice.product.length > 0 ? (
                <div className="space-y-6">
                  {groupedAdvice.product.map((advice) => (
                    <div key={advice.id} className="border rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-blue-500">
                          <i className="fa-solid fa-code"></i>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{advice.title}</h3>
                          <p className="mt-1 text-gray-600">{advice.content}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Q{advice.quarter}, Year {advice.year}
                            {advice.relatedTo && ` • Related to: ${advice.relatedTo}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-code text-2xl mb-2"></i>
                  <p>No product advice available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Product insights will appear as your business progresses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hr" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>HR Advice</CardTitle>
              <CardDescription>Strategic insights about your team and company culture</CardDescription>
            </CardHeader>
            <CardContent>
              {groupedAdvice.hr.length > 0 ? (
                <div className="space-y-6">
                  {groupedAdvice.hr.map((advice) => (
                    <div key={advice.id} className="border rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-purple-500">
                          <i className="fa-solid fa-users"></i>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{advice.title}</h3>
                          <p className="mt-1 text-gray-600">{advice.content}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Q{advice.quarter}, Year {advice.year}
                            {advice.relatedTo && ` • Related to: ${advice.relatedTo}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-users text-2xl mb-2"></i>
                  <p>No HR advice available yet</p>
                  <p className="text-sm text-gray-400 mt-1">HR insights will appear as your business progresses</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Strategic Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Resources</CardTitle>
          <CardDescription>Educational materials to help grow your business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900">Startup Fundamentals</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Learn the essential principles of building a successful startup from ideation to scale.
                </p>
                <div className="space-y-2">
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-file-pdf mr-1"></i>
                    Lean Startup Methodology
                  </a>
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-video mr-1"></i>
                    Finding Product-Market Fit
                  </a>
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-link mr-1"></i>
                    Growth Metrics That Matter
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <i className="fa-solid fa-money-bill-trend-up"></i>
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900">Funding Strategies</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Discover different funding options and how to secure investment for your business.
                </p>
                <div className="space-y-2">
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-video mr-1"></i>
                    Creating the Perfect Pitch Deck
                  </a>
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-file-pdf mr-1"></i>
                    VC Term Sheet Guide
                  </a>
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-link mr-1"></i>
                    Bootstrapping vs Venture Capital
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <i className="fa-solid fa-people-group"></i>
                  </div>
                  <h3 className="ml-3 font-medium text-gray-900">Team Building</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Learn how to hire, manage, and retain top talent for your growing business.
                </p>
                <div className="space-y-2">
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-file-pdf mr-1"></i>
                    Hiring Your First Employees
                  </a>
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-video mr-1"></i>
                    Creating a Strong Company Culture
                  </a>
                  <a href="#" className="text-xs text-primary-600 hover:underline flex items-center">
                    <i className="fa-solid fa-link mr-1"></i>
                    Equity Distribution Guide
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
