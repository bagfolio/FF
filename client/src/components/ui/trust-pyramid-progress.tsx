import { cn } from "@/lib/utils";
import { Check, Circle, Lock, Trophy, ArrowUp, Sparkles, TrendingUp } from "lucide-react";
import TrustPyramid from "./trust-pyramid";
import { Progress } from "./progress";
import { Button } from "./button";
import { useState, useEffect } from "react";

import type { TrustPyramidProgress as PyramidData } from "@/lib/trustPyramidCalculator";

interface TrustPyramidProgressProps {
  currentLevel: "bronze" | "silver" | "gold" | "platinum";
  className?: string;
  pyramidProgress?: PyramidData; // Optional for backward compatibility
}

const levelRequirements = {
  bronze: {
    name: "Bronze",
    requirements: [
      { id: "profile", label: "Complete seu perfil", completed: true },
      { id: "photo", label: "Adicione uma foto", completed: true },
      { id: "basic", label: "Informações básicas", completed: true }
    ],
    progress: 100,
    nextLevel: "silver"
  },
  silver: {
    name: "Prata",
    requirements: [
      { id: "tests", label: "Complete 3 testes verificados", completed: true, current: 2, total: 3 },
      { id: "video", label: "Adicione vídeo de jogo", completed: false },
      { id: "endorsement", label: "Obtenha endorsement de treinador", completed: false }
    ],
    progress: 33,
    nextLevel: "gold",
    benefits: ["Verificação social", "Maior visibilidade para scouts", "Badge especial"]
  },
  gold: {
    name: "Ouro",
    requirements: [
      { id: "league", label: "Participe de liga oficial", completed: false },
      { id: "stats", label: "10+ jogos com estatísticas", completed: false },
      { id: "performance", label: "Performance consistente", completed: false }
    ],
    progress: 0,
    nextLevel: "platinum",
    benefits: ["Verificação por liga oficial", "Destaque nos resultados", "Relatórios avançados"]
  },
  platinum: {
    name: "Platina",
    requirements: [
      { id: "ai", label: "Verificação completa por IA", completed: false },
      { id: "combine", label: "Todos os testes do Combine", completed: false },
      { id: "elite", label: "Performance elite", completed: false }
    ],
    progress: 0,
    nextLevel: null,
    benefits: ["Máxima credibilidade", "Verificação por IA", "Acesso a scouts premium"]
  }
};

export default function TrustPyramidProgress({ currentLevel, className, pyramidProgress }: TrustPyramidProgressProps) {
  // Use real data if provided, otherwise fall back to hardcoded values
  const fallbackData = levelRequirements[currentLevel];
  const currentLevelData = pyramidProgress ? pyramidProgress[currentLevel] : fallbackData;
  
  // Determine next level
  const nextLevelKey = pyramidProgress?.nextLevel || fallbackData.nextLevel as keyof typeof levelRequirements | null;
  const nextLevelData = nextLevelKey ? (pyramidProgress ? pyramidProgress[nextLevelKey] : levelRequirements[nextLevelKey]) : null;
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Animate progress bar on mount
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border-2 border-purple-200", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Pyramid Visual */}
        <div className="flex flex-col items-center relative">
          <h3 className="font-bebas text-2xl text-purple-900 mb-4">PIRÂMIDE DA CONFIANÇA</h3>
          <div className="relative">
            <TrustPyramid 
              currentLevel={currentLevel}
              showLabels={false}
              interactive={true}
              className="max-w-[250px]"
            />
            {/* Glowing effect on current level */}
            <div className="absolute inset-0 pointer-events-none">
              <div className={`absolute ${currentLevel === 'bronze' ? 'bottom-0' : currentLevel === 'silver' ? 'bottom-1/4' : currentLevel === 'gold' ? 'bottom-2/4' : 'top-0'} left-0 right-0 h-1/4`}>
                <div className="w-full h-full bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress Details */}
        <div className="space-y-4">
          {nextLevelData && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bebas text-2xl text-purple-900 flex items-center gap-2">
                    PRÓXIMO NÍVEL: {nextLevelData.name.toUpperCase()}
                    <ArrowUp className="w-5 h-5 text-green-500 animate-bounce" />
                  </h4>
                  <span className="text-lg font-bold text-verde-brasil">{nextLevelData.progress || 0}%</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={animateProgress ? (nextLevelData.progress || 0) : 0} 
                    className="h-3 transition-all duration-1000"
                  />
                  {animateProgress && (nextLevelData.progress || 0) > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  )}
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Requisitos:</p>
                {nextLevelData.requirements.map((req) => (
                  <div key={req.id} className="flex items-start gap-2">
                    {req.completed ? (
                      <div className="relative">
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        req.completed ? "text-green-700 line-through" : "text-gray-700"
                      )}>
                        {req.label}
                        {'current' in req && 'total' in req && req.current !== undefined && req.total !== undefined && (
                          <span className="ml-1 text-xs">({req.current}/{req.total})</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits Preview */}
              {'benefits' in nextLevelData && nextLevelData.benefits && (
                <div className="bg-gradient-to-r from-gray-50 to-transparent rounded-lg p-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/0 to-yellow-100/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2 relative z-10">
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                    Desbloqueie no {nextLevelData.name}:
                  </p>
                  <ul className="space-y-1 relative z-10">
                    {nextLevelData.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2 group-hover:text-gray-700 transition-colors">
                        <Lock className="w-3 h-3 group-hover:text-yellow-500 transition-colors" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="w-full btn-primary group relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continuar Progresso
                  <ArrowUp className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </>
          )}

          {/* Max Level Reached */}
          {!nextLevelData && currentLevel === "platinum" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bebas text-2xl text-purple-600 mb-2">NÍVEL MÁXIMO!</h4>
              <p className="text-gray-600">
                Parabéns! Você alcançou o mais alto nível de verificação.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}