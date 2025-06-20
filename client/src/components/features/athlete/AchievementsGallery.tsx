import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Lock, Sparkles, Star, Award, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface Achievement {
  id: string;
  name: string;
  icon: any;
  points: number;
  unlocked?: boolean;
  progress?: number;
  rarity?: "common" | "rare" | "epic" | "legendary";
}

interface AchievementsGalleryProps {
  achievements: Achievement[];
}

export function AchievementsGallery({ achievements }: AchievementsGalleryProps) {
  const [, setLocation] = useLocation();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const getRarityConfig = (rarity?: string) => {
    const configs = {
      common: {
        border: "border-white/20",
        bg: "glass-morph"
      },
      rare: {
        border: "border-blue-400/50",
        bg: "glass-morph-blue"
      },
      epic: {
        border: "border-purple-400/50",
        bg: "glass-morph-purple"
      },
      legendary: {
        border: "border-yellow-400/50 shadow-lg shadow-yellow-400/20",
        bg: "glass-morph-yellow"
      }
    };
    return configs[rarity as keyof typeof configs] || configs.common;
  };

  return (
    <Card className="overflow-hidden glass-morph border-white/10 hover:border-white/20 transition-all duration-300">
      <CardHeader className="glass-morph-yellow border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent transform -translate-x-full animate-shimmer" />
        <CardTitle className="tracking-tight font-bebas text-xl flex items-center justify-between text-white font-medium relative z-10">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 animate-pulse" />
            MINHAS CONQUISTAS
            <Badge className="bg-white/10 text-white/90 border-white/20 text-xs animate-count-up">
              🏆 {totalXP.toLocaleString()} XP
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/80 hover:bg-white/10"
            onClick={() => setLocation('/athlete/achievements')}
          >
            Ver Todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardTitle>
        {/* Recently unlocked indicator */}
        {achievements.some(a => a.unlocked) && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-xs text-white font-semibold">Nova!</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {achievements.slice(0, 9).map((achievement, i) => {
            const isUnlocked = achievement.unlocked !== false;
            const rarity = achievement.rarity || "common";
            const rarityConfig = getRarityConfig(rarity);
            const progress = achievement.progress || (isUnlocked ? 100 : 0);
            
            return (
              <div key={achievement.id || i} className="relative">
                <div 
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer transition-all border-2 ${
                    isUnlocked 
                      ? `bg-gradient-to-br ${rarityConfig.bg} ${rarityConfig.border}` 
                      : `bg-white/5 border-white/10`
                  } ${
                    isUnlocked && i === 4 ? 'animate-pulse-slow' : ''
                  } transform hover:scale-105`}
                >
                  {(() => {
                    const Icon = achievement.icon;
                    return <Icon className={`w-8 h-8 ${isUnlocked ? 'text-white' : 'text-white/30'}`} />;
                  })()}
                  
                  {!isUnlocked && (
                    <>
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Progress bar for locked achievements */}
                      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amarelo-ouro to-yellow-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-white text-center mt-0.5">{progress}%</p>
                      </div>
                    </>
                  )}
                  
                  {/* Rarity indicator */}
                  {isUnlocked && (
                    <div className="absolute top-1 right-1">
                      {rarity === "legendary" && <Sparkles className="w-3 h-3 text-yellow-400" />}
                      {rarity === "epic" && <Star className="w-3 h-3 text-purple-400" />}
                      {rarity === "rare" && <Award className="w-3 h-3 text-blue-400" />}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                    <p className="text-white text-xs text-center font-semibold">{achievement.name}</p>
                    <p className="text-white/80 text-xs mt-1">+{achievement.points} XP</p>
                  </div>
                </div>
                
                {/* Recently unlocked pulse */}
                {isUnlocked && i === 4 && (
                  <div className="absolute -inset-1 bg-yellow-400/50 rounded-lg animate-ping" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-white/60">{unlockedCount} de {achievements.length} desbloqueadas</p>
            <p className="text-xs text-white/40">Próxima em 2 dias</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amarelo-ouro to-yellow-500 h-3 rounded-full relative" 
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}