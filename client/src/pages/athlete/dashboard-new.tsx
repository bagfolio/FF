import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/layout/Navigation";
import TrustPyramid from "@/components/ui/trust-pyramid";
import VerificationBadge from "@/components/ui/verification-badge";
import PerformanceRadar from "@/components/ui/performance-radar";
import TrustPyramidProgress from "@/components/ui/trust-pyramid-progress";
import ProgressEnhanced from "@/components/ui/progress-enhanced";
import { generateRealisticAthlete, generateActivity, achievements } from "@/lib/brazilianData";
import { 
  User, Trophy, TrendingUp, Eye, Play, Medal, Star, Crown, Check, 
  Camera, Share2, MapPin, Calendar, Zap, Target, Award, BarChart3,
  Video, Clock, ChevronRight, Sparkles, Flame, Lock, Plus,
  ChevronDown, ChevronUp, Filter
} from "lucide-react";

export default function AthleteDashboardNew() {
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
    Array.from({ length: 10 }, () => generateActivity())
  );
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [scoutViews, setScoutViews] = useState(3);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activityFilter, setActivityFilter] = useState("all");

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

  // Filter activities based on selected filter
  const filteredActivities = activities.filter(activity => {
    if (activityFilter === "all") return true;
    return activity.type === activityFilter;
  });

  return (
    <div className="min-h-screen bg-cinza-claro">
      <Navigation />
      
      {/* Streamlined Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Profile Info - Simplified */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-verde-brasil" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-amarelo-ouro rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
                </button>
              </div>
              
              <div>
                <h1 className="font-bebas text-3xl md:text-5xl mb-1">{athlete?.fullName || realisticStats.fullName}</h1>
                <div className="flex items-center gap-3 text-sm md:text-base opacity-90">
                  <span>{athlete?.position || realisticStats.position}</span>
                  <span>•</span>
                  <span>{athlete?.currentTeam || realisticStats.team}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <VerificationBadge level={verificationLevel} size="md" />
                  <span className="text-sm opacity-80">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {athlete?.city || realisticStats.city}, {athlete?.state || realisticStats.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Stats - Condensed */}
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-oswald font-bold">{realisticStats.percentile}%</div>
                <div className="text-xs md:text-sm opacity-80">Percentil</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-oswald font-bold">{realisticStats.profileViews}</div>
                <div className="text-xs md:text-sm opacity-80">Visualizações</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-oswald font-bold">{tests.length || 3}</div>
                <div className="text-xs md:text-sm opacity-80">Testes</div>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mt-6 flex gap-3">
            <Button size="lg" className="bg-[#00C853] hover:bg-[#00E676] text-white font-semibold">
              <Play className="w-5 h-5 mr-2" />
              Realizar Novo Teste
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Share2 className="w-5 h-5 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Engagement Hub - Trust Pyramid + Tests Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trust Pyramid - Compact Version */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-700 to-green-800 text-white pb-3">
                  <CardTitle className="font-bebas text-xl flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    NÍVEL DE CONFIANÇA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <TrustPyramid 
                    currentLevel={verificationLevel}
                    showLabels={false}
                    interactive={true}
                    className="max-w-[180px] mx-auto"
                  />
                  <div className="mt-4 text-center">
                    <p className="font-bebas text-2xl azul-celeste">{verificationLevel.toUpperCase()}</p>
                    <p className="text-sm text-gray-600 mt-1">3 de 5 requisitos completos</p>
                    <Button size="sm" className="mt-3" variant="outline">
                      Ver Requisitos
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Test Access */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white pb-3">
                  <CardTitle className="font-bebas text-xl flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    TESTES RÁPIDOS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {/* Recommended Test */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg border border-green-200 cursor-pointer hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Sprint 20m</h4>
                        <Badge className="bg-green-500 text-white text-xs">RECOMENDADO</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          3-5 min
                        </span>
                        <span>Melhor: 2.76s</span>
                      </div>
                    </div>

                    {/* New Test */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-transparent rounded-lg border border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Agilidade 5-10-5</h4>
                        <Badge className="bg-red-500 text-white text-xs animate-pulse">NOVO</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5-7 min
                        </span>
                        <span>Não realizado</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    Ver Todos os Testes
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Dashboard - Tabbed View */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  ANÁLISE DE DESEMPENHO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="current" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="current">Atual</TabsTrigger>
                    <TabsTrigger value="evolution">Evolução</TabsTrigger>
                    <TabsTrigger value="videos">Vídeos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="current" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <PerformanceRadar 
                        data={[
                          { label: "Velocidade", value: realisticStats.speed },
                          { label: "Agilidade", value: realisticStats.agility },
                          { label: "Técnica", value: realisticStats.technique },
                          { label: "Resistência", value: realisticStats.endurance },
                          { label: "Força", value: Math.floor(Math.random() * 30) + 60 },
                          { label: "Mental", value: Math.floor(Math.random() * 30) + 65 }
                        ]}
                        size={250}
                        showLabels={true}
                        animated={true}
                      />
                      
                      <div className="space-y-4">
                        <ProgressEnhanced
                          value={realisticStats.speed}
                          label="Velocidade"
                          average={72}
                          trend={{ value: 5, direction: "up" }}
                        />
                        <ProgressEnhanced
                          value={realisticStats.agility}
                          label="Agilidade"
                          average={70}
                          trend={{ value: 8, direction: "up" }}
                        />
                        <ProgressEnhanced
                          value={realisticStats.technique}
                          label="Técnica"
                          average={65}
                        />
                        <ProgressEnhanced
                          value={realisticStats.endurance}
                          label="Resistência"
                          average={68}
                          trend={{ value: 2, direction: "down" }}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="evolution" className="mt-6">
                    <div className="space-y-6">
                      {/* Evolution Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-700">+15%</div>
                          <p className="text-sm text-green-600">Velocidade</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-700">+8%</div>
                          <p className="text-sm text-blue-600">Agilidade</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-700">+5%</div>
                          <p className="text-sm text-yellow-600">Técnica</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-700">+23</div>
                          <p className="text-sm text-purple-600">Posições</p>
                        </div>
                      </div>

                      {/* Simple Chart */}
                      <div className="h-48 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-end justify-between h-full">
                          {[65, 68, 67, 72, 74, 78, 82].map((value, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-gradient-to-t from-verde-brasil to-green-400 rounded-t"
                                style={{ height: `${(value / 100) * 160}px` }}
                              />
                              <span className="text-xs text-gray-600 mt-2">
                                {['J', 'F', 'M', 'A', 'M', 'J', 'J'][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="videos" className="mt-6">
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
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Video className="w-4 h-4 mr-2" />
                      Enviar Novo Vídeo
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Unified Activity Timeline */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-bebas text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    LINHA DO TEMPO
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select 
                      className="text-sm border rounded-md px-2 py-1"
                      value={activityFilter}
                      onChange={(e) => setActivityFilter(e.target.value)}
                    >
                      <option value="all">Todas</option>
                      <option value="view">Visualizações</option>
                      <option value="achievement">Conquistas</option>
                      <option value="test">Testes</option>
                      <option value="rank">Rankings</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredActivities.map((activity, index) => {
                    const iconConfig = {
                      view: { icon: Eye, color: "text-green-600", bg: "bg-green-50" },
                      achievement: { icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-50" },
                      test: { icon: Play, color: "text-blue-600", bg: "bg-blue-50" },
                      update: { icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                      rank: { icon: Award, color: "text-orange-600", bg: "bg-orange-50" }
                    };
                    
                    const config = iconConfig[activity.type as keyof typeof iconConfig] || iconConfig.update;
                    const Icon = config.icon;
                    
                    return (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${config.bg}`}>
                        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Collapsible */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mobile Toggle */}
            <button
              className="lg:hidden flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-md"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span className="font-bebas text-xl">PAINEL LATERAL</span>
              {sidebarExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>

            <div className={`space-y-6 ${!sidebarExpanded && 'hidden lg:block'}`}>
              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bebas">ESTATÍSTICAS RÁPIDAS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ranking Municipal</span>
                      <span className="font-bold">#12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ranking Estadual</span>
                      <span className="font-bold">#87</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ranking Nacional</span>
                      <span className="font-bold">#342</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Perfil Completo</span>
                      <span className="font-bold text-green-600">{profileCompletion}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Daily Challenge */}
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white pb-3">
                  <CardTitle className="text-lg font-bebas flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    DESAFIO DO DIA
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="font-semibold mb-2">100 toques sem deixar cair</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span>200 XP + Badge</span>
                  </div>
                  <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Aceitar Desafio
                  </Button>
                </CardContent>
              </Card>

              {/* Achievements - Compact */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bebas flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    CONQUISTAS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {achievements.slice(0, 6).map((achievement, i) => {
                      const isUnlocked = i < 3;
                      return (
                        <div key={i} className="relative">
                          <div className={`aspect-square rounded-lg flex items-center justify-center ${
                            isUnlocked ? 'bg-yellow-100' : 'bg-gray-100'
                          }`}>
                            {(() => {
                              const Icon = achievement.icon;
                              return <Icon className={`w-6 h-6 ${isUnlocked ? 'text-yellow-700' : 'text-gray-400'}`} />;
                            })()}
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-gray-900/60 rounded-lg flex items-center justify-center">
                                <Lock className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    Ver Todas
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Goals Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bebas flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    METAS ATIVAS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Sprint -10%</span>
                        <span className="text-xs text-gray-600">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Nível Ouro</span>
                        <span className="text-xs text-gray-600">40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Plus className="w-4 h-4 mr-1" />
                    Nova Meta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-verde-brasil to-green-600 hover:from-green-600 hover:to-verde-brasil text-white shadow-2xl"
          onClick={() => setLocation("/athlete/test")}
        >
          <Play className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}