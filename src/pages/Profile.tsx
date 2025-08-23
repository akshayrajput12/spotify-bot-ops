import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Shield, Bell, Save, Camera, Key, Clock, Activity, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentProfile, useRecentActivity, useSessionInfo, useProfileActions } from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: 'UTC',
    bio: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [adminSettings, setAdminSettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    emailNotifications: true,
    kycAlerts: true,
    systemAlerts: true,
    transactionAlerts: false,
    weeklyReports: true
  });
  
  // Data fetching
  const { data: profile, loading: profileLoading, refetch: refetchProfile } = useCurrentProfile();
  const { data: recentActivity, loading: activityLoading } = useRecentActivity();
  const { data: sessionInfo, loading: sessionLoading } = useSessionInfo();
  const { updateProfile, updatePassword, updateAdminSettings, logout, loading: actionLoading } = useProfileActions();
  
  // Update form state when profile data loads
  useEffect(() => {
    if (profile) {
      const nameParts = (profile.fullName || '').split(' ');
      setProfileForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: profile.email || '',
        phone: profile.phone || '',
        timezone: profile.timezone || 'UTC',
        bio: profile.bio || ''
      });
      
      if (profile.adminData) {
        setAdminSettings(prev => ({
          ...prev,
          twoFactorEnabled: profile.adminData?.twoFactorEnabled || false
        }));
      }
    }
  }, [profile]);
  
  const handleSaveProfile = async () => {
    const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
    const success = await updateProfile({
      fullName,
      phone: profileForm.phone,
      timezone: profileForm.timezone,
      bio: profileForm.bio
    });
    
    if (success) {
      refetchProfile();
    }
  };
  
  const handleUpdatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'New passwords do not match.',
        variant: 'destructive'
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'Validation Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }
    
    const success = await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
    if (success) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };
  
  const handleUpdateAdminSettings = async () => {
    const success = await updateAdminSettings({
      twoFactorEnabled: adminSettings.twoFactorEnabled,
      sessionTimeout: adminSettings.sessionTimeout
    });
    
    if (success) {
      refetchProfile();
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'moderator':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };
  
  const formatRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Super Admin';
      case 'moderator':
        return 'Moderator';
      default:
        return 'User';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Button 
            onClick={handleSaveProfile}
            disabled={actionLoading || profileLoading}
          >
            {actionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {profileLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading profile...</span>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatarUrl || "/placeholder-avatar.jpg"} />
                      <AvatarFallback className="text-lg">
                        {profile?.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'AU'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                      <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileForm.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">Email cannot be changed from this interface.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={profileForm.timezone} 
                      onValueChange={(value) => setProfileForm(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Australia/Sydney (AEST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={handleUpdatePassword}
                    disabled={actionLoading || !passwordForm.currentPassword || !passwordForm.newPassword}
                    className="w-full"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Update Password
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      checked={adminSettings.twoFactorEnabled}
                      onCheckedChange={(checked) => {
                        setAdminSettings(prev => ({ ...prev, twoFactorEnabled: checked }));
                        handleUpdateAdminSettings();
                      }}
                      disabled={actionLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                    </div>
                    <Select 
                      value={adminSettings.sessionTimeout.toString()} 
                      onValueChange={(value) => {
                        setAdminSettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }));
                        handleUpdateAdminSettings();
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 min</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch 
                    checked={adminSettings.emailNotifications}
                    onCheckedChange={(checked) => setAdminSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>KYC Approval Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when KYC requires approval</p>
                  </div>
                  <Switch 
                    checked={adminSettings.kycAlerts}
                    onCheckedChange={(checked) => setAdminSettings(prev => ({ ...prev, kycAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>System Alert Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for system issues</p>
                  </div>
                  <Switch 
                    checked={adminSettings.systemAlerts}
                    onCheckedChange={(checked) => setAdminSettings(prev => ({ ...prev, systemAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of suspicious transactions</p>
                  </div>
                  <Switch 
                    checked={adminSettings.transactionAlerts}
                    onCheckedChange={(checked) => setAdminSettings(prev => ({ ...prev, transactionAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive weekly analytics summaries</p>
                  </div>
                  <Switch 
                    checked={adminSettings.weeklyReports}
                    onCheckedChange={(checked) => setAdminSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Role</span>
                      <Badge 
                        variant="secondary" 
                        className={getRoleBadgeColor(profile?.role || 'user')}
                      >
                        {formatRoleName(profile?.role || 'user')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge 
                        variant="secondary" 
                        className={profile?.isActive ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}
                      >
                        {profile?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Login</span>
                      <span className="text-sm text-muted-foreground">
                        {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Account Created</span>
                      <span className="text-sm text-muted-foreground">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Spotify Connected</span>
                      <Badge 
                        variant="secondary" 
                        className={profile?.spotifyConnected ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}
                      >
                        {profile?.spotifyConnected ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <div className="font-medium">{activity.description}</div>
                      <div className="text-muted-foreground">{activity.relativeTime}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No recent activity</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessionLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Session</span>
                      <span className="text-sm text-muted-foreground">
                        {sessionInfo?.duration || '0h 0m'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">IP Address</span>
                      <span className="text-sm text-muted-foreground">
                        {sessionInfo?.ipAddress || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Device</span>
                      <span className="text-sm text-muted-foreground">
                        {sessionInfo?.device || 'Unknown'}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleLogout}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      End Session
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}