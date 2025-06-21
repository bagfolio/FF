import React, { createContext, useContext, useEffect, useRef } from 'react';

interface SoundControllerContextValue {
  playSound: (soundName: string) => void;
  stopSound: (soundName: string) => void;
}

const SoundControllerContext = createContext<SoundControllerContextValue | null>(null);

export function SoundControllerProvider({ children }: { children: React.ReactNode }) {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());

  const playSound = (soundName: string) => {
    // Stub implementation
    console.log(`Playing sound: ${soundName}`);
  };

  const stopSound = (soundName: string) => {
    // Stub implementation
    console.log(`Stopping sound: ${soundName}`);
  };

  useEffect(() => {
    // Initialize window.soundController for legacy code
    (window as any).soundController = {
      play: playSound,
      stop: stopSound,
    };

    return () => {
      delete (window as any).soundController;
    };
  }, []);

  return (
    <SoundControllerContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundControllerContext.Provider>
  );
}

export function useSoundController() {
  const context = useContext(SoundControllerContext);
  if (!context) {
    throw new Error('useSoundController must be used within SoundControllerProvider');
  }
  return context;
}

// Component version for enhanced pages
interface SoundControllerProps {
  variant?: string;
  autoPlay?: boolean;
}

export default function SoundController({ variant, autoPlay }: SoundControllerProps) {
  useEffect(() => {
    if (autoPlay && window.soundController) {
      window.soundController.play(variant || 'default');
    }
    
    return () => {
      if (window.soundController) {
        window.soundController.stop(variant || 'default');
      }
    };
  }, [variant, autoPlay]);

  return null;
}