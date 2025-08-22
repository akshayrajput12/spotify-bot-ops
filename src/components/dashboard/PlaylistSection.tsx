import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Music, Play, Users, TrendingUp, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaylistStats {
  totalPlaylists: number;
  activePlaylists: number;
  totalListeningHours: number;
  activeListeners: number;
  pointsDistributed: number;
}

interface TopPlaylist {
  id: string;
  name: string;
  image_url: string;
  listeners: number;
  totalTime: number;
  pointsEarned: number;
}

export function PlaylistSection() {
  const navigate = useNavigate();

  // Mock data for demonstration
  const stats: PlaylistStats = {
    totalPlaylists: 12,
    activePlaylists: 8,
    totalListeningHours: 2847,
    activeListeners: 1243,
    pointsDistributed: 45620
  };

  const topPlaylists: TopPlaylist[] = [
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

  const recentActivity = [
    { user: "user@example.com", playlist: "Today's Top Hits", points: 25, time: "2 min ago" },
    { user: "john.doe@example.com", playlist: "RapCaviar", points: 18, time: "5 min ago" },
    { user: "jane.smith@example.com", playlist: "Chill Vibes", points: 32, time: "8 min ago" },
    { user: "mike.wilson@example.com", playlist: "Today's Top Hits", points: 15, time: "12 min ago" },
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
        <Button onClick={() => navigate('/playlists')}>
          <Plus className="mr-2 h-4 w-4" />
          Manage Playlists
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Playlists</p>
                <p className="text-xl font-bold">{stats.totalPlaylists}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Play className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Playlists</p>
                <p className="text-xl font-bold">{stats.activePlaylists}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listening Hours</p>
                <p className="text-xl font-bold">{stats.totalListeningHours.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light/10 rounded-lg">
                <Users className="h-5 w-5 text-primary-light" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Listeners</p>
                <p className="text-xl font-bold">{stats.activeListeners.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-light rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points Distributed</p>
                <p className="text-xl font-bold">{stats.pointsDistributed.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Playlists & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Playlists */}
        <Card>
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
                    <AvatarFallback>
                      <Music className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{playlist.name}</h4>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Recent Listening Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">
                      Listened to "{activity.playlist}"
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-success">+{activity.points} pts</div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={() => navigate('/analytics')}>
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="justify-start" onClick={() => navigate('/playlists')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Playlist
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => navigate('/rewards/settings')}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Update Reward Settings
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => navigate('/analytics')}>
            <Users className="mr-2 h-4 w-4" />
            View User Analytics
          </Button>
          <Button variant="outline" className="justify-start">
            <Music className="mr-2 h-4 w-4" />
            Spotify Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}