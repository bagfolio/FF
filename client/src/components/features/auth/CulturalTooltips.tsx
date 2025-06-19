import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface CulturalTooltip {
  id: string;
  title: string;
  content: string;
  icon?: string;
  position?: { top?: string; bottom?: string; left?: string; right?: string };
}

const culturalFacts: { [key: string]: CulturalTooltip[] } = {
  welcome: [
    {
      id: 'maracana',
      title: 'Estádio do Maracanã',
      content: 'O maior estádio do Brasil já recebeu mais de 200.000 torcedores em uma partida. Hoje comporta 78.838 pessoas e é a casa da Seleção Brasileira.',
      icon: '🏟️'
    },
    {
      id: 'pentacampeao',
      title: 'Única Pentacampeã',
      content: 'O Brasil é o único país pentacampeão mundial de futebol, com títulos em 1958, 1962, 1970, 1994 e 2002.',
      icon: '🏆'
    }
  ],
  position: [
    {
      id: 'pele10',
      title: 'A Camisa 10',
      content: 'Pelé eternizou a camisa 10. No Brasil, ela representa criatividade, magia e a responsabilidade de fazer a diferença em campo.',
      icon: '👑'
    },
    {
      id: 'garrincha',
      title: 'Posições Lendárias',
      content: 'Garrincha (7) revolucionou a ponta direita, Cafú (2) redefiniu o lateral, e Ronaldo (9) mostrou como um centroavante brasileiro joga.',
      icon: '⭐'
    }
  ],
  profile: [
    {
      id: 'pelada',
      title: 'Futebol de Rua',
      content: 'A "pelada" é onde nascem os craques brasileiros. Nas ruas, praias e quadras, desenvolvemos o famoso "jogo bonito".',
      icon: '⚽'
    },
    {
      id: 'apelidos',
      title: 'Tradição dos Apelidos',
      content: 'No Brasil, jogadores são conhecidos por apelidos carinhosos: Pelé (Edson), Zico (Arthur), Kaká (Ricardo). É parte da nossa cultura!',
      icon: '🎭'
    }
  ],
  skills: [
    {
      id: 'ginga',
      title: 'Ginga Brasileira',
      content: 'A ginga é o movimento corporal único do futebol brasileiro, influenciado pela capoeira e pelo samba. É ritmo, é arte, é futebol!',
      icon: '🕺'
    },
    {
      id: 'dribles',
      title: 'Arte do Drible',
      content: 'Elástico, lambreta, caneta, chapéu... O Brasil criou os dribles mais famosos do mundo. Aqui, driblar é tão importante quanto marcar gols.',
      icon: '🌟'
    }
  ],
  complete: [
    {
      id: 'torcida',
      title: 'A 12ª Jogador',
      content: 'A torcida brasileira é conhecida mundialmente por sua paixão. Cantos, bandeiras e festa fazem parte de cada jogo.',
      icon: '🥁'
    },
    {
      id: 'sonho',
      title: 'O Sonho Brasileiro',
      content: 'Para milhões de jovens brasileiros, o futebol representa esperança, uma chance de mudar de vida e orgulhar sua família.',
      icon: '💚'
    }
  ]
};

interface CulturalTooltipsProps {
  page: 'welcome' | 'position' | 'profile' | 'skills' | 'complete';
  autoShow?: boolean;
  delay?: number;
}

export default function CulturalTooltips({ page, autoShow = true, delay = 3000 }: CulturalTooltipsProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [shownTooltips, setShownTooltips] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const tooltips = culturalFacts[page] || [];

  useEffect(() => {
    if (autoShow && tooltips.length > 0) {
      const timer = setTimeout(() => {
        // Show a tooltip that hasn't been shown yet
        const unshownTooltip = tooltips.find(t => !shownTooltips.has(t.id));
        if (unshownTooltip) {
          setActiveTooltip(unshownTooltip.id);
          setShownTooltips(prev => new Set(Array.from(prev).concat(unshownTooltip.id)));
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [page, autoShow, delay, shownTooltips]);

  useEffect(() => {
    // Show hint after all tooltips have been shown
    if (shownTooltips.size === tooltips.length && tooltips.length > 0) {
      const timer = setTimeout(() => setShowHint(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [shownTooltips, tooltips]);

  const currentTooltip = tooltips.find(t => t.id === activeTooltip);

  return (
    <>
      {/* Floating hint button */}
      <AnimatePresence>
        {showHint && !activeTooltip && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              const randomTooltip = tooltips[Math.floor(Math.random() * tooltips.length)];
              setActiveTooltip(randomTooltip.id);
            }}
            className="fixed top-32 right-8 z-40 w-12 h-12 rounded-full bg-amarelo-ouro text-azul-celeste flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Info className="w-5 h-5" />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-amarelo-ouro"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Tooltip modal */}
      <AnimatePresence>
        {activeTooltip && currentTooltip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveTooltip(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Tooltip content */}
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-gradient-to-br from-verde-brasil to-azul-celeste p-6 rounded-2xl shadow-2xl border-2 border-amarelo-ouro"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveTooltip(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-5xl mb-4 text-center"
              >
                {currentTooltip.icon}
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-bebas text-3xl text-white mb-3 text-center"
              >
                {currentTooltip.title}
              </motion.h3>

              {/* Content */}
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/90 text-center leading-relaxed"
              >
                {currentTooltip.content}
              </motion.p>

              {/* Brazilian flag decoration */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-azul-celeste rounded-b-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick tips (non-intrusive) */}
      <AnimatePresence>
        {tooltips.map((tooltip, index) => (
          <motion.div
            key={tooltip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ delay: index * 0.2 + 5 }}
            className="fixed z-30 cursor-pointer hover:opacity-100 transition-opacity"
            style={{
              top: `${20 + index * 15}%`,
              left: '20px'
            }}
            onClick={() => setActiveTooltip(tooltip.id)}
          >
            <div className="w-2 h-2 rounded-full bg-amarelo-ouro animate-pulse" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}