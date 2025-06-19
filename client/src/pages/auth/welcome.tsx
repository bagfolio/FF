import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AuthWelcome() {
  const [, setLocation] = useLocation();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleStart = () => {
    setIsButtonClicked(true);
    // Add delay for kick animation before transitioning
    setTimeout(() => {
      setLocation("/auth/position");
    }, 1200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-verde-brasil via-amarelo-ouro to-azul-celeste">
      {/* Video Background Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.3'%3E%3Cpath d='M30 0l15 8.66v17.32L30 34.64 15 25.98V8.66z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="font-bebas text-6xl md:text-8xl text-white mb-4 tracking-wider drop-shadow-2xl">
            FUTEBOL
          </h1>
          <h2 className="font-bebas text-4xl md:text-6xl text-amarelo-ouro mb-6 tracking-wider drop-shadow-xl">
            FUTURO
          </h2>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Bem-vindo à revolução do futebol brasileiro. Sua jornada para se tornar o próximo craque da Seleção começa agora.
          </p>
        </motion.div>

        {/* Animated Football Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative"
        >
          {/* Football Button */}
          <motion.div
            animate={isButtonClicked ? {
              x: [0, 300, 600],
              y: [0, -100, -50],
              rotate: [0, 360, 720],
              scale: [1, 1.2, 0.8]
            } : {
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={isButtonClicked ? {
              duration: 1.2,
              ease: "easeOut"
            } : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={handleStart}
              disabled={isButtonClicked}
              className="relative w-32 h-32 rounded-full bg-white text-azul-celeste hover:bg-cinza-claro transition-all duration-300 shadow-2xl border-4 border-azul-celeste hover:border-verde-brasil hover:scale-110 disabled:opacity-50"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="text-4xl mb-1"
                >
                  ⚽
                </motion.div>
                <span className="font-bebas text-sm tracking-wider">
                  COMEÇAR
                </span>
                <span className="font-bebas text-xs tracking-wider">
                  JORNADA
                </span>
              </div>
            </Button>
          </motion.div>

          {/* Particle Trail Effect */}
          {isButtonClicked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 64, 
                    y: 64, 
                    opacity: 1,
                    scale: 1 
                  }}
                  animate={{
                    x: 64 + (Math.random() - 0.5) * 200,
                    y: 64 + (Math.random() - 0.5) * 200,
                    opacity: 0,
                    scale: 0.3
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 bg-amarelo-ouro rounded-full"
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="text-white/80 text-center mt-8 font-medium"
        >
          Clique na bola para começar sua aventura
        </motion.p>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-azul-celeste/50 to-transparent z-10" />
    </div>
  );
}