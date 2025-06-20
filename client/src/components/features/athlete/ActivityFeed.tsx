import { Button } from "@/components/ui/button";
import { Eye, Trophy, TrendingUp, Award, Play, ChevronRight, Bell, Circle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Activity {
  id?: string;
  type: "view" | "achievement" | "test" | "update" | "rank";
  message: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [, setLocation] = useLocation();
  const [visibleActivities, setVisibleActivities] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const activityStyles = {
    view: { 
      icon: Eye, 
      glow: "shadow-lg shadow-blue-500/20",
      border: "border-blue-500/30",
      iconColor: "text-blue-400"
    },
    achievement: { 
      icon: Trophy, 
      glow: "shadow-lg shadow-yellow-500/20",
      border: "border-yellow-500/30",
      iconColor: "text-yellow-400"
    },
    test: { 
      icon: CheckCircle, 
      glow: "shadow-lg shadow-green-500/20",
      border: "border-green-500/30",
      iconColor: "text-green-400"
    },
    update: { 
      icon: TrendingUp, 
      glow: "shadow-lg shadow-purple-500/20",
      border: "border-purple-500/30",
      iconColor: "text-purple-400"
    },
    rank: { 
      icon: Award, 
      glow: "shadow-lg shadow-orange-500/20",
      border: "border-orange-500/30",
      iconColor: "text-orange-400"
    }
  };

  // Set up intersection observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleActivities((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.1 }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="relative activity-feed">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white/80" />
              <span className="font-bebas text-xl text-white">ATIVIDADE</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 bg-green-500 animate-pulse" />
              <span className="text-xs text-white/50">Ao vivo</span>
            </div>
          </div>
        </div>
        
        {/* Activity List */}
        <div className="p-4 space-y-3">
          {activities.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="empty-state py-12 text-center"
            >
              <div className="glass-sphere mx-auto w-20 h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-white/40 animate-bounce" />
              </div>
              <p className="text-white/60">Sua jornada começa agora</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              {activities.slice(0, 5).map((activity, index) => {
                const config = activityStyles[activity.type] || activityStyles.update;
                const Icon = config.icon;
                const isVisible = visibleActivities.has(index);
                
                return (
                  <motion.div
                    key={activity.id || index}
                    ref={(el) => {
                      if (el && observerRef.current) {
                        el.setAttribute('data-index', index.toString());
                        observerRef.current.observe(el);
                      }
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`
                      relative
                      bg-white/5
                      backdrop-blur-md
                      border ${config.border}
                      rounded-xl
                      p-4
                      hover:bg-white/8
                      transition-all
                      hover:border-white/20
                      hover:transform hover:-translate-y-1
                      cursor-pointer
                      ${config.glow}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                      >
                        <Icon className={`w-5 h-5 ${config.iconColor}`} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/90 font-medium line-clamp-2">{activity.message}</p>
                        <p className="text-xs text-white/50 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
        
        {/* View All Button */}
        {activities.length > 0 && (
          <div className="px-4 pb-4">
            <Button 
              variant="ghost" 
              className="w-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all" 
              size="sm"
              onClick={() => setLocation('/athlete/activity')}
            >
              Ver Todas
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <motion.div
          animate={{
            y: [-20, -40, -20],
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-10 left-10 w-2 h-2 bg-blue-400/50 rounded-full"
        />
        <motion.div
          animate={{
            y: [-10, -30, -10],
            x: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-400/50 rounded-full"
        />
      </div>
    </div>
  );
}