import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AuthWelcome() {
  const [, setLocation] = useLocation();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleStart = () => {
    setIsButtonClicked(true);
    setTimeout(() => {
      setLocation("/auth/position");
    }, 1200);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Video Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />
        
        {/* Animated stadium lights */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"
          animate={{
            y: [0, 100, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Stadium background image with parallax effect */}
        <motion.div
          className="absolute inset-0 opacity-40"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
        />
      </div>
      {/* Animated grass particles */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-20">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1 bg-gradient-to-t from-green-600 to-green-400"
            style={{
              left: `${(i * 100) / 30}%`,
              height: `${80 + Math.random() * 40}px`
            }}
            animate={{
              x: [0, Math.random() * 20 - 10, 0],
              scaleY: [1, 1.1, 1]
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
      {/* Main Content */}
      <div className="relative z-30 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="font-bebas text-7xl md:text-9xl text-white mb-4 tracking-wider relative"
            initial={{ letterSpacing: "0.5em", opacity: 0 }}
            animate={{ letterSpacing: "0.1em", opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            REVELA
            {/* Gold shimmer effect */}
            <motion.span
              className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                WebkitTextStroke: "1px rgba(255, 215, 0, 0.3)",
                backgroundSize: "200% 100%"
              }}
            >REVELA</motion.span>
          </motion.h1>
          
          <motion.h2
            className="font-bebas text-5xl md:text-7xl text-amarelo-ouro mb-6 tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            FUTEBOL
          </motion.h2>
          
          <motion.p
            className="text-white/90 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            A revolução do futebol brasileiro começa aqui.
            <br />
            <span className="text-amarelo-ouro font-bold">
              Transforme seu talento em oportunidade.
            </span>
          </motion.p>
        </motion.div>

        {/* Enhanced Football Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5, type: "spring", stiffness: 100 }}
          className="relative mb-8"
        >
          {/* Glow effect behind ball */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-verde-brasil to-amarelo-ouro rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Football Button */}
          <motion.div
            animate={isButtonClicked ? {
              x: [0, 400, 800],
              y: [0, -150, -50],
              rotate: [0, 720, 1440],
              scale: [1, 1.2, 0.5]
            } : {
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={isButtonClicked ? {
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            } : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button
              onClick={handleStart}
              disabled={isButtonClicked}
              className="relative w-40 h-40 rounded-full bg-gradient-to-br from-white to-gray-200 hover:from-gray-100 hover:to-white transition-all duration-300 shadow-2xl hover:shadow-verde-brasil/50 hover:scale-110 disabled:opacity-50 group"
            >
              {/* Soccer ball pattern */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="soccer" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <polygon points="15,3 25,10 22,20 8,20 5,10" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <circle cx="50" cy="50" r="48" fill="url(#soccer)" opacity="0.8"/>
                </svg>
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/50 via-white/20 to-transparent" />
              
              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="text-5xl mb-2"
                >
                  ⚽
                </motion.div>
                <span className="font-bebas text-lg tracking-wider opacity-80">CHUTAR</span>
              </div>
            </Button>
          </motion.div>

          {/* Kick particles */}
          {isButtonClicked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 80, y: 80 }}
                  animate={{
                    x: 80 + Math.cos(i * 24 * Math.PI / 180) * 200,
                    y: 80 + Math.sin(i * 24 * Math.PI / 180) * 200,
                    opacity: [1, 0],
                    scale: [1, 0.3]
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className="absolute w-3 h-3 bg-gradient-to-r from-amarelo-ouro to-verde-brasil rounded-full"
                />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-white/80 text-center font-medium text-lg"
        >
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            👇
          </motion.span>
          {" "}Chute a bola para entrar no estádio
        </motion.p>

        {/* Brazilian flag accent */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2.5 }}
        >
          <div className="w-16 h-2 bg-verde-brasil rounded" />
          <div className="w-16 h-2 bg-amarelo-ouro rounded" />
          <div className="w-16 h-2 bg-azul-celeste rounded" />
        </motion.div>
      </div>
      {/* Transition overlay */}
      {isButtonClicked && (
        <motion.div
          className="fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        />
      )}
    </div>
  );
}