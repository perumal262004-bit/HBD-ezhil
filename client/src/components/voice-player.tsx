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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoicePlayerProps {
  isUnlocked: boolean;
}

export default function VoicePlayer({ isUnlocked }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isUnlocked) return;

    // Initialize from current state if already loaded
    if (audio.readyState >= 1 || Number.isFinite(audio.duration)) {
      setDuration(audio.duration || 0);
      setAudioLoading(false);
      setCurrentTime(audio.currentTime);
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      setDuration(audio.duration || 0);
      setAudioError(false);
      setAudioLoading(false);
    };
    const handleCanPlay = () => {
      setAudioError(false);
      setAudioLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    };
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
      setAudioLoading(false);
      toast({
        title: "Audio Error",
        description: "Unable to load the voice message. Please try again.",
        variant: "destructive"
      });
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isUnlocked, toast]);

  const retryAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(false);
    setAudioLoading(true);
    audio.load(); // Force reload the audio
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || audioLoading) return;

    // Allow retry on error
    if (audioError) {
      retryAudio();
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      toast({
        title: "Playback Error", 
        description: "Could not start playing the audio. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isUnlocked) {
    return (
      <Card className="shadow-xl border border-border" data-testid="card-voice-locked">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2" data-testid="text-locked-title">
               Message Locked
            </h3>
            <p className="text-muted-foreground" data-testid="text-locked-description">
             Come On Boys...Innaiku nammaku nalla action block maati irukku
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border border-border" data-testid="card-voice-unlocked">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-primary mb-4 font-serif" data-testid="text-unlocked-title">
            My Special Voice Message For You! 💖
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              onClick={togglePlay}
              className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
              size="icon"
              disabled={audioLoading}
              data-testid="button-play-pause"
            >
              {audioLoading ? (
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
              ) : audioError ? (
                <RotateCcw className="h-6 w-6" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            
            <div className="text-muted-foreground" data-testid="text-audio-time">
              <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="bg-secondary rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
              data-testid="progress-audio"
            />
          </div>
          
          <audio
            ref={audioRef}
            src={getAssetUrl("/birthday-message.mp3")}
            preload="metadata"
            data-testid="audio-player"
          />
        </div>
      </CardContent>
    </Card>
  );
}
