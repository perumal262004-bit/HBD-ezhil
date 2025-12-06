import { useEffect, useState } from "react";

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'sparkle' | 'heart' | 'star' | 'confetti';
  rotation: number;
  rotationSpeed: number;
}

interface ParticleEffectsProps {
  isActive: boolean;
  intensity?: number;
  type?: 'background' | 'celebration';
}

const PARTICLE_TYPES = {
  sparkle: { symbol: '✨', colors: ['#FFD700', '#FFA500', '#FF69B4'] },
  heart: { symbol: '💖', colors: ['#FF69B4', '#FF1493', '#FFB6C1'] },
  star: { symbol: '⭐', colors: ['#FFD700', '#FFFF00', '#FFA500'] },
  confetti: { symbol: '🎊', colors: ['#FF69B4', '#FFD700', '#00CED1', '#FF1493'] }
};

export default function ParticleEffects({ isActive, intensity = 3, type = 'background' }: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [allowSpawning, setAllowSpawning] = useState(true);
  
  // Auto-stop celebration spawning after 3 seconds
  useEffect(() => {
    if (isActive && type === 'celebration') {
      const timer = setTimeout(() => {
        setAllowSpawning(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, type]);
  
  // Create new particles
  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      setAllowSpawning(true);
      return;
    }

    const maxParticles = type === 'celebration' ? 50 : intensity * 5;
    let animationFrame: number;

    const createParticle = (): Particle => {
      const particleType = type === 'celebration' ? 
        (['confetti', 'star', 'heart'][Math.floor(Math.random() * 3)] as keyof typeof PARTICLE_TYPES) :
        (['sparkle', 'heart', 'star'][Math.floor(Math.random() * 3)] as keyof typeof PARTICLE_TYPES);
      
      const colors = PARTICLE_TYPES[particleType].colors;
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * window.innerWidth,
        y: type === 'celebration' ? window.innerHeight + 20 : Math.random() * window.innerHeight,
        vx: type === 'celebration' ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 2,
        vy: type === 'celebration' ? -(Math.random() * 8 + 4) : -(Math.random() * 2 + 0.5),
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: particleType,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4
      };
    };

    const updateParticles = () => {
      setParticles(current => {
        const updated = current.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          rotation: particle.rotation + particle.rotationSpeed,
          opacity: type === 'celebration' ? 
            Math.max(0, particle.opacity - 0.01) : 
            particle.opacity * 0.995
        })).filter(particle => 
          particle.opacity > 0.05 && 
          particle.y > -50 && 
          particle.x > -50 && 
          particle.x < window.innerWidth + 50
        );

        // Add new particles periodically (if spawning is allowed)
        if (allowSpawning && updated.length < maxParticles && Math.random() < 0.1) {
          updated.push(createParticle());
        }

        return updated;
      });

      animationFrame = requestAnimationFrame(updateParticles);
    };

    // Initial particles
    const initialParticles = Array.from({ length: Math.min(maxParticles, 10) }, createParticle);
    setParticles(initialParticles);

    updateParticles();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, intensity, type]);

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10"
      data-testid="particle-effects-container"
      aria-hidden="true"
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-lg transition-opacity duration-200 select-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            color: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))',
            textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
          }}
          data-testid={`particle-${particle.type}`}
        >
          {PARTICLE_TYPES[particle.type].symbol}
        </div>
      ))}
    </div>
  );
}

// Heart capture effect component
interface HeartCaptureEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function HeartCaptureEffect({ x, y, onComplete }: HeartCaptureEffectProps) {
  const [sparkles, setSparkles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create sparkle burst effect
    const burstParticles = Array.from({ length: 8 }, (_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const speed = Math.random() * 3 + 2;
      
      return {
        id: `burst-${i}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 16 + 8,
        opacity: 1,
        color: '#FFD700',
        type: 'sparkle' as const,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 10
      };
    });

    setSparkles(burstParticles);

    const timeout = setTimeout(() => {
      onComplete();
    }, 500);

    return () => clearTimeout(timeout);
  }, [x, y, onComplete]);

  useEffect(() => {
    if (sparkles.length === 0) return;

    let animationFrame: number;
    const animate = () => {
      setSparkles(current => 
        current.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // gravity
          rotation: particle.rotation + particle.rotationSpeed,
          opacity: particle.opacity * 0.95
        })).filter(particle => particle.opacity > 0.1)
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [sparkles.length]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-20"
      data-testid="heart-capture-effect"
    >
      {sparkles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-lg"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
            color: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))',
            textShadow: '0 0 10px rgba(255, 215, 0, 1)'
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}