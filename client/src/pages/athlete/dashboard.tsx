import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/layout/Navigation";
import TrustPyramid from "@/components/ui/trust-pyramid";
import VerificationBadge from "@/components/ui/verification-badge";
import PerformanceRadar from "@/components/ui/performance-radar";
import ProfileCompletionRing from "@/components/ui/profile-completion-ring";
import TrustPyramidProgress from "@/components/ui/trust-pyramid-progress";
import ProgressEnhanced from "@/components/ui/progress-enhanced";
import { generateRealisticAthlete, generateActivity, achievements } from "@/lib/brazilianData";
import { 
  User, Trophy, TrendingUp, Eye, Play, Medal, Star, Crown, Check, 
  Camera, Share2, MapPin, Calendar, Zap, Target, Award, BarChart3,
  Video, Clock, ChevronRight, Sparkles, Flame, Lock, Plus
} from "lucide-react";

export default function AthleteDashboard() {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete, isLoading: athleteLoading } = useQuery({ queryKey: ["/api/athletes/me"] });
  const { data: tests = [], isLoading: testsLoading } = useQuery({ 
    queryKey: ["/api/tests/athlete", athlete?.id],
    enabled: !!athlete?.id
  });

  const isLoading = athleteLoading || testsLoading;

  // Generate realistic data
  const [realisticStats] = useState(() => generateRealisticAthlete());
  const [activities] = useState(() => 
    Array.from({ length: 5 }, () => generateActivity())
  );
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [scoutViews, setScoutViews] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfileCompletion(Math.min(profileCompletion + 5, 100));
    }, 2000);
    return () => clearTimeout(timer);
  }, [profileCompletion]);

  // Simulate scout views
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setScoutViews(prev => prev + 1);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const verificationLevel = (athlete?.verificationLevel || realisticStats.verificationLevel) as "bronze" | "silver" | "gold" | "platinum";

  // Temporarily bypass athlete profile check for testing
  // if (!athlete) {
  //   return (
  //     <div className="min-h-screen bg-cinza-claro">
  //       <Navigation />
  //       <div className="container mx-auto px-4 pt-20">
  //         <Card className="max-w-md mx-auto shadow-xl hover:shadow-2xl transition-all duration-300">
  //           <CardContent className="pt-6 text-center">
  //             <div className="w-24 h-24 bg-gradient-to-br from-verde-brasil to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
  //               <User className="w-12 h-12 text-white" />
  //             </div>
  //             <h2 className="font-bebas text-3xl azul-celeste mb-4">Complete Seu Perfil</h2>
  //             <p className="text-gray-600 mb-8">
  //               Para acessar o dashboard, você precisa completar seu perfil de atleta.
  //             </p>
  //             <Button 
  //               className="btn-primary px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200" 
  //               onClick={() => setLocation("/athlete/onboarding")}
  //             >
  //               Completar Perfil
  //             </Button>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      {/* Hero Section - Full Width */}
      <div className="relative bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-animate opacity-20" />
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }} />
          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-8 h-8 bg-white/10 rounded-full" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <div className="w-6 h-6 bg-amarelo-ouro/20 rounded-full" />
          </div>
          <div className="absolute bottom-20 left-1/3 animate-float">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Side - Profile Info */}
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <ProfileCompletionRing percentage={profileCompletion} size={180} strokeWidth={8}>
                  <div className="relative">
                    <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <User className="w-20 h-20 text-verde-brasil" />
                    </div>
                    <button className="absolute bottom-0 right-0 w-11 h-11 bg-amarelo-ouro rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5 text-gray-800" />
                    </button>
                  </div>
                </ProfileCompletionRing>
                <div className="text-center mt-3">
                  <span className="text-3xl font-oswald font-bold text-white">{profileCompletion}%</span>
                  <p className="text-sm text-white/80">perfil completo</p>
                </div>
              </div>
              
              <div>
                <h1 className="font-bebas text-5xl mb-2">{athlete?.fullName || realisticStats.fullName}</h1>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-xl opacity-90">{athlete?.position || realisticStats.position}</span>
                  <span className="text-xl opacity-90">•</span>
                  <span className="text-xl opacity-90">{athlete?.currentTeam || realisticStats.team}</span>
                </div>
                <div className="flex items-center gap-3">
                  <VerificationBadge level={verificationLevel} size="lg" />
                  <div className="flex items-center gap-2 text-sm opacity-80">
                    <MapPin className="w-4 h-4" />
                    {athlete?.city || realisticStats.city}, {athlete?.state || realisticStats.state}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Key Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-oswald font-bold mb-1">{realisticStats.percentile}%</div>
                <div className="text-sm opacity-80">Percentil Nacional</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-oswald font-bold mb-1 flex items-center justify-center gap-2">
                  <Eye className="w-6 h-6" />
                  {realisticStats.profileViews}
                </div>
                <div className="text-sm opacity-80">Visualizações</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-oswald font-bold mb-1">{tests.length || 3}</div>
                <div className="text-sm opacity-80">Testes Verificados</div>
              </div>
            </div>
          </div>

          {/* Key Stats Cards - Prominent Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl mx-auto">
            {/* Sprint Time Card */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 shadow-2xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-verde-brasil/20 rounded-full flex items-center justify-center border border-verde-brasil/30">
                  <Zap className="w-6 h-6 text-verde-brasil" />
                </div>
                <Badge className="bg-green-500 text-white text-sm font-bold px-3 py-1">↑ 5%</Badge>
              </div>
              <div className="text-4xl font-oswald font-bold mb-1 text-white">2.76s</div>
              <p className="text-lg text-white/90 font-medium">Sprint 20m</p>
              <p className="text-sm text-white/70 mt-1">Melhor que 90% dos atletas</p>
            </div>
            
            {/* Views Card */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 shadow-2xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amarelo-ouro/20 rounded-full flex items-center justify-center border border-amarelo-ouro/30">
                  <Eye className="w-6 h-6 text-amarelo-ouro" />
                </div>
                <Badge className="bg-amarelo-ouro text-gray-900 text-sm font-bold px-3 py-1 animate-pulse">ATIVO</Badge>
              </div>
              <div className="text-4xl font-oswald font-bold mb-1 text-white">{realisticStats.profileViews}</div>
              <p className="text-lg text-white/90 font-medium">Visualizações</p>
              <p className="text-sm text-white/70 mt-1">{scoutViews} scouts esta semana</p>
            </div>
            
            {/* City Ranking Card */}
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20 shadow-2xl transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amarelo-ouro/20 rounded-full flex items-center justify-center border border-amarelo-ouro/30">
                  <Trophy className="w-6 h-6 text-amarelo-ouro" />
                </div>
                <Badge className="bg-white/20 text-white text-sm font-bold px-3 py-1">{realisticStats.city}</Badge>
              </div>
              <div className="text-4xl font-oswald font-bold mb-1 text-white">#12</div>
              <p className="text-lg text-white/90 font-medium">Ranking Municipal</p>
              <p className="text-sm text-white/70 mt-1">Subiu 3 posições este mês</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button size="lg" className="bg-[#00C853] hover:bg-[#00E676] text-white font-semibold shadow-xl transform hover:scale-105 transition-all">
              <Play className="w-5 h-5 mr-2" />
              Realizar Novo Teste
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm bg-transparent">
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar Perfil
            </Button>
          </div>
        </div>

        {/* Wave Shape at Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 fill-cinza-claro">
            <path d="M0,64 C240,96 480,32 720,48 C960,64 1200,96 1440,64 L1440,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* Main Content - 12 Column Grid */}
      <div className="container mx-auto px-4 py-8">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Top Achievement Alert - Most Prominent */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-2xl p-6 shadow-2xl transform hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-verde-brasil/20 rounded-full flex items-center justify-center flex-shrink-0 border border-verde-brasil/30">
                  <Flame className="w-8 h-8 text-verde-brasil" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bebas text-white mb-1">🔥 VOCÊ ESTÁ NO TOP 10% EM VELOCIDADE!</h3>
                  <p className="text-white/90 text-lg">Sua velocidade de 2.76s no sprint 20m é melhor que 90% dos atletas da sua idade.</p>
                </div>
                <Button size="sm" className="bg-verde-brasil hover:bg-green-600 text-white border-2 border-verde-brasil">
                  Ver Detalhes
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Trust Pyramid Progress - Prominent Position */}
            <TrustPyramidProgress currentLevel={verificationLevel} />

            {/* Activity Feed */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  ACONTECENDO AGORA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Social Proof Items */}

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg border-l-4 border-yellow-500">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">👀 Scout do Palmeiras visualizou seu perfil</p>
                      <p className="text-sm text-gray-600 mt-1">Há 15 minutos atrás • 3ª visualização desta semana</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border-l-4 border-blue-500">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">📈 Sua agilidade melhorou 8% este mês</p>
                      <p className="text-sm text-gray-600 mt-1">Continue treinando para manter essa evolução!</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border-l-4 border-purple-500">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">🎯 3 dias para completar o Desafio Semanal</p>
                      <p className="text-sm text-gray-600 mt-1">Complete 100 toques sem deixar cair para ganhar 200 XP</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section: Meu Desempenho */}
            <div>
              <h2 className="font-bebas text-3xl text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-12 h-1 bg-gradient-to-r from-verde-brasil to-transparent" />
                MEU DESEMPENHO
              </h2>
            </div>

            {/* Performance Overview Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-700 to-green-800 text-white">
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  ANÁLISE DE DESEMPENHO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Performance Radar Chart */}
                  <div className="relative">
                    <PerformanceRadar 
                      data={[
                        { label: "Velocidade", value: realisticStats.speed },
                        { label: "Agilidade", value: realisticStats.agility },
                        { label: "Técnica", value: realisticStats.technique },
                        { label: "Resistência", value: realisticStats.endurance },
                        { label: "Força", value: Math.floor(Math.random() * 30) + 60 },
                        { label: "Mental", value: Math.floor(Math.random() * 30) + 65 }
                      ]}
                      size={280}
                      showLabels={true}
                      animated={true}
                    />
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="space-y-6">
                    <ProgressEnhanced
                      value={realisticStats.speed}
                      label="Velocidade"
                      average={72}
                      trend={{ value: 5, direction: "up" }}
                      comparison={{ value: 68, label: "Mês passado" }}
                    />
                    <ProgressEnhanced
                      value={realisticStats.agility}
                      label="Agilidade"
                      average={70}
                      trend={{ value: 8, direction: "up" }}
                      comparison={{ value: realisticStats.agility - 8, label: "Mês passado" }}
                    />
                    <ProgressEnhanced
                      value={realisticStats.technique}
                      label="Técnica"
                      average={65}
                      trend={{ value: 3, direction: "up" }}
                    />
                    <ProgressEnhanced
                      value={realisticStats.endurance}
                      label="Resistência"
                      average={68}
                      trend={{ value: 2, direction: "down" }}
                      comparison={{ value: realisticStats.endurance + 2, label: "Mês passado" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prominent Rankings Display */}
            <div>
              <h2 className="font-bebas text-3xl text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-12 h-1 bg-gradient-to-r from-amarelo-ouro to-transparent" />
                SEUS RANKINGS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City Ranking */}
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="bg-gradient-to-br from-green-700 to-green-800 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{realisticStats.city}</span>
                      </div>
                      <Badge className="bg-white/20 text-white">MUNICIPAL</Badge>
                    </div>
                    <div className="text-6xl font-oswald font-bold mb-2 animate-count-up">#12</div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-green-200">Subiu 3 posições</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Entre os 15 melhores da cidade</p>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      Ver Ranking Completo
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                {/* State Ranking */}
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="bg-gradient-to-br from-amarelo-ouro to-yellow-500 p-6 text-gray-900">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{realisticStats.state}</span>
                      </div>
                      <Badge className="bg-black/10 text-gray-900">ESTADUAL</Badge>
                    </div>
                    <div className="text-6xl font-oswald font-bold mb-2 animate-count-up">#87</div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-700" />
                      <span className="text-green-800">Subiu 12 posições</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Top 100 do estado</p>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      Ver Ranking Completo
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                {/* National Ranking */}
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        <span className="font-medium">BRASIL</span>
                      </div>
                      <Badge className="bg-white/20 text-white">NACIONAL</Badge>
                    </div>
                    <div className="text-6xl font-oswald font-bold mb-2 animate-count-up">#342</div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-green-200">Subiu 45 posições</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Top 1% nacional da categoria</p>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      Ver Ranking Completo
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section: Combine Digital */}
            <div className="mt-8">
              <h2 className="font-bebas text-3xl text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-12 h-1 bg-gradient-to-r from-azul-celeste to-transparent" />
                COMBINE DIGITAL
              </h2>
            </div>

            {/* Combine Digital Hub - Enhanced */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  TESTES DISPONÍVEIS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Test Card 1 - Velocidade */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl border-2 border-transparent hover:border-green-400 transition-all">
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <Video className="w-16 h-16 text-green-600" />
                      </div>
                      
                      {/* Progress Ring for Completed Test */}
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
                      
                      {/* NEW Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white animate-pulse">RECOMENDADO</Badge>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="font-semibold text-lg mb-2">Teste de Velocidade 20m</h4>
                        
                        {/* Difficulty Stars */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-gray-400">★</span>
                            <span className="text-gray-400">★</span>
                            <span className="ml-1 text-xs">Fácil</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            3-5 min
                          </span>
                        </div>
                        
                        {/* Best Score */}
                        <div className="mt-2 text-xs opacity-80">
                          Seu melhor: <span className="font-bold">2.76s</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-7 h-7 text-verde-brasil ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Card 2 - Agilidade */}
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl border-2 border-transparent hover:border-yellow-400 transition-all">
                      <div className="aspect-video bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                        <Video className="w-16 h-16 text-yellow-600" />
                      </div>
                      
                      {/* NEW Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500 text-white animate-pulse">NOVO</Badge>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="font-semibold text-lg mb-2">Teste de Agilidade 5-10-5</h4>
                        
                        {/* Difficulty Stars */}
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★★</span>
                            <span className="text-gray-400">★</span>
                            <span className="ml-1 text-xs">Médio</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            5-7 min
                          </span>
                        </div>
                        
                        {/* Not attempted */}
                        <div className="mt-2 text-xs opacity-80">
                          Não realizado ainda
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-7 h-7 text-amarelo-ouro ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
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

            {/* Goals & Daily Challenge Combined */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  OBJETIVOS & DESAFIOS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Daily Challenge Hero */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 mb-6 border-2 border-orange-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <Flame className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bebas text-2xl text-gray-900 flex items-center gap-2">
                          DESAFIO DO DIA
                          <Badge className="bg-orange-500 text-white animate-pulse">ATIVO</Badge>
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="font-bold text-orange-600">🔥 7 dias consecutivos</span>
                          <span>•</span>
                          <span>Expire em 18h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4">
                    <p className="font-semibold text-lg text-gray-900 mb-2">Complete 100 toques sem deixar cair</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span>Recompensa: <strong>200 XP</strong> + Badge exclusivo</span>
                    </div>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Aceitar Desafio
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Current Goals */}
                  <div>
                    <h4 className="font-bebas text-xl azul-celeste mb-3">METAS ATIVAS</h4>
                    
                    {/* Primary Goal */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-lg border-2 border-purple-200 mb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-purple-900">Melhorar Sprint em 10%</h4>
                          <p className="text-sm text-purple-700 mt-1">Reduzir tempo de 2.76s para 2.48s</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700">15 dias</Badge>
                      </div>
                      <Progress value={65} className="h-3" />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-600">65% completo</span>
                        <span className="text-xs text-purple-600 font-medium">5 treinos restantes</span>
                      </div>
                    </div>

                    {/* Secondary Goals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-sm">Nível Ouro</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">2 de 5 requisitos</span>
                          <span className="text-xs font-bold text-yellow-600">40%</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">Top 50 AL</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Posição #87</span>
                          <span className="text-xs font-bold text-blue-600">37↑</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Meta
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Histórico
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Evolution Timeline - Now with real data */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-800 text-white">
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  SUA EVOLUÇÃO
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Evolution Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-oswald font-bold text-green-700">+15%</div>
                    <p className="text-sm text-green-600 mt-1">Velocidade</p>
                    <p className="text-xs text-gray-600">Último mês</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-oswald font-bold text-blue-700">+8%</div>
                    <p className="text-sm text-blue-600 mt-1">Agilidade</p>
                    <p className="text-xs text-gray-600">Último mês</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-oswald font-bold text-yellow-700">+5%</div>
                    <p className="text-sm text-yellow-600 mt-1">Técnica</p>
                    <p className="text-xs text-gray-600">Último mês</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-oswald font-bold text-purple-700">+23</div>
                    <p className="text-sm text-purple-600 mt-1">Posições</p>
                    <p className="text-xs text-gray-600">No ranking</p>
                  </div>
                </div>

                {/* Simple Line Chart Visualization */}
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between h-32">
                    {[65, 68, 67, 72, 74, 78, 82].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-verde-brasil to-green-400 rounded-t transition-all hover:from-green-600 hover:to-green-300"
                          style={{ height: `${(value / 100) * 128}px` }}
                        />
                        <span className="text-xs text-gray-600 mt-2">
                          {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evolution Insights */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-gray-700">Você está <strong>23% mais rápido</strong> que há 6 meses</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-700">Sua evolução está <strong>acima da média</strong> da categoria</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section: Minha Evolução */}
            <div className="mt-8">
              <h2 className="font-bebas text-3xl text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-12 h-1 bg-gradient-to-r from-amarelo-ouro to-transparent" />
                MINHA EVOLUÇÃO
              </h2>
            </div>

            {/* Video Showcase */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-2xl text-gray-900 flex items-center gap-2">
                  <Video className="w-6 h-6" />
                  SEUS MELHORES MOMENTOS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative group cursor-pointer">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <Video className="w-8 h-8 text-gray-500" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                      {i === 1 && (
                        <Badge className="absolute top-2 left-2 bg-verde-brasil text-white">
                          <Trophy className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Video className="w-4 h-4 mr-2" />
                  Enviar Novo Vídeo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Takes up 1 column on large screens */}
          <div className="lg:col-span-1 space-y-6">
            {/* Motivational Quote */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 text-white/10">
                  <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                  </svg>
                </div>
                <div className="relative z-10">
                  <p className="text-lg font-medium italic mb-3">
                    "O talento vence jogos, mas só o trabalho em equipe ganha campeonatos."
                  </p>
                  <p className="text-sm opacity-90">- Pelé</p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-verde-brasil" />
                  <span className="text-xs">Frase motivacional do dia</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Gallery - Enhanced */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amarelo-ouro to-yellow-500 text-gray-900">
                <CardTitle className="font-bebas text-xl flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  CONQUISTAS
                  <Badge className="bg-white/80 text-gray-700 text-xs ml-auto">🏆 1,250 XP</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {achievements.slice(0, 9).map((achievement, i) => {
                    const isUnlocked = i < 5;
                    const rarity = i < 2 ? "common" : i < 5 ? "rare" : i < 8 ? "epic" : "legendary";
                    const rarityColors = {
                      common: "border-gray-300",
                      rare: "border-blue-400",
                      epic: "border-purple-400",
                      legendary: "border-yellow-400 shadow-lg shadow-yellow-400/20"
                    };
                    const progress = isUnlocked ? 100 : Math.floor(Math.random() * 80);
                    
                    return (
                      <div key={i} className="relative">
                        <div 
                          className={`aspect-square rounded-lg flex flex-col items-center justify-center relative group cursor-pointer transition-all border-2 ${
                            isUnlocked 
                              ? `bg-gradient-to-br from-yellow-100 to-yellow-200 ${rarityColors[rarity]}` 
                              : `bg-gray-100 border-gray-200`
                          } ${
                            isUnlocked && i === 4 ? 'animate-pulse-slow' : ''
                          }`}
                        >
                          {(() => {
                            const Icon = achievement.icon;
                            return <Icon className={`w-8 h-8 ${isUnlocked ? 'text-yellow-700' : 'text-gray-400'}`} />;
                          })()}
                          
                          {!isUnlocked && (
                            <>
                              <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center">
                                <Lock className="w-6 h-6 text-white" />
                              </div>
                              
                              {/* Progress bar for locked achievements */}
                              <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
                                <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-white text-center mt-0.5">{progress}%</p>
                              </div>
                            </>
                          )}
                          
                          {/* Rarity indicator */}
                          {isUnlocked && (
                            <div className="absolute top-1 right-1">
                              {rarity === "legendary" && <Sparkles className="w-3 h-3 text-yellow-600" />}
                              {rarity === "epic" && <Star className="w-3 h-3 text-purple-600" />}
                              {rarity === "rare" && <Award className="w-3 h-3 text-blue-600" />}
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                            <p className="text-white text-xs text-center font-semibold">{achievement.name}</p>
                            <p className="text-white/80 text-xs mt-1">+{achievement.points} XP</p>
                          </div>
                        </div>
                        
                        {/* Recently unlocked pulse */}
                        {isUnlocked && i === 4 && (
                          <div className="absolute -inset-1 bg-yellow-400/50 rounded-lg animate-ping" />
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Overall Progress */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">5 de {achievements.length} desbloqueadas</p>
                    <p className="text-xs text-gray-500">Próxima em 2 dias</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-amarelo-ouro to-yellow-500 h-3 rounded-full relative" style={{ width: '56%' }}>
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>




            {/* Activity Feed - Compact */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-xl text-gray-900">ATIVIDADE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activities.slice(0, 3).map((activity, index) => {
                    const iconConfig = {
                      view: { icon: Eye, color: "text-green-600" },
                      achievement: { icon: Trophy, color: "text-yellow-600" },
                      test: { icon: Play, color: "text-blue-600" },
                      update: { icon: TrendingUp, color: "text-purple-600" },
                      rank: { icon: Award, color: "text-orange-600" }
                    };
                    
                    const config = iconConfig[activity.type as keyof typeof iconConfig] || iconConfig.update;
                    const Icon = config.icon;
                    
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 line-clamp-2">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" className="w-full mt-3" size="sm">
                  Ver Todas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <Button 
          size="lg"
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-verde-brasil to-green-600 hover:from-green-600 hover:to-verde-brasil text-white shadow-2xl transform hover:scale-110 transition-all duration-300 group"
          onClick={() => setLocation("/athlete/test")}
        >
          <div className="flex flex-col items-center">
            <Play className="w-6 h-6 md:w-7 md:h-7" />
            <span className="text-xs font-bold absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-gray-900 text-white px-2 py-1 rounded hidden md:block">
              Novo Teste
            </span>
          </div>
        </Button>
        <div className="absolute -inset-1 bg-verde-brasil rounded-full opacity-30 animate-ping" />
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
      0% {
        opacity: 0;
        transform: scale(0.5) translateY(20px);
      }
      50% {
        transform: scale(1.1) translateY(-5px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    
    @keyframes gradient-animate {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    .bg-gradient-animate {
      background: linear-gradient(-45deg, #009C3B, #FFDF00, #002776, #009C3B);
      background-size: 400% 400%;
      animation: gradient-animate 15s ease infinite;
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-float-delayed {
      animation: float 6s ease-in-out 3s infinite;
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