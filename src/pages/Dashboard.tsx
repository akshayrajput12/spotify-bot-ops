import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  CreditCard, 
  Bot, 
  Trophy, 
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  Activity,
  Target,
  Zap,
  Shield
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "12,483",
      description: "Active platform users",
      icon: Users,
      trend: { value: 12.5, label: "from last month", positive: true },
      variant: "primary" as const
    },
    {
      title: "Pending KYC",
      value: "23",
      description: "Require approval",
      icon: AlertCircle,
      trend: { value: -8.2, label: "from yesterday", positive: false },
      variant: "warning" as const
    },
    {
      title: "Total Transactions",
      value: "₹4,67,892",
      description: "This month",
      icon: CreditCard,
      trend: { value: 23.1, label: "from last month", positive: true },
      variant: "success" as const
    },
    {
      title: "Active Bots",
      value: "1,247",
      description: "Currently running",
      icon: Bot,
      trend: { value: 5.4, label: "from last hour", positive: true },
      variant: "default" as const
    },
    {
      title: "Rewards Distributed",
      value: "89,450",
      description: "Points this week",
      icon: Trophy,
      trend: { value: 15.3, label: "from last week", positive: true },
      variant: "success" as const
    },
    {
      title: "Avg Session Time",
      value: "47m",
      description: "Per user session",
      icon: Clock,
      trend: { value: 8.7, label: "from last week", positive: true },
      variant: "default" as const
    }
  ];

  const recentActivities = [
    { user: "user@email.com", action: "KYC Approved", time: "2 minutes ago", type: "success", amount: "₹500" },
    { user: "john.doe@email.com", action: "Transaction Completed", time: "5 minutes ago", type: "default", amount: "₹1,200" },
    { user: "jane.smith@email.com", action: "KYC Submitted", time: "12 minutes ago", type: "warning", amount: "-" },
    { user: "mike.wilson@email.com", action: "Bot Session Started", time: "18 minutes ago", type: "default", amount: "45m" },
    { user: "sarah.connor@email.com", action: "Reward Claimed", time: "25 minutes ago", type: "success", amount: "250 pts" },
    { user: "alex.turner@email.com", action: "Payment Failed", time: "32 minutes ago", type: "destructive", amount: "₹800" },
  ];

  const systemMetrics = [
    { name: "API Response Time", value: 45, target: 50, unit: "ms", status: "good" },
    { name: "Database Load", value: 78, target: 80, unit: "%", status: "warning" },
    { name: "Bot Engine CPU", value: 65, target: 85, unit: "%", status: "good" },
    { name: "Memory Usage", value: 82, target: 90, unit: "%", status: "good" },
  ];

  const quickStats = [
    { label: "Today's Revenue", value: "₹12,450", change: "+15.2%", positive: true },
    { label: "Active Sessions", value: "2,847", change: "+8.7%", positive: true },
    { label: "Failed Transactions", value: "12", change: "-23.1%", positive: true },
    { label: "Support Tickets", value: "8", change: "+12.5%", positive: false },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-300">
              <Activity className="mr-2 h-4 w-4" />
              System Status
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Badge 
                    variant={stat.positive ? "secondary" : "destructive"}
                    className={stat.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' : 
                        activity.type === 'warning' ? 'bg-yellow-500' : 
                        activity.type === 'destructive' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">{activity.time}</span>
                      <span className="text-sm font-medium text-gray-700">{activity.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Metrics */}
          <Card className="border-gray-200">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{metric.name}</span>
                    <span className="font-medium text-gray-900">
                      {metric.value}{metric.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Target: {metric.target}{metric.unit}</span>
                    <Badge 
                      variant="secondary" 
                      className={metric.status === 'good' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {metric.status === 'good' ? 'Good' : 'Warning'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Approve KYC</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">23 pending</Badge>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-gray-300 hover:border-green-300 hover:bg-green-50">
                <Bot className="h-6 w-6 text-green-600" />
                <span className="font-medium">Bot Settings</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Configure</Badge>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-gray-300 hover:border-purple-300 hover:bg-purple-50">
                <Trophy className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Rewards</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">Update</Badge>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-gray-300 hover:border-orange-300 hover:bg-orange-50">
                <DollarSign className="h-6 w-6 text-orange-600" />
                <span className="font-medium">Transactions</span>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">Review</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-green-800">API Status</span>
                  <p className="text-xs text-green-600">Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-green-800">Database</span>
                  <p className="text-xs text-green-600">Healthy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-yellow-800">Bot Engine</span>
                  <p className="text-xs text-yellow-600">Busy</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium text-green-800">Payment Gateway</span>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}