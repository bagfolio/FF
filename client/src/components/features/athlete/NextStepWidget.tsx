import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Zap, Flame } from "lucide-react";

interface NextStepWidgetProps {
  profileCompletion: number;
  tests: any[];
}

export function NextStepWidget({ profileCompletion, tests }: NextStepWidgetProps) {
  const [, setLocation] = useLocation();

  // Dynamic content logic based on user progress
  if (profileCompletion < 100) {
    return (
      <Card className="relative overflow-hidden border-2 border-amarelo-ouro shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-amarelo-ouro/10 to-orange-500/10" />
        <CardContent className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-amarelo-ouro/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-8 h-8 text-amarelo-ouro" />
            </div>
            <div className="flex-1">
              <h2 className="font-bebas text-3xl text-gray-900 mb-3">
                PRIMEIRO PASSO: COMPLETE SEU PERFIL
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Seu perfil está incompleto. Preencha todas as suas informações para desbloquear o Combine Digital e ser visto por scouts.
              </p>
              <Button 
                size="lg"
                className="bg-amarelo-ouro hover:bg-yellow-500 text-gray-900 font-bold shadow-lg transform hover:scale-105 transition-all"
                onClick={() => setLocation('/athlete/onboarding')}
              >
                Completar Perfil Agora
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="relative overflow-hidden border-2 border-verde-brasil shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil/10 to-green-600/10" />
        <CardContent className="relative z-10 p-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-verde-brasil/20 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
              <Zap className="w-8 h-8 text-verde-brasil" />
            </div>
            <div className="flex-1">
              <h2 className="font-bebas text-3xl text-gray-900 mb-3">
                HORA DE BRILHAR: REALIZE SEU PRIMEIRO TESTE!
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Você está pronto! Realize o Teste de Velocidade 20m para verificar suas métricas, ativar seu ranking nacional e aparecer nas buscas dos olheiros.
              </p>
              <Button 
                size="lg"
                className="bg-verde-brasil hover:bg-green-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all"
                onClick={() => {}}
              >
                Realizar Teste de Velocidade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Daily Challenge for users with complete profile and tests
  return (
    <Card className="relative overflow-hidden border-2 border-orange-500 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
      <CardContent className="relative z-10 p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-bebas text-3xl text-gray-900 mb-3">
              DESAFIO DO DIA 🔥
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Complete 100 toques sem deixar cair para ganhar 200 XP e uma badge exclusiva!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg transform hover:scale-105 transition-all"
              onClick={() => {}}
            >
              Aceitar Desafio
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}