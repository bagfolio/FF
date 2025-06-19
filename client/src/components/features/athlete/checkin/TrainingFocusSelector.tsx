import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { focusAreas, drillsByFocusArea, calculateVarietyBonus, getIntensityFromTime } from './drillsDatabase';
import FocusAreaCard from './FocusAreaCard';
import FloatingParticles from './FloatingParticles';

export interface TrainingFocusData {
  focusAreas: Array<{
    id: string;
    name: string;
    timeSpent: number;
    drills: string[];
    intensity: 'leve' | 'moderado' | 'intenso';
  }>;
  totalAllocatedTime: number;
  customDrills: string[];
}

interface TrainingFocusSelectorProps {
  maxMinutes: number; // From intensity step
  onComplete: (data: TrainingFocusData) => void;
  onBack: () => void;
}

const TrainingFocusSelector: React.FC<TrainingFocusSelectorProps> = ({ maxMinutes, onComplete, onBack }) => {
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [areaData, setAreaData] = useState<Record<string, {
    timeSpent: number;
    drills: string[];
    customDrills: string[];
  }>>({});
  const [totalAllocatedTime, setTotalAllocatedTime] = useState(0);

  // Load saved custom drills from localStorage
  useEffect(() => {
    const savedCustomDrills = localStorage.getItem('customDrills');
    if (savedCustomDrills) {
      // Initialize with saved custom drills if needed
    }
  }, []);

  const handleAreaToggle = (areaId: string) => {
    const newSelected = new Set(selectedAreas);
    if (newSelected.has(areaId)) {
      newSelected.delete(areaId);
      // Remove area data when deselected
      const newAreaData = { ...areaData };
      delete newAreaData[areaId];
      setAreaData(newAreaData);
    } else {
      newSelected.add(areaId);
      // Initialize area data when selected
      setAreaData({
        ...areaData,
        [areaId]: {
          timeSpent: 0,
          drills: [],
          customDrills: []
        }
      });
    }
    setSelectedAreas(newSelected);
  };

  const handleTimeUpdate = (areaId: string, time: number) => {
    const oldTime = areaData[areaId]?.timeSpent || 0;
    const newTotal = totalAllocatedTime - oldTime + time;
    
    // Validate against max time
    if (newTotal <= maxMinutes) {
      setAreaData({
        ...areaData,
        [areaId]: {
          ...areaData[areaId],
          timeSpent: time
        }
      });
      setTotalAllocatedTime(newTotal);
    }
  };

  const handleDrillToggle = (areaId: string, drillId: string) => {
    const currentDrills = areaData[areaId]?.drills || [];
    const newDrills = currentDrills.includes(drillId)
      ? currentDrills.filter(d => d !== drillId)
      : [...currentDrills, drillId];
    
    setAreaData({
      ...areaData,
      [areaId]: {
        ...areaData[areaId],
        drills: newDrills
      }
    });
  };

  const handleCustomDrill = (areaId: string, drillName: string) => {
    const currentCustom = areaData[areaId]?.customDrills || [];
    setAreaData({
      ...areaData,
      [areaId]: {
        ...areaData[areaId],
        customDrills: [...currentCustom, drillName]
      }
    });
    
    // Save to localStorage for future use
    const allCustomDrills = JSON.parse(localStorage.getItem('customDrills') || '{}');
    if (!allCustomDrills[areaId]) {
      allCustomDrills[areaId] = [];
    }
    allCustomDrills[areaId].push(drillName);
    localStorage.setItem('customDrills', JSON.stringify(allCustomDrills));
  };

  const handleContinue = () => {
    const trainingData: TrainingFocusData = {
      focusAreas: Array.from(selectedAreas).map(areaId => {
        const area = focusAreas.find(f => f.id === areaId)!;
        const data = areaData[areaId];
        return {
          id: areaId,
          name: area.name,
          timeSpent: data.timeSpent,
          drills: [...data.drills, ...data.customDrills],
          intensity: getIntensityFromTime(data.timeSpent)
        };
      }),
      totalAllocatedTime,
      customDrills: Object.values(areaData).flatMap(d => d.customDrills)
    };
    
    onComplete(trainingData);
  };

  const canContinue = selectedAreas.size > 0 && totalAllocatedTime > 0;
  const remainingTime = maxMinutes - totalAllocatedTime;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingParticles />
      
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">
            O que você treinou hoje?
          </h2>
          <p className="text-white/60">
            Selecione as áreas e exercícios que você praticou
          </p>
          
          {/* Time summary */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-sm text-white/70">Tempo alocado:</span>
            <span className="font-semibold text-white">{totalAllocatedTime} min</span>
            <span className="text-white/40">/</span>
            <span className="text-white/70">{maxMinutes} min</span>
            {remainingTime > 0 && (
              <span className="text-xs text-amarelo-ouro ml-2">
                ({remainingTime} min disponíveis)
              </span>
            )}
          </div>
        </motion.div>

        {/* Focus Area Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {focusAreas.map((area) => (
            <FocusAreaCard
              key={area.id}
              area={area}
              isSelected={selectedAreas.has(area.id)}
              timeSpent={areaData[area.id]?.timeSpent || 0}
              selectedDrills={areaData[area.id]?.drills || []}
              customDrills={areaData[area.id]?.customDrills || []}
              maxTime={remainingTime + (areaData[area.id]?.timeSpent || 0)}
              onToggle={() => handleAreaToggle(area.id)}
              onTimeUpdate={(time) => handleTimeUpdate(area.id, time)}
              onDrillToggle={(drillId) => handleDrillToggle(area.id, drillId)}
              onCustomDrill={(drillName) => handleCustomDrill(area.id, drillName)}
            />
          ))}
        </div>


        {/* XP Preview */}
        {selectedAreas.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-white/60"
          >
            Bônus de variedade: +{calculateVarietyBonus(Array.from(selectedAreas))} XP
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TrainingFocusSelector;