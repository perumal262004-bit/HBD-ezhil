import { memo, useState } from "react";
import { HeartCaptureEffect } from "@/components/particle-effects";

interface HeartData {
  id: string;
  x: number;
  y: number;
  size: number;
  animationDelay: number;
  animationDuration: number;
}

interface HeartProps {
  data: HeartData;
  onCapture: (id: string) => void;
}

const Heart = memo(({ data, onCapture }: HeartProps) => {
  const [showEffect, setShowEffect] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  const handleClick = (event: React.MouseEvent) => {
    // Capture click position for sparkle effect
    const rect = (event.target as Element).getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setShowEffect(true);
    
    // Small delay before capturing to show the effect
    setTimeout(() => {
      onCapture(data.id);
    }, 100);
  };

  return (
    <>
      {showEffect && (
        <HeartCaptureEffect
          x={clickPosition.x}
          y={clickPosition.y}
          onComplete={() => setShowEffect(false)}
        />
      )}
    <div
      className="absolute heart-cursor animate-float select-none"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        fontSize: `${data.size}px`,
        animationDelay: `${data.animationDelay}s`,
        animationDuration: `${data.animationDuration}s`,
        zIndex: 10,
      }}
      onClick={handleClick}
      data-testid={`heart-${data.id}`}
    >
      🎂
    </div>
    </>
  );
});

Heart.displayName = "Heart";

export default Heart;
