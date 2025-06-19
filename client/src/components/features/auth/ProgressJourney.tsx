import { motion } from 'framer-motion';
import { MapPin, Trophy, User, Target, Zap } from 'lucide-react';

interface ProgressJourneyProps {
  currentStep: number;
  steps?: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    location: string;
  }>;
}

const defaultSteps = [
  { id: 'welcome', title: 'Entrada', icon: <MapPin className="w-5 h-5" />, location: 'Portão Principal' },
  { id: 'position', title: 'Posição', icon: <Target className="w-5 h-5" />, location: 'Sala Tática' },
  { id: 'profile', title: 'Perfil', icon: <User className="w-5 h-5" />, location: 'Vestiário' },
  { id: 'skills', title: 'Habilidades', icon: <Zap className="w-5 h-5" />, location: 'Campo de Treino' },
  { id: 'complete', title: 'Conclusão', icon: <Trophy className="w-5 h-5" />, location: 'Gramado Principal' }
];

export default function ProgressJourney({ currentStep, steps = defaultSteps }: ProgressJourneyProps) {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md rounded-full px-8 py-4 shadow-2xl border border-white/20">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex flex-col items-center"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute left-full top-6 w-8 h-0.5 bg-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-verde-brasil to-amarelo-ouro"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  />
                </div>
              )}

              {/* Step indicator */}
              <motion.div
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  ${isCompleted ? 'bg-verde-brasil text-white' : ''}
                  ${isCurrent ? 'bg-amarelo-ouro text-azul-celeste scale-110' : ''}
                  ${isUpcoming ? 'bg-white/10 text-white/50' : ''}
                `}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted && !isCurrent ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  step.icon
                )}

                {/* Pulse effect for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-amarelo-ouro"
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
                )}
              </motion.div>

              {/* Step label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="absolute top-full mt-2 text-center whitespace-nowrap"
              >
                <p className={`text-xs font-bebas tracking-wider ${isCurrent ? 'text-amarelo-ouro' : 'text-white/70'}`}>
                  {step.title}
                </p>
                <p className={`text-[10px] ${isCurrent ? 'text-white' : 'text-white/50'}`}>
                  {step.location}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Current step indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-xs text-white/70">Passo {currentStep + 1} de {steps.length}</p>
      </motion.div>
    </div>
  );
}