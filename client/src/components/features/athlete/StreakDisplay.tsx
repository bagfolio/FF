import { motion, AnimatePresence } from "framer-motion";
import { Flame, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface StreakDisplayProps {
  streak: number;
  size?: "small" | "medium" | "large";
  showWarning?: boolean;
  lastActivity?: Date;
  history?: { date: Date; hasActivity: boolean }[];
}

export function StreakDisplay({ 
  streak, 
  size = "medium", 
  showWarning = false,
  lastActivity,
  history = []
}: StreakDisplayProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Determine flame intensity based on streak
  const getFlameIntensity = (streakDays: number) => {
    if (streakDays >= 30) return "platinum";
    if (streakDays >= 14) return "gold";
    if (streakDays >= 7) return "silver";
    return "bronze";
  };
  
  const flameIntensity = getFlameIntensity(streak);
  
  const sizeClasses = {
    small: {
      container: "w-16 h-20",
      flame: "w-6 h-8",
      number: "text-lg",
      label: "text-xs"
    },
    medium: {
      container: "w-20 h-24",
      flame: "w-8 h-10",
      number: "text-2xl",
      label: "text-sm"
    },
    large: {
      container: "w-24 h-32",
      flame: "w-10 h-12",
      number: "text-3xl",
      label: "text-base"
    }
  };
  
  const flameColors = {
    bronze: {
      gradient: "from-orange-600 via-orange-500 to-yellow-500",
      glow: "shadow-orange-500/50"
    },
    silver: {
      gradient: "from-orange-500 via-yellow-500 to-yellow-400",
      glow: "shadow-yellow-500/50"
    },
    gold: {
      gradient: "from-yellow-500 via-yellow-400 to-white",
      glow: "shadow-yellow-400/50"
    },
    platinum: {
      gradient: "from-blue-400 via-yellow-400 to-white",
      glow: "shadow-blue-400/50"
    }
  };
  
  const currentSize = sizeClasses[size];
  const currentFlame = flameColors[flameIntensity];

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCalendar(true)}
        className={cn(
          "streak-container glass-morph relative flex flex-col items-center justify-center cursor-pointer",
          "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3",
          "hover:bg-white/8 hover:border-white/20 transition-all",
          currentSize.container
        )}
      >
        {/* Flame Wrapper */}
        <div className="flame-wrapper relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={cn("flame relative", currentSize.flame)}
          >
            {/* Flame particles */}
            <div className="absolute inset-0">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-5, -15, -5],
                    opacity: [0.5, 0, 0.5],
                    scale: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeOut"
                  }}
                  className={cn(
                    "absolute bottom-0 w-1 h-1 rounded-full",
                    i === 0 && "left-1/4 bg-orange-400",
                    i === 1 && "left-1/2 bg-yellow-400",
                    i === 2 && "left-3/4 bg-orange-500"
                  )}
                />
              ))}
            </div>
            
            {/* Main flame */}
            <div
              className={cn(
                "flame-inner w-full h-full rounded-[50%_50%_50%_50%/60%_60%_40%_40%]",
                "bg-gradient-to-t",
                currentFlame.gradient,
                "shadow-lg",
                currentFlame.glow,
                "relative overflow-hidden"
              )}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/20 to-white/40 blur-sm" />
            </div>
          </motion.div>
        </div>
        
        {/* Streak Counter */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mt-1"
        >
          <span className={cn("font-bold text-white block", currentSize.number)}>
            {streak}
          </span>
          <span className={cn("text-white/60", currentSize.label)}>dias</span>
        </motion.div>
        
        {/* Warning indicator */}
        {showWarning && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1"
          >
            <AlertCircle className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Calendar Modal */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bebas flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Histórico de Sequência
            </DialogTitle>
          </DialogHeader>
          
          <div className="calendar-modal mt-4">
            <div className="grid grid-cols-7 gap-2">
              {/* Calendar header */}
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, i) => (
                <div key={i} className="text-center text-xs text-gray-400 font-semibold">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                const hasActivity = i >= 30 - streak || Math.random() > 0.3; // Demo logic
                const isToday = i === 29;
                
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.01 }}
                    className={cn(
                      "calendar-day relative aspect-square rounded-lg flex items-center justify-center",
                      "bg-white/5 backdrop-blur-sm border",
                      hasActivity 
                        ? "border-orange-500/30 bg-orange-500/10" 
                        : "border-white/10",
                      isToday && "ring-2 ring-white/50"
                    )}
                  >
                    {hasActivity && (
                      <motion.div
                        animate={{
                          scale: [0.8, 1, 0.8],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Flame className={cn(
                          "w-4 h-4",
                          isToday ? "text-orange-400" : "text-orange-500/60"
                        )} />
                      </motion.div>
                    )}
                    {!hasActivity && (
                      <span className="text-xs text-gray-500">{date.getDate()}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-2xl font-bold text-orange-400">{streak}</p>
                <p className="text-xs text-gray-400">Sequência Atual</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-2xl font-bold text-yellow-400">15</p>
                <p className="text-xs text-gray-400">Maior Sequência</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                <p className="text-2xl font-bold text-green-400">85%</p>
                <p className="text-xs text-gray-400">Consistência</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}