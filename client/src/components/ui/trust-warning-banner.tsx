import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrustWarningBannerProps {
  trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalUnverified: number;
  totalItems: number;
  context: 'scout' | 'athlete';
  onAction?: () => void;
  onDismiss?: () => void;
  className?: string;
  dismissible?: boolean;
}

export function TrustWarningBanner({
  trustLevel,
  totalUnverified,
  totalItems,
  context,
  onAction,
  onDismiss,
  className,
  dismissible = true
}: TrustWarningBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  
  if (!isVisible) return null;
  
  const percentage = totalItems > 0 ? Math.round((totalUnverified / totalItems) * 100) : 0;
  const shouldShowWarning = percentage > 25 && trustLevel === 'bronze';
  
  const getWarningLevel = () => {
    if (percentage >= 75) return 'critical';
    if (percentage >= 50) return 'high';
    if (percentage >= 25) return 'medium';
    return 'low';
  };
  
  const warningLevel = getWarningLevel();
  
  const warningConfig = {
    critical: {
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      iconColor: 'text-red-500',
      pulseColor: 'bg-red-500',
      message: context === 'scout' 
        ? 'A maioria dos dados não está verificada - interprete com cautela'
        : 'Seus dados precisam de verificação urgente para maior credibilidade'
    },
    high: {
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      iconColor: 'text-orange-500',
      pulseColor: 'bg-orange-500',
      message: context === 'scout'
        ? 'Muitos dados não verificados - recomenda-se confirmação adicional'
        : 'Verifique seus dados para aumentar sua visibilidade'
    },
    medium: {
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      iconColor: 'text-yellow-500',
      pulseColor: 'bg-yellow-500',
      message: context === 'scout'
        ? 'Alguns dados não verificados - considere solicitar validação'
        : 'Complete a verificação para melhorar seu perfil'
    },
    low: {
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      iconColor: 'text-blue-500',
      pulseColor: 'bg-blue-500',
      message: context === 'scout'
        ? 'Dados majoritariamente verificados'
        : 'Seu perfil está bem verificado'
    }
  };
  
  const config = warningConfig[warningLevel];
  
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };
  
  return (
    <AnimatePresence>
      {shouldShowWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4",
            config.bgColor,
            config.borderColor,
            className
          )}
        >
          {/* Animated background pulse for critical warnings */}
          {warningLevel === 'critical' && (
            <motion.div
              className={cn(
                "absolute inset-0 opacity-10",
                config.pulseColor
              )}
              animate={{
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          <div className="relative flex items-start gap-3">
            {/* Animated warning icon */}
            <motion.div
              animate={warningLevel === 'critical' ? {
                rotate: [-5, 5, -5],
              } : {}}
              transition={{
                duration: 0.5,
                repeat: warningLevel === 'critical' ? Infinity : 0,
                ease: "easeInOut"
              }}
              className="flex-shrink-0"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                config.bgColor,
                `border-2 ${config.borderColor}`
              )}>
                {warningLevel === 'low' ? (
                  <Shield className={cn("w-5 h-5", config.iconColor)} />
                ) : (
                  <AlertTriangle className={cn("w-5 h-5", config.iconColor)} />
                )}
              </div>
            </motion.div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className={cn("font-semibold", config.textColor)}>
                  {percentage}% dos dados não verificados
                </h4>
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className={cn(
                      "p-1 rounded hover:bg-white/10 transition-colors",
                      config.textColor
                    )}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className={cn("text-sm mb-3", config.textColor, "opacity-80")}>
                {config.message}
              </p>
              
              {/* Progress bar showing verification status */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-600"
                />
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-3">
                {context === 'scout' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "text-xs",
                      config.borderColor,
                      config.textColor,
                      "hover:bg-white/10"
                    )}
                    onClick={onAction}
                  >
                    Filtrar apenas verificados
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
                
                {context === 'athlete' && (
                  <Button
                    size="sm"
                    className={cn(
                      "text-xs",
                      warningLevel === 'critical' 
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-verde-brasil hover:bg-verde-brasil/90 text-white"
                    )}
                    onClick={onAction}
                  >
                    Verificar agora
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional context for scouts */}
          {context === 'scout' && warningLevel !== 'low' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.5 }}
              className={cn(
                "mt-3 pt-3 border-t text-xs",
                config.borderColor,
                config.textColor,
                "opacity-70"
              )}
            >
              <p>
                💡 <strong>Dica:</strong> Dados verificados incluem validação por treinador (Prata), 
                estatísticas de liga (Ouro) ou testes do Combine Digital (Platina).
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact version for inline use
export function TrustWarningBadge({
  trustLevel,
  verified = false,
  className
}: {
  trustLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  verified?: boolean;
  className?: string;
}) {
  if (verified || trustLevel !== 'bronze') return null;
  
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
        "bg-orange-500/10 border border-orange-500/30 text-orange-400",
        className
      )}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <AlertTriangle className="w-3 h-3" />
      </motion.div>
      <span>Não verificado</span>
    </motion.div>
  );
}