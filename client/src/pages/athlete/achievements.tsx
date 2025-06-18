import AthleteLayout from "@/components/layout/AthleteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Trophy, Lock, Star, Sparkles, Award, Target, Flame, Zap, Medal, Crown, Shield, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { achievements as baseAchievements } from "@/lib/brazilianData";
import { useState } from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  points: number;
  color: string;
  category: string;
  unlocked?: boolean;
  progress?: number;
  unlockedAt?: string;
  rarity?: "common" | "rare" | "epic" | "legendary";
  requirement?: string;
}

// Extend the base achievements with more details
const allAchievements: Achievement[] = [
  // Performance Achievements
  {
    id: "first_test",
    name: "Primeiros Passos",
    description: "Complete seu primeiro teste verificado",
    icon: Target,
    points: 100,
    color: "from-green-400 to-green-600",
    category: "performance",
    unlocked: true,
    unlockedAt: "15 de junho, 2024",
    rarity: "common"
  },
  {
    id: "speed_demon",
    name: "Relâmpago",
    description: "Entre no top 10% de velocidade da sua idade",
    icon: Zap,
    points: 500,
    color: "from-yellow-400 to-orange-500",
    category: "performance",
    unlocked: true,
    unlockedAt: "20 de junho, 2024",
    rarity: "epic",
    requirement: "Top 10% em velocidade"
  },
  {
    id: "all_rounder",
    name: "Jogador Completo",
    description: "Complete testes em todas as 6 categorias",
    icon: Shield,
    points: 750,
    color: "from-purple-400 to-purple-600",
    category: "performance",
    progress: 67,
    rarity: "epic",
    requirement: "4/6 categorias completadas"
  },
  {
    id: "perfectionist",
    name: "Perfeccionista",
    description: "Alcance 90º percentil em qualquer teste",
    icon: Star,
    points: 400,
    color: "from-blue-400 to-blue-600",
    category: "performance",
    unlocked: true,
    unlockedAt: "22 de junho, 2024",
    rarity: "rare"
  },
  
  // Profile Achievements
  {
    id: "complete_profile",
    name: "Profissional",
    description: "Complete 100% do seu perfil",
    icon: Star,
    points: 200,
    color: "from-blue-400 to-blue-600",
    category: "profile",
    progress: 85,
    rarity: "common",
    requirement: "85% completo"
  },
  {
    id: "verified_gold",
    name: "Ouro Olímpico",
    description: "Alcance o nível Ouro de verificação",
    icon: Crown,
    points: 1000,
    color: "from-yellow-400 to-yellow-600",
    category: "profile",
    progress: 60,
    rarity: "legendary",
    requirement: "Nível Prata atual"
  },
  {
    id: "team_player",
    name: "Trabalho em Equipe",
    description: "Receba 5 endossos de treinadores",
    icon: Award,
    points: 400,
    color: "from-purple-400 to-purple-600",
    category: "profile",
    progress: 40,
    rarity: "rare",
    requirement: "2/5 endossos"
  },
  {
    id: "media_star",
    name: "Estrela da Mídia",
    description: "Adicione 10 vídeos de destaque",
    icon: Medal,
    points: 300,
    color: "from-pink-400 to-pink-600",
    category: "profile",
    progress: 30,
    rarity: "rare",
    requirement: "3/10 vídeos"
  },
  
  // Engagement Achievements
  {
    id: "week_streak",
    name: "Dedicação",
    description: "Treine por 7 dias consecutivos",
    icon: Flame,
    points: 300,
    color: "from-red-400 to-red-600",
    category: "engagement",
    unlocked: true,
    unlockedAt: "Hoje",
    rarity: "common"
  },
  {
    id: "month_warrior",
    name: "Guerreiro do Mês",
    description: "Mantenha uma sequência de 30 dias",
    icon: Flame,
    points: 1000,
    color: "from-orange-400 to-red-600",
    category: "engagement",
    progress: 23,
    rarity: "epic",
    requirement: "7/30 dias"
  },
  {
    id: "early_bird",
    name: "Madrugador",
    description: "Complete 10 testes antes das 8h",
    icon: Target,
    points: 250,
    color: "from-indigo-400 to-indigo-600",
    category: "engagement",
    progress: 50,
    rarity: "common",
    requirement: "5/10 testes"
  },
  
  // Social Achievements
  {
    id: "rising_star",
    name: "Estrela em Ascensão",
    description: "Seja visualizado por 10 olheiros",
    icon: TrendingUp,
    points: 600,
    color: "from-pink-400 to-pink-600",
    category: "social",
    progress: 30,
    rarity: "rare",
    requirement: "3/10 olheiros"
  },
  {
    id: "viral_athlete",
    name: "Atleta Viral",
    description: "Alcance 1000 visualizações no perfil",
    icon: Star,
    points: 800,
    color: "from-purple-400 to-pink-600",
    category: "social",
    progress: 45,
    rarity: "epic",
    requirement: "450/1000 views"
  },
  {
    id: "network_effect",
    name: "Bem Conectado",
    description: "Conecte com 20 atletas da sua região",
    icon: Shield,
    points: 350,
    color: "from-green-400 to-teal-600",
    category: "social",
    progress: 25,
    rarity: "common",
    requirement: "5/20 conexões"
  },
  
  // Elite Achievements
  {
    id: "champion",
    name: "Campeão",
    description: "Alcance o top 5% nacional",
    icon: Trophy,
    points: 1500,
    color: "from-indigo-400 to-indigo-600",
    category: "elite",
    progress: 0,
    rarity: "legendary",
    requirement: "Top 15% atual"
  },
  {
    id: "legend",
    name: "Lenda",
    description: "Mantenha top 10% por 6 meses",
    icon: Crown,
    points: 2000,
    color: "from-yellow-400 to-orange-600",
    category: "elite",
    progress: 0,
    rarity: "legendary",
    requirement: "0/6 meses"
  },
  {
    id: "verified_athlete",
    name: "Atleta Verificado",
    description: "Complete todos os testes do Combine Digital",
    icon: Medal,
    points: 800,
    color: "from-teal-400 to-teal-600",
    category: "elite",
    progress: 45,
    rarity: "epic",
    requirement: "7/15 testes"
  }
];

export default function AchievementsPage() {
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");

  const statusFilters = [
    { id: "all", name: "Todas", count: allAchievements.length },
    { id: "unlocked", name: "Desbloqueadas", count: allAchievements.filter(a => a.unlocked).length },
    { id: "locked", name: "Bloqueadas", count: allAchievements.filter(a => !a.unlocked).length }
  ];

  const filteredAchievements = allAchievements.filter(achievement => {
    const statusMatch = selectedStatus === "all" || 
      (selectedStatus === "unlocked" && achievement.unlocked) ||
      (selectedStatus === "locked" && !achievement.unlocked);
    const rarityMatch = selectedRarity === "all" || achievement.rarity === selectedRarity;
    return statusMatch && rarityMatch;
  });

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalXP = allAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const nextAchievement = allAchievements.find(a => !a.unlocked && a.progress && a.progress > 50);

  const getRarityConfig = (rarity?: string) => {
    const configs = {
      common: { label: "Comum", color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-300" },
      rare: { label: "Raro", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-300" },
      epic: { label: "Épico", color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-300" },
      legendary: { label: "Lendário", color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-300" }
    };
    return configs[rarity as keyof typeof configs] || configs.common;
  };

  return (
    <AthleteLayout>
      <div className="min-h-screen bg-cinza-claro">
        <div className="container mx-auto px-4 pt-8 pb-16">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/athlete/dashboard" className="hover:text-azul-celeste">
                  Dashboard
                </a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Galeria de Conquistas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bebas text-4xl text-amarelo-ouro mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10" />
            GALERIA DE CONQUISTAS
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            🏆 1,250 XP • Rank: Estrela em Ascensão ✨
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">XP Total</p>
                    <p className="text-2xl font-bold text-orange-700">{totalXP.toLocaleString()}</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Desbloqueadas</p>
                    <p className="text-2xl font-bold text-green-700">{unlockedCount}/{allAchievements.length}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-purple-700">{Math.round((unlockedCount / allAchievements.length) * 100)}%</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Nível Atual</p>
                    <p className="text-2xl font-bold text-blue-700">15</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Achievement Alert */}
        {nextAchievement && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">Próxima Conquista</p>
                  <p className="text-sm text-green-700">
                    Você está próximo de desbloquear "{nextAchievement.name}" - {nextAchievement.progress}% completo!
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Filters */}
        <Tabs defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
          <TabsList className="grid grid-cols-3 w-full">
            {statusFilters.map(filter => (
              <TabsTrigger 
                key={filter.id} 
                value={filter.id}
                className="data-[state=active]:bg-amarelo-ouro data-[state=active]:text-white"
              >
                {filter.name} ({filter.count})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Rarity Filter */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={selectedRarity === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedRarity("all")}
            className={selectedRarity === "all" ? "bg-gray-600" : ""}
          >
            Todas Raridades
          </Button>
          {["common", "rare", "epic", "legendary"].map(rarity => {
            const config = getRarityConfig(rarity);
            return (
              <Button
                key={rarity}
                variant={selectedRarity === rarity ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRarity(rarity)}
                className={selectedRarity === rarity ? config.bg + " " + config.color : ""}
              >
                {config.label}
              </Button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => {
            const Icon = achievement.icon;
            const rarityConfig = getRarityConfig(achievement.rarity);
            const isUnlocked = achievement.unlocked;
            
            return (
              <Card 
                key={achievement.id} 
                className={`group cursor-pointer transition-all duration-300 overflow-hidden ${
                  isUnlocked ? "hover:shadow-xl" : "opacity-75 grayscale"
                } ${rarityConfig.border} border-2 ${
                  achievement.rarity === "legendary" && isUnlocked ? "legendary-glow" : ""
                }`}
              >
                <div className={`h-24 bg-gradient-to-br ${achievement.color} flex items-center justify-center relative`}>
                  <Icon className={`w-12 h-12 ${isUnlocked ? "text-white" : "text-white/50"}`} />
                  
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}
                  
                  {/* Rarity Badge */}
                  <Badge className={`absolute top-2 right-2 ${rarityConfig.bg} ${rarityConfig.color}`}>
                    {rarityConfig.label}
                  </Badge>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{achievement.name}</h3>
                    <span className="text-sm font-bold text-amarelo-ouro">+{achievement.points} XP</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  
                  {isUnlocked ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Trophy className="w-4 h-4" />
                        <span>Desbloqueada em {achievement.unlockedAt}</span>
                      </div>
                    </div>
                  ) : achievement.progress ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progresso</span>
                        <span className="font-semibold">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      {achievement.requirement && (
                        <p className="text-xs text-gray-500">{achievement.requirement}</p>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-500">Bloqueada</p>
                      {achievement.requirement && (
                        <p className="text-xs text-gray-400 mt-1">{achievement.requirement}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Level Progress */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-indigo-900 text-lg">Progresso do Nível</h3>
                <p className="text-indigo-700">Nível 15 → Nível 16</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-900">2,800 / 3,000 XP</p>
                <p className="text-sm text-indigo-600">200 XP para o próximo nível</p>
              </div>
            </div>
            <Progress value={93} className="h-3" />
          </CardContent>
        </Card>
      </div>
    </div>
    </AthleteLayout>
  );
}