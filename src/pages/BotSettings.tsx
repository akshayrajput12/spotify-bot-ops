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
import { Bot, Play, Pause, SkipForward, Shield, TestTube, Save, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function BotSettings() {
  const [minDuration, setMinDuration] = useState([15]);
  const [maxDuration, setMaxDuration] = useState([45]);
  const [minDelay, setMinDelay] = useState([5]);
  const [maxDelay, setMaxDelay] = useState([30]);
  const [enablePremiumOnly, setEnablePremiumOnly] = useState(true);
  const [playbackMode, setPlaybackMode] = useState("intelligent");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bot Settings</h1>
            <p className="text-muted-foreground">Configure AI bot behaviors, timing, and playback patterns</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <TestTube className="h-4 w-4 mr-2" />
              Test Bot
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

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
                  placeholder="8"
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
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Pause/Resume</Label>
                    <p className="text-sm text-muted-foreground">Simulate natural listening patterns</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Like Popular Songs</Label>
                    <p className="text-sm text-muted-foreground">Automatically like trending tracks</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="skipProbability">Skip Probability (%)</Label>
                <Input
                  id="skipProbability"
                  type="number"
                  placeholder="15"
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
                  placeholder="7"
                  min="0"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="kycRequired">KYC Verification Required</Label>
                <Switch defaultChecked />
                <p className="text-sm text-muted-foreground">Require identity verification before bot access</p>
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
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="font-medium">Bot Service Status</span>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">Active Bot Sessions</span>
                  </div>
                  <Badge variant="outline">247</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="font-medium">Queue Status</span>
                  </div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">12 Pending</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  <TestTube className="h-4 w-4 mr-2" />
                  Run Test Session
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Restart Bot Service
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
              <Button>Apply to All Users</Button>
              <Button variant="outline">Apply to Premium Only</Button>
              <Button variant="outline">Save as Template</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}