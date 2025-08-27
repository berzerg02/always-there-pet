import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Minimize2, Settings, Heart, Utensils, Gamepad2 } from 'lucide-react';
import { Pet, PetAction } from '@/types/pet';
import { PetStatusBar } from './PetStatusBar';
import { PetSelector } from './PetSelector';
import { cn } from '@/lib/utils';

interface PetBarProps {
  pets: Pet[];
  selectedPet: Pet | null;
  isMinimized: boolean;
  showMenu: boolean;
  onToggleMinimize: () => void;
  onToggleMenu: () => void;
  onSelectPet: (petId: string) => void;
  onPetAction: (action: PetAction) => void;
}

export const PetBar = ({
  pets,
  selectedPet,
  isMinimized,
  showMenu,
  onToggleMinimize,
  onToggleMenu,
  onSelectPet,
  onPetAction
}: PetBarProps) => {
  const [petImage, setPetImage] = useState<string>('');

  useEffect(() => {
    if (selectedPet) {
      import(`@/assets/pet-${selectedPet.type}.png`).then((module) => {
        setPetImage(module.default);
      });
    }
  }, [selectedPet]);

  if (isMinimized) {
    return (
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={onToggleMinimize}
          className="rounded-b-lg rounded-t-none bg-primary hover:bg-primary/90 text-primary-foreground shadow-bar"
          size="sm"
        >
          <Heart className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Card className="rounded-none bg-gradient-bar border-b shadow-bar">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            {selectedPet && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-card p-1 shadow-pet">
                  {petImage && (
                    <img 
                      src={petImage} 
                      alt={selectedPet.name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedPet.name}</h3>
                  <div className="flex gap-2">
                    <PetStatusBar label="❤️" value={selectedPet.happiness} color="pet-happy" />
                    <PetStatusBar label="🍽️" value={selectedPet.hunger} color="pet-hungry" />
                    <PetStatusBar label="⚡" value={selectedPet.energy} color="pet-playful" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPetAction('feed')}
              variant="secondary"
              size="sm"
              className="shadow-button hover:scale-105 transition-transform duration-200"
              disabled={!selectedPet}
            >
              <Utensils className="w-4 h-4 mr-1" />
              Feed
            </Button>
            <Button
              onClick={() => onPetAction('play')}
              variant="secondary"
              size="sm"
              className="shadow-button hover:scale-105 transition-transform duration-200"
              disabled={!selectedPet}
            >
              <Gamepad2 className="w-4 h-4 mr-1" />
              Play
            </Button>
            <Button
              onClick={() => onPetAction('pet')}
              variant="secondary"
              size="sm"
              className="shadow-button hover:scale-105 transition-transform duration-200"
              disabled={!selectedPet}
            >
              <Heart className="w-4 h-4 mr-1" />
              Pet
            </Button>
            
            <Button
              onClick={onToggleMenu}
              variant="ghost"
              size="sm"
              className="hover:bg-accent/20"
            >
              <Settings className="w-4 h-4 mr-1" />
              {showMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={onToggleMinimize}
              variant="ghost"
              size="sm"
              className="hover:bg-accent/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showMenu && (
          <div className="border-t bg-card/50 p-4 backdrop-blur-sm">
            <PetSelector
              pets={pets}
              selectedPetId={selectedPet?.id || null}
              onSelectPet={onSelectPet}
            />
          </div>
        )}
      </Card>
    </div>
  );
};