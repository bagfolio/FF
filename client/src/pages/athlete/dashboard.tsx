import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateRealisticAthlete, generateActivity } from "@/lib/brazilianData";
import { User, Trophy, TrendingUp, Eye, Play, Star, Crown } from "lucide-react";

export default function AthleteDashboard() {
  const [, setLocation] = useLocation();
  
  // Dados realistas do atleta
  const [athleteData] = useState(() => generateRealisticAthlete());
  const [activities] = useState(() => Array.from({ length: 5 }, () => generateActivity()));
  const [profileCompletion, setProfileCompletion] = useState(75);

  useEffect(() => {
    // Animação do progresso do perfil
    const timer = setTimeout(() => {
      setProfileCompletion(Math.min(profileCompletion + 5, 100));
    }, 2000);
    return () => clearTimeout(timer);
  }, [profileCompletion]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header do Atleta - Responsivo */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 p-4 sm:p-6 bg-white rounded-2xl shadow-lg">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center shadow-lg mx-auto sm:mx-0">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h1 className="font-bebas text-2xl sm:text-3xl lg:text-4xl azul-celeste truncate">{athleteData.fullName}</h1>
            <p className="text-gray-600 text-sm sm:text-lg">{athleteData.position} • {athleteData.team}</p>
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-2">
              <Badge className="bg-green-100 text-green-700 text-xs sm:text-sm">{athleteData.verificationLevel}</Badge>
              <span className="text-xs sm:text-sm text-gray-500">{athleteData.city}, {athleteData.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas - Mobile Responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Testes</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold azul-celeste flex items-center gap-1 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>3</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">+2 este mês</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Views</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold azul-celeste flex items-center gap-1 sm:gap-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{athleteData.profileViews}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">+{Math.floor(athleteData.profileViews * 0.15)} semana</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Percentil</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold verde-brasil flex items-center gap-1 sm:gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{athleteData.percentile}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Top {100 - athleteData.percentile}%</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-yellow-50">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Conquistas</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold amarelo-ouro flex items-center gap-1 sm:gap-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>5</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">2 próximas</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal - Responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Combine Digital */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-2xl azul-celeste">COMBINE DIGITAL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 bg-gradient-to-r from-green-50 to-transparent transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">Teste de Velocidade 20m</h4>
                        <Badge className="bg-green-100 text-green-700 text-xs">RECOMENDADO</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Medição de aceleração e velocidade máxima</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          3-5 min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Fácil
                        </span>
                      </div>
                    </div>
                    <Button className="btn-primary">
                      <Play className="w-4 h-4 mr-2" />
                      Realizar
                    </Button>
                  </div>
                </div>

                <div className="p-6 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 bg-gradient-to-r from-yellow-50 to-transparent transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">Teste de Agilidade 5-10-5</h4>
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">NOVO</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Avalia mudanças de direção e coordenação</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          5-7 min
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          <Star className="w-3 h-3" />
                          Médio
                        </span>
                      </div>
                    </div>
                    <Button className="btn-primary">
                      <Play className="w-4 h-4 mr-2" />
                      Realizar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* Progresso do Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-xl azul-celeste">PROGRESSO DO PERFIL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold verde-brasil mb-2">{profileCompletion}%</div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-verde-brasil h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">Complete seu perfil para aumentar sua visibilidade</p>
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bebas text-xl azul-celeste">ATIVIDADE RECENTE</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}