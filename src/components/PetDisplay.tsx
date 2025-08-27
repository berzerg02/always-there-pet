import { useState, useEffect } from 'react';
import { Pet } from '@/types/pet';
import { AnimatedPet } from './AnimatedPet';
import { PetStatusBar } from './PetStatusBar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Zap } from 'lucide-react';

interface PetDisplayProps {
  pet: Pet;
  lastAction?: { action: string; timestamp: number } | null;
}

export const PetDisplay = ({ pet, lastAction }: PetDisplayProps) => {
  const [displayAnimation, setDisplayAnimation] = useState<'idle' | 'happy' | 'eating' | 'playing' | 'sleepy'>('idle');

  // Get pet mood based on stats
  const getPetMood = () => {
    const avgStats = (pet.happiness + pet.hunger + pet.energy) / 3;
    
    if (avgStats > 75) return { mood: 'Ecstatic', emoji: '🤩', color: 'bg-pet-happy' };
    if (avgStats > 50) return { mood: 'Happy', emoji: '😊', color: 'bg-accent' };
    if (avgStats > 25) return { mood: 'Okay', emoji: '😐', color: 'bg-muted' };
    return { mood: 'Needs Care', emoji: '😢', color: 'bg-pet-hungry' };
  };

  const getPetPersonality = () => {
    switch (pet.type) {
      case 'cat':
        return {
          trait: 'Independent',
          description: "Whiskers loves quiet moments and gentle pets. A true connoisseur of cozy spots!",
          favoriteActivity: 'Napping in sunny spots'
        };
      case 'dog':
        return {
          trait: 'Playful',
          description: "Buddy is always ready for fun! Loyal, energetic, and loves making friends.",
          favoriteActivity: 'Playing fetch and running around'
        };
      case 'beaver':
        return {
          trait: 'Industrious',
          description: "Chomper is a natural builder and loves staying busy with projects!",
          favoriteActivity: 'Building and organizing things'
        };
      default:
        return {
          trait: 'Friendly',
          description: "A wonderful companion!",
          favoriteActivity: 'Spending time with you'
        };
    }
  };

  // Sync animation with last action
  useEffect(() => {
    if (lastAction) {
      const { action } = lastAction;
      switch (action) {
        case 'feed':
          setDisplayAnimation('eating');
          break;
        case 'play':
          setDisplayAnimation('playing');
          break;
        case 'pet':
          setDisplayAnimation('happy');
          break;
      }
      
      const timeout = setTimeout(() => {
        setDisplayAnimation('idle');
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [lastAction]);

  // Auto-set animation based on pet state
  useEffect(() => {
    if (!lastAction) {
      if (pet.energy < 30) {
        setDisplayAnimation('sleepy');
      } else if (pet.happiness > 80) {
        setDisplayAnimation('happy');
      } else {
        setDisplayAnimation('idle');
      }
    }
  }, [pet.energy, pet.happiness, lastAction]);

  const mood = getPetMood();
  const personality = getPetPersonality();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Pet Display */}
      <Card className="p-8 text-center bg-gradient-pet border-2 border-primary/20 shadow-pet">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <AnimatedPet 
              pet={pet}
              animation={displayAnimation}
              size="lg"
              className="scale-150"
            />
            
            {/* Floating mood indicator */}
            <div className="absolute -top-2 -right-2">
              <Badge className={`${mood.color} text-white animate-pulse`}>
                {mood.emoji} {mood.mood}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              {pet.name}
              <Heart className="w-6 h-6 text-pet-happy animate-pulse" />
            </h2>
            <p className="text-lg text-muted-foreground capitalize">
              The {personality.trait} {pet.type}
            </p>
          </div>
        </div>
      </Card>

      {/* Pet Stats & Info */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Status</h3>
          </div>
          <div className="space-y-3">
            <PetStatusBar label="❤️ Happiness" value={pet.happiness} color="pet-happy" />
            <PetStatusBar label="🍽️ Hunger" value={pet.hunger} color="pet-hungry" />
            <PetStatusBar label="⚡ Energy" value={pet.energy} color="pet-playful" />
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-semibold">Personality</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">{personality.description}</p>
            <div className="pt-2">
              <span className="font-medium text-foreground">Favorite Activity:</span>
              <p className="text-muted-foreground">{personality.favoriteActivity}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Care Tips */}
      <Card className="p-4 bg-accent/10 border-accent/30">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pet-happy" />
          Care Tips
        </h3>
        <div className="text-sm text-muted-foreground space-y-1">
          {pet.hunger < 50 && (
            <p>🍽️ {pet.name} is getting hungry! Time for a tasty meal.</p>
          )}
          {pet.happiness < 60 && (
            <p>❤️ {pet.name} could use some attention. Try petting or playing!</p>
          )}
          {pet.energy < 40 && (
            <p>😴 {pet.name} is getting tired. They might need some rest soon.</p>
          )}
          {pet.happiness > 80 && pet.hunger > 70 && pet.energy > 60 && (
            <p>✨ {pet.name} is doing great! They're happy and well-cared for.</p>
          )}
        </div>
      </Card>
    </div>
  );
};