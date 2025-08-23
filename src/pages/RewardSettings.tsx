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
import { Gift, Target, Users, Coins, Save, Eye, RotateCcw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRewardSettings, useRewardStats, useRewardHistory, useRewardActions } from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";

export default function RewardSettings() {
  const { toast } = useToast();
  
  // Local state for form fields
  const [pointsMultiplier, setPointsMultiplier] = useState([1.5]);
  const [inviteBonus, setInviteBonus] = useState([500]);
  const [playtimeThresholds, setPlaytimeThresholds] = useState({
    100: 50,
    500: 300,
    1000: 750,
    5000: 5000
  });
  const [bonusActions, setBonusActions] = useState({
    likeSong: 5,
    sharePlaylist: 25,
    followArtist: 10,
    createPlaylist: 50,
    enabled: true,
    doublePointsWeekends: false
  });
  const [referralSystem, setReferralSystem] = useState({
    enabled: true,
    bonusPoints: 500,
    maxReferrals: 10,
    codeFormat: 'SPOTIFY{USER_ID}'
  });
  const [redemption, setRedemption] = useState({
    conversionRate: 100,
    minRedemption: 500,
    enableGiftCards: true,
    enableBankTransfers: false,
    enableUPI: true
  });
  const [preview, setPreview] = useState<any[]>([]);
  
  // Data fetching
  const { data: rewardSettings, loading: settingsLoading, refetch: refetchSettings } = useRewardSettings();
  const { data: rewardStats, loading: statsLoading } = useRewardStats();
  const { data: settingsHistory, loading: historyLoading } = useRewardHistory();
  const { updateRewardSetting, calculatePreview, saveAllSettings, loading: actionLoading } = useRewardActions();
  
  // Update local state when settings are loaded
  useEffect(() => {
    if (rewardSettings) {
      setPointsMultiplier([rewardSettings.pointsMultiplier]);
      setInviteBonus([rewardSettings.referralSystem.bonusPoints]);
      setPlaytimeThresholds(rewardSettings.playtimeThresholds);
      setBonusActions(rewardSettings.bonusActions);
      setReferralSystem(rewardSettings.referralSystem);
      setRedemption(rewardSettings.redemption);
      
      // Calculate initial preview
      calculateAndSetPreview();
    }
  }, [rewardSettings]);
  
  const calculateAndSetPreview = async () => {
    const currentSettings = {
      playtimeThresholds,
      pointsMultiplier: pointsMultiplier[0],
      bonusActions,
      referralSystem,
      redemption
    };
    
    const previewData = await calculatePreview(currentSettings);
    setPreview(previewData);
  };
  
  const handleSaveChanges = async () => {
    const settings = {
      playtimeThresholds,
      pointsMultiplier: pointsMultiplier[0],
      bonusActions,
      referralSystem: {
        ...referralSystem,
        bonusPoints: inviteBonus[0]
      },
      redemption
    };
    
    const success = await saveAllSettings(settings);
    if (success) {
      refetchSettings();
      calculateAndSetPreview();
    }
  };
  
  const handleResetToDefault = () => {
    setPointsMultiplier([1.5]);
    setInviteBonus([500]);
    setPlaytimeThresholds({ 100: 50, 500: 300, 1000: 750, 5000: 5000 });
    setBonusActions({
      likeSong: 5,
      sharePlaylist: 25,
      followArtist: 10,
      createPlaylist: 50,
      enabled: true,
      doublePointsWeekends: false
    });
    setReferralSystem({
      enabled: true,
      bonusPoints: 500,
      maxReferrals: 10,
      codeFormat: 'SPOTIFY{USER_ID}'
    });
    setRedemption({
      conversionRate: 100,
      minRedemption: 500,
      enableGiftCards: true,
      enableBankTransfers: false,
      enableUPI: true
    });
    
    toast({
      title: 'Reset Complete',
      description: 'Settings have been reset to default values.',
    });
  };
  
  const updateThreshold = (minutes: number, points: string) => {
    setPlaytimeThresholds(prev => ({
      ...prev,
      [minutes]: parseInt(points) || 0
    }));
  };
  
  const updateBonusAction = (action: string, value: string) => {
    setBonusActions(prev => ({
      ...prev,
      [action]: parseInt(value) || 0
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reward Settings</h1>
            <p className="text-muted-foreground">Configure gamification rewards and point systems</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={calculateAndSetPreview}
              disabled={actionLoading || settingsLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetToDefault}
              disabled={actionLoading || settingsLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
            <Button 
              size="sm"
              onClick={handleSaveChanges}
              disabled={actionLoading || settingsLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {settingsLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reward settings...</span>
          </div>
        ) : (
          <>
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
                    {Object.entries(playtimeThresholds).map(([minutes, points]) => (
                      <div key={minutes} className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`threshold${minutes}`}>{minutes} Minutes</Label>
                          <Input 
                            id={`threshold${minutes}`} 
                            type="number" 
                            value={points}
                            onChange={(e) => updateThreshold(parseInt(minutes), e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Current: {points} points</Label>
                          <Badge 
                            variant={parseInt(minutes) >= 5000 ? "secondary" : "outline"} 
                            className={parseInt(minutes) >= 5000 ? "bg-success/10 text-success border-success/20 mt-2" : "mt-2"}
                          >
                            {parseInt(minutes) >= 5000 ? "Premium" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    ))}
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
                      <Input 
                        type="number" 
                        value={bonusActions.likeSong}
                        onChange={(e) => updateBonusAction('likeSong', e.target.value)}
                        className="w-20" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Share a Playlist</Label>
                        <p className="text-sm text-muted-foreground">Points for sharing playlists</p>
                      </div>
                      <Input 
                        type="number" 
                        value={bonusActions.sharePlaylist}
                        onChange={(e) => updateBonusAction('sharePlaylist', e.target.value)}
                        className="w-20" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Follow an Artist</Label>
                        <p className="text-sm text-muted-foreground">Points for following artists</p>
                      </div>
                      <Input 
                        type="number" 
                        value={bonusActions.followArtist}
                        onChange={(e) => updateBonusAction('followArtist', e.target.value)}
                        className="w-20" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Create Playlist</Label>
                        <p className="text-sm text-muted-foreground">Points for creating playlists</p>
                      </div>
                      <Input 
                        type="number" 
                        value={bonusActions.createPlaylist}
                        onChange={(e) => updateBonusAction('createPlaylist', e.target.value)}
                        className="w-20" 
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Bonus Actions</Label>
                        <p className="text-sm text-muted-foreground">Allow users to earn bonus points</p>
                      </div>
                      <Switch 
                        checked={bonusActions.enabled}
                        onCheckedChange={(checked) => setBonusActions(prev => ({ ...prev, enabled: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Double Points Weekends</Label>
                        <p className="text-sm text-muted-foreground">2x points on Saturday & Sunday</p>
                      </div>
                      <Switch 
                        checked={bonusActions.doublePointsWeekends}
                        onCheckedChange={(checked) => setBonusActions(prev => ({ ...prev, doublePointsWeekends: checked }))}
                      />
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
                    <Switch 
                      checked={referralSystem.enabled}
                      onCheckedChange={(checked) => setReferralSystem(prev => ({ ...prev, enabled: checked }))}
                    />
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
                    <Input 
                      id="maxReferrals" 
                      type="number" 
                      value={referralSystem.maxReferrals}
                      onChange={(e) => setReferralSystem(prev => ({ ...prev, maxReferrals: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="referralCode">Referral Code Format</Label>
                    <Input 
                      id="referralCode" 
                      value={referralSystem.codeFormat}
                      onChange={(e) => setReferralSystem(prev => ({ ...prev, codeFormat: e.target.value }))}
                    />
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
                      <Input 
                        id="conversionRate" 
                        type="number" 
                        value={redemption.conversionRate}
                        onChange={(e) => setRedemption(prev => ({ ...prev, conversionRate: parseInt(e.target.value) || 0 }))}
                      />
                      <span className="text-sm text-muted-foreground">points = ₹1</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="minRedemption">Minimum Redemption Amount</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="minRedemption" 
                        type="number" 
                        value={redemption.minRedemption}
                        onChange={(e) => setRedemption(prev => ({ ...prev, minRedemption: parseInt(e.target.value) || 0 }))}
                      />
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
                      <Switch 
                        checked={redemption.enableGiftCards}
                        onCheckedChange={(checked) => setRedemption(prev => ({ ...prev, enableGiftCards: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Bank Transfers</Label>
                        <p className="text-sm text-muted-foreground">Direct transfer to bank accounts</p>
                      </div>
                      <Switch 
                        checked={redemption.enableBankTransfers}
                        onCheckedChange={(checked) => setRedemption(prev => ({ ...prev, enableBankTransfers: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable UPI Payments</Label>
                        <p className="text-sm text-muted-foreground">Transfer via UPI</p>
                      </div>
                      <Switch 
                        checked={redemption.enableUPI}
                        onCheckedChange={(checked) => setRedemption(prev => ({ ...prev, enableUPI: checked }))}
                      />
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
                  {preview.length > 0 ? (
                    preview.slice(0, 3).map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{item.points} Points</div>
                        <p className="text-sm text-muted-foreground">For {item.minutes} minutes played</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 p-4 border rounded-lg text-center">
                      <div className="text-muted-foreground">Click Preview to calculate rewards with current settings</div>
                    </div>
                  )}
                </div>
                {rewardStats && (
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-success">{rewardStats.totalPointsDistributed.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">Total Points Distributed</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{rewardStats.usersWithPoints}</div>
                      <p className="text-sm text-muted-foreground">Users with Points</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl font-bold text-warning">{rewardStats.avgPointsPerUser}</div>
                      <p className="text-sm text-muted-foreground">Average Points per User</p>
                    </div>
                  </div>
                )}
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
                  {historyLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading history...</span>
                    </div>
                  ) : settingsHistory && settingsHistory.length > 0 ? (
                    settingsHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-muted-foreground">{item.changedAt} by {item.changedBy}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: 'Change Details',
                              description: item.description,
                            });
                          }}
                        >
                          View Changes
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">
                      No settings history available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}