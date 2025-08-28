import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Clock, 
  Calendar,
  Filter,
  Play,
  Pause,
  SkipForward
} from "lucide-react";
import { useState } from "react";

export function HistoryComponent() {
  const [filter, setFilter] = useState("all");
  
  // Mock listening history - in a real app, this would come from the database
  const listeningHistory = [
    {
      id: 1,
      song: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      duration: "3:20",
      date: "2023-06-15",
      time: "14:30",
      playlist: "Today's Top Hits"
    },
    {
      id: 2,
      song: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      duration: "2:54",
      date: "2023-06-15",
      time: "14:25",
      playlist: "Chill Vibes"
    },
    {
      id: 3,
      song: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      duration: "3:23",
      date: "2023-06-14",
      time: "20:15",
      playlist: "Dance Party"
    },
    {
      id: 4,
      song: "Good 4 U",
      artist: "Olivia Rodrigo",
      album: "SOUR",
      duration: "2:58",
      date: "2023-06-14",
      time: "20:10",
      playlist: "Pop Hits"
    }
  ];

  const filterOptions = [
    { value: "all", label: "All History" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Listening History</h1>
        <p className="text-muted-foreground">Your complete Spotify listening history</p>
      </div>

      {/* Filters */}
      <Card className="bg-card border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(option.value)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Listening Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Playtime</p>
                <h3 className="text-2xl font-bold">4h 32m</h3>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Songs Played</p>
                <h3 className="text-2xl font-bold">127</h3>
              </div>
              <Music className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Playlists</p>
                <h3 className="text-2xl font-bold">8</h3>
              </div>
              <Play className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listening History */}
      <Card className="bg-card border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Listening Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listeningHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="aspect-square bg-muted rounded-md w-16 h-16 flex items-center justify-center">
                    <Music className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.song}</h3>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.playlist}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.date}</p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Load More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}