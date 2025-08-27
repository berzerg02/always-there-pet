import { PetBar } from './PetBar';
import { usePetGame } from '@/hooks/usePetGame';

export const DesktopGame = () => {
  const {
    gameState,
    selectedPet,
    performPetAction,
    selectPet,
    toggleMinimize,
    toggleMenu
  } = usePetGame();

  return (
    <div className="min-h-screen bg-gradient-pet">
      <PetBar
        pets={gameState.pets}
        selectedPet={selectedPet}
        isMinimized={gameState.isBarMinimized}
        showMenu={gameState.showMenu}
        onToggleMinimize={toggleMinimize}
        onToggleMenu={toggleMenu}
        onSelectPet={selectPet}
        onPetAction={performPetAction}
      />
      
      {/* Desktop content area */}
      <div className={`pt-${gameState.isBarMinimized ? '8' : '20'} p-8 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Virtual Pet Desktop
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your pets live in the top bar! Use the controls to feed, play, and care for them.
          </p>
          
          {selectedPet && (
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-pet">
              <h2 className="text-2xl font-semibold mb-2">Currently Selected: {selectedPet.name}</h2>
              <p className="text-muted-foreground">
                {selectedPet.name} the {selectedPet.type} is waiting for your attention in the top bar!
              </p>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>💡 <strong>Tip:</strong> Your pets' needs decrease over time. Keep them happy and fed!</p>
                <p>📱 Click the minimize button to hide the bar, then click the heart icon to restore it.</p>
                <p>⚙️ Use the settings menu to switch between your pets.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};