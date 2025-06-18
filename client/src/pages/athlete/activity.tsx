import AthleteLayout from "@/components/layout/AthleteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Activity, Eye, Trophy, TrendingUp, Award, Play, User, Video, Bell, Filter, Calendar, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { generateActivity } from "@/lib/brazilianData";

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

// Generate more detailed activities
const generateDetailedActivities = (): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  const dates = ["Hoje", "Ontem", "2 dias atrás", "3 dias atrás", "5 dias atrás", "1 semana atrás", "2 semanas atrás"];
  const times = ["agora mesmo", "5 minutos atrás", "15 minutos atrás", "1 hora atrás", "3 horas atrás", "8 horas atrás"];
  
  // Recent activities (today)
  activities.push({
    id: "1",
    type: "view",
    title: "Novo Olheiro Interessado",
    message: "Seu perfil foi visualizado por um scout do Santos FC",
    time: "5 minutos atrás",
    date: "Hoje",
    icon: Eye,
    metadata: { club: "Santos FC", viewCount: 3 },
    isNew: true
  });
  
  activities.push({
    id: "2",
    type: "achievement",
    title: "Conquista Desbloqueada!",
    message: "Você desbloqueou 'Dedicação' - 7 dias de sequência",
    time: "1 hora atrás",
    date: "Hoje",
    icon: Trophy,
    metadata: { achievement: "Dedicação", xpEarned: 300 },
    isNew: true
  });
  
  activities.push({
    id: "3",
    type: "test",
    title: "Novo Teste Disponível",
    message: "Teste de Agilidade Illinois agora disponível para você",
    time: "3 horas atrás",
    date: "Hoje",
    icon: Play,
    metadata: { test: "Illinois Agility Test" }
  });
  
  // Yesterday's activities
  activities.push({
    id: "4",
    type: "rank",
    title: "Subiu no Ranking!",
    message: "Você subiu para o 78º percentil em velocidade",
    time: "14:30",
    date: "Ontem",
    icon: TrendingUp,
    metadata: { skill: "velocidade", percentile: 78 }
  });
  
  activities.push({
    id: "5",
    type: "view",
    title: "Múltiplas Visualizações",
    message: "Seu perfil foi visualizado 5 vezes nas últimas 24 horas",
    time: "10:15",
    date: "Ontem",
    icon: Eye,
    metadata: { viewCount: 5 }
  });
  
  activities.push({
    id: "6",
    type: "social",
    title: "Nova Conexão",
    message: "Pedro Santos da sua região começou a seguir você",
    time: "09:00",
    date: "Ontem",
    icon: User,
    metadata: { player: "Pedro Santos" }
  });
  
  // Older activities
  activities.push({
    id: "7",
    type: "achievement",
    title: "Conquista Épica!",
    message: "Você desbloqueou 'Relâmpago' - Top 10% em velocidade",
    time: "16:45",
    date: "2 dias atrás",
    icon: Trophy,
    metadata: { achievement: "Relâmpago", xpEarned: 500 }
  });
  
  activities.push({
    id: "8",
    type: "update",
    title: "Atualização Regional",
    message: "João Silva da sua região melhorou seu tempo no sprint 20m",
    time: "12:30",
    date: "2 dias atrás",
    icon: TrendingUp,
    metadata: { player: "João Silva" }
  });
  
  activities.push({
    id: "9",
    type: "system",
    title: "Novo Recurso!",
    message: "Teste de Tomada de Decisão adicionado ao Combine Digital",
    time: "08:00",
    date: "3 dias atrás",
    icon: Bell,
    metadata: {}
  });
  
  activities.push({
    id: "10",
    type: "view",
    title: "Scout Premium",
    message: "Seu perfil foi visualizado por um scout verificado do Flamengo",
    time: "19:20",
    date: "3 dias atrás",
    icon: Eye,
    metadata: { club: "Flamengo", viewCount: 2 }
  });
  
  activities.push({
    id: "11",
    type: "test",
    title: "Teste Completado",
    message: "Você completou o Teste de Embaixadinhas com 87 toques",
    time: "15:00",
    date: "5 dias atrás",
    icon: Play,
    metadata: { test: "Embaixadinhas" }
  });
  
  activities.push({
    id: "12",
    type: "rank",
    title: "Melhoria Significativa",
    message: "Você melhorou 15 posições no ranking de agilidade",
    time: "11:30",
    date: "1 semana atrás",
    icon: TrendingUp,
    metadata: { skill: "agilidade" }
  });
  
  // Add more generated activities
  for (let i = 0; i < 20; i++) {
    const activity = generateActivity();
    activities.push({
      id: `gen-${i}`,
      type: activity.type as any,
      title: activity.type === "view" ? "Visualização de Perfil" : 
             activity.type === "achievement" ? "Nova Conquista" :
             activity.type === "test" ? "Teste Disponível" :
             activity.type === "update" ? "Atualização" : "Mudança no Ranking",
      message: activity.message,
      time: times[Math.floor(Math.random() * times.length)],
      date: dates[Math.floor(Math.random() * dates.length)],
      icon: activity.type === "view" ? Eye :
            activity.type === "achievement" ? Trophy :
            activity.type === "test" ? Play :
            activity.type === "update" ? TrendingUp : Award
    });
  }
  
  return activities;
};

export default function ActivityPage() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  
  const activities = generateDetailedActivities();
  
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
    view: { color: "text-verde-brasil", bg: "bg-green-100" },
    achievement: { color: "text-amarelo-ouro", bg: "bg-yellow-100" },
    test: { color: "text-azul-celeste", bg: "bg-blue-100" },
    update: { color: "text-purple-600", bg: "bg-purple-100" },
    rank: { color: "text-orange-600", bg: "bg-orange-100" },
    social: { color: "text-pink-600", bg: "bg-pink-100" },
    system: { color: "text-gray-600", bg: "bg-gray-100" }
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
              <BreadcrumbPage>Histórico de Atividade</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-bebas text-4xl text-azul-celeste mb-2 flex items-center gap-3">
            <Activity className="w-10 h-10" />
            HISTÓRICO DE ATIVIDADE
          </h1>
          <p className="text-gray-600">
            Acompanhe todas as suas atividades e interações na plataforma
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Visualizações Hoje</p>
                    <p className="text-2xl font-bold text-green-700">3</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conquistas esta Semana</p>
                    <p className="text-2xl font-bold text-yellow-700">2</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Testes Completados</p>
                    <p className="text-2xl font-bold text-blue-700">7</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Atividade Total</p>
                    <p className="text-2xl font-bold text-purple-700">{activities.length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-purple-600" />
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
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
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
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhuma atividade encontrada para os filtros selecionados.</p>
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
                        <div className="bg-white px-4 py-2 rounded-full shadow-sm border">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <h3 className="font-semibold text-gray-700">{date}</h3>
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
                          
                          <Card className={`timeline-content ${isLeft ? 'timeline-left' : 'timeline-right'} ${
                            activity.isNew ? 'border-verde-brasil border-2' : ''
                          } hover:shadow-xl`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-6 h-6 ${config.color}`} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {activity.title}
                                      {activity.isNew && (
                                        <Badge className="ml-2 bg-verde-brasil text-white text-xs">NOVO</Badge>
                                      )}
                                    </h4>
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-2">{activity.message}</p>
                                  
                                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
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
    </AthleteLayout>
  );
}