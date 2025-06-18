import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VerificationBadge from "@/components/ui/verification-badge";
import { Zap, Video, Play, Clock, Sparkles, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface Test {
  id: string;
  name: string;
  type: string;
  bestScore?: string;
  verified?: boolean;
  completed?: boolean;
  difficulty: 1 | 2 | 3;
  duration: string;
  isNew?: boolean;
  isRecommended?: boolean;
}

interface CombineDigitalHubProps {
  tests: any[];
}

const availableTests: Test[] = [
  {
    id: "speed_20m",
    name: "Teste de Velocidade 20m",
    type: "speed",
    bestScore: "2.76s",
    verified: true,
    completed: true,
    difficulty: 1,
    duration: "3-5 min",
    isRecommended: true
  },
  {
    id: "agility_5_10_5",
    name: "Teste de Agilidade 5-10-5",
    type: "agility",
    verified: false,
    completed: false,
    difficulty: 2,
    duration: "5-7 min",
    isNew: true
  },
  {
    id: "technical_juggling",
    name: "Teste Técnico - Embaixadinhas",
    type: "technical",
    bestScore: "87",
    verified: true,
    completed: true,
    difficulty: 2,
    duration: "5 min"
  },
  {
    id: "endurance_yo_yo",
    name: "Teste de Resistência Yo-Yo",
    type: "endurance",
    verified: false,
    completed: false,
    difficulty: 3,
    duration: "10-15 min"
  }
];

export function CombineDigitalHub({ tests }: CombineDigitalHubProps) {
  const [, setLocation] = useLocation();
  
  const getTestColor = (type: string) => {
    const colors = {
      speed: "from-green-100 to-green-200",
      agility: "from-yellow-100 to-yellow-200",
      technical: "from-blue-100 to-blue-200",
      endurance: "from-purple-100 to-purple-200"
    };
    return colors[type as keyof typeof colors] || colors.speed;
  };

  const getTestIconColor = (type: string) => {
    const colors = {
      speed: "text-green-600",
      agility: "text-yellow-600",
      technical: "text-blue-600",
      endurance: "text-purple-600"
    };
    return colors[type as keyof typeof colors] || colors.speed;
  };

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 relative overflow-hidden border-b-2 border-blue-200">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent transform -translate-x-full animate-shimmer" />
        <CardTitle className="tracking-tight font-bebas text-2xl flex items-center justify-between text-azul-celeste font-medium relative z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 animate-pulse" />
            COMBINE DIGITAL
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-azul-celeste/10 px-3 py-1 rounded-full text-sm font-normal flex items-center gap-1 text-azul-celeste">
              <span className="font-bold">{availableTests.filter(t => !t.completed).length}</span>
              testes disponíveis
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-azul-celeste hover:bg-azul-celeste/10"
              onClick={() => setLocation('/athlete/combine')}
            >
              Ver Todos
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTests.map((test) => (
            <div key={test.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-xl border-2 border-transparent hover:border-verde-brasil transition-all duration-300 transform hover:scale-[1.02]">
                <div className={`aspect-video bg-gradient-to-br ${getTestColor(test.type)} flex items-center justify-center`}>
                  <Video className={`w-16 h-16 ${getTestIconColor(test.type)}`} />
                </div>
                
                {/* Progress Ring for Completed Test */}
                {test.completed && (
                  <div className="absolute top-4 left-4">
                    <div className="relative w-16 h-16">
                      <svg className="transform -rotate-90 w-16 h-16">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#10b981" strokeWidth="4"
                          strokeDasharray="175.93" strokeDashoffset="44" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-green-600">75%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 right-4 space-y-2">
                  {test.verified && (
                    <VerificationBadge level="silver" size="sm" />
                  )}
                  {test.isRecommended && (
                    <Badge className="bg-verde-brasil text-white animate-pulse">RECOMENDADO</Badge>
                  )}
                  {test.isNew && (
                    <Badge className="bg-red-500 text-white animate-pulse">NOVO!</Badge>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-semibold text-lg mb-2">{test.name}</h4>
                  
                  {/* Difficulty Stars */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((star) => (
                        <span key={star} className={star <= test.difficulty ? "text-amarelo-ouro" : "text-gray-400"}>
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-xs">
                        {test.difficulty === 1 ? "Fácil" : test.difficulty === 2 ? "Médio" : "Difícil"}
                      </span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.duration}
                    </span>
                  </div>
                  
                  {/* Best Score or Status */}
                  <div className="mt-2 text-xs opacity-80">
                    {test.bestScore ? (
                      <>Seu melhor: <span className="font-bold">{test.bestScore}</span></>
                    ) : (
                      "Não realizado ainda"
                    )}
                  </div>
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <Play className="w-7 h-7 text-verde-brasil ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-900">Recomendação da IA</p>
              <p className="text-sm text-purple-700 mt-1">
                Baseado no seu último teste, recomendamos o Teste de Agilidade para melhorar seu perfil.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}