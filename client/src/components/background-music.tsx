import { useState, useRef, useEffect } from "react";

// Helper function for asset URLs with base path handling
function getAssetUrl(path: string): string {
  try {
    const baseUrl = import.meta.env.BASE_URL;
    if (baseUrl && baseUrl !== '/') {
      return baseUrl.endsWith('/') ? baseUrl + path.substring(1) : baseUrl + path;
    }
    return path;
  } catch (e) {
    return path; // Fallback to original path
  }
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

interface BackgroundMusicProps {
  gameActive: boolean;
  gameComplete: boolean;
}

export default function BackgroundMusic({ gameActive, gameComplete }: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]); // Default 50% volume
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => setIsLoaded(true);
    const handleEnded = () => {
      // Loop the background music
      audio.currentTime = 0;
      if (gameActive && !gameComplete) {
        audio.play().catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [gameActive, gameComplete]);

  // Auto-start music when game becomes active
  useEffect(() => {
    if (gameActive && !gameComplete && isLoaded && !isPlaying) {
      togglePlay();
    }
  }, [gameActive, isLoaded]);
  

  // Stop music when game completes
  useEffect(() => {
    if (gameComplete && isPlaying) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setIsPlaying(false);
      }
    }
  }, [gameComplete, isPlaying]);

  // Update volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = async () =>{
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (newVolume[0] > 0 && isMuted) {
      setIsMuted(false);
    }
    if (newVolume[0] === 0) {
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-20">
      <Card className="bg-card/90 backdrop-blur-sm shadow-lg border border-border">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                onClick={togglePlay}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={!isLoaded || gameComplete}
                data-testid="button-background-music-play"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={toggleMute}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                disabled={!isLoaded}
                aria-pressed={isMuted}
                aria-label={isMuted ? "Unmute background music" : "Mute background music"}
                data-testid="button-background-music-mute"
              >
                {isMuted || volume[0] === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 min-w-[80px]">
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
                disabled={!isLoaded}
                data-testid="slider-background-music-volume"
              />
              <span className="text-xs text-muted-foreground min-w-[30px]" data-testid="text-volume-level">
                {isMuted ? "0%" : `${volume[0]}%`}
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground" data-testid="text-music-status">
              {gameComplete 
                ? "🎵 Background music (completed)" 
                : isMuted
                  ? "🔇 Background music (muted)"
                  : isPlaying 
                    ? "🎵 Background music (playing)" 
                    : "🎵 Background music (paused)"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <audio
        ref={audioRef}
        src={getAssetUrl("/background-music.mp3")}
        preload="metadata"
        loop={false} // Handle looping manually to respect game state
        data-testid="audio-background-music"
      />
    </div>
  );
}