import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, Play, Users, TrendingUp, Clock, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlaylistStats, useRecentActivities } from "@/hooks/useDatabase";

export function PlaylistSection() {
  const navigate = useNavigate();
  const { data: playlistStats, loading: statsLoading } = usePlaylistStats();
  const { data: recentActivities, loading: activitiesLoading } = useRecentActivities();
  
  // Mock top playlists data - in a real app, this would come from the database
  // This would be another hook like useTopPlaylists()
  const topPlaylists = [
    {
      id: "1",
      name: "Today's Top Hits",
      image_url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      listeners: 456,
      totalTime: 1247,
      pointsEarned: 8934
    },
    {
      id: "2", 
      name: "RapCaviar",
      image_url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      listeners: 387,
      totalTime: 892,
      pointsEarned: 6721
    },
    {
      id: "3",
      name: "Chill Vibes",
      image_url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      listeners: 293,
      totalTime: 1456,
      pointsEarned: 7834
    }
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Music & Rewards</h2>
          <p className="text-muted-foreground">Spotify playlist management and user engagement</p>
        </div>
        <Button onClick={() => navigate('/playlists')} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Manage Playlists
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Playlists</p>
                <p className="text-xl font-bold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : playlistStats?.totalPlaylists || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <Play className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Playlists</p>
                <p className="text-xl font-bold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : playlistStats?.activePlaylists || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listening Hours</p>
                <p className="text-xl font-bold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (playlistStats?.totalListeningHours || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light/20 rounded-lg">
                <Users className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Listeners</p>
                <p className="text-xl font-bold">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (playlistStats?.activeListeners || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-primary-light border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Points Distributed</p>
                <p className="text-xl font-bold text-white">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : (playlistStats?.pointsDistributed || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Playlists & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Playlists */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performing Playlists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPlaylists.map((playlist, index) => (
              <div key={playlist.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-lg font-bold text-muted-foreground w-6">
                    #{index + 1}
                  </div>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={playlist.image_url} alt={playlist.name} />
                    <AvatarFallback className="bg-primary/10">
                      <Music className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{playlist.name}</h4>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>{playlist.listeners} listeners</span>
                      <span>{formatTime(playlist.totalTime)} played</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {playlist.pointsEarned} pts
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => navigate('/playlists')}>
              View All Playlists
            </Button>
          </CardContent>
        </Card>

        {/* Recent Listening Activity */}
        <Card className="bg-card border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Recent Listening Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : recentActivities && recentActivities.length > 0 ? (
              recentActivities.slice(0, 4).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-success' : 
                      activity.type === 'warning' ? 'bg-warning' : 
                      activity.type === 'error' ? 'bg-destructive' : 'bg-muted-foreground'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-success">Activity</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
            <Button variant="outline" className="w-full" onClick={() => navigate('/analytics')}>
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start hover:bg-primary/10" onClick={() => navigate('/playlists')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Playlist
          </Button>
          <Button variant="outline" className="justify-start hover:bg-primary/10" onClick={() => navigate('/rewards/settings')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Update Reward Settings
          </Button>
          <Button variant="outline" className="justify-start hover:bg-primary/10" onClick={() => navigate('/analytics')}>
            <Users className="mr-2 h-4 w-4" />
            View User Analytics
          </Button>
          <Button variant="outline" className="justify-start hover:bg-primary/10">
            <Music className="mr-2 h-4 w-4" />
            Spotify Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}