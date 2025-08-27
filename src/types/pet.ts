export interface Pet {
  id: string;
  name: string;
  type: 'cat' | 'dog' | 'beaver';
  hunger: number; // 0-100
  happiness: number; // 0-100
  energy: number; // 0-100
  lastFed: number;
  lastPlayed: number;
  lastPetted: number;
  isSelected: boolean;
}

export interface GameState {
  pets: Pet[];
  selectedPetId: string | null;
  isBarMinimized: boolean;
  showMenu: boolean;
}

export type PetAction = 'feed' | 'play' | 'pet';

export const PET_IMAGES = {
  cat: () => import('@/assets/pet-cat.png'),
  dog: () => import('@/assets/pet-dog.png'), 
  beaver: () => import('@/assets/pet-beaver.png')
};