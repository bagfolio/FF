import { useState, useEffect } from "react";
import { X, Sparkles, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeNotificationProps {
  athleteName: string;
  streakDays: number;
  scoutsWatching: number;
  percentileChange?: number;
}

export function WelcomeNotification({ athleteName, streakDays, scoutsWatching, percentileChange = 2 }: WelcomeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transform transition-all duration-500 ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      <Card className="w-80 glass-morph-green shadow-2xl border-2 border-verde-brasil/30 overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil/10 to-transparent pointer-events-none" />
        
        <div className="relative p-4">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/10"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 pt-1">
              <h3 className="font-bebas text-lg text-white mb-1">
                BEM-VINDO DE VOLTA, {athleteName.split(' ')[0].toUpperCase()}!
              </h3>
              
              <div className="space-y-2 text-sm">
                {streakDays > 0 && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <div className="w-5 h-5 glass-morph-orange rounded-full flex items-center justify-center">
                      <span className="text-xs">🔥</span>
                    </div>
                    <span className="font-medium">{streakDays} dias consecutivos!</span>
                  </div>
                )}
                
                {scoutsWatching > 0 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{scoutsWatching} scouts viram seu perfil hoje</span>
                  </div>
                )}
                
                {percentileChange > 0 && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Você subiu {percentileChange}% no ranking!</span>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-white/60 mt-3">
                Continue assim para alcançar seus objetivos! 💪
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}