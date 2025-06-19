import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Users, Target, Sparkles, Crown } from "lucide-react";
import BrazilianStadiumScene from "@/components/3d/BrazilianStadiumScene";
import ProgressJourney from "@/components/features/auth/ProgressJourney";
import SoundController from "@/components/features/auth/SoundController";
import CulturalTooltips from "@/components/features/auth/CulturalTooltips";
import { Canvas } from '@react-three/fiber';
import { Text, Float, Sparkles as Sparkles3D } from '@react-three/drei';

// 3D Trophy Component
function Trophy3D() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Trophy base */}
        <mesh position={[0, -1, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1, 0.5, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Trophy stem */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Trophy cup */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Trophy handles */}
        <mesh position={[-1, 0.3, 0]} rotation={[0, 0, -0.5]} castShadow>
          <torusGeometry args={[0.3, 0.1, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1, 0.3, 0]} rotation={[0, 0, 0.5]} castShadow>
          <torusGeometry args={[0.3, 0.1, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Stars around trophy */}
        <Sparkles3D count={50} scale={3} size={2} speed={0.5} color="#FFD700" />
        
        {/* "Campeão" text */}
        <Text
          position={[0, -1.5, 0.5]}
          fontSize={0.3}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bebas-neue-v9-latin-regular.woff"
        >
          CAMPEÃO
        </Text>
      </group>
    </Float>
  );
}

export default function AuthCompleteEnhanced() {
  const [, setLocation] = useLocation();
  const [showStadium, setShowStadium] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [fireworksCount, setFireworksCount] = useState(0);

  useEffect(() => {
    // Staged reveal sequence
    const timer1 = setTimeout(() => setShowStadium(true), 500);
    const timer2 = setTimeout(() => setShowTrophy(true), 2000);
    const timer3 = setTimeout(() => setShowDashboard(true), 3000);
    
    // Initial celebration
    const timer4 = setTimeout(() => {
      triggerBrazilianCelebration();
      if (window.soundController) {
        window.soundController.playEffect('success');
      }
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const triggerBrazilianCelebration = () => {
    const colors = ['#009B3A', '#FEDF00', '#002776', '#FFFFFF'];
    const gravity = 0.3;
    const burst = 100;
    
    // Center burst
    confetti({
      particleCount: burst,
      spread: 360,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
      gravity: gravity,
      scalar: 1.2,
      shapes: ['circle', 'square']
    });

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: burst / 2,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.7 },
        colors: colors,
        gravity: gravity
      });
      
      confetti({
        particleCount: burst / 2,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.7 },
        colors: colors,
        gravity: gravity
      });
    }, 250);

    // Top burst
    setTimeout(() => {
      confetti({
        particleCount: burst * 2,
        angle: 90,
        spread: 120,
        origin: { x: 0.5, y: 0.9 },
        colors: colors,
        gravity: gravity * 0.5,
        scalar: 1.5,
        drift: 0
      });
    }, 500);

    setFireworksCount(prev => prev + 1);
  };

  const handleEnterDashboard = () => {
    triggerBrazilianCelebration();
    setTimeout(() => {
      setLocation("/athlete/dashboard");
    }, 1000);
  };

  const savedData = {
    position: JSON.parse(localStorage.getItem("authPosition") || "{}"),
    profile: JSON.parse(localStorage.getItem("authProfile") || "{}"),
    skills: JSON.parse(localStorage.getItem("authSkills") || "{}")
  };

  const overallScore = Object.values(savedData.skills as Record<string, number>).reduce((sum, score) => sum + score, 0) / Object.keys(savedData.skills).length || 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Stadium Scene with Finale Variant */}
      <AnimatePresence>
        {showStadium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            <BrazilianStadiumScene variant="field" intensity={1.2} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Progress Journey - Complete */}
      <div className="relative z-20">
        <ProgressJourney currentStep={4} />
      </div>

      {/* Sound Controller */}
      <SoundController variant="celebration" autoPlay={showTrophy} />

      {/* Cultural Tooltips */}
      <CulturalTooltips page="complete" />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Trophy Presentation */}
        <AnimatePresence>
          {showTrophy && (
            <motion.div
              initial={{ scale: 0, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 1.5 
              }}
              className="mb-8"
            >
              <div className="h-64 w-64">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <Trophy3D />
                </Canvas>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Text */}
        <AnimatePresence>
          {showTrophy && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <motion.h1
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.5)",
                    "0 0 40px rgba(255, 215, 0, 0.8)",
                    "0 0 20px rgba(255, 215, 0, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-bebas text-6xl md:text-8xl text-white mb-4 tracking-wider"
              >
                PARABÉNS, CRAQUE!
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="font-bebas text-3xl md:text-5xl text-amarelo-ouro tracking-wider mb-4"
              >
                BEM-VINDO AO FUTEBOL FUTURO
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-xl text-white/90 max-w-2xl mx-auto"
              >
                Você completou sua jornada de entrada e agora faz parte da elite do futebol brasileiro digital!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Summary */}
        <AnimatePresence>
          {showDashboard && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl w-full grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {/* Profile Achievement */}
              <Card className="bg-gradient-to-br from-verde-brasil/20 to-verde-brasil/40 backdrop-blur-md border-verde-brasil/50 text-white overflow-hidden group">
                <CardContent className="p-6 text-center relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 text-verde-brasil/20"
                  >
                    <Users className="w-20 h-20" />
                  </motion.div>
                  <div className="relative z-10">
                    <Users className="w-10 h-10 mx-auto mb-3 text-verde-brasil" />
                    <h3 className="font-bebas text-xl mb-1">PERFIL ELITE</h3>
                    <p className="text-sm opacity-90">{savedData.profile.fullName || "Atleta"}</p>
                    <p className="text-xs opacity-70 mt-1">{savedData.profile.city}, {savedData.profile.state}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Position Achievement */}
              <Card className="bg-gradient-to-br from-azul-celeste/20 to-azul-celeste/40 backdrop-blur-md border-azul-celeste/50 text-white overflow-hidden group">
                <CardContent className="p-6 text-center relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 text-azul-celeste/20"
                  >
                    <Target className="w-20 h-20" />
                  </motion.div>
                  <div className="relative z-10">
                    <Target className="w-10 h-10 mx-auto mb-3 text-azul-celeste" />
                    <h3 className="font-bebas text-xl mb-1">POSIÇÃO DEFINIDA</h3>
                    <p className="text-sm opacity-90">{savedData.position.name} #{savedData.position.number}</p>
                    <p className="text-xs opacity-70 mt-1">Como {savedData.position.legend}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Achievement */}
              <Card className="bg-gradient-to-br from-amarelo-ouro/20 to-amarelo-ouro/40 backdrop-blur-md border-amarelo-ouro/50 text-white overflow-hidden group">
                <CardContent className="p-6 text-center relative">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 180, 360],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-4 -right-4 text-amarelo-ouro/20"
                  >
                    <Star className="w-20 h-20" />
                  </motion.div>
                  <div className="relative z-10">
                    <Star className="w-10 h-10 mx-auto mb-3 text-amarelo-ouro" />
                    <h3 className="font-bebas text-xl mb-1">HABILIDADES</h3>
                    <p className="text-sm opacity-90">{Math.round(overallScore)}% Geral</p>
                    <p className="text-xs opacity-70 mt-1">
                      {overallScore >= 80 ? "Nível Elite" : 
                       overallScore >= 60 ? "Promissor" : 
                       "Em Desenvolvimento"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Journey Complete */}
              <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/40 backdrop-blur-md border-purple-600/50 text-white overflow-hidden group">
                <CardContent className="p-6 text-center relative">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 text-purple-600/20"
                  >
                    <Trophy className="w-20 h-20" />
                  </motion.div>
                  <div className="relative z-10">
                    <Trophy className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                    <h3 className="font-bebas text-xl mb-1">JORNADA COMPLETA</h3>
                    <p className="text-sm opacity-90">100% Concluído</p>
                    <p className="text-xs opacity-70 mt-1">Pronto para jogar!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter Dashboard Button */}
        <AnimatePresence>
          {showDashboard && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(255, 215, 0, 0.3)",
                    "0 0 60px rgba(255, 215, 0, 0.6)",
                    "0 0 30px rgba(255, 215, 0, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block rounded-full"
              >
                <Button
                  onClick={handleEnterDashboard}
                  className="relative px-16 py-8 text-2xl font-bebas tracking-wider bg-gradient-to-r from-verde-brasil via-amarelo-ouro to-verde-brasil text-white border-4 border-white/30 rounded-full shadow-2xl overflow-hidden group"
                  onMouseEnter={() => triggerBrazilianCelebration()}
                >
                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <Sparkles className="w-8 h-8" />
                    <span>ENTRAR NO PAINEL DO ATLETA</span>
                    <Crown className="w-8 h-8" />
                  </div>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/80 mt-6 text-lg"
              >
                Acesse estatísticas, conquistas, testes e muito mais!
              </motion.p>

              {/* Next Steps Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
              >
                {[
                  { icon: "📊", text: "Veja suas estatísticas" },
                  { icon: "🎯", text: "Faça novos testes" },
                  { icon: "🏆", text: "Conquiste medalhas" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.7 + index * 0.1, type: "spring" }}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-xs text-white/80">{item.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fireworks Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 4 }}
          onClick={triggerBrazilianCelebration}
          className="fixed bottom-8 left-8 text-white/60 hover:text-white/80 transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🎆</span>
          <span className="text-sm">Mais fogos! ({fireworksCount})</span>
        </motion.button>
      </div>

      {/* Stadium Crowd Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-10"
      >
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-gradient-to-t from-amarelo-ouro to-verde-brasil"
              style={{ height: `${20 + Math.random() * 30}px` }}
              animate={{
                height: [`${20 + Math.random() * 30}px`, `${30 + Math.random() * 40}px`, `${20 + Math.random() * 30}px`],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}