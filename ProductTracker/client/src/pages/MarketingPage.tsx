import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from "recharts";

export default function MarketingPage() {
  const { state, openDecisionModal } = useGameContext();
  const { formatCurrency, formatPercentage } = useBusinessContext();
  
  if (!state.business) return null;
  
  const business = state.business;
  
  // Filter decisions related to marketing
  const marketingDecisions = state.decisions.filter(
    d => d.type === "marketing" && !d.isCompleted
  );
  
  // Sample marketing channels data - in a full implementation, these would come from the API
  const channels = [
    { name: "Social Media", allocation: 30, cac: 180, customers: 42, conversion: 2.8 },
    { name: "Search Ads", allocation: 25, cac: 210, customers: 35, conversion: 3.5 },
    { name: "Content Marketing", allocation: 20, cac: 150, customers: 25, conversion: 1.7 },
    { name: "Email Marketing", allocation: 15, cac: 85, customers: 18, conversion: 4.2 },
    { name: "Partnerships", allocation: 10, cac: 120, customers: 14, conversion: 6.5 }
  ];
  
  // Marketing performance chart data
  const performanceData = [
    { month: 'Jan', visitors: 4200, leads: 210, customers: 21 },
    { month: 'Feb', visitors: 4800, leads: 240, customers: 24 },
    { month: 'Mar', visitors: 5500, leads: 275, customers: 27 },
    { month: 'Apr', visitors: 6200, leads: 310, customers: 31 },
    { month: 'May', visitors: 7000, leads: 350, customers: 35 },
    { month: 'Jun', visitors: 8500, leads: 425, customers: 42 }
  ];
  
  // Channel allocation for pie chart
  const channelAllocation = channels.map(channel => ({
    name: channel.name,
    value: channel.allocation
  }));
  
  // Colors for charts
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  
  // Calculate monthly marketing budget
  const monthlyBudget = business.expenses * 0.3 / 3; // Assuming 30% of quarterly expenses goes to marketing
  
  // Calculate average CAC
  const totalCustomers = channels.reduce((sum, channel) => sum + channel.customers, 0);
  const averageCac = totalCustomers > 0 
    ? channels.reduce((sum, channel) => sum + (channel.cac * channel.customers), 0) / totalCustomers
    : 0;
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Marketing & Acquisition
        </h1>
        <p className="text-gray-600">
          Manage your marketing campaigns, customer acquisition, and brand strategy
        </p>
      </div>
      
      {/* Marketing Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Monthly Budget</div>
            <div className="text-2xl font-bold">{formatCurrency(monthlyBudget)}</div>
            <div className="text-xs text-gray-500 mt-2">
              {formatPercentage(0.3)} of operating expenses
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Customer Acquisition Cost</div>
            <div className="text-2xl font-bold">{formatCurrency(averageCac)}</div>
            <div className="text-xs text-gray-500 mt-2">
              Industry avg: {formatCurrency(280)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Active Campaigns</div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-gray-500 mt-2">
              Across 5 marketing channels
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</div>
            <div className="text-2xl font-bold">{formatPercentage(0.035)}</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-success-600">+0.5%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance" className="mb-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Performance</CardTitle>
              <CardDescription>Customer acquisition funnel and conversion metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="visitors" name="Website Visitors" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="leads" name="Leads Generated" stroke="hsl(var(--chart-2))" />
                    <Line type="monotone" dataKey="customers" name="New Customers" stroke="hsl(var(--chart-3))" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Funnel Conversion Rates</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Visitor → Lead</span>
                          <span className="font-medium">5.0%</span>
                        </div>
                        <Progress value={5} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Lead → Customer</span>
                          <span className="font-medium">10.0%</span>
                        </div>
                        <Progress value={10} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Overall Conversion</span>
                          <span className="font-medium">0.5%</span>
                        </div>
                        <Progress value={0.5} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Month-over-Month Growth</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Website Traffic</span>
                          <span className="font-medium text-success-600">+12.5%</span>
                        </div>
                        <Progress value={12.5} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Lead Generation</span>
                          <span className="font-medium text-success-600">+9.7%</span>
                        </div>
                        <Progress value={9.7} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Customer Acquisition</span>
                          <span className="font-medium text-success-600">+8.3%</span>
                        </div>
                        <Progress value={8.3} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Key Metrics</h4>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Cost per Click:</span>
                        <span className="text-xs font-medium">{formatCurrency(1.85)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Cost per Lead:</span>
                        <span className="text-xs font-medium">{formatCurrency(37)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Customer LTV:</span>
                        <span className="text-xs font-medium">{formatCurrency(1200)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">LTV:CAC Ratio:</span>
                        <span className="text-xs font-medium">4.8:1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="channels" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>Comparing customer acquisition costs across channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={channels}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="customers" name="Customers Acquired" fill="hsl(var(--chart-1))" />
                      <Bar yAxisId="right" dataKey="cac" name="Acquisition Cost ($)" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>How marketing spend is distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {channelAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Budget Allocation']} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Channel Analysis</h4>
                  <p className="text-xs text-gray-600">
                    Email marketing and partnerships show the best conversion rates but have limited scale. 
                    Social media provides the highest volume of leads but at a higher acquisition cost.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Channel Details</CardTitle>
              <CardDescription>Performance metrics for each marketing channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Channel</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Budget Allocation</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Monthly Spend</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">CAC</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Customers Acquired</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {channels.map((channel, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">{channel.name}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{channel.allocation}%</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(monthlyBudget * channel.allocation / 100)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(channel.cac)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{channel.customers}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{formatPercentage(channel.conversion / 100)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Marketing Campaigns</CardTitle>
              <CardDescription>Current campaigns and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summer Promotion Campaign */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Summer Promotion Campaign</h3>
                      <p className="text-sm text-gray-600 mt-1">Special pricing for new subscribers during summer months</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Budget Spent</div>
                      <div className="text-sm font-medium">{formatCurrency(12500)} / {formatCurrency(20000)}</div>
                      <Progress value={62.5} className="h-1.5 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Timeline</div>
                      <div className="text-sm font-medium">Jun 1 - Aug 31</div>
                      <Progress value={33} className="h-1.5 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Conversion Rate</div>
                      <div className="text-sm font-medium">{formatPercentage(0.042)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">New Customers</div>
                      <div className="text-sm font-medium">28 (Goal: 75)</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
                
                {/* Product Launch Campaign */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Product Launch Campaign</h3>
                      <p className="text-sm text-gray-600 mt-1">Introducing new features to existing customers and prospects</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Budget Spent</div>
                      <div className="text-sm font-medium">{formatCurrency(18000)} / {formatCurrency(25000)}</div>
                      <Progress value={72} className="h-1.5 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Timeline</div>
                      <div className="text-sm font-medium">May 15 - Jul 15</div>
                      <Progress value={75} className="h-1.5 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Conversion Rate</div>
                      <div className="text-sm font-medium">{formatPercentage(0.038)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">New Customers</div>
                      <div className="text-sm font-medium">45 (Goal: 60)</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
                
                {/* Content Marketing Campaign */}
                <div className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Content Marketing Initiative</h3>
                      <p className="text-sm text-gray-600 mt-1">Building brand authority through blog posts and whitepapers</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Budget Spent</div>
                      <div className="text-sm font-medium">{formatCurrency(8000)} / {formatCurrency(12000)}</div>
                      <Progress value={66.7} className="h-1.5 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Timeline</div>
                      <div className="text-sm font-medium">Ongoing</div>
                      <Progress value={100} className="h-1.5 mt-1" />
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Leads Generated</div>
                      <div className="text-sm font-medium">120 (Goal: 200)</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Website Traffic</div>
                      <div className="text-sm font-medium">+22% increase</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
                
                {/* Upcoming Campaign */}
                <div className="border rounded-md p-4 border-dashed">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Holiday Season Campaign</h3>
                      <p className="text-sm text-gray-600 mt-1">Special year-end offers for new and existing customers</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-medium">
                      Planned
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Planned Budget</div>
                      <div className="text-sm font-medium">{formatCurrency(30000)}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Timeline</div>
                      <div className="text-sm font-medium">Nov 15 - Dec 31</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Target Customers</div>
                      <div className="text-sm font-medium">100 new customers</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="text-sm font-medium">Planning phase</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">Edit Campaign Plan</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Create New Campaign</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="decisions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Decisions</CardTitle>
              <CardDescription>Pending strategic decisions for your marketing efforts</CardDescription>
            </CardHeader>
            <CardContent>
              {marketingDecisions.length > 0 ? (
                <div className="space-y-4">
                  {marketingDecisions.map((decision) => (
                    <div key={decision.id} className="border-l-4 border-warning-500 bg-gray-50 p-4 rounded-r-md">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{decision.title}</h3>
                        <span className="text-xs bg-warning-100 text-warning-800 px-2 py-0.5 rounded-full font-medium">
                          {decision.urgency === "urgent" ? "Urgent" : "Normal"}
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
                  <p>No pending marketing decisions</p>
                  <p className="text-sm text-gray-400 mt-1">Check back next quarter for new marketing opportunities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Brand Strategy */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Brand Strategy</CardTitle>
          <CardDescription>Your company's positioning and brand identity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Positioning Statement</h3>
              <p className="text-sm text-gray-600">
                For tech-savvy businesses seeking efficiency, {business.name} provides an intuitive 
                platform that optimizes workflows and increases productivity, 
                unlike traditional solutions that are complex and difficult to implement.
              </p>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                  <li>Small to medium businesses (10-200 employees)</li>
                  <li>Tech-forward organizations</li>
                  <li>Teams seeking automation and efficiency</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Brand Values</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Innovation</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Constantly pushing boundaries and challenging the status quo
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Simplicity</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Making complex processes intuitive and easy to use
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700">Reliability</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Building trust through consistent performance and support
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Competitive Differentiation</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Ease of Use</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">85%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Feature Set</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">70%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Customer Support</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">90%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Pricing</h4>
                  <div className="flex items-center mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="ml-2 text-xs font-medium text-gray-700">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
