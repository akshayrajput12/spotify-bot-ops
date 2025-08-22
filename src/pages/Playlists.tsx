import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Music, 
  Plus, 
  Search, 
  Clock, 
  Users,
  ExternalLink,
  Play,
  Pause,
  MoreHorizontal,
  Trash2,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  preview_url: string;
  image_url: string;
}

interface Playlist {
  id: string;
  spotify_id: string;
  name: string;
  description: string;
  image_url: string;
  tracks_count: number;
  total_duration: number;
  is_active: boolean;
  created_by: string;
  tracks: Track[];
}

export default function Playlists() {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Mock data for development
  const mockPlaylists: Playlist[] = [
    {
      id: "1",
      spotify_id: "37i9dQZF1DXcBWIGoYBM5M",
      name: "Today's Top Hits",
      description: "The most played songs on Spotify right now",
      image_url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      tracks_count: 50,
      total_duration: 12000,
      is_active: true,
      created_by: "admin",
      tracks: []
    },
    {
      id: "2", 
      spotify_id: "37i9dQZF1DX0XUsuxWHRQd",
      name: "RapCaviar",
      description: "New music and big hits in hip-hop",
      image_url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6",
      tracks_count: 65,
      total_duration: 15600,
      is_active: true,
      created_by: "admin",
      tracks: []
    }
  ];

  useEffect(() => {
    setPlaylists(mockPlaylists);
  }, []);

  const connectToSpotify = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would use the Spotify Web API
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      setSpotifyAccessToken("mock_token");
      toast({
        title: "Connected to Spotify",
        description: "Successfully connected to your Spotify account",
      });
      
      // Mock Spotify playlists
      setSpotifyPlaylists([
        {
          id: "new1",
          name: "Chill Vibes",
          description: "Relaxing music for focus",
          images: [{ url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6" }],
          tracks: { total: 45 }
        },
        {
          id: "new2", 
          name: "Workout Mix",
          description: "High energy tracks for exercise",
          images: [{ url: "https://i.scdn.co/image/ab67706f00000002ca5a7517156021292e5663a6" }],
          tracks: { total: 32 }
        }
      ]);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Spotify. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const importPlaylist = async (spotifyPlaylist: any) => {
    setLoading(true);
    try {
      // Simulate importing playlist
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        spotify_id: spotifyPlaylist.id,
        name: spotifyPlaylist.name,
        description: spotifyPlaylist.description,
        image_url: spotifyPlaylist.images[0]?.url || "",
        tracks_count: spotifyPlaylist.tracks.total,
        total_duration: spotifyPlaylist.tracks.total * 210, // Assume 3.5min avg
        is_active: true,
        created_by: "admin",
        tracks: []
      };
      
      setPlaylists(prev => [...prev, newPlaylist]);
      toast({
        title: "Playlist Imported",
        description: `"${spotifyPlaylist.name}" has been added to your playlists`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import playlist. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const togglePlaylistStatus = (playlistId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, is_active: !playlist.is_active }
        : playlist
    ));
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    toast({
      title: "Playlist Deleted",
      description: "Playlist has been removed from your collection",
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Playlist Management</h1>
            <p className="text-muted-foreground">
              Import and manage Spotify playlists for user rewards
            </p>
          </div>
          <div className="flex gap-3">
            {!isConnected ? (
              <Button 
                onClick={connectToSpotify}
                disabled={loading}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white"
              >
                <Music className="mr-2 h-4 w-4" />
                Connect Spotify
              </Button>
            ) : (
              <Badge variant="outline" className="bg-success/10 text-success border-success">
                <Music className="mr-1 h-3 w-3" />
                Spotify Connected
              </Badge>
            )}
          </div>
        </div>

        {/* Search and Stats */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{playlists.length} Total</span>
            <span>{playlists.filter(p => p.is_active).length} Active</span>
            <span>{playlists.reduce((sum, p) => sum + p.tracks_count, 0)} Tracks</span>
          </div>
        </div>

        {/* Spotify Import Section */}
        {isConnected && spotifyPlaylists.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Import from Spotify
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {spotifyPlaylists.map((playlist) => (
                  <Card key={playlist.id} className="border-dashed">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={playlist.images[0]?.url} />
                          <AvatarFallback>
                            <Music className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{playlist.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {playlist.tracks.total} tracks
                          </p>
                          <Button 
                            size="sm" 
                            onClick={() => importPlaylist(playlist)}
                            disabled={loading}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Import
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playlists Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlaylists.map((playlist) => (
            <Card key={playlist.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={playlist.image_url} 
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="bg-background/80 backdrop-blur">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => setSelectedPlaylist(playlist)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a 
                          href={`https://open.spotify.com/playlist/${playlist.spotify_id}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open in Spotify
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deletePlaylist(playlist.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold truncate">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {playlist.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {playlist.tracks_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(playlist.total_duration)}
                      </span>
                    </div>
                    <Switch 
                      checked={playlist.is_active}
                      onCheckedChange={() => togglePlaylistStatus(playlist.id)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge variant={playlist.is_active ? "default" : "secondary"}>
                      {playlist.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      by {playlist.created_by}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlaylists.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No playlists found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? "No playlists match your search criteria"
                  : "Connect to Spotify to import your first playlist"
                }
              </p>
              {!isConnected && (
                <Button onClick={connectToSpotify} disabled={loading}>
                  <Music className="mr-2 h-4 w-4" />
                  Connect Spotify
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Playlist Details Dialog */}
        <Dialog open={!!selectedPlaylist} onOpenChange={() => setSelectedPlaylist(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedPlaylist?.name}</DialogTitle>
              <DialogDescription>
                Playlist details and track information
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlaylist && (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedPlaylist.image_url} />
                    <AvatarFallback>
                      <Music className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedPlaylist.name}</h3>
                    <p className="text-muted-foreground">{selectedPlaylist.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>{selectedPlaylist.tracks_count} tracks</span>
                      <span>{formatDuration(selectedPlaylist.total_duration)}</span>
                      <Badge variant={selectedPlaylist.is_active ? "default" : "secondary"}>
                        {selectedPlaylist.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Reward Settings</h4>
                  <div className="text-sm text-muted-foreground">
                    • Users earn 1 point per minute listened<br/>
                    • Bonus 5 points for completing a full track<br/>
                    • Double points for first-time listeners
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}