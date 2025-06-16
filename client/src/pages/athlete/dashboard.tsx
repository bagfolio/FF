import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import EmptyState from "@/components/ui/empty-state";
import { DashboardStatsSkeleton, ActivityFeedSkeleton, ProfileCompletionSkeleton } from "@/components/ui/skeleton-loader";
import { generateRealisticAthlete, generateActivity, achievements } from "@/lib/brazilianData";
import { User, Trophy, TrendingUp, Eye, Play, Medal, Star, Crown, Check } from "lucide-react";
import TrustPyramid from "@/components/ui/trust-pyramid";
import VerificationBadge from "@/components/ui/verification-badge";

export default function AthleteDashboard() {
  const [, setLocation] = useLocation();
  
  // Use mock data instead of API calls
  const athlete = generateRealisticAthlete();
  const tests = []; // Mock empty tests array
  const isLoading = false;

  // Generate realistic data
  const [realisticStats, setRealisticStats] = useState(() => generateRealisticAthlete());
  const [activities, setActivities] = useState(() => 
    Array.from({ length: 5 }, () => generateActivity())
  );
  const [profileCompletion, setProfileCompletion] = useState(65);

  useEffect(() => {
    // Animate profile completion
    const timer = setTimeout(() => {
      setProfileCompletion(Math.min(profileCompletion + 5, 100));
    }, 2000);
    return () => clearTimeout(timer);
  }, [profileCompletion]);

  const verificationLevel = (athlete.verificationLevel || realisticStats.verificationLevel) as "bronze" | "silver" | "gold" | "platinum";

  // Always show the dashboard since we're using mock data
  if (false) {
    return (
      <div className="min-h-screen bg-cinza-claro">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <Card className="max-w-md mx-auto shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="font-bebas text-3xl azul-celeste mb-4">Complete Seu Perfil</h2>
              <p className="text-gray-600 mb-8">
                Para acessar o dashboard, você precisa completar seu perfil de atleta.
              </p>
              <Button 
                className="btn-primary px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200" 
                onClick={() => setLocation("/athlete/onboarding")}
              >
                Completar Perfil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-300">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="font-bebas text-4xl azul-celeste">{athlete.fullName || realisticStats.fullName}</h1>
              <p className="text-gray-600 text-lg">{athlete.position || realisticStats.position} • {athlete.team || realisticStats.team}</p>
              <div className="mt-2 flex items-center gap-2">
                <VerificationBadge level={verificationLevel} />
                <span className="text-sm text-gray-500">{athlete.city || realisticStats.city}, {athlete.state || realisticStats.state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Testes Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold azul-celeste animate-count-up">{tests?.length || 3}</div>
                <p className="text-xs text-gray-500 mt-1">+2 este mês</p>
              </CardContent>
            </Card>

            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Visualizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold azul-celeste flex items-center gap-2">
                  <Eye className="w-5 h-5 animate-pulse-slow" />
                  <span className="animate-count-up">{realisticStats.profileViews}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">+{Math.floor(realisticStats.profileViews * 0.15)} esta semana</p>
              </CardContent>
            </Card>

            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Percentil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold verde-brasil flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 animate-bounce-slow" />
                  <span className="animate-count-up">{realisticStats.percentile}%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Top {100 - realisticStats.percentile}% nacional</p>
              </CardContent>
            </Card>

            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conquistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold amarelo-ouro flex items-center gap-2">
                  <Trophy className="w-5 h-5 animate-pulse-slow" />
                  <span className="animate-count-up">{achievements.filter(a => Math.random() > 0.5).length}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">2 próximas disponíveis</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Combine Digital */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-2xl azul-celeste">COMBINE DIGITAL</CardTitle>
              </CardHeader>
              <CardContent>
                {tests?.length === 0 ? (
                  <EmptyState 
                    type="no-tests"
                    action={{
                      label: "Fazer Primeiro Teste",
                      onClick: () => console.log("Navigate to test")
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 bg-gradient-to-r from-green-50 to-transparent transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">Teste de Velocidade 20m</h4>
                            <Badge className="bg-green-100 text-green-700 text-xs">RECOMENDADO</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Medição de aceleração e velocidade máxima</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              3-5 min
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Fácil
                            </span>
                          </div>
                        </div>
                        <Button className="btn-primary group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
                          <Play className="w-4 h-4 mr-2" />
                          Realizar
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 bg-gradient-to-r from-yellow-50 to-transparent transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">Teste de Agilidade 5-10-5</h4>
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs">NOVO</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Avalia mudanças de direção e coordenação</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              5-7 min
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              <Star className="w-3 h-3" />
                              Médio
                            </span>
                          </div>
                        </div>
                        <Button className="btn-primary group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
                          <Play className="w-4 h-4 mr-2" />
                          Realizar
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 bg-gradient-to-r from-blue-50 to-transparent transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg group cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">Habilidades Técnicas</h4>
                            <Badge className="bg-blue-100 text-blue-700 text-xs">AVANÇADO</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Controle de bola, chutes e passes com precisão</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              10-15 min
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              <Star className="w-3 h-3" />
                              <Star className="w-3 h-3" />
                              Difícil
                            </span>
                          </div>
                        </div>
                        <Button className="btn-primary group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
                          <Play className="w-4 h-4 mr-2" />
                          Realizar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Trust Pyramid */}
            <Card className="relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">PIRÂMIDE DA CONFIANÇA</CardTitle>
              </CardHeader>
              <CardContent>
                <TrustPyramid 
                  currentLevel={verificationLevel}
                  showLabels={true}
                  interactive={true}
                  className="max-w-sm mx-auto"
                />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">ATIVIDADE RECENTE</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <EmptyState type="no-activity" className="py-8" />
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const iconConfig = {
                        view: { bg: "bg-gradient-to-br from-verde-brasil to-green-600", icon: Eye },
                        achievement: { bg: "bg-gradient-to-br from-amarelo-ouro to-yellow-600", icon: Trophy },
                        test: { bg: "bg-gradient-to-br from-azul-celeste to-blue-700", icon: Play },
                        update: { bg: "bg-gradient-to-br from-purple-500 to-purple-700", icon: TrendingUp },
                        rank: { bg: "bg-gradient-to-br from-orange-500 to-red-600", icon: TrendingUp }
                      };
                      
                      const config = iconConfig[activity.type] || iconConfig.update;
                      const Icon = config.icon;
                      
                      return (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                            opacity: 0
                          }}
                        >
                          <div className={`w-10 h-10 ${config.bg} rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 group-hover:text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="mt-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">COMPLETAR PERFIL</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ProfileCompletionSkeleton />
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Dados básicos
                      </span>
                      <span className="text-green-500 font-semibold">✓</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                      <span>Foto de perfil</span>
                      <span className="text-gray-400 group-hover:text-verde-brasil transition-colors">Adicionar</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                      <span>Primeiro teste</span>
                      <span className="text-gray-400 group-hover:text-verde-brasil transition-colors">Pendente</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Vídeo de apresentação
                      </span>
                      <span className="text-green-500 font-semibold">✓</span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-600">Progresso do Perfil</span>
                        <span className="font-semibold verde-brasil">{profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-verde-brasil to-green-500 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{ width: `${profileCompletion}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {profileCompletion === 100 ? "Perfil completo! 🎉" : `Faltam ${100 - profileCompletion}% para completar`}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add animations CSS
if (typeof document !== 'undefined' && !document.querySelector('#dashboard-animations')) {
  const style = document.createElement('style');
  style.id = 'dashboard-animations';
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes count-up {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    
    .animate-count-up {
      animation: count-up 0.5s ease-out;
    }
    
    .animate-pulse-slow {
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-bounce-slow {
      animation: bounce 2s infinite;
    }
    
    .animate-shimmer {
      animation: shimmer 2s infinite;
    }
    
    .fade-in {
      animation: fadeInUp 0.6s ease-out;
    }
  `;
  document.head.appendChild(style);
}
