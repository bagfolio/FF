import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import BrazilianStadiumScene from "@/components/3d/BrazilianStadiumScene";
import { ProgressJourney } from "@/components/features/auth/ProgressJourney";
import SoundController from "@/components/features/auth/SoundController";
import CulturalTooltips from "@/components/features/auth/CulturalTooltips";
import { Users, Activity } from "lucide-react";

// 3D Football component for the interactive button
function Football3D({ onClick, isKicked }: { onClick: () => void; isKicked: boolean }) {
  return (
    <motion.div
      className="relative cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Football with realistic texture */}
      <motion.div
        animate={isKicked ? {
          x: [0, 600, 1200],
          y: [0, -200, 0],
          rotate: [0, 720, 1440],
          scale: [1, 0.8, 0.5]
        } : {
          rotate: [0, 360],
          y: [0, -10, 0]
        }}
        transition={isKicked ? {
          duration: 1.5,
          ease: "easeOut"
        } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-32 h-32 relative"
      >
        {/* Ball base */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-gray-200 shadow-2xl">
          {/* Pentagon pattern */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="soccer-pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
                <polygon points="12.5,2 20,8 17.5,17 7.5,17 5,8" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#soccer-pattern)" opacity="0.8"/>
          </svg>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-xl"
        animate={isKicked ? {
          scale: [1, 0.5, 0],
          opacity: [0.3, 0.1, 0]
        } : {
          scale: [1, 1.1, 1]
        }}
        transition={isKicked ? {
          duration: 1.5
        } : {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Kick effect particles */}
      <AnimatePresence>
        {isKicked && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(i * 30 * Math.PI / 180) * 150,
                  y: Math.sin(i * 30 * Math.PI / 180) * 150,
                  opacity: 0,
                  scale: [1, 1.5, 0]
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AuthWelcomeEnhanced() {
  const [, setLocation] = useLocation();
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [liveStats, setLiveStats] = useState({ players: 1247, online: 89 });

  useEffect(() => {
    // Simulate live stats updates
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        players: prev.players + Math.floor(Math.random() * 3),
        online: Math.max(50, Math.min(150, prev.online + Math.floor(Math.random() * 7) - 3))
      }));
    }, 5000);

    // Show content after scene loads
    const timer = setTimeout(() => setShowMainContent(true), 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  const handleStart = () => {
    setIsButtonClicked(true);
    if (window.soundController) {
      window.soundController.playEffect('success');
    }
    
    setTimeout(() => {
      setLocation("/auth/position");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* 3D Stadium Background */}
      <BrazilianStadiumScene variant="entrance" intensity={0.8} />

      {/* Progress Journey */}
      <ProgressJourney currentStep={1} totalSteps={4} />

      {/* Sound Controller */}
      <SoundController variant="stadium" />

      {/* Cultural Tooltips */}
      <CulturalTooltips page="welcome" />

      {/* Live Stats Overlay */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showMainContent ? 1 : 0, y: 0 }}
        className="absolute top-32 right-8 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/20"
      >
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-verde-brasil mr-1" />
              <motion.span
                key={liveStats.players}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-bebas text-2xl text-white"
              >
                {liveStats.players.toLocaleString()}
              </motion.span>
            </div>
            <p className="text-xs text-white/60">Atletas Cadastrados</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Activity className="w-4 h-4 text-amarelo-ouro mr-1" />
              <motion.span
                key={liveStats.online}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-bebas text-2xl text-white"
              >
                {liveStats.online}
              </motion.span>
            </div>
            <p className="text-xs text-white/60">Treinando Agora</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence>
        {showMainContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4"
          >
            {/* Title with Stadium Lights Effect */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-12"
            >
              {/* Spotlight effect */}
              <motion.div
                className="absolute -inset-20 bg-gradient-to-b from-yellow-400/20 via-transparent to-transparent blur-3xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.h1
                className="font-bebas text-6xl md:text-8xl lg:text-9xl text-white mb-4 tracking-wider relative"
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.1em", opacity: 1 }}
                transition={{ duration: 1.5 }}
              >
                FUTEBOL
                <motion.span
                  className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-verde-brasil"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    WebkitTextStroke: "2px rgba(255, 255, 255, 0.3)",
                    backgroundSize: "200% 100%"
                  }}
                >
                  FUTEBOL
                </motion.span>
              </motion.h1>

              <motion.h2
                className="font-bebas text-4xl md:text-6xl lg:text-7xl text-amarelo-ouro mb-6 tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                FUTURO
              </motion.h2>

              <motion.p
                className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Entre no maior estádio virtual do Brasil.
                <br />
                <span className="text-amarelo-ouro">Sua jornada rumo ao estrelato começa aqui.</span>
              </motion.p>
            </motion.div>

            {/* Interactive Football Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
              className="relative mb-8"
            >
              <Football3D onClick={handleStart} isKicked={isButtonClicked} />
              
              {/* Pulsing ring around ball */}
              {!isButtonClicked && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-amarelo-ouro/50"
                    animate={{
                      scale: [1, 1.3, 1.3],
                      opacity: [0.5, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-verde-brasil/50"
                    animate={{
                      scale: [1, 1.3, 1.3],
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
            </motion.div>

            {/* Call to Action */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-white/80 text-center font-medium animate-pulse"
            >
              Chute a bola para entrar no estádio
            </motion.p>

            {/* Stadium entrance effect when kicked */}
            <AnimatePresence>
              {isButtonClicked && (
                <motion.div
                  className="fixed inset-0 z-50 bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated grass particles at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1 bg-gradient-to-t from-green-600 to-green-400"
            style={{
              left: `${i * 5}%`,
              height: `${20 + Math.random() * 20}px`
            }}
            animate={{
              x: [0, Math.random() * 10 - 5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
}