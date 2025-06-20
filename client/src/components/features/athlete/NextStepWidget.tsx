import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Zap, Flame, Clock, Sparkles, ArrowRight, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NextStepWidgetProps {
  profileCompletion: number;
  tests: any[];
}

export function NextStepWidget({ profileCompletion, tests }: NextStepWidgetProps) {
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate time left until midnight (daily reset)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Dynamic content logic based on user progress
  if (profileCompletion < 100) {
    return (
      <Card 
        className="relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-laranja-destaque/10 to-amarelo-ouro/10" />
        <div className={`absolute inset-0 bg-gradient-to-r from-orange-600/5 to-yellow-500/5 transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 left-4 w-2 h-2 bg-amarelo-ouro rounded-full"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-8 right-8 w-3 h-3 bg-orange-500 rounded-full"
          />
        </div>
        
        <CardContent className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-laranja-destaque to-amarelo-ouro rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-laranja-destaque/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bebas text-3xl text-white mb-3">
                PRIMEIRO PASSO: COMPLETE SEU PERFIL
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amarelo-ouro animate-pulse" />
                <span className="text-sm text-amarelo-ouro font-semibold">Ação Necessária</span>
              </div>
              <p className="text-lg text-white/80 mb-6">
                Seu perfil está incompleto. Preencha todas as suas informações para desbloquear o Combine Digital e ser visto por scouts.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white font-bold shadow-lg shadow-verde-brasil/20 transform hover:scale-105 transition-all group/btn"
                onClick={() => setLocation('/athlete/onboarding')}
              >
                <span className="flex items-center gap-2">
                  Completar Perfil Agora
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tests.length === 0) {
    return (
      <Card 
        className="relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-verde-brasil/10 to-azul-celeste/10" />
        <div className={`absolute inset-0 bg-gradient-to-r from-verde-brasil/5 to-azul-celeste/5 transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
        
        {/* Urgent badge */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
        >
          NOVO!
        </motion.div>
        
        <CardContent className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-16 h-16 bg-gradient-to-br from-verde-brasil to-azul-celeste rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-verde-brasil/30"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <div className="flex-1">
              <h2 className="font-bebas text-3xl text-white mb-3">
                HORA DE BRILHAR: REALIZE SEU PRIMEIRO TESTE!
              </h2>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-verde-brasil" />
                  <span className="text-sm text-verde-brasil font-semibold">5 min apenas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-verde-brasil" />
                  <span className="text-sm text-verde-brasil font-semibold">Comece agora</span>
                </div>
              </div>
              <p className="text-lg text-white/80 mb-6">
                Você está pronto! Realize o Teste de Velocidade 20m para verificar suas métricas, ativar seu ranking nacional e aparecer nas buscas dos olheiros.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white font-bold shadow-lg shadow-verde-brasil/20 transform hover:scale-105 transition-all group/btn relative overflow-hidden"
                onClick={() => setLocation('/athlete/combine')}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Realizar Teste de Velocidade
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Daily Challenge for users with complete profile and tests
  return (
    <Card 
      className="relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10" />
      <div className={`absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-500/5 transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
      
      {/* Timer badge */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20">
        <Clock className="w-3 h-3" />
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </div>
      
      <CardContent className="relative z-10 p-8">
        <div className="flex items-start gap-6">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30"
          >
            <Flame className="w-8 h-8 text-white" />
          </motion.div>
          <div className="flex-1">
            <h2 className="font-bebas text-3xl text-white mb-3 flex items-center gap-2">
              DESAFIO DO DIA <span className="text-4xl animate-bounce">🔥</span>
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-1 bg-white/10 backdrop-blur-md text-amarelo-ouro rounded-full text-xs font-semibold flex items-center gap-1 border border-amarelo-ouro/20">
                <Sparkles className="w-3 h-3" />
                200 XP + Badge Exclusiva
              </div>
            </div>
            <p className="text-lg text-white/80 mb-6">
              Complete o desafio diário para ganhar XP e subir no ranking!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-500/20 transform hover:scale-105 transition-all group/btn relative overflow-hidden"
              onClick={() => setLocation('/athlete/combine')}
            >
              <span className="relative z-10 flex items-center gap-2">
                Aceitar Desafio
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}