import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import Heart from "@/components/heart";
import VoicePlayer from "@/components/voice-player";
import SpecialNote from "@/components/special-note";
import BackgroundMusic from "@/components/background-music";
import PhotoGallery from "@/components/photo-gallery";
import ParticleEffects from "@/components/particle-effects";

interface HeartData {
  id: string;
  x: number;
  y: number;
  size: number;
  animationDelay: number;
  animationDuration: number;
}

export default function BirthdayGame() {
  const [capturedHearts, setCapturedHearts] = useState(0);
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [capturedHeartIds, setCapturedHeartIds] = useState(new Set<string>());
  const [gameActive, setGameActive] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  
  const totalHearts = 18;

  const generateHeart = useCallback((index: number): HeartData => {
    return {
      id: `heart-${index}-${Date.now()}`,
      x: Math.random() * 80 + 5, // 5% to 85% to avoid edges
      y: Math.random() * 70 + 10, // 10% to 80% to avoid edges
      size: Math.random() * 20 + 30, // 30px to 50px
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 2, // 2s to 4s
    };
  }, []);

  const initializeHearts = useCallback(() => {
    const newHearts: HeartData[] = [];
    for (let i = 0; i < totalHearts; i++) {
      newHearts.push(generateHeart(i));
    }
    setHearts(newHearts);
    setGameStarted(true);
  }, [generateHeart, totalHearts]);

  const handleHeartCapture = useCallback((heartId: string) => {
    if (!gameActive) return;
    
    // Prevent duplicate captures of the same heart
    setCapturedHeartIds(prevIds => {
      if (prevIds.has(heartId)) return prevIds; // Already captured, ignore
      
      const newIds = new Set(prevIds);
      newIds.add(heartId);
      
      // Remove from hearts and update counter
      setHearts(prev => prev.filter(heart => heart.id !== heartId));
      setCapturedHearts(prev => {
        const newCount = prev + 1;
        // Use >= for robust completion check
        if (newCount >= totalHearts) {
          setGameActive(false);
          setTimeout(() => {
            setGameComplete(true);
          }, 1000);
        }
        return newCount;
      });
      
      return newIds;
    });
  }, [gameActive, totalHearts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeHearts();
    }, 1000);

    return () => clearTimeout(timer);
  }, [initializeHearts]);

  return (
    <>
      <div className="floating-hearts"></div>
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 
            className="text-4xl md:text-6xl font-bold text-primary mb-2 font-serif"
            data-testid="title-birthday"
          >
            Happy பொறந்தday My Dear Friend
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-instructions">
            Catch all 18 Cakes to unlock your special surprise ! 💖
          </p>
        </div>

        {/* Progress Counter */}
        <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Card className="rounded-full px-6 py-3 shadow-lg border border-border">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎂</span>
              <span className="font-semibold text-lg" data-testid="text-progress">
                <span data-testid="counter-hearts">{capturedHearts}</span>/18 Cakes Captured
              </span>
            </div>
          </Card>
        </div>

        {/* Game Area */}
        <div 
          className="relative w-full max-w-4xl h-96 mb-8 bg-card/50 rounded-3xl border border-border shadow-xl backdrop-blur-sm overflow-hidden animate-fade-in" 
          style={{ animationDelay: "0.4s" }}
          data-testid="area-game"
        >
          {!gameStarted && (
            <div className="absolute inset-0 p-6 text-center flex items-center justify-center">
              <p className="text-muted-foreground text-lg" data-testid="text-game-instructions">
                Click on the floating hearts to capture them! ✨
              </p>
            </div>
          )}
          
          {gameStarted && gameActive && (
            <div className="absolute inset-0">
              {hearts.map((heart) => (
                <Heart
                  key={heart.id}
                  data={heart}
                  onCapture={handleHeartCapture}
                />
              ))}
            </div>
          )}
          
          {gameComplete && (
            <div className="absolute inset-0 p-6 text-center flex items-center justify-center">
              <p className="text-primary text-xl font-semibold animate-bounce-gentle" data-testid="text-completion">
                Congratulations! 🎉✨
              </p>
            </div>
          )}
        </div>

        {/* Voice Message Player */}
        <div className="w-full max-w-md mb-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <VoicePlayer isUnlocked={gameComplete} />
        </div>

        {/* Special Note */}
        {gameComplete && (
          <div className="w-full max-w-lg animate-fade-in">
            <SpecialNote />
          </div>
        )}

        {/* Photo Gallery */}
        {gameComplete && (
          <div className="w-full mt-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <PhotoGallery isVisible={gameComplete} />
          </div>
        )}
      </div>

      {/* Background Music Controls */}
      <BackgroundMusic gameActive={gameActive && gameStarted} gameComplete={gameComplete} />
      
      {/* Particle Effects */}
      <ParticleEffects 
        isActive={gameStarted && !gameComplete} 
        intensity={2} 
        type="background" 
      />
      
      {/* Celebration Effects */}
      {gameComplete && (
        <ParticleEffects 
          isActive={true} 
          intensity={5} 
          type="celebration" 
        />
      )}
    </>
  );
}
