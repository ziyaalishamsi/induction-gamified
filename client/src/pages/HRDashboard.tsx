import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  DollarSign, 
  BookOpen,
  Target,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function HRDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  
  // Fetch live dashboard data
  const { data: analyticsOverview } = useQuery({
    queryKey: ['/cityofciti/api/hr/analytics/overview'],
    refetchInterval: 30000
  });

  const { data: performanceTrends } = useQuery({
    queryKey: ['/cityofciti/api/hr/analytics/performance-trends'],
    refetchInterval: 60000
  });

  const { data: detailedMetrics } = useQuery({
    queryKey: ['/cityofciti/api/hr/analytics/detailed-metrics'],
    refetchInterval: 60000
  });

  const { data: roiAnalysis } = useQuery({
    queryKey: ['/cityofciti/api/hr/analytics/roi-analysis'],
    refetchInterval: 300000 // 5 minutes
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['/cityofciti/api/leaderboard']
  });

  // Use real analytics data from API with proper type casting
  const kpiData = (analyticsOverview as any) || {
    totalEmployees: 0,
    activeTrainees: 0,
    completionRate: 0,
    avgTimeToComplete: 0,
    costSavings: 0,
    engagementScore: 0,
    retentionImprovement: 0,
    timeReduction: 0
  };

  const completionTrendData = (performanceTrends as any)?.completionTrends || [];

  const departmentData = (performanceTrends as any)?.departmentPerformance?.map((dept: any) => ({
    name: dept.department,
    value: dept.completion,
    employees: Math.round(dept.completion * 10) // Approximate employee count
  })) || [];

  const engagementData = [
    { metric: 'Quiz Scores', before: 67, after: 89 },
    { metric: 'Time to Complete', before: 8.5, after: 3.2 },
    { metric: 'Employee Satisfaction', before: 72, after: 94 },
    { metric: 'Knowledge Retention', before: 58, after: 86 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(213,56%,24%)]">HR Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive training performance and employee engagement insights</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalEmployees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trainees</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.activeTrainees}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.avgTimeToComplete}h</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-65%</span> reduction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROI and Savings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">${kpiData.costSavings.toLocaleString()}</div>
            <p className="text-xs text-green-600">Per quarter vs traditional training</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{kpiData.engagementScore}%</div>
            <p className="text-xs text-blue-600">+22% improvement in engagement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">+{kpiData.retentionImprovement}%</div>
            <p className="text-xs text-purple-600">Better employee retention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Reduction</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">{kpiData.timeReduction}%</div>
            <p className="text-xs text-orange-600">Faster onboarding process</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Metrics</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="roi">ROI & Savings</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={completionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="completion" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(leaderboardData) ? (
                    leaderboardData.slice(0, 5).map((user: any, index: number) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{user.xp} XP</div>
                          <div className="text-xs text-gray-500">Technology</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Improvements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.metric}</span>
                        <span className="text-sm text-green-600">
                          +{Math.round(((item.after - item.before) / item.before) * 100)}%
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">Before</div>
                          <Progress value={(item.before / 100) * 100} className="h-2" />
                          <div className="text-xs">{item.before}{item.metric.includes('Time') ? 'h' : '%'}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">After</div>
                          <Progress value={(item.after / 100) * 100} className="h-2" />
                          <div className="text-xs">{item.after}{item.metric.includes('Time') ? 'h' : '%'}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Module Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { module: 'BTSS', completions: 156 },
                    { module: 'Communication', completions: 142 },
                    { module: 'CSIS', completions: 134 },
                    { module: 'Risk', completions: 128 },
                    { module: 'RES', completions: 118 },
                    { module: 'TA', completions: 112 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="module" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completions" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept: any, index: number) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{dept.name}</span>
                        <span className="text-sm text-gray-500">{dept.employees} employees</span>
                      </div>
                      <Progress value={dept.value * 2.5} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {Math.round(dept.value * 2.5)}% completion rate
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span>Traditional Training</span>
                    <span className="font-bold text-red-600">$450,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>Digital Platform</span>
                    <span className="font-bold text-green-600">$125,000</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Annual Savings</span>
                      <span className="font-bold text-green-600">$325,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">65%</div>
                    <div className="text-sm text-gray-500">Time Reduction</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Before: 8.5 hours</span>
                      <span>After: 3.2 hours</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    5.3 hours saved per employee
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">23%</div>
                    <div className="text-sm text-gray-500">Productivity Increase</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Faster Onboarding</span>
                      <span className="text-green-600">+35%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Knowledge Retention</span>
                      <span className="text-green-600">+48%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Employee Satisfaction</span>
                      <span className="text-green-600">+22%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}