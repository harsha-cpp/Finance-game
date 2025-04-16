import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OperationsPage() {
  const { state, openDecisionModal } = useGameContext();
  const { formatCurrency } = useBusinessContext();
  
  if (!state.business) return null;
  
  const business = state.business;
  
  // Filter decisions related to operations and product
  const operationsDecisions = state.decisions.filter(
    d => (d.type === "operations" || d.type === "product") && !d.isCompleted
  );
  
  // Sample product development stages - in a full implementation, these would come from the API
  const productStages = [
    { 
      name: "MVP Development", 
      progress: Math.min(100, business.productProgress * 2), 
      description: "Building the first workable version with core features",
      timeline: "3 months"
    },
    { 
      name: "Beta Testing", 
      progress: business.productProgress > 50 ? Math.min(100, (business.productProgress - 50) * 2) : 0,
      description: "Testing with early users to gather feedback",
      timeline: "2 months"
    },
    { 
      name: "Full Launch", 
      progress: business.productProgress > 75 ? Math.min(100, (business.productProgress - 75) * 4) : 0,
      description: "Public release with complete feature set",
      timeline: "1 month"
    }
  ];
  
  // Current development focus
  const developmentFocus = business.productProgress < 50 
    ? "MVP Development" 
    : business.productProgress < 75 
      ? "Beta Testing" 
      : "Full Launch";
  
  // Days remaining estimate
  const daysRemaining = Math.max(0, 100 - business.productProgress) * 0.9;
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Operations & Product
        </h1>
        <p className="text-gray-600">
          Manage your product development and business operations
        </p>
      </div>
      
      {/* Product Development Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Development</CardTitle>
          <CardDescription>Current progress on your product development lifecycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-medium text-gray-900">Current Project: Mobile App v2.0</h3>
              <p className="text-sm text-gray-600">Focus: {developmentFocus}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Overall Progress: {business.productProgress}%</p>
              <p className="text-sm text-gray-600">Est. completion: {Math.round(daysRemaining)} days</p>
            </div>
          </div>
          
          <Progress value={business.productProgress} className="h-2 mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productStages.map((stage, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{stage.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                  <Progress value={stage.progress} className="h-1.5 mb-2" />
                  <div className="flex justify-between text-xs">
                    <span>{stage.progress}% complete</span>
                    <span>Timeline: {stage.timeline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="decisions" className="mb-6">
        <TabsList>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="decisions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Operations Decisions</CardTitle>
              <CardDescription>Make strategic decisions about your product and operations</CardDescription>
            </CardHeader>
            <CardContent>
              {operationsDecisions.length > 0 ? (
                <div className="space-y-4">
                  {operationsDecisions.map((decision) => (
                    <div key={decision.id} className="border-l-4 border-primary-500 bg-gray-50 p-4 rounded-r-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{decision.title}</h3>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                          {decision.type === "product" ? "Product" : "Operations"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{decision.description}</p>
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="link"
                          className="text-sm text-primary-600 hover:text-primary-800 font-medium p-0"
                          onClick={() => openDecisionModal(decision)}
                        >
                          Review Decision <i className="fa-solid fa-chevron-right ml-1 text-xs"></i>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-check-circle text-2xl mb-2"></i>
                  <p>No pending operations decisions</p>
                  <p className="text-sm text-gray-400 mt-1">Check back next quarter for new decisions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="infrastructure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure & Technology</CardTitle>
              <CardDescription>Manage your technical infrastructure and resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Server Infrastructure */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Server Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Plan:</span>
                        <span className="font-medium">Standard Cloud Hosting</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Cost:</span>
                        <span className="font-medium">{formatCurrency(2400)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Scalability:</span>
                        <span className="font-medium">Medium</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reliability:</span>
                        <span className="font-medium">99.9% Uptime</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Review Options
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Development Tools */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Development Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Tools:</span>
                        <span className="font-medium">Professional Suite</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Cost:</span>
                        <span className="font-medium">{formatCurrency(1800)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Team Size:</span>
                        <span className="font-medium">Up to 15 developers</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Features:</span>
                        <span className="font-medium">CI/CD, Testing, Monitoring</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Review Options
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Management</CardTitle>
              <CardDescription>Track and allocate resources for your operations</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Resource allocation */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Development Resource Allocation</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Core Product Features</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Bug Fixes & Maintenance</span>
                      <span className="text-sm text-gray-600">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">New Features</span>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Technical Debt</span>
                      <span className="text-sm text-gray-600">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </div>
              
              {/* Development Metrics */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Development Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Sprint Velocity</h4>
                      <div className="text-xl font-bold text-gray-900">32 points</div>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="text-success-600">+2 points</span> from last sprint
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Deployment Frequency</h4>
                      <div className="text-xl font-bold text-gray-900">2x / week</div>
                      <p className="text-xs text-gray-600 mt-1">
                        Industry avg: 1.5x / week
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Bug Fix Rate</h4>
                      <div className="text-xl font-bold text-gray-900">93%</div>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="text-success-600">+5%</span> from last quarter
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Product Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle>Product Roadmap</CardTitle>
          <CardDescription>Your product development timeline and future plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>
            
            <div className="relative pl-10 pb-8">
              <div className="absolute left-0 top-1 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <i className="fa-solid fa-check"></i>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Initial Research & Planning</h3>
                <p className="text-sm text-gray-600 mt-1">Define product requirements and user research</p>
                <div className="mt-1 text-xs text-gray-500">Completed in Q1 Year 1</div>
              </div>
            </div>
            
            <div className="relative pl-10 pb-8">
              <div className="absolute left-0 top-1 flex items-center justify-center">
                <div className={`h-8 w-8 rounded-full ${business.productProgress >= 25 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                  {business.productProgress >= 25 ? <i className="fa-solid fa-check"></i> : '2'}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">MVP Development</h3>
                <p className="text-sm text-gray-600 mt-1">Create first viable version with core features</p>
                <div className="mt-1 text-xs text-gray-500">{business.productProgress >= 25 ? 'Completed in Q2 Year 1' : 'In progress'}</div>
              </div>
            </div>
            
            <div className="relative pl-10 pb-8">
              <div className="absolute left-0 top-1 flex items-center justify-center">
                <div className={`h-8 w-8 rounded-full ${business.productProgress >= 50 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                  {business.productProgress >= 50 ? <i className="fa-solid fa-check"></i> : '3'}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Beta Testing</h3>
                <p className="text-sm text-gray-600 mt-1">Test with early users and gather feedback</p>
                <div className="mt-1 text-xs text-gray-500">{business.productProgress >= 50 ? 'Completed' : 'Scheduled'}</div>
              </div>
            </div>
            
            <div className="relative pl-10 pb-8">
              <div className="absolute left-0 top-1 flex items-center justify-center">
                <div className={`h-8 w-8 rounded-full ${business.productProgress >= 75 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                  {business.productProgress >= 75 ? <i className="fa-solid fa-check"></i> : '4'}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Full Launch</h3>
                <p className="text-sm text-gray-600 mt-1">Public release with complete feature set</p>
                <div className="mt-1 text-xs text-gray-500">{business.productProgress >= 75 ? 'Completed' : 'Scheduled'}</div>
              </div>
            </div>
            
            <div className="relative pl-10">
              <div className="absolute left-0 top-1 flex items-center justify-center">
                <div className={`h-8 w-8 rounded-full ${business.productProgress >= 100 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
                  {business.productProgress >= 100 ? <i className="fa-solid fa-check"></i> : '5'}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Feature Expansion</h3>
                <p className="text-sm text-gray-600 mt-1">Add premium features and expand functionality</p>
                <div className="mt-1 text-xs text-gray-500">Planned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
