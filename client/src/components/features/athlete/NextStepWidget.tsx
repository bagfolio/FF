import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Zap, Flame, Clock, Sparkles, ArrowRight, Users } from "lucide-react";
import { useState, useEffect } from "react";

interface NextStepWidgetProps {
  profileCompletion: number;
  tests: any[];
}

export function NextStepWidget({ profileCompletion, tests }: NextStepWidgetProps) {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [isHovered, setIsHovered] = useState(false);

  // Countdown timer for daily challenges
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Dynamic content logic based on user progress
  if (profileCompletion < 100) {
    return (
      <Card 
        className="relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-laranja-destaque to-amarelo-ouro" />
        <div className={`absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-500/20 transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-4 w-2 h-2 bg-amarelo-ouro/40 rounded-full animate-float" />
          <div className="absolute top-8 right-8 w-3 h-3 bg-orange-500/40 rounded-full animate-float-delayed" />
          <div className="absolute bottom-4 left-1/3 w-2 h-2 bg-amarelo-ouro/40 rounded-full animate-float" />
        </div>
        
        <CardContent className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bebas text-3xl text-gray-900 mb-3">
                PRIMEIRO PASSO: COMPLETE SEU PERFIL
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-orange-700 animate-pulse" />
                <span className="text-sm text-orange-700 font-semibold">Ação Necessária</span>
              </div>
              <p className="text-lg text-gray-800 mb-6">
                Seu perfil está incompleto. Preencha todas as suas informações para desbloquear o Combine Digital e ser visto por scouts.
              </p>
              <Button 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg transform hover:scale-105 transition-all group/btn"
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
        className="relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-laranja-destaque to-amarelo-ouro" />
        <div className={`absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-500/20 transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
        
        {/* Urgent badge */}
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          NOVO!
        </div>
        
        <CardContent className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bebas text-3xl text-gray-900 mb-3">
                HORA DE BRILHAR: REALIZE SEU PRIMEIRO TESTE!
              </h2>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-700" />
                  <span className="text-sm text-orange-700 font-semibold">5 min apenas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-700" />
                  <span className="text-sm text-orange-700 font-semibold">247 atletas fizeram hoje</span>
                </div>
              </div>
              <p className="text-lg text-gray-800 mb-6">
                Você está pronto! Realize o Teste de Velocidade 20m para verificar suas métricas, ativar seu ranking nacional e aparecer nas buscas dos olheiros.
              </p>
              <Button 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg transform hover:scale-105 transition-all group/btn relative overflow-hidden"
                onClick={() => {}}
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
      className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-laranja-destaque to-amarelo-ouro" />
      <div className={`absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-500/20 transform transition-transform duration-700 ${isHovered ? 'translate-x-0' : '-translate-x-full'}`} />
      
      {/* Timer badge */}
      <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
        <Clock className="w-3 h-3" />
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </div>
      
      <CardContent className="relative z-10 p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-bebas text-3xl text-gray-900 mb-3 flex items-center gap-2">
              DESAFIO DO DIA <span className="text-4xl animate-bounce">🔥</span>
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-2 py-1 bg-gray-900/10 text-gray-900 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                200 XP + Badge Exclusiva
              </div>
            </div>
            <p className="text-lg text-gray-800 mb-6">
              Complete 100 toques sem deixar cair para ganhar 200 XP e uma badge exclusiva!
            </p>
            <Button 
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold shadow-lg transform hover:scale-105 transition-all group/btn relative overflow-hidden"
              onClick={() => {}}
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