import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePlaylists, usePlaylistActions } from "@/hooks/useDatabase";
import { supabase } from "@/integrations/supabase/client";
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
  Eye,
  Loader2
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
  const { profile } = useAuth();
  const { data: playlistsData, loading: playlistsLoading, refetch } = usePlaylists();
  const { importPlaylist, updatePlaylistStatus, deletePlaylist, loading: actionsLoading } = usePlaylistActions();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [fetchingPlaylists, setFetchingPlaylists] = useState(false);

  // Set playlists from database
  useEffect(() => {
    if (playlistsData) {
      setPlaylists(playlistsData);
    }
  }, [playlistsData]);

  // Check if user has Spotify connected
  useEffect(() => {
    if (profile?.spotify_id) {
      setIsConnected(true);
    }
  }, [profile]);

  const connectToSpotify = async () => {
    setLoading(true);
    try {
      // For production deployment, we need to specify the exact redirect URL
      // Check if we have a specific Vercel domain environment variable
      const vercelDomain = import.meta.env.VITE_VERCEL_DOMAIN;
      const isVercel = !!import.meta.env.VITE_VERCEL;
      
      let redirectTo;
      if (process.env.NODE_ENV === 'production') {
        if (vercelDomain) {
          redirectTo = `https://${vercelDomain}/playlists`;
        } else if (isVercel) {
          // If we're on Vercel but don't have a specific domain, use the current origin
          redirectTo = `${window.location.origin}/playlists`;
        } else {
          // Fallback for other production environments
          redirectTo = `${window.location.origin}/playlists`;
        }
      } else {
        // Development environment
        redirectTo = `${window.location.origin}/playlists`;
      }
        
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: redirectTo,
          scopes: 'user-read-email user-read-private playlist-read-private playlist-read-collaborative user-library-read user-read-recently-played'
        }
      });
      
      if (error) {
        toast({
          title: "Connection Failed",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Spotify connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Spotify. Please check the console for details.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchSpotifyPlaylists = async () => {
    if (!profile?.id) return;
    
    setFetchingPlaylists(true);
    try {
      // Get the access token from Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.provider_token;
      
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // Fetch playlists from Spotify API
      const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      setSpotifyPlaylists(data.items || []);
    } catch (error) {
      console.error("Error fetching Spotify playlists:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch playlists from Spotify. Please try again.",
        variant: "destructive",
      });
    }
    setFetchingPlaylists(false);
  };

  // Fetch Spotify playlists when connected
  useEffect(() => {
    if (isConnected) {
      fetchSpotifyPlaylists();
    }
  }, [isConnected]);

  const handleImportPlaylist = async (spotifyPlaylist: any) => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Save playlist to database
      await importPlaylist(spotifyPlaylist, profile.id);
      
      // Refresh playlists
      refetch();
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

  const handleTogglePlaylistStatus = async (playlistId: string) => {
    try {
      // Find the playlist to get its current status
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) return;
      
      // Update playlist status in database
      await updatePlaylistStatus(playlistId, !playlist.is_active);
      
      // Refresh playlists
      refetch();
      toast({
        title: "Playlist Updated",
        description: `Playlist status updated to ${!playlist.is_active ? 'active' : 'inactive'}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update playlist status.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      // Delete playlist from database
      await deletePlaylist(playlistId);
      
      // Refresh playlists
      refetch();
      toast({
        title: "Playlist Deleted",
        description: "Playlist has been removed from your collection",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete playlist.",
        variant: "destructive",
      });
    }
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

  if (playlistsLoading && !playlistsData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

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
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Import from Spotify
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetchingPlaylists ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {spotifyPlaylists.map((playlist) => (
                    <Card key={playlist.id} className="border-dashed">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={playlist.images?.[0]?.url} />
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
                              onClick={() => handleImportPlaylist(playlist)}
                              disabled={loading || actionsLoading}
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
              )}
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
                        onClick={() => handleDeletePlaylist(playlist.id)}
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
                      onCheckedChange={() => handleTogglePlaylistStatus(playlist.id)}
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