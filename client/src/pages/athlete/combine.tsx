import EnhancedAthleteLayout from "@/components/layout/EnhancedAthleteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlassTabs, GlassTabsList, GlassTabsTrigger, GlassTabsContent } from "@/components/ui/glass-tabs";
import { GlassStats, GlassStatsGrid } from "@/components/ui/glass-stats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import VerificationBadge from "@/components/ui/verification-badge";
import { ArrowLeft, Zap, Video, Play, Clock, Star, Filter, TrendingUp, Award, Target, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

interface Test {
  id: string;
  name: string;
  type: "speed" | "agility" | "technical" | "endurance" | "strength" | "mental";
  category: string;
  description: string;
  duration: string;
  difficulty: 1 | 2 | 3;
  bestScore?: string;
  lastAttempt?: string;
  attempts?: number;
  verified?: boolean;
  trending?: boolean;
  recommended?: boolean;
  new?: boolean;
  percentile?: number;
  xpReward: number;
}

const allTests: Test[] = [
  // Velocidade
  {
    id: "speed_10m",
    name: "Sprint 10 metros",
    type: "speed",
    category: "Velocidade",
    description: "Teste sua explosão nos primeiros metros",
    duration: "3 min",
    difficulty: 1,
    bestScore: "1.72s",
    lastAttempt: "2 dias atrás",
    attempts: 5,
    verified: true,
    percentile: 85,
    xpReward: 50
  },
  {
    id: "speed_20m",
    name: "Sprint 20 metros",
    type: "speed",
    category: "Velocidade",
    description: "Velocidade máxima em distância curta",
    duration: "5 min",
    difficulty: 1,
    bestScore: "2.76s",
    lastAttempt: "1 semana atrás",
    attempts: 3,
    verified: true,
    recommended: true,
    percentile: 78,
    xpReward: 75
  },
  {
    id: "speed_40m",
    name: "Sprint 40 metros",
    type: "speed",
    category: "Velocidade",
    description: "Teste completo de velocidade",
    duration: "5 min",
    difficulty: 2,
    new: true,
    xpReward: 100
  },
  
  // Agilidade
  {
    id: "agility_5_10_5",
    name: "Teste 5-10-5",
    type: "agility",
    category: "Agilidade",
    description: "Mudança de direção e aceleração",
    duration: "7 min",
    difficulty: 2,
    trending: true,
    xpReward: 125
  },
  {
    id: "agility_illinois",
    name: "Illinois Agility Test",
    type: "agility",
    category: "Agilidade",
    description: "Percurso completo de agilidade",
    duration: "10 min",
    difficulty: 3,
    bestScore: "15.8s",
    lastAttempt: "2 semanas atrás",
    attempts: 2,
    verified: false,
    percentile: 68,
    xpReward: 150
  },
  {
    id: "agility_cone_drill",
    name: "Cone Drill",
    type: "agility",
    category: "Agilidade",
    description: "Precisão em mudanças de direção",
    duration: "8 min",
    difficulty: 2,
    recommended: true,
    xpReward: 100
  },
  
  // Técnico
  {
    id: "technical_juggling",
    name: "Embaixadinhas",
    type: "technical",
    category: "Técnico",
    description: "Controle de bola no ar",
    duration: "5 min",
    difficulty: 2,
    bestScore: "87",
    lastAttempt: "3 dias atrás",
    attempts: 8,
    verified: true,
    percentile: 92,
    xpReward: 100
  },
  {
    id: "technical_passing",
    name: "Precisão de Passes",
    type: "technical",
    category: "Técnico",
    description: "Acerte alvos com passes precisos",
    duration: "10 min",
    difficulty: 2,
    trending: true,
    xpReward: 125
  },
  {
    id: "technical_dribbling",
    name: "Slalom com Bola",
    type: "technical",
    category: "Técnico",
    description: "Conduza a bola entre cones",
    duration: "8 min",
    difficulty: 3,
    new: true,
    xpReward: 150
  },
  
  // Resistência
  {
    id: "endurance_yo_yo",
    name: "Yo-Yo Test Nível 1",
    type: "endurance",
    category: "Resistência",
    description: "Teste intervalado de resistência",
    duration: "15-20 min",
    difficulty: 3,
    xpReward: 200
  },
  {
    id: "endurance_12min",
    name: "Teste de Cooper",
    type: "endurance",
    category: "Resistência",
    description: "Distância máxima em 12 minutos",
    duration: "12 min",
    difficulty: 3,
    recommended: true,
    xpReward: 175
  },
  
  // Força
  {
    id: "strength_vertical",
    name: "Salto Vertical",
    type: "strength",
    category: "Força",
    description: "Altura máxima de salto",
    duration: "5 min",
    difficulty: 1,
    bestScore: "52cm",
    lastAttempt: "1 semana atrás",
    attempts: 4,
    verified: true,
    percentile: 81,
    xpReward: 75
  },
  {
    id: "strength_horizontal",
    name: "Salto Horizontal",
    type: "strength",
    category: "Força",
    description: "Distância máxima de salto",
    duration: "5 min",
    difficulty: 1,
    new: true,
    xpReward: 75
  },
  
  // Mental
  {
    id: "mental_reaction",
    name: "Tempo de Reação",
    type: "mental",
    category: "Mental",
    description: "Velocidade de resposta a estímulos",
    duration: "5 min",
    difficulty: 1,
    trending: true,
    xpReward: 50
  },
  {
    id: "mental_decision",
    name: "Tomada de Decisão",
    type: "mental",
    category: "Mental",
    description: "Escolhas rápidas sob pressão",
    duration: "10 min",
    difficulty: 2,
    new: true,
    xpReward: 100
  }
];

export default function CombinePage() {
  const [, setLocation] = useLocation();
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  const getTestStatus = (test: Test) => {
    if (test.verified) return "verified";
    if (test.bestScore && !test.verified) return "in_analysis";
    return "to_do";
  };
  
  const filteredTests = allTests.filter(test => {
    if (selectedStatus === "all") return true;
    const status = getTestStatus(test);
    if (selectedStatus === "to_do" && status === "to_do") return true;
    if (selectedStatus === "verified" && status === "verified") return true;
    if (selectedStatus === "in_analysis" && status === "in_analysis") return true;
    return false;
  });
  
  // Sort tests based on selected option
  const sortedTests = [...filteredTests].sort((a, b) => {
    switch (sortBy) {
      case "recommended":
        return (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0);
      case "difficulty_asc":
        return a.difficulty - b.difficulty;
      case "difficulty_desc":
        return b.difficulty - a.difficulty;
      case "recent":
        return ((b.new ? 1 : 0) + (b.trending ? 1 : 0)) - ((a.new ? 1 : 0) + (a.trending ? 1 : 0));
      case "xp":
        return b.xpReward - a.xpReward;
      default:
        return 0;
    }
  });

  const completedTests = allTests.filter(t => t.bestScore).length;
  const totalXP = allTests.filter(t => t.bestScore).reduce((sum, t) => sum + t.xpReward, 0);

  const getTestColor = (type: string) => {
    const colors = {
      speed: "glass-morph-green",
      agility: "glass-morph-yellow",
      technical: "glass-morph-blue",
      endurance: "glass-morph-purple",
      strength: "glass-morph-orange",
      mental: "glass-morph-pink"
    };
    return colors[type as keyof typeof colors] || colors.speed;
  };

  const getTestIconColor = (type: string) => {
    const colors = {
      speed: "text-green-400",
      agility: "text-yellow-400",
      technical: "text-blue-400",
      endurance: "text-purple-400",
      strength: "text-orange-400",
      mental: "text-pink-400"
    };
    return colors[type as keyof typeof colors] || colors.speed;
  };

  return (
    <EnhancedAthleteLayout>
      <div className="min-h-screen relative">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-64 h-64 bg-verde-brasil rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-azul-celeste rounded-full blur-3xl"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 relative z-10">
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
              <BreadcrumbPage>Combine Digital</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-bebas text-4xl text-white mb-2 flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-10 h-10" />
            </motion.div>
            COMBINE DIGITAL
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/60"
          >
            Sua central de testes para performance de elite. Cada teste verificado aumenta sua visibilidade.
          </motion.p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Card className="glass-morph-green hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Testes Completados</p>
                      <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="text-2xl font-bold text-white"
                      >
                        {completedTests}/{allTests.length}
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Target className="w-8 h-8 text-green-400" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <Card className="glass-morph-yellow hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">XP Total</p>
                      <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="text-2xl font-bold text-white"
                      >
                        {totalXP.toLocaleString()}
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Star className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Card className="glass-morph-purple hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/60">Percentil Médio</p>
                      <motion.p 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: "spring" }}
                        className="text-2xl font-bold text-white"
                      >
                        82º
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Recommendation - Moved to top */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="mb-6 glass-morph-purple hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-purple-400 mt-0.5" />
                </motion.div>
                <div>
                <h3 className="font-semibold text-white mb-2">Recomendação Personalizada da IA</h3>
                <p className="text-white/80">
                  Baseado no seu desempenho recente, recomendamos focar em testes de <strong>Agilidade</strong> para 
                  equilibrar seu perfil. Você está no top 10% em velocidade, mas pode melhorar sua mudança de direção.
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Status Tabs */}
          <GlassTabs defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus}>
            <GlassTabsList className="grid w-full grid-cols-4">
              <GlassTabsTrigger value="all">Todos</GlassTabsTrigger>
              <GlassTabsTrigger value="to_do">A Realizar</GlassTabsTrigger>
              <GlassTabsTrigger value="verified">Verificados</GlassTabsTrigger>
              <GlassTabsTrigger value="in_analysis">Em Análise</GlassTabsTrigger>
            </GlassTabsList>
          </GlassTabs>
          
          {/* Sorting Dropdown */}
          <div className="flex justify-end">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[250px] glass-morph border-white/10">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="glass-morph-dark border-white/10">
                <SelectItem value="recommended">Recomendados</SelectItem>
                <SelectItem value="difficulty_asc">Dificuldade (Fácil → Difícil)</SelectItem>
                <SelectItem value="difficulty_desc">Dificuldade (Difícil → Fácil)</SelectItem>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="xp">Maior XP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tests Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedTests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="group cursor-pointer glass-morph border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative">
                <div className={`h-32 ${getTestColor(test.type)} flex items-center justify-center relative`}>
                  <Video className={`w-16 h-16 ${getTestIconColor(test.type)}`} />
                  
                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {test.verified && <VerificationBadge level="silver" size="sm" />}
                    {test.new && <Badge className="bg-red-500 text-white">NOVO</Badge>}
                    {test.trending && <Badge className="bg-purple-500 text-white">EM ALTA</Badge>}
                    {test.recommended && <Badge className="bg-verde-brasil text-white">RECOMENDADO</Badge>}
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="w-14 h-14 bg-white/0 group-hover:bg-white/90 rounded-full flex items-center justify-center"
                    >
                      <Play className="w-7 h-7 text-verde-brasil ml-1" />
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{test.name}</h3>
                <p className="text-sm text-white/60 mb-3">{test.description}</p>
                
                {/* Test Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-white/40" />
                      {test.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      {[1, 2, 3].map(star => (
                        <span key={star} className={star <= test.difficulty ? "text-yellow-400" : "text-white/20"}>
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Recompensa XP</span>
                    <span className="font-semibold text-verde-brasil">+{test.xpReward} XP</span>
                  </div>
                </div>
                
                {/* Progress/Status */}
                {test.bestScore ? (
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-white/60">Melhor resultado</span>
                      <span className="font-bold text-verde-brasil">{test.bestScore}</span>
                    </div>
                    {test.percentile && (
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white/60">Percentil</span>
                        <span className="font-semibold">{test.percentile}º</span>
                      </div>
                    )}
                    <p className="text-xs text-white/40">
                      {test.attempts} tentativas • Última: {test.lastAttempt}
                    </p>
                  </div>
                ) : (
                  <div className="border-t pt-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-verde-brasil to-green-600 hover:from-green-600 hover:to-verde-brasil"
                      size="sm"
                    >
                      Iniciar Teste
                    </Button>
                  </div>
                )}
              </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
    </EnhancedAthleteLayout>
  );
}