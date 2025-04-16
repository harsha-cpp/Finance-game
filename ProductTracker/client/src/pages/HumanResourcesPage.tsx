import AppShell from "@/components/layout/AppShell";
import { useGameContext } from "@/contexts/GameContext";
import { useBusinessContext } from "@/contexts/BusinessContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function HumanResourcesPage() {
  const { state, openDecisionModal } = useGameContext();
  const { formatCurrency } = useBusinessContext();
  
  if (!state.business) return null;
  
  const business = state.business;
  
  // Filter decisions related to HR
  const hrDecisions = state.decisions.filter(
    d => d.type === "hr" && !d.isCompleted
  );
  
  // Sample team structure data - in a full implementation, these would come from the API
  const teamStructure = [
    { department: "Engineering", headcount: Math.ceil(business.employees * 0.45), budget: Math.ceil(business.employees * 0.45) * 7500 },
    { department: "Product", headcount: Math.ceil(business.employees * 0.15), budget: Math.ceil(business.employees * 0.15) * 7200 },
    { department: "Marketing", headcount: Math.ceil(business.employees * 0.15), budget: Math.ceil(business.employees * 0.15) * 6800 },
    { department: "Sales", headcount: Math.ceil(business.employees * 0.10), budget: Math.ceil(business.employees * 0.10) * 7000 },
    { department: "Customer Success", headcount: Math.ceil(business.employees * 0.10), budget: Math.ceil(business.employees * 0.10) * 6500 },
    { department: "Operations", headcount: Math.ceil(business.employees * 0.05), budget: Math.ceil(business.employees * 0.05) * 6900 }
  ];
  
  // Calculate total headcount and budget
  const totalHeadcount = teamStructure.reduce((sum, dept) => sum + dept.headcount, 0);
  const totalBudget = teamStructure.reduce((sum, dept) => sum + dept.budget, 0);
  
  // Data for department distribution pie chart
  const departmentData = teamStructure.map(dept => ({
    name: dept.department,
    value: dept.headcount
  }));
  
  // Colors for charts
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))'];
  
  // Open positions - in a full implementation, these would come from the API
  const openPositions = [
    { title: "Senior Software Engineer", department: "Engineering", level: "Senior", salary: 120000 },
    { title: "Marketing Manager", department: "Marketing", level: "Manager", salary: 95000 }
  ];
  
  // Company culture metrics
  const cultureMetrics = [
    { name: "Employee Satisfaction", value: 85 },
    { name: "Engagement", value: 78 },
    { name: "Work-Life Balance", value: 82 },
    { name: "Career Growth", value: 75 }
  ];
  
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Human Resources
        </h1>
        <p className="text-gray-600">
          Manage your team, hiring, and company culture
        </p>
      </div>
      
      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Team Size</div>
            <div className="text-2xl font-bold">{business.employees} people</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-success-600">+2</span> from last quarter
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Monthly Payroll</div>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget / 3)}</div>
            <div className="text-xs text-gray-500 mt-2">
              Avg. Salary: {formatCurrency(totalBudget / totalHeadcount / 12)} per month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Open Positions</div>
            <div className="text-2xl font-bold">{openPositions.length}</div>
            <div className="text-xs text-gray-500 mt-2">
              Est. cost: {formatCurrency((openPositions.reduce((sum, pos) => sum + pos.salary, 0) / 12))} per month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-gray-500 mb-2">Employee Satisfaction</div>
            <div className="text-2xl font-bold">85%</div>
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-success-600">+3%</span> from last quarter
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="team" className="mb-6">
        <TabsList>
          <TabsTrigger value="team">Team Structure</TabsTrigger>
          <TabsTrigger value="hiring">Hiring</TabsTrigger>
          <TabsTrigger value="culture">Company Culture</TabsTrigger>
          <TabsTrigger value="decisions">HR Decisions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="team" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Department Structure</CardTitle>
                <CardDescription>Headcount and budget allocation by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamStructure}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="department" type="category" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === "budget" ? formatCurrency(value as number) : value, 
                          name === "budget" ? "Annual Budget" : "Headcount"
                        ]} 
                      />
                      <Bar dataKey="headcount" name="Headcount" fill="hsl(var(--chart-1))" />
                      <Bar dataKey="budget" name="Annual Budget" fill="hsl(var(--chart-2))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Team Distribution</CardTitle>
                <CardDescription>Headcount by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Department Details</CardTitle>
              <CardDescription>Detailed information about each department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">Department</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Headcount</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">% of Company</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Annual Budget</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">Avg. Salary</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamStructure.map((dept, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">{dept.department}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{dept.headcount}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {((dept.headcount / totalHeadcount) * 100).toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">{formatCurrency(dept.budget)}</td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {formatCurrency(dept.budget / dept.headcount)}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <i className="fa-solid fa-pencil"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hiring" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>Currently open roles and hiring status</CardDescription>
            </CardHeader>
            <CardContent>
              {openPositions.length > 0 ? (
                <div className="space-y-6">
                  {openPositions.map((position, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{position.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{position.department} • {position.level}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                          Recruiting
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Annual Salary</div>
                          <div className="text-sm font-medium">{formatCurrency(position.salary)}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Candidates Reviewed</div>
                          <div className="text-sm font-medium">12 / 28 applicants</div>
                          <Progress value={42.9} className="h-1.5 mt-1" />
                        </div>
                        
                        <div>
                          <div className="text-xs text-gray-500">Time Open</div>
                          <div className="text-sm font-medium">
                            {index === 0 ? "18 days" : "7 days"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">View Candidates</Button>
                        <Button size="sm">Hire</Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border rounded-md p-4 border-dashed">
                    <div className="text-center py-6">
                      <i className="fa-solid fa-plus-circle text-gray-400 text-2xl mb-2"></i>
                      <p className="text-gray-600 font-medium">Open New Position</p>
                      <p className="text-xs text-gray-500 mt-1">Create a new job posting</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="fa-solid fa-user-plus text-2xl mb-2"></i>
                  <p>No open positions</p>
                  <p className="text-sm text-gray-400 mt-1">Create a new position to start hiring</p>
                  <Button className="mt-4">Create Position</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Hiring Metrics</CardTitle>
              <CardDescription>Key performance indicators for your recruitment process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Time to Hire</h4>
                    <div className="text-xl font-bold text-gray-900">28 days</div>
                    <p className="text-xs text-gray-600 mt-1">
                      Industry avg: 35 days
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Cost per Hire</h4>
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(4200)}</div>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="text-success-600">-8%</span> from last quarter
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Offer Acceptance Rate</h4>
                    <div className="text-xl font-bold text-gray-900">78%</div>
                    <p className="text-xs text-gray-600 mt-1">
                      Industry avg: 65%
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Employee Turnover</h4>
                    <div className="text-xl font-bold text-gray-900">12%</div>
                    <p className="text-xs text-gray-600 mt-1">
                      Annual rate based on exits
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="culture" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Culture</CardTitle>
              <CardDescription>Employee satisfaction and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Employee Satisfaction Metrics</h3>
                    <div className="space-y-4">
                      {cultureMetrics.map((metric, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{metric.name}</span>
                            <span className="text-sm text-gray-600">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Recent Feedback</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600 italic">
                          "The product team collaboration has improved significantly with the new project management tools."
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          — Engineering Team Member
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600 italic">
                          "I appreciate the flexible work arrangements and focus on work-life balance."
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          — Marketing Team Member
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600 italic">
                          "The career development programs have helped me grow professionally over the past quarter."
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          — Customer Success Team Member
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Culture Initiatives</h3>
                  <div className="space-y-3">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Professional Development</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Learning budget and career growth opportunities
                        </p>
                        <div className="flex justify-between text-xs">
                          <span>Budget: {formatCurrency(1500)}/employee</span>
                          <span className="text-success-600">Active</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Wellness Program</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Mental and physical health support
                        </p>
                        <div className="flex justify-between text-xs">
                          <span>Participation: 65%</span>
                          <span className="text-success-600">Active</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Team Building</h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Regular events to strengthen team bonds
                        </p>
                        <div className="flex justify-between text-xs">
                          <span>Quarterly events</span>
                          <span className="text-success-600">Active</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Button variant="outline" className="w-full">
                      <i className="fa-solid fa-plus mr-1"></i> New Initiative
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="decisions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>HR Decisions</CardTitle>
              <CardDescription>Pending decisions related to your team and culture</CardDescription>
            </CardHeader>
            <CardContent>
              {hrDecisions.length > 0 ? (
                <div className="space-y-4">
                  {hrDecisions.map((decision) => (
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
                  <p>No pending HR decisions</p>
                  <p className="text-sm text-gray-400 mt-1">Check back next quarter for new HR opportunities</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Organizational Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Organizational Structure</CardTitle>
          <CardDescription>Your company's leadership and reporting hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="max-w-3xl w-full">
              {/* CEO Level */}
              <div className="flex justify-center mb-8">
                <div className="w-48 bg-primary-50 border border-primary-200 rounded-md p-3 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white mb-2">
                    {state.user?.displayName?.split(' ').map(n => n[0]).join('').substring(0, 2) || 'JP'}
                  </div>
                  <h4 className="font-medium text-gray-900">{state.user?.displayName || 'Jane Parker'}</h4>
                  <p className="text-xs text-gray-600">Founder & CEO</p>
                </div>
              </div>
              
              {/* Connecting Line */}
              <div className="flex justify-center">
                <div className="w-0.5 h-6 bg-gray-300"></div>
              </div>
              
              {/* Executive Level */}
              <div className="flex justify-center mb-2">
                <div className="w-64 border-b border-gray-300"></div>
              </div>
              <div className="flex justify-center gap-4 mb-8">
                <div className="w-40 bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                  <h4 className="font-medium text-gray-900">David Lee</h4>
                  <p className="text-xs text-gray-600">CTO</p>
                </div>
                <div className="w-40 bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                  <h4 className="font-medium text-gray-900">Sarah Chen</h4>
                  <p className="text-xs text-gray-600">CMO</p>
                </div>
                <div className="w-40 bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                  <h4 className="font-medium text-gray-900">Michael Brown</h4>
                  <p className="text-xs text-gray-600">COO</p>
                </div>
              </div>
              
              {/* Connecting Lines */}
              <div className="flex justify-around px-16">
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="w-0.5 h-6 bg-gray-300"></div>
                <div className="w-0.5 h-6 bg-gray-300"></div>
              </div>
              
              {/* Department Level */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
                <div>
                  <div className="mb-2 border-b border-gray-300"></div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                      <h5 className="text-sm font-medium text-gray-900">Engineering Team</h5>
                      <p className="text-xs text-gray-600">{teamStructure[0].headcount} members</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                      <h5 className="text-sm font-medium text-gray-900">Product Team</h5>
                      <p className="text-xs text-gray-600">{teamStructure[1].headcount} members</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 border-b border-gray-300"></div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                      <h5 className="text-sm font-medium text-gray-900">Marketing Team</h5>
                      <p className="text-xs text-gray-600">{teamStructure[2].headcount} members</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                      <h5 className="text-sm font-medium text-gray-900">Sales Team</h5>
                      <p className="text-xs text-gray-600">{teamStructure[3].headcount} members</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 border-b border-gray-300"></div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                      <h5 className="text-sm font-medium text-gray-900">Customer Success</h5>
                      <p className="text-xs text-gray-600">{teamStructure[4].headcount} members</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                      <h5 className="text-sm font-medium text-gray-900">Operations</h5>
                      <p className="text-xs text-gray-600">{teamStructure[5].headcount} members</p>
                    </div>
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
