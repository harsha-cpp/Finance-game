import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export default function CompetitionPage() {
  const { state } = useGameContext();
  const { formatCurrency, formatPercentage } = useBusinessContext();
  
  if (!state.business) return null;
  
  const business = state.business;
  const competitors = state.competitors;
  
  // Market share data for pie chart
  const marketShareData = [
    { name: business.name, value: business.marketShare * 100 },
    ...competitors.map(comp => ({ name: comp.name, value: comp.marketShare * 100 }))
  ];
  
  // Colors for charts
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
  
  // Generate customer growth data (in a real app, would come from API)
  const growthData = [
    { name: 'Q1', [business.name]: 30, "TechSolutions": 45, "InnovateCorp": 20, "NextGenSystems": 15 },
    { name: 'Q2', [business.name]: 40, "TechSolutions": 50, "InnovateCorp": 25, "NextGenSystems": 20 },
    { name: 'Q3', [business.name]: business.customers, "TechSolutions": 55, "InnovateCorp": 30, "NextGenSystems": 30 }
  ];
  
  // Competitive analysis data for radar chart
  const competitiveData = [
    {
      subject: 'Price',
      [business.name]: 7,
      "TechSolutions": 8,
      "InnovateCorp": 6,
      "NextGenSystems": 9,
      fullMark: 10,
    },
    {
      subject: 'Features',
      [business.name]: 8,
      "TechSolutions": 9,
      "InnovateCorp": 7,
      "NextGenSystems": 6,
      fullMark: 10,
    },
    {
      subject: 'UX',
      [business.name]: 9,
      "TechSolutions": 7,
      "InnovateCorp": 8,
      "NextGenSystems": 6,
      fullMark: 10,
    },
    {
      subject: 'Marketing',
      [business.name]: 6,
      "TechSolutions": 8,
      "InnovateCorp": 5,
      "NextGenSystems": 4,
      fullMark: 10,
    },
    {
      subject: 'Support',
      [business.name]: 8,
      "TechSolutions": 6,
      "InnovateCorp": 7,
      "NextGenSystems": 5,
      fullMark: 10,
    },
  ];
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Market Competition
        </h1>
        <p className="text-gray-600">
          Analyze your competitors and market position
        </p>
      </div>
      
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Your Market Share</div>
            <div className="text-2xl font-bold">{formatPercentage(business.marketShare)}</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-success-600">+1.2%</span> from last quarter
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Competitors</div>
            <div className="text-2xl font-bold">{competitors.length}</div>
            <div className="text-xs text-gray-500 mt-2">
              {competitors.length > 0 ? `${competitors[0].name} is the market leader` : 'No competitors yet'}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Market Growth Rate</div>
            <div className="text-2xl font-bold">8.5%</div>
            <div className="text-xs text-gray-500 mt-2">
              Annual projected growth
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList>
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          <TabsTrigger value="strategy">Competitive Strategy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Share Distribution</CardTitle>
                <CardDescription>Percentage of market controlled by each company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {marketShareData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketShareData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        >
                          {marketShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <i className="fa-solid fa-chart-pie text-4xl mb-2"></i>
                        <p className="text-sm">No market data available yet</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth Trends</CardTitle>
                <CardDescription>Customer acquisition comparison over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={growthData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey={business.name} fill="hsl(var(--primary))" />
                      {competitors.slice(0, 3).map((comp, index) => (
                        <Bar key={comp.id} dataKey={comp.name} fill={COLORS[index+1]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>Current trends affecting your market segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <i className="fa-solid fa-arrow-trend-up"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Remote Work Acceleration</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        The shift to remote work continues to accelerate adoption of digital collaboration tools, 
                        expanding the addressable market by approximately 15% year-over-year.
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Opportunity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <i className="fa-solid fa-globe"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Market Consolidation</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Larger players are acquiring smaller competitors to expand their feature sets and market reach.
                        Three acquisitions have occurred in the last quarter.
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Threat
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <i className="fa-solid fa-robot"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">AI Integration</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Products with AI-powered features are seeing 30% higher adoption rates and 25% better 
                        retention than traditional solutions.
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Opportunity
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competitors" className="mt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Competitive Analysis</CardTitle>
              <CardDescription>Feature and market strength comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competitiveData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar name={business.name} dataKey={business.name} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                    {competitors.slice(0, 3).map((comp, index) => (
                      <Radar
                        key={comp.id}
                        name={comp.name}
                        dataKey={comp.name}
                        stroke={COLORS[index+1]}
                        fill={COLORS[index+1]}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Competitors</CardTitle>
              <CardDescription>Analysis of your main competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Competitor</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Market Share</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-500">Strength</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Primary Focus</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Key Differentiator</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {competitors.map((competitor, index) => (
                      <tr key={competitor.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">{competitor.name}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{formatPercentage(competitor.marketShare)}</td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            {Array.from({ length: competitor.strength }).map((_, i) => (
                              <i key={i} className="fa-solid fa-star text-yellow-400 text-xs"></i>
                            ))}
                            {Array.from({ length: 10 - competitor.strength }).map((_, i) => (
                              <i key={i} className="fa-regular fa-star text-gray-300 text-xs"></i>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{competitor.focus}</td>
                        <td className="px-4 py-3">
                          {competitor.name === "TechSolutions" && "Advanced AI capabilities"}
                          {competitor.name === "InnovateCorp" && "Lower pricing model"}
                          {competitor.name === "NextGenSystems" && "Enterprise security features"}
                          {!["TechSolutions", "InnovateCorp", "NextGenSystems"].includes(competitor.name) && 
                            "Custom integrations"}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <i className="fa-solid fa-magnifying-glass"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    
                    {competitors.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          <p>No competitors identified yet</p>
                          <p className="text-sm text-gray-400 mt-1">Competitors will appear as your business grows</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Competitive Strategy</CardTitle>
              <CardDescription>Define how you will differentiate from competitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Current Positioning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Differentiator:</span>
                        <span className="font-medium">User Experience</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price Point:</span>
                        <span className="font-medium">Mid-tier</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target Segment:</span>
                        <span className="font-medium">SMB Market</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Strategy Type:</span>
                        <span className="font-medium">Differentiation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Competitive Advantages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <i className="fa-solid fa-check text-success-500 mt-0.5 mr-2"></i>
                        <span>Intuitive user interface with lower learning curve</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check text-success-500 mt-0.5 mr-2"></i>
                        <span>Faster implementation time than industry average</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check text-success-500 mt-0.5 mr-2"></i>
                        <span>More flexible customization options</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check text-success-500 mt-0.5 mr-2"></i>
                        <span>Superior customer support response times</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Competitive Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <i className="fa-solid fa-xmark text-danger-500 mt-0.5 mr-2"></i>
                        <span>Smaller feature set compared to enterprise solutions</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-xmark text-danger-500 mt-0.5 mr-2"></i>
                        <span>Limited marketing budget vs. larger competitors</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-xmark text-danger-500 mt-0.5 mr-2"></i>
                        <span>Less established brand recognition</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-xmark text-danger-500 mt-0.5 mr-2"></i>
                        <span>Fewer integration options with legacy systems</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Strategic Options</CardTitle>
              <CardDescription>Potential strategies to improve your competitive position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <i className="fa-solid fa-trophy"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Feature Differentiation</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Invest in developing unique features that address underserved customer needs.
                        This could include AI-driven analytics or specialized automation workflows.
                      </p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">Explore Strategy</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <i className="fa-solid fa-handshake"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Strategic Partnerships</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Form alliances with complementary service providers to offer bundled solutions
                        that provide greater value than competitors' standalone products.
                      </p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">Explore Strategy</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <i className="fa-solid fa-bullseye"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Niche Focus</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Target an underserved industry vertical with specialized features and marketing.
                        This allows you to build a strong reputation in a specific segment before expanding.
                      </p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">Explore Strategy</Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <i className="fa-solid fa-tag"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Pricing Innovation</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Implement a unique pricing model that disrupts the market, such as usage-based pricing
                        or a freemium model with premium features.
                      </p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">Explore Strategy</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Develop Competitive Strategy</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
