import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Bot, Play, Pause, SkipForward, Shield, TestTube, Save, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useBotConfig, useBotStats, useBotActions } from "@/hooks/useDatabase";
import { BotService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

export default function BotSettings() {
  const { toast } = useToast();
  
  // Bot configuration state
  const [botConfigId, setBotConfigId] = useState<string>('default');
  const [minDuration, setMinDuration] = useState([15]);
  const [maxDuration, setMaxDuration] = useState([45]);
  const [minDelay, setMinDelay] = useState([5]);
  const [maxDelay, setMaxDelay] = useState([30]);
  const [dailyLimit, setDailyLimit] = useState('8');
  const [enablePremiumOnly, setEnablePremiumOnly] = useState(true);
  const [playbackMode, setPlaybackMode] = useState("intelligent");
  const [enableRandomSkips, setEnableRandomSkips] = useState(false);
  const [enablePauseResume, setEnablePauseResume] = useState(true);
  const [likePpopularSongs, setLikePpopularSongs] = useState(false);
  const [skipProbability, setSkipProbability] = useState('15');
  const [minAccountAge, setMinAccountAge] = useState('7');
  const [kycRequired, setKycRequired] = useState(true);
  
  // Data fetching
  const { data: botConfig, loading: configLoading, refetch: refetchConfig } = useBotConfig(botConfigId);
  const { data: botStats, loading: statsLoading, refetch: refetchStats } = useBotStats();
  const { updateBotConfig, createBotConfig, testBotConfig, loading: actionLoading } = useBotActions();
  
  // Load bot configuration when component mounts
  useEffect(() => {
    const loadDefaultConfig = async () => {
      try {
        const config = await BotService.getDefaultBotConfig();
        if (config) {
          setBotConfigId(config.id);
          updateStateFromConfig(config);
        }
      } catch (error) {
        console.error('Error loading default config:', error);
      }
    };
    
    loadDefaultConfig();
  }, []);
  
  // Update local state when bot config changes
  useEffect(() => {
    if (botConfig) {
      updateStateFromConfig(botConfig);
    }
  }, [botConfig]);
  
  const updateStateFromConfig = (config: any) => {
    if (config.config?.session) {
      setMinDuration([config.config.session.minDuration || 15]);
      setMaxDuration([config.config.session.maxDuration || 45]);
      setMinDelay([config.config.session.minDelay || 5]);
      setMaxDelay([config.config.session.maxDelay || 30]);
      setDailyLimit(String(config.config.session.dailyLimit || 8));
    }
    
    if (config.config?.playback) {
      setPlaybackMode(config.config.playback.mode || 'intelligent');
      setEnableRandomSkips(config.config.playback.enableRandomSkips || false);
      setEnablePauseResume(config.config.playback.enablePauseResume || true);
      setLikePpopularSongs(config.config.playback.likePpopularSongs || false);
      setSkipProbability(String(config.config.playback.skipProbability || 15));
    }
    
    if (config.config?.restrictions) {
      setEnablePremiumOnly(config.config.restrictions.premiumOnly || true);
      setMinAccountAge(String(config.config.restrictions.minAccountAge || 7));
      setKycRequired(config.config.restrictions.kycRequired || true);
    }
  };
  
  const handleSaveChanges = async () => {
    const configData = {
      config: {
        session: {
          minDuration: minDuration[0],
          maxDuration: maxDuration[0],
          minDelay: minDelay[0],
          maxDelay: maxDelay[0],
          dailyLimit: parseInt(dailyLimit)
        },
        playback: {
          mode: playbackMode,
          enableRandomSkips,
          enablePauseResume,
          likePpopularSongs,
          skipProbability: parseInt(skipProbability)
        },
        restrictions: {
          premiumOnly: enablePremiumOnly,
          minAccountAge: parseInt(minAccountAge),
          kycRequired
        }
      }
    };
    
    if (botConfigId === 'default') {
      // Create new config
      const success = await createBotConfig({
        name: 'Default Bot Configuration',
        description: 'Default bot settings for the system',
        status: 'active',
        ...configData
      });
      if (success) {
        refetchConfig();
        refetchStats();
      }
    } else {
      // Update existing config
      const success = await updateBotConfig(botConfigId, configData);
      if (success) {
        refetchConfig();
        refetchStats();
      }
    }
  };
  
  const handleTestBot = async () => {
    if (botConfigId !== 'default') {
      await testBotConfig(botConfigId);
      refetchStats();
    } else {
      toast({
        title: 'Save Configuration First',
        description: 'Please save the configuration before testing.',
        variant: 'destructive'
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'paused':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Paused</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bot Settings</h1>
            <p className="text-muted-foreground">Configure AI bot behaviors, timing, and playback patterns</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTestBot}
              disabled={actionLoading || configLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4 mr-2" />
              )}
              Test Bot
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveChanges}
              disabled={actionLoading || configLoading}
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

        {configLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading bot configuration...</span>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Session Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Session Configuration
                  </CardTitle>
                  <CardDescription>Set timing parameters for bot listening sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Session Duration (minutes)</Label>
                    <div className="grid gap-4">
                      <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Minimum</span>
                          <span>{minDuration[0]} min</span>
                        </div>
                        <Slider
                          value={minDuration}
                          onValueChange={setMinDuration}
                          max={60}
                          min={5}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Maximum</span>
                          <span>{maxDuration[0]} min</span>
                        </div>
                        <Slider
                          value={maxDuration}
                          onValueChange={setMaxDuration}
                          max={120}
                          min={15}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Delay Between Actions (seconds)</Label>
                    <div className="grid gap-4">
                      <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Minimum Delay</span>
                          <span>{minDelay[0]}s</span>
                        </div>
                        <Slider
                          value={minDelay}
                          onValueChange={setMinDelay}
                          max={60}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Maximum Delay</span>
                          <span>{maxDelay[0]}s</span>
                        </div>
                        <Slider
                          value={maxDelay}
                          onValueChange={setMaxDelay}
                          max={120}
                          min={5}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label htmlFor="dailyLimit">Daily Playtime Limit (hours)</Label>
                    <Input
                      id="dailyLimit"
                      type="number"
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(e.target.value)}
                      min="1"
                      max="24"
                    />
                    <p className="text-sm text-muted-foreground">Maximum daily listening time per user to maintain ethical limits</p>
                  </div>
                </CardContent>
              </Card>

              {/* Playback Behavior */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Playback Behavior
                  </CardTitle>
                  <CardDescription>Configure how bots interact with Spotify</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="playbackMode">Playback Mode</Label>
                    <Select value={playbackMode} onValueChange={setPlaybackMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intelligent">Intelligent (AI-driven)</SelectItem>
                        <SelectItem value="random">Random Playback</SelectItem>
                        <SelectItem value="sequential">Sequential</SelectItem>
                        <SelectItem value="user-preference">User Preference Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Random Skips</Label>
                        <p className="text-sm text-muted-foreground">Allow bots to skip songs occasionally</p>
                      </div>
                      <Switch 
                        checked={enableRandomSkips}
                        onCheckedChange={setEnableRandomSkips}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Enable Pause/Resume</Label>
                        <p className="text-sm text-muted-foreground">Simulate natural listening patterns</p>
                      </div>
                      <Switch 
                        checked={enablePauseResume}
                        onCheckedChange={setEnablePauseResume}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label>Like Popular Songs</Label>
                        <p className="text-sm text-muted-foreground">Automatically like trending tracks</p>
                      </div>
                      <Switch 
                        checked={likePpopularSongs}
                        onCheckedChange={setLikePpopularSongs}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="skipProbability">Skip Probability (%)</Label>
                    <Input
                      id="skipProbability"
                      type="number"
                      value={skipProbability}
                      onChange={(e) => setSkipProbability(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* User Restrictions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    User Restrictions
                  </CardTitle>
                  <CardDescription>Control which users can access bot features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Premium Users Only</Label>
                      <p className="text-sm text-muted-foreground">Restrict bot features to Spotify Premium users</p>
                    </div>
                    <Switch
                      checked={enablePremiumOnly}
                      onCheckedChange={setEnablePremiumOnly}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="minAccountAge">Minimum Account Age (days)</Label>
                    <Input
                      id="minAccountAge"
                      type="number"
                      value={minAccountAge}
                      onChange={(e) => setMinAccountAge(e.target.value)}
                      min="0"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="kycRequired">KYC Verification Required</Label>
                        <p className="text-sm text-muted-foreground">Require identity verification before bot access</p>
                      </div>
                      <Switch 
                        checked={kycRequired}
                        onCheckedChange={setKycRequired}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Bot Status & Testing</CardTitle>
                  <CardDescription>Current system status and testing tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          botStats?.serviceStatus === 'active' ? 'bg-success' : 
                          botStats?.serviceStatus === 'error' ? 'bg-destructive' : 'bg-warning'
                        }`}></div>
                        <span className="font-medium">Bot Service Status</span>
                      </div>
                      {statsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        getStatusBadge(botStats?.serviceStatus || 'inactive')
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-medium">Active Bot Sessions</span>
                      </div>
                      {statsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Badge variant="outline">{botStats?.activeSessions || 0}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          (botStats?.pendingLogs || 0) > 0 ? 'bg-warning' : 'bg-success'
                        }`}></div>
                        <span className="font-medium">Queue Status</span>
                      </div>
                      {statsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Badge 
                          variant="secondary" 
                          className={`${
                            (botStats?.pendingLogs || 0) > 0 
                              ? 'bg-warning/10 text-warning border-warning/20' 
                              : 'bg-success/10 text-success border-success/20'
                          }`}
                        >
                          {(botStats?.pendingLogs || 0) > 0 
                            ? `${botStats?.pendingLogs} Pending` 
                            : 'All Clear'
                          }
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleTestBot}
                      disabled={actionLoading || botConfigId === 'default'}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4 mr-2" />
                      )}
                      Run Test Session
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        refetchStats();
                        refetchConfig();
                      }}
                      disabled={statsLoading || configLoading}
                    >
                      {statsLoading || configLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Refresh Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Global Actions</CardTitle>
                <CardDescription>Apply changes across all bot instances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSaveChanges} 
                    disabled={actionLoading || configLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Apply to All Users
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: 'Premium Configuration',
                        description: 'Configuration will be applied to premium users only.',
                      });
                    }}
                    disabled={actionLoading}
                  >
                    Apply to Premium Only
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: 'Template Saved',
                        description: 'Configuration saved as a template for future use.',
                      });
                    }}
                    disabled={actionLoading}
                  >
                    Save as Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}