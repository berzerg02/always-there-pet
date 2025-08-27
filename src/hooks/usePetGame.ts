import { useState, useEffect, useCallback } from 'react';
import { Pet, GameState, PetAction } from '@/types/pet';
import { useToast } from '@/hooks/use-toast';

const INITIAL_PETS: Pet[] = [
  {
    id: '1',
    name: 'Whiskers',
    type: 'cat',
    hunger: 75,
    happiness: 80,
    energy: 60,
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastPetted: Date.now(),
    isSelected: true
  },
  {
    id: '2', 
    name: 'Buddy',
    type: 'dog',
    hunger: 50,
    happiness: 90,
    energy: 85,
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastPetted: Date.now(),
    isSelected: false
  },
  {
    id: '3',
    name: 'Chomper',
    type: 'beaver',
    hunger: 60,
    happiness: 70,
    energy: 40,
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastPetted: Date.now(),
    isSelected: false
  }
];

export const usePetGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    pets: INITIAL_PETS,
    selectedPetId: '1',
    isBarMinimized: false,
    showMenu: false
  });

  const { toast } = useToast();

  const selectedPet = gameState.pets.find(pet => pet.id === gameState.selectedPetId) || null;

  // Pet needs decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        pets: prev.pets.map(pet => ({
          ...pet,
          hunger: Math.max(0, pet.hunger - 0.5),
          happiness: Math.max(0, pet.happiness - 0.3),
          energy: Math.max(0, pet.energy - 0.2)
        }))
      }));
    }, 10000); // Decay every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const performPetAction = useCallback((action: PetAction) => {
    if (!selectedPet) return;

    const now = Date.now();
    const timeSinceLastAction = {
      feed: now - selectedPet.lastFed,
      play: now - selectedPet.lastPlayed,
      pet: now - selectedPet.lastPetted
    };

    // Prevent spamming actions (cooldown of 5 seconds)
    if (timeSinceLastAction[action] < 5000) {
      toast({
        title: "Too soon!",
        description: `Wait a bit before ${action}ing again.`,
        variant: "destructive"
      });
      return;
    }

    setGameState(prev => ({
      ...prev,
      pets: prev.pets.map(pet => {
        if (pet.id !== selectedPet.id) return pet;

        let updates: Partial<Pet> = {};
        let message = '';

        switch (action) {
          case 'feed':
            updates = {
              hunger: Math.min(100, pet.hunger + 25),
              happiness: Math.min(100, pet.happiness + 5),
              lastFed: now
            };
            message = `${pet.name} enjoyed the meal! 🍽️`;
            break;
          case 'play':
            updates = {
              happiness: Math.min(100, pet.happiness + 20),
              energy: Math.max(0, pet.energy - 10),
              lastPlayed: now
            };
            message = `${pet.name} had fun playing! 🎮`;
            break;
          case 'pet':
            updates = {
              happiness: Math.min(100, pet.happiness + 15),
              lastPetted: now
            };
            message = `${pet.name} loves the attention! ❤️`;
            break;
        }

        toast({
          title: "Action completed!",
          description: message,
        });

        return { ...pet, ...updates };
      })
    }));
  }, [selectedPet, toast]);

  const selectPet = useCallback((petId: string) => {
    setGameState(prev => ({
      ...prev,
      selectedPetId: petId
    }));
  }, []);

  const toggleMinimize = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isBarMinimized: !prev.isBarMinimized,
      showMenu: false // Close menu when minimizing
    }));
  }, []);

  const toggleMenu = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      showMenu: !prev.showMenu
    }));
  }, []);

  return {
    gameState,
    selectedPet,
    performPetAction,
    selectPet,
    toggleMinimize,
    toggleMenu
  };
};