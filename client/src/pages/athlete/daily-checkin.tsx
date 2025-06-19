import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { MoodSelector } from "@/components/features/athlete/checkin/MoodSelector";
import { IntensityWheel } from "@/components/features/athlete/checkin/IntensityWheel";
import { ReflectionInput } from "@/components/features/athlete/checkin/ReflectionInput";
import { CheckInCelebration } from "@/components/features/athlete/checkin/CheckInCelebration";
import TrainingFocusSelector, { TrainingFocusData } from "@/components/features/athlete/checkin/TrainingFocusSelector";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export interface CheckInData {
  mood: {
    emoji: string;
    label: string;
    value: number;
    color: string;
    xp: number;
  } | null;
  intensity: number;
  trainingFocus: TrainingFocusData | null;
  reflection: string;
  timestamp: Date;
}

const STEPS = ['mood', 'intensity', 'training', 'reflection', 'complete'] as const;
type Step = typeof STEPS[number];

export default function DailyCheckIn() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [checkInData, setCheckInData] = useState<CheckInData>({
    mood: null,
    intensity: 0,
    trainingFocus: null,
    reflection: '',
    timestamp: new Date()
  });

  // Check if user already checked in today
  const { data: todayCheckIn } = useQuery({
    queryKey: ['/api/checkin/today'],
    queryFn: async () => {
      // This would fetch from your API
      const today = new Date().toDateString();
      const saved = localStorage.getItem('lastCheckIn');
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Date(parsed.timestamp).toDateString() === today ? parsed : null;
      }
      return null;
    }
  });

  // Save check-in mutation
  const saveCheckIn = useMutation({
    mutationFn: async (data: CheckInData) => {
      // In production, this would POST to your API
      localStorage.setItem('lastCheckIn', JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/checkin'] });
      queryClient.invalidateQueries({ queryKey: ['/api/athletes/me'] });
    }
  });

  // Redirect if already checked in today
  useEffect(() => {
    if (todayCheckIn) {
      setLocation('/athlete/dashboard');
    }
  }, [todayCheckIn, setLocation]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    await saveCheckIn.mutateAsync(checkInData);
    setCurrentStep(3); // Show celebration
  };

  const canProceed = () => {
    switch (STEPS[currentStep]) {
      case 'mood':
        return checkInData.mood !== null;
      case 'intensity':
        return checkInData.intensity > 0;
      case 'training':
        return checkInData.trainingFocus !== null && checkInData.trainingFocus.totalAllocatedTime > 0;
      case 'reflection':
        return true; // Reflection is optional
      default:
        return true;
    }
  };

  return (
    <EnhancedAthleteLayout>
      {/* Full-screen container that overlays the layout padding */}
      <div className="fixed inset-0 md:left-0 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden z-30">
        {/* Animated background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        {/* Progress indicator */}
        {currentStep < 4 && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center gap-2">
              {STEPS.slice(0, -1).map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-1 rounded-full transition-all ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-verde-brasil to-amarelo-ouro w-12' 
                      : 'bg-white/20 w-8'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 h-full flex items-center justify-center px-6"
          >
            {currentStep === 0 && (
              <MoodSelector
                selected={checkInData.mood}
                onSelect={(mood) => setCheckInData({ ...checkInData, mood })}
              />
            )}
            {currentStep === 1 && (
              <IntensityWheel
                value={checkInData.intensity}
                onChange={(intensity) => setCheckInData({ ...checkInData, intensity })}
              />
            )}
            {currentStep === 2 && (
              <TrainingFocusSelector
                maxMinutes={checkInData.intensity}
                onComplete={(trainingFocus) => {
                  setCheckInData({ ...checkInData, trainingFocus });
                }}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ReflectionInput
                value={checkInData.reflection}
                onChange={(reflection) => setCheckInData({ ...checkInData, reflection })}
              />
            )}
            {currentStep === 4 && (
              <CheckInCelebration
                checkInData={checkInData}
                onComplete={() => setLocation('/athlete/dashboard')}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {currentStep < 4 && (
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8 z-20">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="mr-2" />
              Voltar
            </Button>

            <Button
              size="lg"
              onClick={currentStep === 3 ? handleComplete : handleNext}
              disabled={!canProceed() || (currentStep === 2 && (!checkInData.trainingFocus || checkInData.trainingFocus.totalAllocatedTime === 0))}
              className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white shadow-lg shadow-verde-brasil/20"
            >
              {currentStep === 2 ? 'Concluir' : 'Próximo'}
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </EnhancedAthleteLayout>
  );
}