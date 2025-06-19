import React from 'react';
import { motion } from 'framer-motion';
import { Drill } from './drillsDatabase';

interface DrillChipProps {
  drill: Drill;
  isSelected: boolean;
  onClick: () => void;
}

const DrillChip: React.FC<DrillChipProps> = ({ drill, isSelected, onClick }) => {
  return (
    <motion.button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? 'bg-verde-brasil text-white shadow-md shadow-verde-brasil/20'
          : 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-105'
      }`}
      whileHover={{ scale: isSelected ? 1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    >
      <span>{drill.name}</span>
      
      {/* XP indicator */}
      {isSelected && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-2 text-xs opacity-80"
        >
          +{drill.xpValue} XP
        </motion.span>
      )}
    </motion.button>
  );
};

export default DrillChip;