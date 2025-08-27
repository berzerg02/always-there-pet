import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Pet } from '@/types/pet';
import { PetStatusBar } from './PetStatusBar';
import { AnimatedPet } from './AnimatedPet';
import { cn } from '@/lib/utils';

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | null;
  onSelectPet: (petId: string) => void;
}

export const PetSelector = ({ pets, selectedPetId, onSelectPet }: PetSelectorProps) => {
  // Determine idle animation based on pet status
  const getPetIdleAnimation = (pet: Pet): 'idle' | 'sleepy' => {
    if (pet.energy < 30) return 'sleepy';
    return 'idle';
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Your Pets</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {pets.map((pet) => (
          <Card
            key={pet.id}
            className={cn(
              "p-3 cursor-pointer transition-all duration-200 hover:shadow-pet hover:scale-105",
              selectedPetId === pet.id 
                ? "ring-2 ring-primary shadow-pet bg-primary/5 animate-pulse-glow" 
                : "hover:bg-accent/50"
            )}
            onClick={() => onSelectPet(pet.id)}
          >
            <div className="flex items-center gap-3">
              <AnimatedPet 
                pet={pet} 
                animation={getPetIdleAnimation(pet)}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground truncate">
                  {pet.name}
                </h4>
                <p className="text-xs text-muted-foreground capitalize mb-2">
                  {pet.type}
                </p>
                <div className="space-y-1">
                  <PetStatusBar label="❤️" value={pet.happiness} color="pet-happy" />
                  <PetStatusBar label="🍽️" value={pet.hunger} color="pet-hungry" />
                  <PetStatusBar label="⚡" value={pet.energy} color="pet-playful" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {pets.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <p>No pets yet! Click "Add Pet" to get your first companion.</p>
        </div>
      )}
    </div>
  );
};