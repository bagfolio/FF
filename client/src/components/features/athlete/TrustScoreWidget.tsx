import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shield, TrendingUp, AlertCircle, ArrowRight, 
  Medal, Star, Crown, Trophy, Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

type TrustLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

interface TrustScoreWidgetProps {
  currentLevel: TrustLevel;
  skills?: any[];
  profileCompletion?: number;
  className?: string;
}

const trustLevelConfig = {
  bronze: {
    score: 25,
    label: 'Bronze',
    icon: Medal,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    progressColor: 'bg-orange-500',
    glowColor: 'shadow-orange-500/30',
    message: 'Dados auto-declarados'
  },
  silver: {
    score: 50,
    label: 'Prata',
    icon: Star,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    progressColor: 'bg-gray-500',
    glowColor: 'shadow-gray-500/30',
    message: 'Validado por treinador'
  },
  gold: {
    score: 75,
    label: 'Ouro',
    icon: Crown,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    progressColor: 'bg-yellow-500',
    glowColor: 'shadow-yellow-500/30',
    message: 'Verificado por liga'
  },
  platinum: {
    score: 100,
    label: 'Platina',
    icon: Trophy,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    progressColor: 'bg-purple-500',
    glowColor: 'shadow-purple-500/30',
    message: 'Combine Digital verificado'
  }
};

export function TrustScoreWidget({
  currentLevel,
  skills = [],
  profileCompletion = 0,
  className
}: TrustScoreWidgetProps) {
  const [, setLocation] = useLocation();
  const config = trustLevelConfig[currentLevel];
  const TrustIcon = config.icon;
  
  // Calculate next level progress
  const nextLevel = currentLevel === 'bronze' ? 'silver' : 
                   currentLevel === 'silver' ? 'gold' : 
                   currentLevel === 'gold' ? 'platinum' : null;
  
  const progressToNext = currentLevel === 'platinum' ? 100 : 
                        currentLevel === 'gold' ? 80 :
                        currentLevel === 'silver' ? 60 : 40;
  
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* Animated background for bronze level */}
      {currentLevel === 'bronze' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5"
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bebas text-2xl">ÍNDICE DE CONFIANÇA</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Seu índice de confiança mostra o quão verificados são seus dados. 
                Scouts confiam mais em perfis com índices mais altos.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6">
        {/* Main Score Display */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <motion.div
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center mx-auto",
                config.bgColor,
                config.borderColor,
                "border-4",
                currentLevel === 'bronze' && "animate-pulse"
              )}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-center">
                <motion.p 
                  className={cn("text-5xl font-bold", config.color)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {config.score}%
                </motion.p>
                <p className={cn("text-xs font-medium", config.color, "opacity-80")}>
                  Confiável
                </p>
              </div>
            </motion.div>
            
            {/* Level Icon */}
            <motion.div
              className={cn(
                "absolute -bottom-2 left-1/2 transform -translate-x-1/2",
                "w-12 h-12 rounded-full flex items-center justify-center",
                config.bgColor,
                config.borderColor,
                "border-2 shadow-lg"
              )}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <TrustIcon className={cn("w-6 h-6", config.color)} />
            </motion.div>
          </div>
          
          <div className="mt-6">
            <h3 className={cn("text-xl font-bold", config.color)}>
              Nível {config.label}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {config.message}
            </p>
          </div>
        </motion.div>
        
        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progresso para {trustLevelConfig[nextLevel].label}</span>
              <span className="font-medium">{progressToNext}%</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
        )}
        
        {/* Warning for Bronze Level */}
        {currentLevel === 'bronze' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">
                  Seus dados precisam de verificação
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Atletas com dados verificados têm 3x mais chances de serem encontrados por scouts.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(
            "p-3 rounded-lg text-center",
            config.bgColor,
            config.borderColor,
            "border"
          )}>
            <TrendingUp className={cn("w-5 h-5 mx-auto mb-1", config.color)} />
            <p className="text-xs text-gray-600">Visibilidade</p>
            <p className={cn("text-sm font-bold", config.color)}>
              {currentLevel === 'platinum' ? 'Máxima' :
               currentLevel === 'gold' ? 'Alta' :
               currentLevel === 'silver' ? 'Média' : 'Baixa'}
            </p>
          </div>
          
          <div className={cn(
            "p-3 rounded-lg text-center",
            config.bgColor,
            config.borderColor,
            "border"
          )}>
            <Shield className={cn("w-5 h-5 mx-auto mb-1", config.color)} />
            <p className="text-xs text-gray-600">Credibilidade</p>
            <p className={cn("text-sm font-bold", config.color)}>
              {config.score}%
            </p>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button
          onClick={() => setLocation('/athlete/skills')}
          className={cn(
            "w-full",
            currentLevel === 'bronze' 
              ? "bg-orange-500 hover:bg-orange-600" 
              : "bg-verde-brasil hover:bg-verde-brasil/90"
          )}
        >
          {currentLevel === 'bronze' ? 'Verificar Dados Agora' : 'Melhorar Índice'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}