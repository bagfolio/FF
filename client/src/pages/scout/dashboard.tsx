import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import EmptyState from "@/components/ui/empty-state";
import { AthleteCardSkeleton, DashboardStatsSkeleton } from "@/components/ui/skeleton-loader";
import { Search, Users, Eye, TrendingUp, Filter, MapPin, Medal, Star, Crown, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import VerificationBadge from "@/components/ui/verification-badge";
import { scoutService } from "@/services/api";
import type { User, ScoutProfile } from "@/types/auth";

export default function ScoutDashboard() {
  const { data: user } = useQuery<User>({ queryKey: ["/api/auth/user"] });
  const { data: scout } = useQuery<ScoutProfile>({ queryKey: ["/api/scouts/me"] });
  const { data: athletes } = useQuery({ queryKey: ["/api/athletes"] });
  const [, setLocation] = useLocation();

  // Fetch real recent athletes instead of mock data
  const { data: recentAthletes = [] } = useQuery({ 
    queryKey: ['recent-athletes'],
    queryFn: () => scoutService.getRecentAthletes(),
    enabled: !!scout
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  // Fetch scout statistics from API
  const { data: scoutStats } = useQuery({ 
    queryKey: ['scout-stats', scout?.id],
    queryFn: () => scoutService.getScoutStats(scout!.id.toString()),
    enabled: !!scout?.id
  });
  
  const [animatedStats, setAnimatedStats] = useState({
    discovered: 0,
    viewed: 0,
    newTalents: 0,
    contacts: 0
  });
  
  useEffect(() => {
    // Animate stats on mount with real data
    if (scoutStats) {
      const timer = setTimeout(() => {
        setAnimatedStats({
          discovered: scoutStats.athletesDiscovered || 0,
          viewed: scoutStats.profilesViewed || 0,
          newTalents: scoutStats.newTalentsThisWeek || 0,
          contacts: scoutStats.contactsMade || 0
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scoutStats]);


  if (!scout) {
    return (
      <div className="min-h-screen bg-cinza-claro">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <h2 className="font-bebas text-2xl azul-celeste mb-4">Complete Seu Perfil de Scout</h2>
              <p className="text-gray-600 mb-6">
                Para acessar o dashboard, você precisa completar seu perfil de scout.
              </p>
              <Button className="btn-primary">Completar Perfil</Button>
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
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bebas text-3xl azul-celeste mb-2">DASHBOARD SCOUT</h1>
              <p className="text-gray-600">{scout?.fullName} - {scout?.club}</p>
            </div>
            <Button 
              onClick={() => setLocation("/scout/search")}
              className="btn-primary"
            >
              <Search className="w-4 h-4 mr-2" />
              Busca Avançada
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {!scout ? (
          <DashboardStatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Atletas Descobertos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold azul-celeste flex items-center gap-2">
                  <Users className="w-5 h-5 animate-pulse-slow" />
                  <span className="animate-count-up">{animatedStats.discovered}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">+3 hoje</p>
              </CardContent>
            </Card>

            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Perfis Visualizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold azul-celeste flex items-center gap-2">
                  <Eye className="w-5 h-5 animate-pulse-slow" />
                  <span className="animate-count-up">{animatedStats.viewed}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">+42 esta semana</p>
              </CardContent>
            </Card>

            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Novos Talentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold verde-brasil flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 animate-bounce-slow" />
                  <span className="animate-count-up">{animatedStats.newTalents}</span>
                </div>
                <p className="text-xs text-gray-500">Esta semana</p>
              </CardContent>
            </Card>

            <Card className="card-hover group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Contatos Realizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-oswald font-bold amarelo-ouro flex items-center gap-2">
                  <Trophy className="w-5 h-5 animate-pulse-slow" />
                  <span className="animate-count-up">{animatedStats.contacts}</span>
                </div>
                <p className="text-xs text-gray-500">Este mês</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Search */}
        <Card className="mb-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-verde-brasil/5 via-amarelo-ouro/5 to-azul-celeste/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader>
            <CardTitle className="font-bebas text-2xl azul-celeste">BUSCA RÁPIDA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Buscar por nome, posição, cidade..." 
                  className="text-lg pl-10 pr-4 h-12 border-2 focus:border-verde-brasil transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="btn-primary px-8 h-12 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-2 hover:border-azul-celeste hover:text-azul-celeste transition-all duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            {/* Popular Searches */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Buscas populares:</span>
              {["Sub-17 Atacantes", "Laterais SP", "Verificados Ouro+", "Velocidade >85%"].map((search) => (
                <Button 
                  key={search}
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7 px-3 bg-gray-100 hover:bg-verde-brasil hover:text-white transition-all duration-200"
                  onClick={() => setSearchQuery(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Athletes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-2xl azul-celeste">NOVOS TALENTOS</CardTitle>
              </CardHeader>
              <CardContent>
                {!recentAthletes.length ? (
                  <EmptyState 
                    type="no-athletes"
                    action={{
                      label: "Ajustar Filtros",
                      onClick: () => setLocation("/scout/search")
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    {recentAthletes.slice(0, 5).map((athlete: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg group ${
                          athlete.verificationLevel === 'platinum' ? 'border-purple-200 hover:border-purple-400 bg-gradient-to-r from-purple-50 to-transparent' :
                          athlete.verificationLevel === 'gold' ? 'border-yellow-200 hover:border-yellow-400 bg-gradient-to-r from-yellow-50 to-transparent' :
                          'border-gray-200 hover:border-verde-brasil'
                        }`}
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                          opacity: 0
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg group-hover:text-verde-brasil transition-colors">
                                {athlete.fullName}
                              </h4>
                              <VerificationBadge level={athlete.verificationLevel as "bronze" | "silver" | "gold" | "platinum"} size="sm" />
                              {athlete.percentile > 90 && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs">
                                  TOP 10%
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2 font-medium">
                              {athlete.position} • {athlete.age} anos
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {athlete.city}, {athlete.state}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                {athlete.team}
                              </span>
                            </div>
                            
                            {/* Performance Preview */}
                            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Velocidade</p>
                                  <p className="text-sm font-semibold">{athlete.speed20m}s</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Visualizações</p>
                                  <p className="text-sm font-semibold">{athlete.profileViews}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                  <Trophy className="w-4 h-4 text-yellow-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Percentil</p>
                                  <p className="text-sm font-semibold">{athlete.percentile}º</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="btn-primary ml-4 transform group-hover:scale-105 transition-all duration-200 shadow-md group-hover:shadow-xl"
                          >
                            Ver Perfil
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">FILTROS SALVOS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Atacantes SP - Sub 18", count: 47, trend: "up" },
                    { name: "Meio-campos Verificados", count: 23, trend: "same" },
                    { name: "Laterais RJ/ES", count: 15, trend: "down" },
                    { name: "Goleiros Top 20%", count: 8, trend: "up" }
                  ].map((filter, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      className="w-full justify-between h-auto p-3 hover:border-verde-brasil hover:bg-green-50 group transition-all duration-200"
                    >
                      <span className="text-left">
                        <p className="font-medium group-hover:text-verde-brasil transition-colors">{filter.name}</p>
                        <p className="text-xs text-gray-500">{filter.count} atletas</p>
                      </span>
                      {filter.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {filter.trend === "down" && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 text-sm text-gray-600 hover:text-verde-brasil"
                >
                  + Criar novo filtro
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-xl azul-celeste">ESTATÍSTICAS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Perfis completos", value: 73, color: "verde-brasil", bg: "bg-gradient-to-r from-verde-brasil to-green-500" },
                    { label: "Com testes verificados", value: 45, color: "amarelo-ouro", bg: "bg-gradient-to-r from-amarelo-ouro to-yellow-500" },
                    { label: "Nível Ouro/Platina", value: 28, color: "azul-celeste", bg: "bg-gradient-to-r from-azul-celeste to-blue-600" }
                  ].map((stat, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="group-hover:text-gray-900 transition-colors">{stat.label}</span>
                        <span className={`font-semibold ${stat.color}`}>{stat.value}%</span>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`${stat.bg} h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                          style={{ 
                            width: `${stat.value}%`,
                            animation: `progressFill 1.5s ease-out ${index * 0.2}s both`
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total de atletas na plataforma</p>
                  <p className="text-2xl font-oswald font-bold azul-celeste">1,247</p>
                  <p className="text-xs text-green-600 mt-1">+18% este mês</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add animations CSS
if (typeof document !== 'undefined' && !document.querySelector('#scout-dashboard-animations')) {
  const style = document.createElement('style');
  style.id = 'scout-dashboard-animations';
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
    
    @keyframes progressFill {
      from {
        width: 0;
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
  `;
  document.head.appendChild(style);
}
