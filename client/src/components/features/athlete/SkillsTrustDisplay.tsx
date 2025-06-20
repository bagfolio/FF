import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, Dumbbell, Target, Heart, 
  Medal, Star, Crown, Trophy,
  CheckCircle, AlertCircle, Info, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SkillsDisplay } from '@/components/scout/SkillsDisplay';

type TrustLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface SkillData {
  id: string;
  name: string;
  data: any;
}

interface SkillVerification {
  skillId: string;
  trustLevel: TrustLevel;
  verifiedAt?: string;
  verifiedBy?: string;
  method?: string;
}

interface SkillsTrustDisplayProps {
  skills: SkillData[] | null;
  currentTrustLevel: TrustLevel;
  skillVerifications?: SkillVerification[];
  onVerifySkill?: (skillId: string) => void;
  className?: string;
}

const skillIcons = {
  speed: Zap,
  strength: Dumbbell,
  technique: Target,
  stamina: Heart
};

const trustLevels = [
  { id: 'bronze', name: 'Bronze', icon: Medal, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { id: 'silver', name: 'Prata', icon: Star, color: 'text-gray-600', bgColor: 'bg-gray-50' },
  { id: 'gold', name: 'Ouro', icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { id: 'platinum', name: 'Platina', icon: Trophy, color: 'text-purple-600', bgColor: 'bg-purple-50' }
];

const verificationMethods: Record<TrustLevel, { label: string; description: string }> = {
  bronze: {
    label: 'Auto-avaliação',
    description: 'Dados inseridos pelo próprio atleta'
  },
  silver: {
    label: 'Validação de Treinador',
    description: 'Confirmado por treinador certificado'
  },
  gold: {
    label: 'Estatísticas de Liga',
    description: 'Dados oficiais de competições'
  },
  platinum: {
    label: 'Combine Digital',
    description: 'Verificado por IA em testes padronizados'
  }
};

export function SkillsTrustDisplay({
  skills,
  currentTrustLevel,
  skillVerifications = [],
  onVerifySkill,
  className
}: SkillsTrustDisplayProps) {
  if (!skills || skills.length === 0) {
    return null;
  }

  const getSkillVerification = (skillId: string): SkillVerification | undefined => {
    return skillVerifications.find(v => v.skillId === skillId);
  };

  const getTrustLevelIndex = (level: TrustLevel): number => {
    return trustLevels.findIndex(l => l.id === level);
  };

  const canUpgradeSkill = (skillId: string): boolean => {
    const verification = getSkillVerification(skillId);
    const skillLevel = verification?.trustLevel || 'bronze';
    return getTrustLevelIndex(skillLevel) < getTrustLevelIndex(currentTrustLevel);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-bebas text-2xl">VERIFICAÇÃO DE HABILIDADES</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Quanto maior o nível de verificação das suas habilidades, mais confiança os scouts terão nos seus dados.
                Melhore seu nível completando testes e obtendo validações.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Trust Level */}
        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Nível de Confiança Geral</span>
            <div className="flex items-center gap-2">
              {trustLevels.map((level, index) => {
                const Icon = level.icon;
                const isActive = getTrustLevelIndex(currentTrustLevel) >= index;
                return (
                  <div
                    key={level.id}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      isActive ? level.bgColor : "bg-gray-200",
                      currentTrustLevel === level.id && "ring-2 ring-offset-1 ring-verde-brasil"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? level.color : "text-gray-400")} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{trustLevels.find(l => l.id === currentTrustLevel)?.name}</span>
              <span className="text-gray-600">{verificationMethods[currentTrustLevel].label}</span>
            </div>
            <Progress 
              value={(getTrustLevelIndex(currentTrustLevel) + 1) * 25} 
              className="h-2"
            />
          </div>
        </div>

        {/* Individual Skill Verifications */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Verificação por Habilidade</h4>
          
          {skills.map(skill => {
            const Icon = skillIcons[skill.id as keyof typeof skillIcons];
            const verification = getSkillVerification(skill.id);
            const skillTrustLevel = verification?.trustLevel || 'bronze';
            const trustLevel = trustLevels.find(l => l.id === skillTrustLevel);
            const TrustIcon = trustLevel?.icon || Medal;
            const canUpgrade = canUpgradeSkill(skill.id);

            return (
              <div 
                key={skill.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{skill.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-2 py-0.5",
                          trustLevel?.bgColor,
                          trustLevel?.color
                        )}
                      >
                        <TrustIcon className="w-3 h-3 mr-1" />
                        {trustLevel?.name}
                      </Badge>
                      {verification?.verifiedAt && (
                        <span className="text-xs text-gray-500">
                          Verificado em {new Date(verification.verifiedAt).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canUpgrade ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onVerifySkill?.(skill.id)}
                          className="text-xs"
                        >
                          Melhorar <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          Você pode elevar esta habilidade para {trustLevels.find(l => l.id === currentTrustLevel)?.name}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">Aumente sua credibilidade</p>
              <p className="text-sm text-blue-700 mt-1">
                Complete testes do Combine Digital ou peça validação do seu treinador para melhorar o nível de confiança das suas habilidades.
              </p>
              <Button size="sm" variant="link" className="text-blue-700 p-0 h-auto mt-2">
                Saiba mais sobre verificação <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}