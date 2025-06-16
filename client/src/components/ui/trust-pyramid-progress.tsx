import { cn } from "@/lib/utils";
import { Check, Circle, Lock, Trophy } from "lucide-react";
import TrustPyramid from "./trust-pyramid";
import { Progress } from "./progress";
import { Button } from "./button";

interface TrustPyramidProgressProps {
  currentLevel: "bronze" | "silver" | "gold" | "platinum";
  className?: string;
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

export default function TrustPyramidProgress({ currentLevel, className }: TrustPyramidProgressProps) {
  const currentLevelData = levelRequirements[currentLevel];
  const nextLevelKey = currentLevelData.nextLevel as keyof typeof levelRequirements | null;
  const nextLevelData = nextLevelKey ? levelRequirements[nextLevelKey] : null;

  return (
    <div className={cn("bg-white rounded-xl shadow-lg p-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Pyramid Visual */}
        <div className="flex flex-col items-center">
          <h3 className="font-bebas text-2xl azul-celeste mb-4">PIRÂMIDE DA CONFIANÇA</h3>
          <TrustPyramid 
            currentLevel={currentLevel}
            showLabels={false}
            interactive={true}
            className="max-w-[250px]"
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Nível Atual</p>
            <p className="font-bebas text-3xl azul-celeste">{currentLevelData.name.toUpperCase()}</p>
          </div>
        </div>

        {/* Right: Progress Details */}
        <div className="space-y-4">
          {nextLevelData && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">Próximo Nível: {nextLevelData.name}</h4>
                  <span className="text-sm font-medium text-gray-600">{nextLevelData.progress}%</span>
                </div>
                <Progress value={nextLevelData.progress} className="h-3" />
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Requisitos:</p>
                {nextLevelData.requirements.map((req) => (
                  <div key={req.id} className="flex items-start gap-2">
                    {req.completed ? (
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm",
                        req.completed ? "text-green-700 line-through" : "text-gray-700"
                      )}>
                        {req.label}
                        {req.current !== undefined && (
                          <span className="ml-1 text-xs">({req.current}/{req.total})</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits Preview */}
              {nextLevelData.benefits && (
                <div className="bg-gradient-to-r from-gray-50 to-transparent rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    🎯 Desbloqueie no {nextLevelData.name}:
                  </p>
                  <ul className="space-y-1">
                    {nextLevelData.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="w-full btn-primary">
                Continuar Progresso
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