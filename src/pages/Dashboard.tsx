import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Users, 
  CreditCard, 
  Bot, 
  Trophy, 
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "12,483",
      description: "Active platform users",
      icon: Users,
      trend: { value: 12.5, label: "from last month" },
      variant: "primary" as const
    },
    {
      title: "Pending KYC",
      value: "23",
      description: "Require approval",
      icon: AlertCircle,
      trend: { value: -8.2, label: "from yesterday" },
      variant: "warning" as const
    },
    {
      title: "Total Transactions",
      value: "₹4,67,892",
      description: "This month",
      icon: CreditCard,
      trend: { value: 23.1, label: "from last month" },
      variant: "success" as const
    },
    {
      title: "Active Bots",
      value: "1,247",
      description: "Currently running",
      icon: Bot,
      trend: { value: 5.4, label: "from last hour" },
      variant: "default" as const
    },
    {
      title: "Rewards Distributed",
      value: "89,450",
      description: "Points this week",
      icon: Trophy,
      trend: { value: 15.3, label: "from last week" },
      variant: "success" as const
    },
    {
      title: "Avg Session Time",
      value: "47m",
      description: "Per user session",
      icon: Clock,
      trend: { value: 8.7, label: "from last week" },
      variant: "default" as const
    }
  ];

  const recentActivities = [
    { user: "user@email.com", action: "KYC Approved", time: "2 minutes ago", type: "success" },
    { user: "john.doe@email.com", action: "Transaction Completed", time: "5 minutes ago", type: "default" },
    { user: "jane.smith@email.com", action: "KYC Submitted", time: "12 minutes ago", type: "warning" },
    { user: "mike.wilson@email.com", action: "Bot Session Started", time: "18 minutes ago", type: "default" },
    { user: "sarah.connor@email.com", action: "Reward Claimed", time: "25 minutes ago", type: "success" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-light">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-success' : 
                        activity.type === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Approve Pending KYC (23)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bot className="mr-2 h-4 w-4" />
                Configure Bot Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Trophy className="mr-2 h-4 w-4" />
                Update Reward Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Review Transactions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">API Status: Operational</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Database: Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm">Bot Engine: Busy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">Payment Gateway: Online</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}