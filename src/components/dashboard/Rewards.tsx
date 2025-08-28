import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Gift, 
  History, 
  TrendingUp,
  Wallet,
  Clock,
  Users
} from "lucide-react";

interface RewardsProps {
  kycStats: {
    totalPoints: number;
    totalPlaytime: string;
  };
}

export function Rewards({ kycStats }: RewardsProps) {
  // Mock redemption options - in a real app, this would come from the database
  const redemptionOptions = [
    { id: 1, name: "₹50 Amazon Gift Card", points: 5000, image: "/placeholder.svg" },
    { id: 2, name: "₹100 Spotify Premium", points: 10000, image: "/placeholder.svg" },
    { id: 3, name: "₹200 Cashback", points: 20000, image: "/placeholder.svg" },
  ];

  // Mock rewards history - in a real app, this would come from the database
  const rewardsHistory = [
    { id: 1, title: "Listening Bonus", points: 150, date: "2023-06-15", type: "earned" },
    { id: 2, title: "Referral Bonus", points: 500, date: "2023-06-10", type: "earned" },
    { id: 3, title: "Redeemed Gift Card", points: -5000, date: "2023-06-05", type: "redeemed" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rewards Center</h1>
        <p className="text-muted-foreground">Earn points and redeem exciting rewards</p>
      </div>

      {/* Points Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary to-primary-light border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-foreground/80">Total Points</p>
                <h3 className="text-2xl font-bold text-white">{kycStats.totalPoints.toLocaleString()}</h3>
              </div>
              <Trophy className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Points This Month</p>
                <h3 className="text-2xl font-bold">1,250</h3>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rank</p>
                <h3 className="text-2xl font-bold">#42</h3>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redeem Points */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Redeem Your Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {redemptionOptions.map((option) => (
              <div key={option.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">{option.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{option.points.toLocaleString()} points</p>
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={kycStats.totalPoints < option.points}
                >
                  Redeem
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards History */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Rewards History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewardsHistory.map((reward) => (
              <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{reward.title}</p>
                  <p className="text-sm text-muted-foreground">{reward.date}</p>
                </div>
                <div className="text-right">
                  <Badge variant={reward.points > 0 ? "secondary" : "destructive"} className={reward.points > 0 ? "bg-success/10 text-success" : ""}>
                    {reward.points > 0 ? '+' : ''}{reward.points.toLocaleString()}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View Full History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}