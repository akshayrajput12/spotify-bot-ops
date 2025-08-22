import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Clock,
  Trophy,
  Music
} from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  preview_url: string;
  image_url: string;
}

interface MusicPlayerProps {
  playlist: {
    id: string;
    name: string;
    tracks: Track[];
  };
  onPointsEarned?: (points: number) => void;
}

export function MusicPlayer({ playlist, onPointsEarned }: MusicPlayerProps) {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [listeningTime, setListeningTime] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(Date.now());

  const currentTrack = playlist.tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          
          // Track listening time and award points
          setListeningTime(prev => {
            const newTime = prev + 1;
            
            // Award 1 point per minute (every 60 seconds)
            if (newTime % 60 === 0) {
              const newPoints = Math.floor(newTime / 60);
              setPointsEarned(newPoints);
              onPointsEarned?.(1);
              
              toast({
                title: "Points Earned! 🎵",
                description: `+1 point for listening! Total: ${newPoints} points`,
              });
            }
            
            return newTime;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, onPointsEarned, toast]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast({
            title: "Playback Error",
            description: "Unable to play this track. It may not have a preview available.",
            variant: "destructive",
          });
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipToNext = () => {
    if (currentTrackIndex < playlist.tracks.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      setCurrentTime(0);
      
      // Award bonus points for completing a track
      if (currentTime > 25) { // If listened for more than 25 seconds
        const bonusPoints = 5;
        setPointsEarned(prev => prev + bonusPoints);
        onPointsEarned?.(bonusPoints);
        
        toast({
          title: "Track Completed! 🎉",
          description: `+${bonusPoints} bonus points for completing the track!`,
        });
      }
    }
  };

  const skipToPrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTrackEnd = () => {
    // Award completion bonus
    const completionBonus = 5;
    setPointsEarned(prev => prev + completionBonus);
    onPointsEarned?.(completionBonus);
    
    toast({
      title: "Track Completed! 🎉",
      description: `+${completionBonus} bonus points for completing the track!`,
    });

    // Auto-play next track
    skipToNext();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatListeningTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (!currentTrack) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tracks available in this playlist</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.preview_url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnd}
          onLoadStart={() => setCurrentTime(0)}
        />

        {/* Points Display */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Trophy className="mr-1 h-3 w-3" />
            {pointsEarned} Points Earned
          </Badge>
          <div className="text-xs text-muted-foreground">
            <Clock className="inline mr-1 h-3 w-3" />
            Listening: {formatListeningTime(listeningTime)}
          </div>
        </div>

        {/* Track Info */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src={currentTrack.image_url} alt={currentTrack.name} />
            <AvatarFallback>
              <Music className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{currentTrack.name}</h3>
            <p className="text-muted-foreground">{currentTrack.artist}</p>
            <p className="text-sm text-muted-foreground">{currentTrack.album}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Track {currentTrackIndex + 1} of {playlist.tracks.length}
            </p>
            <p className="text-xs text-muted-foreground">{playlist.name}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <Progress 
            value={(currentTime / 30) * 100} // 30s preview
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(30)}</span> {/* 30s preview */}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipToPrevious}
            disabled={currentTrackIndex === 0}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            onClick={togglePlayPause}
            className="rounded-full w-12 h-12 bg-primary hover:bg-primary-dark"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={skipToNext}
            disabled={currentTrackIndex === playlist.tracks.length - 1}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="w-24">
            <Progress 
              value={isMuted ? 0 : volume * 100}
              className="w-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                setVolume(Math.max(0, Math.min(1, percentage)));
                setIsMuted(false);
              }}
            />
          </div>
        </div>

        {/* Reward Info */}
        <div className="mt-4 p-3 bg-primary/5 rounded-lg">
          <div className="text-xs text-center text-muted-foreground">
            💡 Earn 1 point per minute listening • 5 bonus points for completing tracks
          </div>
        </div>
      </CardContent>
    </Card>
  );
}