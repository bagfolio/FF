import { useState, useEffect } from "react";
import { Trophy, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface AchievementUnlockNotificationProps {
  achievementName: string;
  xpEarned: number;
  description?: string;
  onClose?: () => void;
}

export function AchievementUnlockNotification({ 
  achievementName, 
  xpEarned, 
  description = "Continue assim para desbloquear mais conquistas!",
  onClose 
}: AchievementUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFDF00', '#009C3B', '#002776']
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${
      isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
    }`}>
      <Card className="glass-morph-yellow border-2 border-amarelo-ouro/50 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-amarelo-ouro/20 to-transparent pointer-events-none" />
        
        <div className="relative p-6 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/10"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 glass-morph-yellow border border-amarelo-ouro/30 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-10 h-10 text-amarelo-ouro" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Sparkles className="w-8 h-8 text-amarelo-ouro" />
              </div>
            </div>
            
            <h3 className="font-bebas text-3xl text-white mb-2">
              CONQUISTA DESBLOQUEADA!
            </h3>
            
            <p className="font-semibold text-xl text-white mb-1">
              {achievementName}
            </p>
            
            <div className="flex items-center gap-2 glass-morph border border-amarelo-ouro/30 px-4 py-2 rounded-full mb-3">
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-white">+{xpEarned} XP</span>
            </div>
            
            <p className="text-sm text-white/80 max-w-xs">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}