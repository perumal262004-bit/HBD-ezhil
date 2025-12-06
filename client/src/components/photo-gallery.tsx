import { useState, useEffect } from "react";

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
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface PhotoGalleryProps {
  isVisible: boolean;
}

interface Memory {
  id: string;
  src: string;
  title: string;
  description: string;
}

const memories: Memory[] = [
  {
    id: "memory1",
    src: getAssetUrl("/memories/memory 1.jpg"),
    title: "Memory 01",
    description: "நண்பர்கள் வாழ்க்கையின் அழகான நினைவுகளை உருவாக்கும் ஒளி 💖"
  },
  {
    id: "memory2", 
    src: getAssetUrl("/memories/memory 2.jpg"),
    title: "Memory 02",
    description: ""
  },
  {
    id: "memory3",
    src: getAssetUrl("/memories/memory 3.jpg"), 
    title: "Memory 03",
    description: ""
  },
  {
    id: "memory4",
    src: getAssetUrl("/memories/memory 4.jpg"),
    title: "Memory 04",
    description: ""
  },
  {
    id: "memory5",
    src: getAssetUrl("/memories/memory 5.jpg"),
    title: "Memory 05",
    description: ""
  }
];

export default function PhotoGallery({ isVisible }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isVisible || !isAutoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % memories.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isVisible, isAutoplay]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  if (!isVisible) {
    return null;
  }

  const currentMemory = memories[currentIndex];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 shadow-2xl border border-primary/20 backdrop-blur-sm animate-fade-in">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-primary mb-2 font-serif" data-testid="text-gallery-title">
            Your smile is the best thing in the world
          </h3>
          <p className="text-muted-foreground" data-testid="text-gallery-subtitle">
            Every moment is a treasure 📸✨
          </p>
        </div>

        {/* Main Photo Display */}
        <div className="relative mb-6 group">
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg bg-muted">
            <img
              src={currentMemory.src}
              alt={currentMemory.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-testid={`img-memory-${currentMemory.id}`}
            />
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={goToPrevious}
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg"
            data-testid="button-gallery-previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            onClick={goToNext}
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg"
            data-testid="button-gallery-next"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Autoplay Toggle */}
          <Button
            onClick={toggleAutoplay}
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 backdrop-blur-sm shadow-lg"
            data-testid="button-gallery-autoplay"
          >
            {isAutoplay ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
            <span className="text-xs">{isAutoplay ? "Pause" : "Play"}</span>
          </Button>
        </div>

        {/* Photo Info */}
        <div className="text-center mb-6">
          <h4 className="text-lg font-semibold text-primary mb-2" data-testid="text-memory-title">
            {currentMemory.title}
          </h4>
          <p className="text-muted-foreground" data-testid="text-memory-description">
            {currentMemory.description}
          </p>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mb-4">
          {memories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              data-testid={`button-gallery-dot-${index}`}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span data-testid="text-gallery-progress">
            {currentIndex + 1} of {memories.length}
          </span>
          <div className="w-32 bg-secondary rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / memories.length) * 100}%` }}
              data-testid="progress-gallery"
            />
          </div>
          <span className="text-xs" data-testid="text-gallery-status">
            {isAutoplay ? "Auto" : "Manual"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}