import { useEffect, useRef, useState } from 'react';
import { Howl, Howler } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SoundControllerProps {
  variant?: 'stadium' | 'training' | 'celebration' | 'ambient';
  autoPlay?: boolean;
  volume?: number;
}

// Sound library
const sounds = {
  stadium: {
    crowd: 'https://cdn.freesound.org/previews/434/434133_7988874-lq.mp3',
    chant: 'https://cdn.freesound.org/previews/434/434133_7988874-lq.mp3'
  },
  training: {
    whistle: 'https://cdn.freesound.org/previews/362/362875_5381451-lq.mp3',
    ball: 'https://cdn.freesound.org/previews/362/362204_6696210-lq.mp3'
  },
  celebration: {
    fireworks: 'https://cdn.freesound.org/previews/316/316641_5380302-lq.mp3',
    cheer: 'https://cdn.freesound.org/previews/277/277021_4862901-lq.mp3'
  },
  ui: {
    click: 'https://cdn.freesound.org/previews/256/256116_4772965-lq.mp3',
    success: 'https://cdn.freesound.org/previews/277/277403_4176593-lq.mp3'
  }
};

export default function SoundController({ 
  variant = 'ambient', 
  autoPlay = true,
  volume = 0.5 
}: SoundControllerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const ambientRef = useRef<Howl | null>(null);
  const effectsRef = useRef<{ [key: string]: Howl }>({});

  useEffect(() => {
    // Initialize ambient sound based on variant
    let ambientSrc = '';
    
    switch (variant) {
      case 'stadium':
        ambientSrc = sounds.stadium.crowd;
        break;
      case 'training':
        ambientSrc = sounds.training.whistle;
        break;
      case 'celebration':
        ambientSrc = sounds.celebration.cheer;
        break;
    }

    if (ambientSrc) {
      ambientRef.current = new Howl({
        src: [ambientSrc],
        loop: true,
        volume: volume * 0.3,
        autoplay: autoPlay,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false)
      });
    }

    // Initialize UI sound effects
    effectsRef.current.click = new Howl({
      src: [sounds.ui.click],
      volume: volume * 0.5
    });

    effectsRef.current.success = new Howl({
      src: [sounds.ui.success],
      volume: volume * 0.7
    });

    // Set global volume
    Howler.volume(isMuted ? 0 : volume);

    return () => {
      // Cleanup
      ambientRef.current?.unload();
      Object.values(effectsRef.current).forEach(sound => sound.unload());
    };
  }, [variant, autoPlay, volume]);

  useEffect(() => {
    Howler.volume(isMuted ? 0 : volume);
  }, [isMuted, volume]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    playEffect('click');
  };

  const playEffect = (effect: string) => {
    if (effectsRef.current[effect] && !isMuted) {
      effectsRef.current[effect].play();
    }
  };

  // Expose methods for external use
  useEffect(() => {
    window.soundController = {
      playEffect,
      setMuted: setIsMuted,
      setVolume: (v: number) => Howler.volume(v)
    };
  }, []);

  return (
    <>
      {/* Sound control button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.div
              key="muted"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
            >
              <VolumeX className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="unmuted"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound waves animation when playing */}
        {isPlaying && !isMuted && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/40"
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
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/40"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.5, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5
              }}
            />
          </>
        )}
      </motion.button>

      {/* Volume slider (appears on hover) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="fixed bottom-8 right-24 z-40 bg-black/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
      >
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={(e) => {
            const newVolume = parseInt(e.target.value) / 100;
            Howler.volume(isMuted ? 0 : newVolume);
          }}
          className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #FEDF00 0%, #FEDF00 ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`
          }}
        />
      </motion.div>
    </>
  );
}

// Type declaration for global sound controller
declare global {
  interface Window {
    soundController: {
      playEffect: (effect: string) => void;
      setMuted: (muted: boolean) => void;
      setVolume: (volume: number) => void;
    };
  }
}