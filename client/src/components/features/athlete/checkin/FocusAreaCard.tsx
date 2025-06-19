import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FocusArea, drillsByFocusArea } from './drillsDatabase';
import DrillChip from './DrillChip';
import { Plus } from 'lucide-react';

interface FocusAreaCardProps {
  area: FocusArea;
  isSelected: boolean;
  timeSpent: number;
  selectedDrills: string[];
  customDrills: string[];
  maxTime: number;
  onToggle: () => void;
  onTimeUpdate: (time: number) => void;
  onDrillToggle: (drillId: string) => void;
  onCustomDrill: (drillName: string) => void;
}

const timeOptions = [15, 30, 45, 60];

const FocusAreaCard: React.FC<FocusAreaCardProps> = ({
  area,
  isSelected,
  timeSpent,
  selectedDrills,
  customDrills,
  maxTime,
  onToggle,
  onTimeUpdate,
  onDrillToggle,
  onCustomDrill
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDrillName, setCustomDrillName] = useState('');
  const drills = drillsByFocusArea[area.id] || [];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customDrillName.trim()) {
      onCustomDrill(customDrillName.trim());
      setCustomDrillName('');
      setShowCustomInput(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.button
        onClick={onToggle}
        className={`relative w-full p-6 rounded-2xl transition-all duration-300 ${
          isSelected
            ? 'bg-gradient-to-br ' + area.color + ' backdrop-blur-md border-2 border-verde-brasil/50 shadow-lg shadow-verde-brasil/20'
            : 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10'
        }`}
        whileHover={{ scale: isSelected ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={isSelected ? {
          y: -8,
          scale: 1.05,
        } : {
          y: 0,
          scale: 1,
        }}
      >
        {/* Icon and Title */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">{area.icon}</span>
          <h3 className="text-lg font-semibold text-white">{area.name}</h3>
          <p className="text-xs text-white/60">{area.description}</p>
        </div>

        {/* Selected indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-verde-brasil rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Expanded content */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 space-y-4 overflow-hidden"
          >
            {/* Time allocation */}
            <div className="px-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Tempo dedicado</span>
                {timeSpent > 0 && (
                  <span className="text-sm font-medium text-verde-brasil">
                    {timeSpent} min
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {timeOptions.map((time) => {
                  const isDisabled = time > maxTime && time !== timeSpent;
                  return (
                    <button
                      key={time}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) {
                          onTimeUpdate(time === timeSpent ? 0 : time);
                        }
                      }}
                      disabled={isDisabled}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        time === timeSpent
                          ? 'bg-verde-brasil text-white shadow-md'
                          : isDisabled
                          ? 'bg-white/5 text-white/30 cursor-not-allowed'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {time === 60 ? '60+' : time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drills */}
            {timeSpent > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-2 space-y-2"
              >
                <span className="text-sm text-white/70">Exercícios praticados</span>
                
                {/* Preset drills */}
                <div className="flex flex-wrap gap-2">
                  {drills.slice(0, 6).map((drill) => (
                    <DrillChip
                      key={drill.id}
                      drill={drill}
                      isSelected={selectedDrills.includes(drill.id)}
                      onClick={() => onDrillToggle(drill.id)}
                    />
                  ))}
                </div>

                {/* Custom drills */}
                {customDrills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {customDrills.map((drillName, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-verde-brasil/20 to-amarelo-ouro/20 border border-verde-brasil/30 text-sm text-white"
                      >
                        {drillName}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Add custom drill */}
                {!showCustomInput ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCustomInput(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 transition-all text-sm text-white/70"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar exercício
                  </button>
                ) : (
                  <form onSubmit={handleCustomSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={customDrillName}
                      onChange={(e) => setCustomDrillName(e.target.value)}
                      placeholder="Nome do exercício"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-verde-brasil"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-verde-brasil text-white text-sm font-medium hover:bg-verde-brasil/80 transition-all"
                    >
                      Adicionar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomInput(false);
                        setCustomDrillName('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-all"
                    >
                      Cancelar
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FocusAreaCard;