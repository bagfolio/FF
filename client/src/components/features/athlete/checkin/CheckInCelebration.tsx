import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Share2, Trophy, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StreakDisplay } from "@/components/features/athlete/StreakDisplay";
import confetti from "canvas-confetti";
import type { CheckInData } from "@/pages/athlete/daily-checkin";

interface CheckInCelebrationProps {
  checkInData: CheckInData;
  onComplete: () => void;
}

export function CheckInCelebration({ checkInData, onComplete }: CheckInCelebrationProps) {
  const [showElements, setShowElements] = useState({
    xp: false,
    streak: false,
    message: false,
    actions: false
  });

  // Calculate bonus XP
  const baseXP = checkInData.mood?.xp || 50;
  const intensityBonus = Math.floor(checkInData.intensity / 30) * 10; // +10 XP per 30 min
  const reflectionBonus = checkInData.reflection.length > 30 ? 15 : 0;
  const totalXP = baseXP + intensityBonus + reflectionBonus;

  // Get current streak (would come from API/storage)
  const currentStreak = parseInt(localStorage.getItem('currentStreak') || '0') + 1;
  
  useEffect(() => {
    // Update streak in storage
    localStorage.setItem('currentStreak', currentStreak.toString());
    
    // Trigger confetti
    const shootConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#009C3B', '#FFDF00', '#002776']
      });
    };

    // Staggered animations
    const timers = [
      setTimeout(() => {
        setShowElements(prev => ({ ...prev, xp: true }));
        shootConfetti();
      }, 300),
      setTimeout(() => setShowElements(prev => ({ ...prev, streak: true })), 1000),
      setTimeout(() => setShowElements(prev => ({ ...prev, message: true })), 1800),
      setTimeout(() => setShowElements(prev => ({ ...prev, actions: true })), 2400)
    ];

    return () => timers.forEach(clearTimeout);
  }, [currentStreak]);

  const getMotivationalMessage = () => {
    if (currentStreak >= 30) return "Lendário! Um mês completo de dedicação! 🏆";
    if (currentStreak >= 14) return "Incrível! Duas semanas de pura consistência! 🌟";
    if (currentStreak >= 7) return "Fantástico! Uma semana completa! 🔥";
    if (currentStreak >= 3) return "Ótimo ritmo! Continue assim! 💪";
    return "Jornada iniciada! Cada dia conta! 🚀";
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {/* XP Burst Animation */}
      {showElements.xp && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: 1 }}
          transition={{ duration: 0.8, times: [0, 0.6, 1] }}
          className="mb-12"
        >
          <div className="relative inline-block">
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-verde-brasil to-amarelo-ouro opacity-50" />
            
            {/* XP Text */}
            <motion.div
              animate={{
                textShadow: [
                  "0 0 20px rgba(0,156,59,0.5)",
                  "0 0 40px rgba(255,223,0,0.5)",
                  "0 0 20px rgba(0,156,59,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative text-8xl font-bold text-white"
            >
              +{totalXP} XP
            </motion.div>
          </div>
          
          {/* XP Breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 space-y-1"
          >
            <p className="text-white/60 text-sm">
              Base: +{baseXP} XP
            </p>
            {intensityBonus > 0 && (
              <p className="text-verde-brasil text-sm">
                Bônus de intensidade: +{intensityBonus} XP
              </p>
            )}
            {reflectionBonus > 0 && (
              <p className="text-amarelo-ouro text-sm">
                Bônus de reflexão: +{reflectionBonus} XP
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Streak Display */}
      {showElements.streak && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8 flex justify-center"
        >
          <StreakDisplay 
            streak={currentStreak} 
            size="large"
            showWarning={false}
          />
        </motion.div>
      )}

      {/* Motivational Message */}
      {showElements.message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bebas text-white mb-2">
            {getMotivationalMessage()}
          </h3>
          <p className="text-white/60">
            Seu comprometimento está fazendo a diferença
          </p>
        </motion.div>
      )}

      {/* Achievement Unlocks */}
      {currentStreak === 7 && showElements.message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 inline-flex items-center gap-3 bg-gradient-to-r from-amarelo-ouro/20 to-yellow-500/20 px-6 py-3 rounded-full border border-amarelo-ouro/30"
        >
          <Trophy className="w-5 h-5 text-amarelo-ouro" />
          <span className="text-white font-medium">
            Conquista Desbloqueada: Guerreiro Semanal!
          </span>
        </motion.div>
      )}

      {/* Action Buttons */}
      {showElements.actions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="glass-morph text-white border-white/20 hover:bg-white/10"
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: 'Minha sequência no Revela',
                  text: `Completei ${currentStreak} dias de treino consecutivos! 🔥`,
                });
              }
            }}
          >
            <Share2 className="mr-2" />
            Compartilhar Conquista
          </Button>
          
          <Button
            size="lg"
            className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white shadow-lg shadow-verde-brasil/20"
            onClick={onComplete}
          >
            <TrendingUp className="mr-2" />
            Ir para Dashboard
          </Button>
        </motion.div>
      )}

      {/* Stats Summary */}
      {showElements.actions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto"
        >
          <div className="glass-morph rounded-lg p-4 border border-white/10">
            <p className="text-3xl font-bold text-white">{checkInData.mood?.emoji}</p>
            <p className="text-xs text-white/60 mt-1">Humor</p>
          </div>
          <div className="glass-morph rounded-lg p-4 border border-white/10">
            <p className="text-3xl font-bold text-white">{checkInData.intensity}'</p>
            <p className="text-xs text-white/60 mt-1">Minutos</p>
          </div>
          <div className="glass-morph rounded-lg p-4 border border-white/10">
            <p className="text-3xl font-bold text-verde-brasil">{currentStreak}</p>
            <p className="text-xs text-white/60 mt-1">Dias</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}