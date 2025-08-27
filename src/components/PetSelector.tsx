import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pet } from '@/types/pet';
import { PetStatusBar } from './PetStatusBar';
import { cn } from '@/lib/utils';

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | null;
  onSelectPet: (petId: string) => void;
}

interface PetWithImage extends Pet {
  imageUrl?: string;
}

export const PetSelector = ({ pets, selectedPetId, onSelectPet }: PetSelectorProps) => {
  const [petsWithImages, setPetsWithImages] = useState<PetWithImage[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const petsWithImagesPromises = pets.map(async (pet) => {
        try {
          const module = await import(`@/assets/pet-${pet.type}.png`);
          return { ...pet, imageUrl: module.default };
        } catch (error) {
          console.error(`Failed to load image for ${pet.type}:`, error);
          return pet;
        }
      });
      
      const result = await Promise.all(petsWithImagesPromises);
      setPetsWithImages(result);
    };

    loadImages();
  }, [pets]);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Your Pets</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {petsWithImages.map((pet) => (
          <Card
            key={pet.id}
            className={cn(
              "p-3 cursor-pointer transition-all duration-200 hover:shadow-pet",
              selectedPetId === pet.id 
                ? "ring-2 ring-primary shadow-pet bg-primary/5" 
                : "hover:bg-accent/50"
            )}
            onClick={() => onSelectPet(pet.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background p-1 shadow-sm">
                {pet.imageUrl && (
                  <img 
                    src={pet.imageUrl} 
                    alt={pet.name}
                    className="w-full h-full object-contain rounded-full"
                  />
                )}
              </div>
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