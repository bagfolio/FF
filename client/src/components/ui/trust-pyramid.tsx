import { cn } from "@/lib/utils";
import { Medal, Star, Crown, Trophy, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TrustPyramidProps {
  currentLevel: "bronze" | "silver" | "gold" | "platinum";
  className?: string;
  showLabels?: boolean;
  interactive?: boolean;
}

const levels = [
  {
    id: "bronze",
    name: "Bronze",
    label: "Dados Não Verificados",
    description: "Dados inseridos pelo atleta",
    icon: Medal,
    color: "from-orange-500 to-orange-600",
    borderColor: "border-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700"
  },
  {
    id: "silver",
    name: "Prata",
    label: "Validação Social",
    description: "Endosso de treinador verificado",
    icon: Star,
    color: "from-gray-400 to-gray-500",
    borderColor: "border-gray-400",
    bgColor: "bg-gray-50",
    textColor: "text-gray-700"
  },
  {
    id: "gold",
    name: "Ouro",
    label: "Verificado por Liga Oficial",
    description: "Estatísticas de ligas parceiras",
    icon: Crown,
    color: "from-yellow-500 to-yellow-600",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-700"
  },
  {
    id: "platinum",
    name: "Platina",
    label: "Métrica Verificada Revela",
    description: "Combine Digital com IA",
    icon: Trophy,
    color: "from-purple-500 to-purple-600",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700"
  }
];

export default function TrustPyramid({ 
  currentLevel, 
  className,
  showLabels = true,
  interactive = false
}: TrustPyramidProps) {
  const currentLevelIndex = levels.findIndex(l => l.id === currentLevel);

  return (
    <div className={cn("relative", className)}>
      {/* Pyramid SVG */}
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Define gradients */}
        <defs>
          {levels.map((level, index) => (
            <linearGradient key={level.id} id={`gradient-${level.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={cn(
                level.id === "bronze" ? "stop-color-orange-500" :
                level.id === "silver" ? "stop-color-gray-400" :
                level.id === "gold" ? "stop-color-yellow-500" :
                "stop-color-purple-500"
              )} />
              <stop offset="100%" className={cn(
                level.id === "bronze" ? "stop-color-orange-600" :
                level.id === "silver" ? "stop-color-gray-500" :
                level.id === "gold" ? "stop-color-yellow-600" :
                "stop-color-purple-600"
              )} />
            </linearGradient>
          ))}
        </defs>

        {/* Pyramid layers */}
        {/* Bronze - Base */}
        <path
          d="M 50 250 L 350 250 L 300 200 L 100 200 Z"
          fill={currentLevelIndex >= 0 ? "url(#gradient-bronze)" : "#f3f4f6"}
          stroke="#e5e7eb"
          strokeWidth="2"
          className={cn(
            "transition-all duration-300",
            interactive && "hover:opacity-80 cursor-pointer"
          )}
        />

        {/* Silver */}
        <path
          d="M 100 200 L 300 200 L 250 150 L 150 150 Z"
          fill={currentLevelIndex >= 1 ? "url(#gradient-silver)" : "#f3f4f6"}
          stroke="#e5e7eb"
          strokeWidth="2"
          className={cn(
            "transition-all duration-300",
            interactive && "hover:opacity-80 cursor-pointer"
          )}
        />

        {/* Gold */}
        <path
          d="M 150 150 L 250 150 L 225 100 L 175 100 Z"
          fill={currentLevelIndex >= 2 ? "url(#gradient-gold)" : "#f3f4f6"}
          stroke="#e5e7eb"
          strokeWidth="2"
          className={cn(
            "transition-all duration-300",
            interactive && "hover:opacity-80 cursor-pointer"
          )}
        />

        {/* Platinum - Apex */}
        <path
          d="M 175 100 L 225 100 L 200 50 Z"
          fill={currentLevelIndex >= 3 ? "url(#gradient-platinum)" : "#f3f4f6"}
          stroke="#e5e7eb"
          strokeWidth="2"
          className={cn(
            "transition-all duration-300",
            interactive && "hover:opacity-80 cursor-pointer"
          )}
        />

        {/* Icons on each level */}
        {levels.map((level, index) => {
          const IconComponent = level.icon;
          const yPositions = [225, 175, 125, 75];
          const isActive = currentLevelIndex >= index;
          
          return (
            <foreignObject
              key={level.id}
              x="185"
              y={yPositions[index]}
              width="30"
              height="30"
            >
              <div className={cn(
                "w-full h-full flex items-center justify-center rounded-full",
                isActive ? "bg-white/90" : "bg-gray-200"
              )}>
                <IconComponent className={cn(
                  "w-4 h-4",
                  isActive ? level.textColor : "text-gray-400"
                )} />
              </div>
            </foreignObject>
          );
        })}
      </svg>

      {/* Labels */}
      {showLabels && (
        <div className="mt-6 space-y-3">
          {levels.map((level, index) => {
            const isActive = currentLevelIndex >= index;
            const isCurrent = levels[currentLevelIndex]?.id === level.id;
            
            return (
              <div
                key={level.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  isActive ? level.bgColor : "bg-gray-50",
                  isCurrent && "ring-2 ring-offset-2",
                  isCurrent && level.borderColor.replace("border", "ring")
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  isActive ? `bg-gradient-to-br ${level.color}` : "bg-gray-300"
                )}>
                  <level.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-semibold",
                      isActive ? level.textColor : "text-gray-400"
                    )}>
                      {level.name}
                    </h4>
                    {interactive && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm">{level.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className={cn(
                    "text-sm",
                    isActive ? "text-gray-600" : "text-gray-400"
                  )}>
                    {level.label}
                  </p>
                </div>
                {isCurrent && (
                  <div className="px-2 py-1 bg-verde-brasil text-white text-xs font-bold rounded">
                    ATUAL
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}