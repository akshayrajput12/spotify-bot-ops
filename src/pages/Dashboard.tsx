import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PlaylistSection } from "@/components/dashboard/PlaylistSection";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { 
  useDashboardStats, 
  useRecentActivities, 
  useSystemStatus 
} from "@/hooks/useDatabase";
import { 
  Users, 
  CreditCard, 
  Bot, 
  Trophy, 
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: dashboardStats, loading: statsLoading } = useDashboardStats();
  const { data: recentActivities, loading: activitiesLoading } = useRecentActivities();
  const { data: systemStatus, loading: statusLoading } = useSystemStatus();

  // Format stats for display with dynamic data
  const stats = dashboardStats ? [
    {
      title: "Total Users",
      value: dashboardStats.totalUsers.toLocaleString(),
      description: "Active platform users",
      icon: Users,
      trend: { value: 12.5, label: "from last month" },
      variant: "primary" as const
    },
    {
      title: "Pending KYC",
      value: dashboardStats.pendingKyc.toString(),
      description: "Require approval",
      icon: AlertCircle,
      trend: { value: -8.2, label: "from yesterday" },
      variant: "warning" as const
    },
    {
      title: "Total Transactions",
      value: `₹${dashboardStats.totalTransactionAmount.toLocaleString()}`,
      description: "This month",
      icon: CreditCard,
      trend: { value: 23.1, label: "from last month" },
      variant: "success" as const
    },
    {
      title: "Active Bots",
      value: dashboardStats.activeBots.toString(),
      description: "Currently running",
      icon: Bot,
      trend: { value: 5.4, label: "from last hour" },
      variant: "default" as const
    },
    {
      title: "Rewards Distributed",
      value: dashboardStats.totalRewards.toLocaleString(),
      description: "Points this week",
      icon: Trophy,
      trend: { value: 15.3, label: "from last week" },
      variant: "success" as const
    },
    {
      title: "Avg Session Time",
      value: `${dashboardStats.avgSessionTime}m`,
      description: "Per user session",
      icon: Clock,
      trend: { value: 8.7, label: "from last week" },
      variant: "default" as const
    }
  ] : [];

  // Loading state
  if (statsLoading || activitiesLoading || statusLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! Here's what's happening with your platform.
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={() => navigate('/analytics')}
          >
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
          <Card className="bg-card border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities && recentActivities.length > 0 ? (
                  recentActivities.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-success' : 
                          activity.type === 'warning' ? 'bg-warning' : 
                          activity.type === 'error' ? 'bg-destructive' : 'bg-muted-foreground'
                        }`} />
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent activities
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => navigate('/kyc')}
              >
                <Users className="mr-2 h-4 w-4" />
                Approve Pending KYC ({dashboardStats?.pendingKyc || 0})
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => navigate('/bots/settings')}
              >
                <Bot className="mr-2 h-4 w-4" />
                Configure Bot Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => navigate('/rewards/settings')}
              >
                <Trophy className="mr-2 h-4 w-4" />
                Update Reward Settings
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-primary/10"
                onClick={() => navigate('/transactions')}
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Review Transactions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Music & Rewards Section */}
        <PlaylistSection />

        {/* System Status */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus?.api === 'operational' ? 'bg-success' : 
                  systemStatus?.api === 'issues' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <span className="text-sm">API Status: {systemStatus?.api || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus?.database === 'healthy' ? 'bg-success' : 
                  systemStatus?.database === 'issues' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <span className="text-sm">Database: {systemStatus?.database || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus?.botEngine === 'active' ? 'bg-success' : 
                  systemStatus?.botEngine === 'idle' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <span className="text-sm">Bot Engine: {systemStatus?.botEngine || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus?.paymentGateway === 'online' ? 'bg-success' : 
                  systemStatus?.paymentGateway === 'issues' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <span className="text-sm">Payment Gateway: {systemStatus?.paymentGateway || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus?.spotifyApi === 'connected' ? 'bg-success' : 
                  systemStatus?.spotifyApi === 'issues' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <span className="text-sm">Spotify API: {systemStatus?.spotifyApi || 'Unknown'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}