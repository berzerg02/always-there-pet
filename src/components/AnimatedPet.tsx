import { useState, useEffect, useMemo } from 'react';
import { Pet, PetAction } from '@/types/pet';
import { cn } from '@/lib/utils';

interface AnimatedPetProps {
  pet: Pet;
  size?: 'sm' | 'md' | 'lg';
  animation?: 'idle' | 'happy' | 'eating' | 'playing' | 'sleepy';
  className?: string;
}

interface PetState {
  animation: string;
  filter: string;
  transform: string;
}

export const AnimatedPet = ({ pet, size = 'md', animation = 'idle', className }: AnimatedPetProps) => {
  const [petImage, setPetImage] = useState<string>('');
  const [currentAnimation, setCurrentAnimation] = useState(animation);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-20 h-20'
  };

  const petState = useMemo((): PetState => {
    switch (currentAnimation) {
      case 'happy':
        return {
          animation: 'animate-bounce-happy',
          filter: 'brightness(1.1) saturate(1.2)',
          transform: 'scale(1.05)'
        };
      case 'eating':
        return {
          animation: 'animate-pulse-glow',
          filter: 'brightness(1.1) hue-rotate(15deg)',
          transform: 'scale(1.1)'
        };
      case 'playing':
        return {
          animation: 'animate-wiggle',
          filter: 'brightness(1.2) saturate(1.3)',
          transform: 'rotate(2deg)'
        };
      case 'sleepy':
        return {
          animation: '',
          filter: 'brightness(0.8) blur(0.5px)',
          transform: 'scale(0.95)'
        };
      default:
        return {
          animation: 'animate-float',
          filter: '',
          transform: ''
        };
    }
  }, [currentAnimation]);

  useEffect(() => {
    if (pet) {
      import(`@/assets/pet-${pet.type}.png`).then((module) => {
        setPetImage(module.default);
      });
    }
  }, [pet]);

  useEffect(() => {
    setCurrentAnimation(animation);
    
    // Reset animation after completion
    if (animation !== 'idle') {
      const timeout = setTimeout(() => {
        setCurrentAnimation('idle');
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [animation]);

  // Add cute expressions based on pet status
  const getStatusExpression = () => {
    if (pet.hunger < 30) return '😋'; // Hungry
    if (pet.happiness > 80) return '😊'; // Happy
    if (pet.energy < 30) return '😴'; // Sleepy
    return ''; // Normal
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        className={cn(
          sizeClasses[size],
          "rounded-full bg-card p-1 shadow-pet transition-all duration-300 relative overflow-hidden",
          petState.animation
        )}
        style={{
          filter: petState.filter,
          transform: petState.transform
        }}
      >
        {petImage && (
          <img 
            src={petImage} 
            alt={pet.name}
            className="w-full h-full object-contain rounded-full"
          />
        )}
        
        {/* Status expression overlay */}
        {getStatusExpression() && (
          <div className="absolute -top-1 -right-1 text-xs animate-pulse">
            {getStatusExpression()}
          </div>
        )}

        {/* Special eating effect */}
        {currentAnimation === 'eating' && (
          <div className="absolute inset-0 rounded-full bg-gradient-happy opacity-20 animate-pulse" />
        )}

        {/* Playing sparkles */}
        {currentAnimation === 'playing' && (
          <>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-pet-playful rounded-full animate-ping opacity-75" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pet-happy rounded-full animate-ping opacity-75" 
                 style={{ animationDelay: '0.3s' }} />
          </>
        )}
      </div>
    </div>
  );
};

// Floating action feedback component
interface FloatingTextProps {
  text: string;
  emoji: string;
  show: boolean;
  onComplete: () => void;
}

export const FloatingActionText = ({ text, emoji, show, onComplete }: FloatingTextProps) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(onComplete, 2000);
      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
      <div className="bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border animate-fade-in">
        <div className="flex items-center gap-1 text-sm font-medium">
          <span className="text-lg">{emoji}</span>
          <span className="text-foreground">{text}</span>
        </div>
      </div>
    </div>
  );
};