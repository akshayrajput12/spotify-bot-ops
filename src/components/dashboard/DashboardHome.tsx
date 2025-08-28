import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Shield, 
  FileText, 
  TrendingUp,
  Users,
  Play,
  Music,
  Loader2
} from "lucide-react";
import { StatsCard } from "./StatsCard";

interface DashboardHomeProps {
  kycStats: {
    totalPoints: number;
    totalPlaytime: string;
  };
  kycDocuments: any[];
  onNavigateToTab: (tab: string) => void;
}

export function DashboardHome({ kycStats, kycDocuments, onNavigateToTab }: DashboardHomeProps) {
  // Get the latest KYC document
  const latestKyc = kycDocuments.length > 0 ? kycDocuments[0] : null;
  
  // Get pending KYC documents
  const pendingKycCount = kycDocuments.filter(doc => doc.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending Review</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "under_review":
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Under Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
        <p className="text-muted-foreground">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Points" 
          value={kycStats.totalPoints.toLocaleString()} 
          description="Earned from listening"
          icon={Trophy}
          variant="primary"
        />
        <StatsCard 
          title="Playtime" 
          value={kycStats.totalPlaytime} 
          description="Total listening time"
          icon={Clock}
          variant="success"
        />
        <StatsCard 
          title="KYC Status" 
          value={latestKyc ? getStatusBadge(latestKyc.status) : "Not Submitted"}
          description={latestKyc ? `Submitted on ${new Date(latestKyc.submitted_at).toLocaleDateString()}` : "Submit your documents"}
          icon={Shield}
          variant="warning"
        />
        <StatsCard 
          title="Documents" 
          value={kycDocuments.length} 
          description="Uploaded for verification"
          icon={FileText}
          variant="default"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10"
              onClick={() => onNavigateToTab("kyc")}
            >
              <Shield className="mr-2 h-4 w-4" />
              {pendingKycCount > 0 
                ? `Complete KYC (${pendingKycCount} pending)` 
                : "Submit KYC Documents"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10"
              onClick={() => onNavigateToTab("rewards")}
            >
              <Trophy className="mr-2 h-4 w-4" />
              View Rewards History
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-primary/10"
              onClick={() => onNavigateToTab("history")}
            >
              <Play className="mr-2 h-4 w-4" />
              Listening History
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kycDocuments.length > 0 ? (
              kycDocuments.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.status === 'approved' ? 'bg-success' : 
                      doc.status === 'pending' ? 'bg-warning' : 
                      doc.status === 'rejected' ? 'bg-destructive' : 
                      doc.status === 'under_review' ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">
                        {doc.document_type.replace('_', ' ')} document {doc.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(doc.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getStatusBadge(doc.status)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No activity yet. Submit your KYC documents to get started.
              </p>
            )}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => onNavigateToTab("history")}
            >
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Music & Rewards Section */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Your Music Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Playlists Created</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Music className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Songs Played</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-warning" />
              <p className="text-2xl font-bold">{kycStats.totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}