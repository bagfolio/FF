import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Mood {
  emoji: string;
  label: string;
  value: number;
  color: string;
  xp: number;
}

interface MoodSelectorProps {
  selected: Mood | null;
  onSelect: (mood: Mood) => void;
}

const moods: Mood[] = [
  { 
    emoji: '😔', 
    label: 'Difícil', 
    value: 1,
    color: 'from-gray-600 to-gray-800', 
    xp: 30 
  },
  { 
    emoji: '😐', 
    label: 'Regular', 
    value: 2,
    color: 'from-blue-600 to-blue-800', 
    xp: 40 
  },
  { 
    emoji: '🙂', 
    label: 'Bom', 
    value: 3,
    color: 'from-green-600 to-green-800', 
    xp: 50 
  },
  { 
    emoji: '😃', 
    label: 'Ótimo', 
    value: 4,
    color: 'from-yellow-600 to-yellow-800', 
    xp: 60 
  },
  { 
    emoji: '🤩', 
    label: 'Incrível', 
    value: 5,
    color: 'from-purple-600 to-pink-600', 
    xp: 75 
  }
];

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bebas text-white mb-2">
          Como foi seu treino hoje?
        </h2>
        <p className="text-white/60 text-lg">
          Seja honesto - isso nos ajuda a entender sua jornada
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood)}
            className={cn(
              "mood-card relative group",
              "aspect-square rounded-2xl p-6",
              "glass-morph backdrop-blur-md",
              "border-2 transition-all duration-300",
              selected?.value === mood.value
                ? "border-white/50 bg-white/10"
                : "border-white/10 hover:border-white/30",
              "flex flex-col items-center justify-center gap-3"
            )}
          >
            {/* Background gradient on hover */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity",
                "bg-gradient-to-br",
                mood.color
              )}
            />

            {/* Selected indicator */}
            {selected?.value === mood.value && (
              <motion.div
                layoutId="selectedMood"
                className="absolute inset-0 rounded-2xl border-2 border-white/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* Emoji */}
            <motion.span
              className="text-5xl sm:text-6xl md:text-7xl relative z-10"
              animate={{
                rotate: selected?.value === mood.value ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              {mood.emoji}
            </motion.span>

            {/* Label */}
            <span className="text-white/80 font-medium text-sm md:text-base relative z-10">
              {mood.label}
            </span>

            {/* XP indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: selected?.value === mood.value ? 1 : 0,
                y: selected?.value === mood.value ? 0 : 10
              }}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
            >
              <span className="text-xs text-amarelo-ouro font-semibold">
                +{mood.xp} XP
              </span>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Selection feedback */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <p className="text-white/60">
            Você selecionou: <span className="text-white font-semibold">{selected.label}</span>
          </p>
        </motion.div>
      )}
    </div>
  );
}