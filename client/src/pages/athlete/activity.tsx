import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Activity, Eye, Trophy, TrendingUp, Award, Play, User, Video, Bell, Filter, Calendar, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/api";
import { useActivityStats } from "@/hooks/useAthleteStats";

interface ActivityItem {
  id: string;
  type: "view" | "achievement" | "test" | "update" | "rank" | "social" | "system";
  title: string;
  message: string;
  time: string;
  date: string;
  icon?: any;
  metadata?: {
    club?: string;
    achievement?: string;
    test?: string;
    player?: string;
    skill?: string;
    percentile?: number;
    xpEarned?: number;
    viewCount?: number;
  };
  isNew?: boolean;
}


export default function ActivityPage() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  
  // Fetch real activities from API
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete } = useQuery({ 
    queryKey: ["/api/athletes/me"],
    enabled: !!user 
  });
  
  const { data: activities = [], isLoading } = useQuery({ 
    queryKey: ['athlete-activities', athlete?.id, selectedType, selectedDate],
    queryFn: () => activityService.getAthleteActivities(athlete!.id.toString(), { type: selectedType, date: selectedDate }),
    enabled: !!athlete?.id,
  });
  
  // Fetch real-time stats
  const { data: todayStats } = useActivityStats(athlete?.id, 'today');
  const { data: weekStats } = useActivityStats(athlete?.id, 'week');
  
  const activityTypes = [
    { id: "all", name: "Todas", count: activities.length },
    { id: "view", name: "Visualizações", count: activities.filter(a => a.type === "view").length, icon: Eye },
    { id: "achievement", name: "Conquistas", count: activities.filter(a => a.type === "achievement").length, icon: Trophy },
    { id: "test", name: "Testes", count: activities.filter(a => a.type === "test").length, icon: Play },
    { id: "rank", name: "Rankings", count: activities.filter(a => a.type === "rank").length, icon: TrendingUp },
    { id: "social", name: "Social", count: activities.filter(a => a.type === "social").length, icon: User }
  ];
  
  const dateFilters = [
    { id: "all", name: "Todo Período" },
    { id: "today", name: "Hoje" },
    { id: "yesterday", name: "Ontem" },
    { id: "week", name: "Esta Semana" },
    { id: "month", name: "Este Mês" }
  ];
  
  const filteredActivities = activities.filter(activity => {
    const typeMatch = selectedType === "all" || activity.type === selectedType;
    const dateMatch = selectedDate === "all" || 
                     (selectedDate === "today" && activity.date === "Hoje") ||
                     (selectedDate === "yesterday" && activity.date === "Ontem") ||
                     (selectedDate === "week" && ["Hoje", "Ontem", "2 dias atrás", "3 dias atrás", "5 dias atrás"].includes(activity.date));
    return typeMatch && dateMatch;
  });
  
  const iconConfig = {
    view: { color: "text-green-400", bg: "glass-morph-green" },
    achievement: { color: "text-yellow-400", bg: "glass-morph-yellow" },
    test: { color: "text-blue-400", bg: "glass-morph-blue" },
    update: { color: "text-purple-400", bg: "glass-morph-purple" },
    rank: { color: "text-orange-400", bg: "glass-morph-orange" },
    social: { color: "text-pink-400", bg: "glass-morph-pink" },
    system: { color: "text-white/60", bg: "glass-morph" }
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
              <BreadcrumbPage>Histórico de Atividade</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bebas text-4xl text-white mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10" />
            HISTÓRICO DE ATIVIDADE
          </h1>
          <p className="text-white/60">
            Acompanhe todas as suas atividades e interações na plataforma
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="glass-morph-green hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Visualizações Hoje</p>
                    <p className="text-2xl font-bold text-white">{todayStats?.views || 0}</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morph-yellow hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Conquistas esta Semana</p>
                    <p className="text-2xl font-bold text-white">{weekStats?.achievements || 0}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morph-blue hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Testes Completados</p>
                    <p className="text-2xl font-bold text-white">{weekStats?.totalTests || 0}</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-morph-purple hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Atividade Total</p>
                    <p className="text-2xl font-bold text-white">{activities.length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Type Filter */}
          <div className="flex-1">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="glass-morph border-white/10">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="glass-morph-dark border-white/10">
                <SelectItem value="all">Tudo</SelectItem>
                <SelectItem value="view">Visualizações de Scout</SelectItem>
                <SelectItem value="achievement">Conquistas</SelectItem>
                <SelectItem value="test">Testes Completos</SelectItem>
                <SelectItem value="rank">Atualizações de Ranking</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Date Filter */}
          <div>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[200px] glass-morph border-white/10">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent className="glass-morph-dark border-white/10">
                {dateFilters.map(filter => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="timeline-container">
          {filteredActivities.length === 0 ? (
            <Card className="p-8 text-center glass-morph border-white/10">
              <p className="text-white/50">Nenhuma atividade encontrada para os filtros selecionados.</p>
            </Card>
          ) : (
            <>
              <div className="timeline-line" />
              
              {/* Group activities by date */}
              {["Hoje", "Ontem", "2 dias atrás", "3 dias atrás", "5 dias atrás", "1 semana atrás", "2 semanas atrás"].map(date => {
                const dateActivities = filteredActivities.filter(a => a.date === date);
                if (dateActivities.length === 0) return null;
                
                return (
                  <div key={date} className="mb-12">
                    {/* Date Header */}
                    <div className="timeline-item">
                      <div className="timeline-dot border-gray-400 bg-gray-100" />
                      <div className="flex items-center justify-center mb-6">
                        <div className="glass-morph px-4 py-2 rounded-full border-white/10">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-white/50" />
                            <h3 className="font-semibold text-white">{date}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Activities for this date */}
                    {dateActivities.map((activity, index) => {
                      const config = iconConfig[activity.type] || iconConfig.system;
                      const Icon = activity.icon || Bell;
                      const isLeft = index % 2 === 0;
                      const getDotColor = () => {
                        const colors = {
                          view: "border-green-500",
                          achievement: "border-yellow-500",
                          test: "border-blue-500",
                          rank: "border-orange-500",
                          social: "border-pink-500",
                          update: "border-purple-500",
                          system: "border-gray-500"
                        };
                        return colors[activity.type] || colors.system;
                      };
                      
                      return (
                        <div key={activity.id} className="timeline-item">
                          <div className={`timeline-dot ${getDotColor()} bg-white`} />
                          
                          <Card className={`timeline-content ${isLeft ? 'timeline-left' : 'timeline-right'} glass-morph border-white/10 ${
                            activity.isNew ? 'border-green-500 border-2' : ''
                          } hover:shadow-xl hover:border-white/20 transition-all duration-300`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-6 h-6 ${config.color}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-white">
                                      {activity.title}
                                      {activity.isNew && (
                                        <Badge className="ml-2 bg-verde-brasil text-white text-xs">NOVO</Badge>
                                      )}
                                    </h4>
                                  </div>
                                  
                                  <p className="text-sm text-white/60 mb-2">{activity.message}</p>
                                  
                                  <div className="flex items-center gap-1 text-xs text-white/40 mb-2">
                                    <Clock className="w-3 h-3" />
                                    <span>{activity.date === "Hoje" || activity.date === "Ontem" ? activity.time : `${activity.date} - ${activity.time}`}</span>
                                  </div>
                                  
                                  {/* Metadata */}
                                  {activity.metadata && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {activity.metadata.xpEarned && (
                                        <Badge variant="secondary" className="text-xs">
                                          +{activity.metadata.xpEarned} XP
                                        </Badge>
                                      )}
                                      {activity.metadata.percentile && (
                                        <Badge variant="secondary" className="text-xs">
                                          {activity.metadata.percentile}º percentil
                                        </Badge>
                                      )}
                                      {activity.metadata.viewCount && activity.metadata.viewCount > 1 && (
                                        <Badge variant="secondary" className="text-xs">
                                          {activity.metadata.viewCount}x visualizações
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Action buttons for certain types */}
                                  {activity.type === "test" && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="mt-2"
                                      onClick={() => setLocation('/athlete/combine')}
                                    >
                                      Fazer Teste
                                    </Button>
                                  )}
                                  {activity.type === "achievement" && (
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="mt-2"
                                      onClick={() => setLocation('/athlete/achievements')}
                                    >
                                      Ver Conquista
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              
              {/* End of timeline indicator */}
              <div className="timeline-item">
                <div className="timeline-dot border-gray-300 bg-gray-200" />
              </div>
            </>
          )}
        </div>

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Carregar Mais Atividades
            </Button>
          </div>
        )}
      </div>
    </div>
    </EnhancedAthleteLayout>
  );
}