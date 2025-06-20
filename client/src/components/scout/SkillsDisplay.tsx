import React from 'react';
import { AlertCircle, CheckCircle, Zap, Dumbbell, Target, Heart, Medal, Star, Crown, Trophy, Info, Shield, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface SkillData {
  id: string;
  name: string;
  data: {
    selfRating?: string;
    sliderValue?: number;
    comparison?: string;
    skills?: Record<string, number>;
    preferredFoot?: string;
    duration?: string;
    recovery?: string;
  };
}

type TrustLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface SkillsDisplayProps {
  skills: SkillData[] | null;
  verified: boolean; // Keep for backward compatibility
  trustLevel?: TrustLevel; // New trust pyramid level
  compact?: boolean;
  showLabels?: boolean;
  highlightBest?: boolean;
  className?: string;
}

// Skill configuration with icons and colors
const skillConfig = {
  speed: { 
    label: 'VEL', 
    fullLabel: 'Velocidade',
    icon: Zap, 
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30'
  },
  strength: { 
    label: 'FOR', 
    fullLabel: 'Força',
    icon: Dumbbell, 
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30'
  },
  technique: { 
    label: 'TEC', 
    fullLabel: 'Técnica',
    icon: Target, 
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  stamina: { 
    label: 'RES', 
    fullLabel: 'Resistência',
    icon: Heart, 
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  }
};

// Trust level configuration
const trustLevelConfig: Record<TrustLevel, {
  label: string;
  icon: any;
  description: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
  glowColor?: string;
  priority: number;
}> = {
  bronze: {
    label: 'Auto-declarado',
    icon: Medal,
    description: 'Dados inseridos pelo atleta - Não verificado',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-300',
    glowColor: 'shadow-orange-500/30',
    priority: 1
  },
  silver: {
    label: 'Validado por Treinador',
    icon: Star,
    description: 'Confirmado por treinador verificado',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-700',
    badgeColor: 'bg-gray-100 text-gray-700 border-gray-300',
    glowColor: 'shadow-gray-500/30',
    priority: 2
  },
  gold: {
    label: 'Verificado por Liga',
    icon: Crown,
    description: 'Estatísticas oficiais de liga',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    textColor: 'text-yellow-700',
    badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    glowColor: 'shadow-yellow-500/30',
    priority: 3
  },
  platinum: {
    label: 'Combine Digital',
    icon: Trophy,
    description: 'Verificado por IA em testes padronizados',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300',
    glowColor: 'shadow-purple-500/30',
    priority: 4
  }
};

export function SkillsDisplay({ 
  skills, 
  verified, 
  trustLevel = 'bronze',
  compact = false, 
  showLabels = true,
  highlightBest = false,
  className = ''
}: SkillsDisplayProps) {
  // Use trustLevel if provided, otherwise derive from verified boolean for backward compatibility
  const effectiveTrustLevel = trustLevel || (verified ? 'silver' : 'bronze');
  const trustConfig = trustLevelConfig[effectiveTrustLevel];
  const TrustIcon = trustConfig.icon;
  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  // Calculate skill values with proper normalization
  const getSkillValue = (skill: SkillData): number => {
    switch(skill.id) {
      case 'speed':
        return skill.data.sliderValue || 0;
      
      case 'strength':
        return skill.data.sliderValue || 0;
      
      case 'technique':
        // Average of technical skills (1-5 scale converted to 0-10)
        const techSkills = skill.data.skills || {};
        const values = Object.values(techSkills).filter(v => typeof v === 'number') as number[];
        if (values.length === 0) return 0;
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        return Math.round(avg * 2); // Convert 1-5 to 0-10 scale
      
      case 'stamina':
        // Convert duration to 0-10 scale
        const duration = skill.data.duration;
        if (duration === '90+') return 10;
        if (duration === '90') return 8;
        if (duration === '60') return 6;
        if (duration === '45') return 4;
        return 0;
      
      default:
        return 0;
    }
  };

  // Process skills data
  const processedSkills = skills.map(skill => ({
    ...skill,
    value: getSkillValue(skill),
    config: skillConfig[skill.id as keyof typeof skillConfig]
  })).filter(skill => skill.config); // Only show configured skills

  // Find best skill if highlighting is enabled
  const maxValue = highlightBest ? Math.max(...processedSkills.map(s => s.value)) : 0;

  // Compact view for search results
  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        {/* Trust level indicator with animation for unverified */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                  trustConfig.badgeColor,
                  effectiveTrustLevel === 'bronze' && "animate-pulse"
                )}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                {effectiveTrustLevel === 'bronze' ? (
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <TrustIcon className="w-3.5 h-3.5" />
                )}
                <span className="font-semibold">{trustConfig.label}</span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">{trustConfig.description}</p>
                {effectiveTrustLevel === 'bronze' && (
                  <p className="text-xs text-orange-400">
                    ⚠️ Scouts interpretam dados não verificados com cautela
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
          
          {/* Trust score percentage for non-bronze levels */}
          {effectiveTrustLevel !== 'bronze' && (
            <div className="text-xs font-bold text-gray-600">
              {trustConfig.priority * 25}% confiável
            </div>
          )}
        </div>
        
        {/* Skills badges with trust level visual differentiation */}
        <div className="flex flex-wrap gap-2">
          {processedSkills.map(skill => {
            const Icon = skill.config.icon;
            const isBest = highlightBest && skill.value === maxValue && skill.value > 0;
            
            return (
              <motion.div 
                key={skill.id}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border",
                  effectiveTrustLevel === 'platinum' 
                    ? "bg-purple-50 border-purple-300 text-purple-700" 
                    : effectiveTrustLevel === 'gold'
                    ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                    : effectiveTrustLevel === 'silver'
                    ? "bg-gray-50 border-gray-300 text-gray-700"
                    : "bg-orange-50 border-orange-300 text-orange-700",
                  isBest && "ring-2 ring-amarelo-ouro ring-offset-1",
                  effectiveTrustLevel === 'bronze' && "opacity-80"
                )}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * processedSkills.indexOf(skill) }}
              >
                {/* Warning overlay for unverified data */}
                {effectiveTrustLevel === 'bronze' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                )}
                
                <Icon className="w-3.5 h-3.5" />
                <span>{skill.config.label}</span>
                <span className={cn(
                  "font-bold",
                  effectiveTrustLevel === 'bronze' && "opacity-70"
                )}>
                  {skill.value}/10
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Detailed view for profiles
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with enhanced trust indicator */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Habilidades</h4>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div 
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full",
                trustConfig.bgColor,
                trustConfig.borderColor,
                "border",
                trustConfig.textColor,
                effectiveTrustLevel === 'bronze' && "animate-pulse"
              )}
              whileHover={{ scale: 1.05 }}
            >
              {effectiveTrustLevel === 'bronze' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <TrustIcon className="w-4 h-4" />
              )}
              <span className="font-semibold">{trustConfig.label}</span>
              <Info className="w-3 h-3 opacity-60" />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <p className="text-sm font-medium">{trustConfig.description}</p>
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-600 mb-1">Níveis de verificação:</p>
                <div className="space-y-1 text-xs">
                  {Object.entries(trustLevelConfig).map(([level, config]) => {
                    const LevelIcon = config.icon;
                    return (
                      <div key={level} className="flex items-center gap-2">
                        <LevelIcon className={cn("w-3 h-3", config.textColor)} />
                        <span className={effectiveTrustLevel === level ? "font-semibold" : ""}>
                          {config.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Skills Grid with enhanced visual feedback */}
      <div className="grid grid-cols-2 gap-3">
        {processedSkills.map((skill, index) => {
          const Icon = skill.config.icon;
          const isBest = highlightBest && skill.value === maxValue && skill.value > 0;
          
          return (
            <motion.div 
              key={skill.id} 
              className={cn(
                "relative space-y-2 p-3 rounded-lg border transition-all",
                trustConfig.bgColor,
                trustConfig.borderColor,
                isBest && "ring-2 ring-amarelo-ouro",
                effectiveTrustLevel === 'bronze' && "opacity-90"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Unverified warning indicator */}
              {effectiveTrustLevel === 'bronze' && (
                <motion.div 
                  className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-3 h-3 text-white" />
                </motion.div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    skill.config.bgColor,
                    `border ${skill.config.borderColor}`
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {showLabels && (
                    <span className="text-sm font-medium text-gray-700">
                      {skill.config.fullLabel}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {skill.value}/10
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full transition-all duration-500 ease-out bg-gradient-to-r",
                    skill.config.color
                  )}
                  style={{ 
                    width: `${skill.value * 10}%`,
                    opacity: effectiveTrustLevel === 'bronze' ? 0.6 : 1
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info for Technique */}
      {processedSkills.find(s => s.id === 'technique') && (
        <div className="text-xs text-gray-600 bg-gray-50 rounded-md p-2">
          <p className="font-medium mb-1">Detalhes Técnicos:</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(skills.find(s => s.id === 'technique')?.data.skills || {}).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="font-medium">{value}/5</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}