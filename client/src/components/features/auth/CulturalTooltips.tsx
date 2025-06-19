import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Star, Trophy, Heart } from "lucide-react";

interface CulturalTooltipsProps {
  page: 'welcome' | 'position' | 'profile' | 'skills' | 'complete';
}

const tooltipData = {
  welcome: [
    {
      id: 'welcome-1',
      icon: Star,
      title: 'Joga Bonito',
      description: 'O futebol brasileiro é conhecido mundialmente pelo seu estilo único e criativo.',
      position: { top: '20%', left: '10%' },
      delay: 3000
    },
    {
      id: 'welcome-2',
      icon: Trophy,
      title: 'Terra dos Campeões',
      description: 'O Brasil é o único país pentacampeão mundial de futebol.',
      position: { top: '60%', right: '15%' },
      delay: 6000
    }
  ],
  position: [
    {
      id: 'position-1',
      icon: Heart,
      title: 'Paixão Nacional',
      description: 'Cada posição tem sua magia no futebol brasileiro.',
      position: { top: '30%', left: '20%' },
      delay: 2000
    }
  ],
  profile: [
    {
      id: 'profile-1',
      icon: Star,
      title: 'Sua História',
      description: 'Todo grande jogador tem uma origem humilde e uma história inspiradora.',
      position: { top: '40%', right: '10%' },
      delay: 4000
    }
  ],
  skills: [
    {
      id: 'skills-1',
      icon: Trophy,
      title: 'Ginga Brasileira',
      description: 'A ginga é mais que habilidade, é arte em movimento.',
      position: { top: '25%', left: '15%' },
      delay: 3000
    }
  ],
  complete: [
    {
      id: 'complete-1',
      icon: Heart,
      title: 'Bem-vindo ao Time',
      description: 'Agora você faz parte da família do futebol brasileiro digital.',
      position: { top: '50%', left: '50%' },
      delay: 1000
    }
  ]
};

export default function CulturalTooltips({ page }: CulturalTooltipsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipQueue, setTooltipQueue] = useState<string[]>([]);

  const currentTooltips = tooltipData[page] || [];

  useEffect(() => {
    if (currentTooltips.length === 0) return;

    // Create queue of tooltip IDs
    const queue = currentTooltips.map(tooltip => tooltip.id);
    setTooltipQueue(queue);

    // Set up timers for each tooltip
    const timers = currentTooltips.map((tooltip, index) => {
      return setTimeout(() => {
        setActiveTooltip(tooltip.id);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setActiveTooltip(null);
        }, 5000);
      }, tooltip.delay);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [page, currentTooltips]);

  const handleDismiss = () => {
    setActiveTooltip(null);
  };

  const activeTooltipData = currentTooltips.find(tooltip => tooltip.id === activeTooltip);

  if (!activeTooltipData) return null;

  const IconComponent = activeTooltipData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className="fixed z-50 pointer-events-none"
        style={{
          ...activeTooltipData.position,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <motion.div
          className="bg-gradient-to-br from-verde-brasil to-verde-brasil/80 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-amarelo-ouro/30 max-w-xs pointer-events-auto"
          whileHover={{ scale: 1.05 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amarelo-ouro rounded-full flex items-center justify-center">
                <IconComponent className="w-4 h-4 text-verde-brasil" />
              </div>
              <h3 className="font-bebas text-lg text-white tracking-wide">
                {activeTooltipData.title}
              </h3>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <p className="text-white/90 text-sm leading-relaxed">
            {activeTooltipData.description}
          </p>

          {/* Brazilian flag accent */}
          <div className="absolute -top-1 -right-1 w-6 h-4 bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-azul-celeste rounded-sm opacity-80" />
        </motion.div>

        {/* Pulsing indicator */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-amarelo-ouro/50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}