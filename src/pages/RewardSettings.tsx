import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Target, Users, Coins, Save, Eye, RotateCcw } from "lucide-react";
import { useState } from "react";

export default function RewardSettings() {
  const [pointsMultiplier, setPointsMultiplier] = useState([1.5]);
  const [inviteBonus, setInviteBonus] = useState([500]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reward Settings</h1>
            <p className="text-muted-foreground">Configure gamification rewards and point systems</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Playtime Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Playtime Thresholds
              </CardTitle>
              <CardDescription>Set points for different playtime milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold1">100 Minutes</Label>
                    <Input id="threshold1" type="number" placeholder="50" />
                  </div>
                  <div>
                    <Label>Current: 50 points</Label>
                    <Badge variant="outline" className="mt-2">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold2">500 Minutes</Label>
                    <Input id="threshold2" type="number" placeholder="300" />
                  </div>
                  <div>
                    <Label>Current: 300 points</Label>
                    <Badge variant="outline" className="mt-2">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold3">1000 Minutes</Label>
                    <Input id="threshold3" type="number" placeholder="750" />
                  </div>
                  <div>
                    <Label>Current: 750 points</Label>
                    <Badge variant="outline" className="mt-2">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold4">5000 Minutes</Label>
                    <Input id="threshold4" type="number" placeholder="5000" />
                  </div>
                  <div>
                    <Label>Current: 5000 points</Label>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mt-2">Premium</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Base Points Multiplier</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>1x (Normal)</span>
                    <span>3x (Maximum)</span>
                  </div>
                  <Slider
                    value={pointsMultiplier}
                    onValueChange={setPointsMultiplier}
                    max={3}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">Current: {pointsMultiplier[0]}x multiplier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bonus Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Bonus Actions
              </CardTitle>
              <CardDescription>Points for additional user activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Like a Song</Label>
                    <p className="text-sm text-muted-foreground">Points per song liked</p>
                  </div>
                  <Input type="number" placeholder="5" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Share a Playlist</Label>
                    <p className="text-sm text-muted-foreground">Points for sharing playlists</p>
                  </div>
                  <Input type="number" placeholder="25" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Follow an Artist</Label>
                    <p className="text-sm text-muted-foreground">Points for following artists</p>
                  </div>
                  <Input type="number" placeholder="10" className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Create Playlist</Label>
                    <p className="text-sm text-muted-foreground">Points for creating playlists</p>
                  </div>
                  <Input type="number" placeholder="50" className="w-20" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Bonus Actions</Label>
                    <p className="text-sm text-muted-foreground">Allow users to earn bonus points</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Double Points Weekends</Label>
                    <p className="text-sm text-muted-foreground">2x points on Saturday & Sunday</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Invite & Earn System
              </CardTitle>
              <CardDescription>Configure referral rewards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Referral System</Label>
                  <p className="text-sm text-muted-foreground">Allow users to invite friends</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Referral Bonus Points</Label>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>100 points</span>
                    <span>2000 points</span>
                  </div>
                  <Slider
                    value={inviteBonus}
                    onValueChange={setInviteBonus}
                    max={2000}
                    min={100}
                    step={50}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Referrer gets: {inviteBonus[0]} points | New user gets: {Math.floor(inviteBonus[0] / 2)} points
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="maxReferrals">Maximum Referrals per User</Label>
                <Input id="maxReferrals" type="number" placeholder="10" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="referralCode">Referral Code Format</Label>
                <Input id="referralCode" placeholder="SPOTIFY{USER_ID}" disabled />
                <p className="text-sm text-muted-foreground">Auto-generated format for referral codes</p>
              </div>
            </CardContent>
          </Card>

          {/* Reward Redemption */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Reward Redemption
              </CardTitle>
              <CardDescription>Configure how points can be redeemed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="conversionRate">Points to INR Conversion Rate</Label>
                <div className="flex items-center gap-2">
                  <Input id="conversionRate" type="number" placeholder="100" />
                  <span className="text-sm text-muted-foreground">points = ₹1</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="minRedemption">Minimum Redemption Amount</Label>
                <div className="flex items-center gap-2">
                  <Input id="minRedemption" type="number" placeholder="500" />
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Gift Cards</Label>
                    <p className="text-sm text-muted-foreground">Allow redemption for gift cards</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Bank Transfers</Label>
                    <p className="text-sm text-muted-foreground">Direct transfer to bank accounts</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable UPI Payments</Label>
                    <p className="text-sm text-muted-foreground">Transfer via UPI</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Reward Calculator Preview</CardTitle>
            <CardDescription>See how rewards work with current settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">125 Points</div>
                <p className="text-sm text-muted-foreground">For 100 minutes played</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">375 Points</div>
                <p className="text-sm text-muted-foreground">For 500 minutes played</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">1,125 Points</div>
                <p className="text-sm text-muted-foreground">For 1000 minutes played</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version History */}
        <Card>
          <CardHeader>
            <CardTitle>Settings History</CardTitle>
            <CardDescription>Track changes to reward configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Updated playtime thresholds</p>
                  <p className="text-sm text-muted-foreground">Aug 15, 2024 at 2:30 PM by Admin User</p>
                </div>
                <Button variant="ghost" size="sm">View Changes</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Enabled referral system</p>
                  <p className="text-sm text-muted-foreground">Aug 14, 2024 at 10:15 AM by Admin User</p>
                </div>
                <Button variant="ghost" size="sm">View Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}