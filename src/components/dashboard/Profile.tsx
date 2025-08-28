import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  Camera,
  Key,
  Shield,
  Globe,
  Music,
  Clock,
  Trophy,
  CalendarDays,
  CreditCard,
  Award,
  Target,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserActions } from "@/hooks/useDatabase";
import { useToast } from "@/hooks/use-toast";

export function Profile({ profile, user }: { profile: any; user: any }) {
  const { toast } = useToast();
  const { updateUserProfile, loading } = useUserActions();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: user?.email || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    location: profile?.location || "",
    dateOfBirth: profile?.date_of_birth || "",
    occupation: profile?.occupation || ""
  });

  // Mock data for user stats - in a real app this would come from the database
  const [userStats, setUserStats] = useState({
    playtime: "125h 32m",
    points: "12,540",
    level: "Gold",
    sessions: "1,247",
    accountAge: "14 months",
    lastActive: "2 hours ago",
    favoriteGenre: "Pop",
    topArtist: "Taylor Swift"
  });

  useEffect(() => {
    // Initialize form data when profile/user data changes
    setFormData({
      fullName: profile?.full_name || "",
      email: user?.email || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      dateOfBirth: profile?.date_of_birth || "",
      occupation: profile?.occupation || ""
    });
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const result = await updateUserProfile(user?.id, {
        full_name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        date_of_birth: formData.dateOfBirth,
        occupation: formData.occupation
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and account settings</p>
      </div>

      {/* Profile Header */}
      <Card className="bg-card border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 border-2 border-background"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">{profile?.full_name || "User"}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {profile?.kyc_status === 'approved' ? 'KYC Verified' : 'KYC Pending'}
                    </Badge>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      Premium User
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Button onClick={handleSave} disabled={loading}>
                      {loading ? (
                        <>
                          <div className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{profile?.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined {new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              {isEditing ? (
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-sm">{profile?.full_name || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <p className="text-sm">{user?.email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-sm">{profile?.phone || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-sm">{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-sm">{profile?.location || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              {isEditing ? (
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-sm">{profile?.occupation || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                />
              ) : (
                <p className="text-sm">{profile?.bio || "No bio provided"}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Login History</p>
                <p className="text-sm text-muted-foreground">View your recent login activity</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Account Status</p>
                <p className="text-sm text-muted-foreground">Your account is active</p>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">KYC Status</p>
                <p className="text-sm text-muted-foreground">Verification status</p>
              </div>
              <Badge variant="secondary" className={profile?.kyc_status === 'approved' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                {profile?.kyc_status === 'approved' ? 'Verified' : 'Pending'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spotify Connection and Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spotify Connection */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 rounded-full p-2">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Spotify Account Connected</p>
                  <p className="text-sm text-muted-foreground">john.doe.spotify</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Connected
              </Badge>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Favorite Genre</span>
                </div>
                <p className="text-lg font-bold mt-1">{userStats.favoriteGenre}</p>
              </div>
              
              <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Top Artist</span>
                </div>
                <p className="text-lg font-bold mt-1">{userStats.topArtist}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Stats */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Playtime</span>
                </div>
                <p className="text-xl font-bold mt-1">{userStats.playtime}</p>
                <p className="text-xs text-muted-foreground">Total listening time</p>
              </div>
              
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Points</span>
                </div>
                <p className="text-xl font-bold mt-1">{userStats.points}</p>
                <p className="text-xs text-muted-foreground">Total earned</p>
              </div>
              
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium">Level</span>
                </div>
                <p className="text-xl font-bold mt-1">{userStats.level}</p>
                <p className="text-xs text-muted-foreground">Member status</p>
              </div>
              
              <div className="p-3 bg-muted/10 rounded-lg border border-muted/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sessions</span>
                </div>
                <p className="text-xl font-bold mt-1">{userStats.sessions}</p>
                <p className="text-xs text-muted-foreground">Total sessions</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-info/10 rounded-lg border border-info/20">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium">Account Age</span>
                </div>
                <p className="text-lg font-bold mt-1">{userStats.accountAge}</p>
              </div>
              
              <div className="p-3 bg-info/10 rounded-lg border border-info/20">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium">Last Active</span>
                </div>
                <p className="text-lg font-bold mt-1">{userStats.lastActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Information */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 text-center">
              <p className="text-2xl font-bold text-primary">14</p>
              <p className="text-sm text-muted-foreground">Months Active</p>
            </div>
            <div className="p-4 bg-success/5 rounded-lg border border-success/10 text-center">
              <p className="text-2xl font-bold text-success">98%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="p-4 bg-info/5 rounded-lg border border-info/10 text-center">
              <p className="text-2xl font-bold text-info">24</p>
              <p className="text-sm text-muted-foreground">Playlists Created</p>
            </div>
            <div className="p-4 bg-warning/5 rounded-lg border border-warning/10 text-center">
              <p className="text-2xl font-bold text-warning">156</p>
              <p className="text-sm text-muted-foreground">Artists Followed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}