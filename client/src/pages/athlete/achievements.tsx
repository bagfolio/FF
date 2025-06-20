import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent } from "@/components/ui/glass-tabs";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Trophy, Lock, Star, Sparkles, Award, Target, Flame, Zap, Medal, Crown, Shield, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { achievementService } from "@/services/api";
import { useAthleteStats } from "@/hooks/useAthleteStats";

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

// Icon mapping for achievements
const iconMap = {
  target: Target,
  zap: Zap,
  shield: Shield,
  star: Star,
  crown: Crown,
  award: Award,
  medal: Medal,
  flame: Flame,
  trophy: Trophy,
  trending_up: TrendingUp
};

export default function AchievementsPage() {
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");

  // Fetch athlete data and achievements from API
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete } = useQuery({ 
    queryKey: ["/api/athletes/me"],
    enabled: !!user 
  });
  
  const { data: achievementsData = [], isLoading } = useQuery({ 
    queryKey: ['athlete-achievements', athlete?.id],
    queryFn: () => achievementService.getAthleteAchievements(athlete!.id),
    enabled: !!athlete?.id,
  });
  
  // Fetch real stats including XP and level
  const { data: stats } = useAthleteStats(athlete?.id);

  // Map API data to include icons
  const allAchievements = achievementsData.map((achievement: any) => ({
    ...achievement,
    icon: iconMap[achievement.iconKey] || Trophy
  }));

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
      common: { label: "Comum", color: "text-white/60", bg: "glass-morph", border: "border-white/20" },
      rare: { label: "Raro", color: "text-blue-400", bg: "glass-morph-blue", border: "border-blue-400/30" },
      epic: { label: "Épico", color: "text-purple-400", bg: "glass-morph-purple", border: "border-purple-400/30" },
      legendary: { label: "Lendário", color: "text-yellow-400", bg: "glass-morph-yellow", border: "border-yellow-400/30" }
    };
    return configs[rarity as keyof typeof configs] || configs.common;
  };

  return (
    <EnhancedAthleteLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
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
          <h1 className="font-bebas text-4xl text-white mb-2 flex items-center gap-3">
            <Trophy className="w-10 h-10" />
            GALERIA DE CONQUISTAS
          </h1>
          <p className="text-xl text-white/80 font-medium">
            🏆 {stats?.totalXP || 0} XP • Rank: {stats?.currentLevel ? `Nível ${stats.currentLevel}` : 'Iniciante'} ✨
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="glass-morph-orange hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">XP Total</p>
                    <p className="text-2xl font-bold text-white">{totalXP.toLocaleString()}</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morph-green hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Desbloqueadas</p>
                    <p className="text-2xl font-bold text-white">{unlockedCount}/{allAchievements.length}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morph-purple hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Taxa de Conclusão</p>
                    <p className="text-2xl font-bold text-white">{allAchievements.length > 0 ? Math.round((unlockedCount / allAchievements.length) * 100) : 0}%</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morph-blue hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Nível Atual</p>
                    <p className="text-2xl font-bold text-white">{stats?.currentLevel || 0}</p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Achievement Alert */}
        {nextAchievement && (
          <Card className="mb-6 glass-morph-green">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-green-400" />
                <div className="flex-1">
                  <p className="font-semibold text-white">Próxima Conquista</p>
                  <p className="text-sm text-white/80">
                    Você está próximo de desbloquear "{nextAchievement.name}" - {nextAchievement.progress}% completo!
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="glass-morph border-green-400/30 text-green-400 hover:bg-green-400/10"
                >
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Filters */}
        <GlassTabs defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus} className="mb-6">
          <GlassTabsList className="grid grid-cols-3 w-full">
            {statusFilters.map(filter => (
              <GlassTabsTrigger 
                key={filter.id} 
                value={filter.id}
              >
                {filter.name} ({filter.count})
              </GlassTabsTrigger>
            ))}
          </GlassTabsList>
        </GlassTabs>

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
                className={`group cursor-pointer transition-all duration-300 overflow-hidden glass-morph ${
                  isUnlocked ? "hover:shadow-xl hover:border-white/30" : "opacity-75 grayscale"
                } ${rarityConfig.border} ${
                  achievement.rarity === "legendary" && isUnlocked ? "legendary-glow" : ""
                }`}
              >
                <div className={`h-24 ${getRarityConfig(achievement.rarity).bg} flex items-center justify-center relative`}>
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
                    <span className="text-sm font-bold text-yellow-400">+{achievement.points} XP</span>
                  </div>
                  
                  <p className="text-sm text-white/60 mb-3">{achievement.description}</p>
                  
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
                        <span className="text-white/60">Progresso</span>
                        <span className="font-semibold">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                      {achievement.requirement && (
                        <p className="text-xs text-white/40">{achievement.requirement}</p>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-white/50">Bloqueada</p>
                      {achievement.requirement && (
                        <p className="text-xs text-white/30 mt-1">{achievement.requirement}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Level Progress */}
        <Card className="mt-8 glass-morph-purple">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-lg">Progresso do Nível</h3>
                <p className="text-white/80">Nível {stats?.currentLevel || 0} → Nível {(stats?.currentLevel || 0) + 1}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{stats?.currentLevelXP || 0} / {stats?.nextLevelXP || 200} XP</p>
                <p className="text-sm text-white/60">{(stats?.nextLevelXP || 200) - (stats?.currentLevelXP || 0)} XP para o próximo nível</p>
              </div>
            </div>
            <Progress value={stats?.levelProgress || 0} className="h-3" />
          </CardContent>
        </Card>
      </div>
    </div>
    </EnhancedAthleteLayout>
  );
}