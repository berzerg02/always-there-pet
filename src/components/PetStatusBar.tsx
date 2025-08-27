import { cn } from '@/lib/utils';

interface PetStatusBarProps {
  label: string;
  value: number;
  color: string;
  className?: string;
}

export const PetStatusBar = ({ label, value, color, className }: PetStatusBarProps) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'pet-happy':
        return 'bg-gradient-happy';
      case 'pet-hungry':
        return 'bg-pet-hungry';
      case 'pet-sleepy':
        return 'bg-pet-sleepy';
      case 'pet-playful':
        return 'bg-gradient-energy';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="text-xs">{label}</span>
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            getColorClass(color)
          )}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">
        {Math.round(value)}
      </span>
    </div>
  );
};