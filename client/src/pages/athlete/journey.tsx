import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Clock, 
  TrendingUp, 
  Trophy, 
  Share2, 
  Download,
  Eye,
  Target,
  Zap,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/journey.css';
import type { AthleteProfile, AthleteStats, DashboardData, Achievement, Activity, JourneyMilestone, SkillProgress, Goal } from '@/types/journey';
import EnhancedAthleteLayout from '@/components/layout/EnhancedAthleteLayout';
import PerformanceRadar from '@/components/ui/performance-radar';
import { TrustPyramidProgressWidget } from '@/components/features/athlete/TrustPyramidProgressWidget';
import ProgressEnhanced from '@/components/ui/progress-enhanced';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { activityService, performanceService } from '@/services/api';
import { useAthleteSkills } from '@/hooks/useAthleteSkills';
import { Skeleton } from '@/components/ui/skeleton';
import { ComingSoonCard } from '@/components/ui/coming-soon-card';

type JourneyView = 'overview' | 'timeline' | 'evolution' | 'highlights';

// Constants
const REFRESH_INTERVALS = {
  DASHBOARD: 300000,    // 5 minutes
  ACTIVITIES: 60000,    // 1 minute  
  SCOUT_ACTIVITY: 30000 // 30 seconds
};

export default function AthleteJourneyPage() {
  const [activeView, setActiveView] = useState<JourneyView>('overview');
  
  // Get athlete data using existing pattern
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  const { data: athlete } = useQuery<AthleteProfile>({ 
    queryKey: ["/api/athletes/me"],
    enabled: !!user 
  });
  
  // Get dashboard data for stats
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard/athlete"],
    enabled: !!athlete,
    refetchInterval: REFRESH_INTERVALS.DASHBOARD
  });
  
  // Get activities for milestones
  const athleteId = athlete?.id;
  const { data: activities = [], isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['athlete-activities', athleteId],
    queryFn: () => activityService.getAthleteActivities(athleteId!.toString()),
    enabled: !!athleteId
  });
  
  // Use skills hook
  const { skills } = useAthleteSkills(athleteId);
  
  const isLoading = isDashboardLoading || isActivitiesLoading;
  
  return (
    <EnhancedAthleteLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
          {/* Journey Hero Section */}
          <JourneyHero 
            athlete={athlete} 
            stats={dashboardData?.stats}
            isLoading={isLoading}
          />
          
          {/* Navigation */}
          <JourneyNavigation activeView={activeView} onChange={setActiveView} />
          
          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeView === 'overview' && (
                <OverviewSection 
                  athlete={athlete} 
                  dashboardData={dashboardData}
                  activities={activities}
                  skills={skills}
                  isLoading={isLoading}
                />
              )}
              {activeView === 'timeline' && (
                <ComingSoonCard 
                  icon={Clock}
                  title="Linha do Tempo em Breve"
                  description="Sua história completa estará disponível aqui"
                  iconColor="text-amarelo-ouro"
                />
              )}
              {activeView === 'evolution' && (
                <ComingSoonCard 
                  icon={TrendingUp}
                  title="Evolução em Breve"
                  description="Acompanhe seu progresso ao longo do tempo"
                  iconColor="text-verde-brasil"
                />
              )}
              {activeView === 'highlights' && (
                <ComingSoonCard 
                  icon={Trophy}
                  title="Destaques em Breve"
                  description="Seus melhores momentos serão celebrados aqui"
                  iconColor="text-amarelo-ouro"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </EnhancedAthleteLayout>
  );
}

// Journey Hero Component
interface JourneyHeroProps {
  athlete: AthleteProfile | null | undefined;
  stats: AthleteStats | null | undefined;
  isLoading: boolean;
}

function JourneyHero({ athlete, stats, isLoading }: JourneyHeroProps) {
  // Calculate career duration
  const startDate = athlete?.createdAt ? new Date(athlete.createdAt) : new Date();
  const now = new Date();
  const monthsActive = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const yearsActive = Math.floor(monthsActive / 12);
  const remainingMonths = monthsActive % 12;
  
  const careerDuration = yearsActive > 0 
    ? `${yearsActive} ${yearsActive === 1 ? 'Ano' : 'Anos'}${remainingMonths > 0 ? ` e ${remainingMonths} ${remainingMonths === 1 ? 'Mês' : 'Meses'}` : ''}`
    : `${monthsActive} ${monthsActive === 1 ? 'Mês' : 'Meses'}`;
  
  if (isLoading) {
    return (
      <div className="glass-morph-dark rounded-2xl p-8">
        <div className="animate-pulse">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-48" />
              <div className="flex gap-6">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-verde-brasil/10 via-amarelo-ouro/5 to-azul-celeste/10 animate-gradient-shift" />
      
      {/* Floating orbs for depth */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-verde-brasil/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amarelo-ouro/20 rounded-full blur-3xl animate-float-delayed" />
      
      <div className="glass-morph-dark relative p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Section */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-verde-brasil to-azul-celeste p-1">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center" role="img" aria-label={`Avatar de ${athlete?.fullName || 'Atleta'}`}>
                <span className="text-4xl font-bebas text-white" aria-hidden="true">
                  {athlete?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
            {/* Trust level glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl animate-pulse",
              athlete?.verificationLevel === 'platinum' && "bg-purple-500/30",
              athlete?.verificationLevel === 'gold' && "bg-amarelo-ouro/30",
              athlete?.verificationLevel === 'silver' && "bg-gray-300/30",
              athlete?.verificationLevel === 'bronze' && "bg-orange-400/30"
            )} />
          </motion.div>
          
          {/* Stats Section */}
          <div className="text-center md:text-left flex-1">
            <motion.h1 
              className="text-4xl font-bebas tracking-wider text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {careerDuration} de Jornada
            </motion.h1>
            <motion.p 
              className="text-xl text-verde-brasil mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {athlete?.fullName} · {athlete?.position} · {athlete?.city}, {athlete?.state}
            </motion.p>
            
            {/* Quick Stats Strip */}
            <motion.div 
              className="flex flex-wrap gap-6 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <QuickStat 
                icon="🏆" 
                value={stats?.achievements || 0} 
                label="Conquistas" 
              />
              <QuickStat 
                icon="👀" 
                value={stats?.scoutViews || 0} 
                label="Visto por Scouts" 
              />
              <QuickStat 
                icon="⚡" 
                value={`Top ${stats?.percentile || 50}%`} 
                label="Ranking Geral" 
              />
              <QuickStat 
                icon="🔥" 
                value={stats?.streakDays || 0} 
                label="Dias de Sequência" 
              />
            </motion.div>
          </div>
          
          {/* CTA Section */}
          <motion.div 
            className="flex flex-col gap-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white font-semibold shadow-lg shadow-verde-brasil/20"
              aria-label="Compartilhar sua jornada de atleta"
            >
              <Share2 className="w-5 h-5 mr-2" aria-hidden="true" />
              Compartilhar Jornada
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="glass-morph border-white/20 hover:bg-white/10 text-white"
              aria-label="Exportar jornada como PDF"
            >
              <Download className="w-5 h-5 mr-2" aria-hidden="true" />
              Exportar PDF
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function QuickStat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-bold text-lg text-white">{value}</p>
        <p className="text-sm text-white/60">{label}</p>
      </div>
    </motion.div>
  );
}

// Journey Navigation Component
function JourneyNavigation({ 
  activeView, 
  onChange 
}: { 
  activeView: JourneyView; 
  onChange: (view: JourneyView) => void;
}) {
  const views = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutGrid },
    { id: 'timeline', label: 'Linha do Tempo', icon: Clock },
    { id: 'evolution', label: 'Evolução', icon: TrendingUp },
    { id: 'highlights', label: 'Destaques', icon: Trophy }
  ] as const;

  return (
    <motion.nav 
      className="glass-morph-dark rounded-full p-1 flex gap-1 overflow-x-auto scrollbar-hide"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {views.map((view, index) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;
        
        return (
          <motion.button
            key={view.id}
            onClick={() => onChange(view.id as JourneyView)}
            className={cn(
              "flex items-center gap-2 px-4 md:px-6 py-3 rounded-full transition-all whitespace-nowrap",
              isActive 
                ? "bg-gradient-to-r from-verde-brasil/20 to-azul-celeste/20 shadow-lg shadow-verde-brasil/20" 
                : "hover:bg-white/5"
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${view.id}`}
            aria-label={`Ver ${view.label}`}
          >
            <Icon className={cn("w-5 h-5", isActive && "text-verde-brasil")} />
            <span className={cn("font-medium", isActive && "text-verde-brasil")}>
              {view.label}
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}

// Overview Section Component
interface OverviewSectionProps {
  athlete: AthleteProfile | null | undefined;
  dashboardData: DashboardData | null | undefined;
  activities: Activity[];
  skills: any; // From useAthleteSkills hook
  isLoading: boolean;
}

function OverviewSection({ athlete, dashboardData, activities, skills, isLoading }: OverviewSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-8 space-y-6">
        {/* Current Performance Card */}
        <CurrentPerformanceCard 
          stats={dashboardData?.stats}
          skills={skills}
          athlete={athlete}
        />
        
        {/* Journey Milestones */}
        <JourneyMilestones 
          activities={activities}
          achievements={dashboardData?.achievements || []}
        />
        
        {/* Skills Evolution Preview */}
        <SkillsEvolutionPreview 
          athlete={athlete}
          skills={skills}
        />
      </div>
      
      {/* Right Column - Supporting Info */}
      <div className="lg:col-span-4 space-y-6">
        {/* Reuse Trust Pyramid */}
        <motion.div 
          className="glass-morph-dark rounded-2xl p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bebas mb-4 text-white">Nível de Confiança</h3>
          <TrustPyramidProgressWidget 
            currentLevel={athlete?.verificationLevel || 'bronze'}
            athlete={athlete}
            skills={skills}
          />
        </motion.div>
        
        {/* Scout Activity Widget */}
        <ScoutActivityWidget stats={dashboardData?.stats} />
        
        {/* Next Goals */}
        <NextGoalsWidget 
          athlete={athlete} 
          stats={dashboardData?.stats}
          achievements={dashboardData?.achievements || []}
        />
      </div>
    </div>
  );
}

// Current Performance Card Component
interface CurrentPerformanceCardProps {
  stats: AthleteStats | null | undefined;
  skills: any; // From useAthleteSkills hook
  athlete: AthleteProfile | null | undefined;
}

function CurrentPerformanceCard({ stats, skills, athlete }: CurrentPerformanceCardProps) {
  // Convert skills data to radar format
  const radarData = skills && skills.length > 0 ? [
    { label: "Velocidade", value: skills.find((s: any) => s.id === "speed")?.data?.sliderValue * 10 || 50 },
    { label: "Força", value: skills.find((s: any) => s.id === "strength")?.data?.sliderValue * 10 || 50 },
    { label: "Técnica", value: skills.find((s: any) => s.id === "technique")?.data?.sliderValue * 10 || 50 },
    { label: "Resistência", value: skills.find((s: any) => s.id === "stamina")?.data?.sliderValue * 10 || 50 },
    { label: "Agilidade", value: 75 }, // Mock for now
    { label: "Mental", value: 80 } // Mock for now
  ] : [
    { label: "Velocidade", value: 65 },
    { label: "Força", value: 70 },
    { label: "Técnica", value: 75 },
    { label: "Resistência", value: 80 },
    { label: "Agilidade", value: 72 },
    { label: "Mental", value: 68 }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass-morph-dark rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`
        }} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bebas text-white">Desempenho Atual</h3>
          {/* Form indicator */}
          <motion.div 
            className="glass-morph px-4 py-2 rounded-full"
            animate={{ 
              boxShadow: ["0 0 20px rgba(0,156,59,0.3)", "0 0 40px rgba(0,156,59,0.5)", "0 0 20px rgba(0,156,59,0.3)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-verde-brasil font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Em Alta 🔥
            </span>
          </motion.div>
        </div>
        
        {/* Reuse existing PerformanceRadar */}
        <div className="flex justify-center mb-6">
          <PerformanceRadar
            data={radarData}
            size={280}
            showLabels={true}
            animated={true}
          />
        </div>
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Sprint 20m"
            value="2.78s"
            trend="+5.3%"
            percentile="Top 15%"
            icon={<Zap className="w-5 h-5" />}
            color="verde"
          />
          <MetricCard
            label="Agilidade"
            value="8.2/10"
            trend="+8.1%"
            percentile="Top 25%"
            icon={<Target className="w-5 h-5" />}
            color="amarelo"
          />
          <MetricCard
            label="Resistência"
            value="Nível 12"
            trend="+2 níveis"
            percentile="Top 20%"
            icon={<Calendar className="w-5 h-5" />}
            color="azul"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Metric Card Component
function MetricCard({ 
  label, 
  value, 
  trend, 
  percentile, 
  icon,
  color = "verde"
}: { 
  label: string; 
  value: string; 
  trend: string; 
  percentile: string;
  icon: React.ReactNode;
  color?: "verde" | "amarelo" | "azul";
}) {
  const colorClasses = {
    verde: "from-verde-brasil/20 to-verde-brasil/10 border-verde-brasil/20",
    amarelo: "from-amarelo-ouro/20 to-amarelo-ouro/10 border-amarelo-ouro/20",
    azul: "from-azul-celeste/20 to-azul-celeste/10 border-azul-celeste/20"
  };
  
  const iconColors = {
    verde: "text-verde-brasil",
    amarelo: "text-amarelo-ouro",
    azul: "text-azul-celeste"
  };
  
  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br border rounded-xl p-4 relative overflow-hidden",
        colorClasses[color]
      )}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={cn("p-2 rounded-lg bg-white/10", iconColors[color])}>
          {icon}
        </div>
        <Badge variant="secondary" className="text-xs bg-white/10 text-white">
          {percentile}
        </Badge>
      </div>
      <h4 className="text-sm text-white/80 mb-1">{label}</h4>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-verde-brasil">{trend}</p>
    </motion.div>
  );
}

// Journey Milestones Component
interface JourneyMilestonesProps {
  activities: Activity[];
  achievements: Achievement[];
}

function JourneyMilestones({ activities, achievements }: JourneyMilestonesProps) {
  // Combine and sort milestones
  const milestones = [
    ...achievements.map((a: any) => ({
      id: `achievement-${a.id}`,
      type: 'achievement',
      title: a.title,
      description: a.description,
      date: a.unlockedAt,
      icon: '🏆',
      color: 'amarelo'
    })),
    ...activities
      .filter((a: any) => a.type === 'test' || a.type === 'rank')
      .slice(0, 5)
      .map((a: any) => ({
        id: `activity-${a.id}`,
        type: a.type,
        title: a.title,
        description: a.message,
        date: a.createdAt,
        icon: a.type === 'test' ? '⚡' : '📈',
        color: a.type === 'test' ? 'verde' : 'azul'
      }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-morph-dark rounded-2xl p-6"
    >
      <h3 className="text-2xl font-bebas mb-6 text-white">Marcos da Jornada</h3>
      
      <div className="space-y-4">
        {milestones.length > 0 ? (
          milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]",
                milestone.color === 'amarelo' && "bg-gradient-to-r from-amarelo-ouro/10 to-amarelo-ouro/5 hover:from-amarelo-ouro/15 hover:to-amarelo-ouro/10",
                milestone.color === 'verde' && "bg-gradient-to-r from-verde-brasil/10 to-verde-brasil/5 hover:from-verde-brasil/15 hover:to-verde-brasil/10",
                milestone.color === 'azul' && "bg-gradient-to-r from-azul-celeste/10 to-azul-celeste/5 hover:from-azul-celeste/15 hover:to-azul-celeste/10"
              )}
            >
              <div className="text-3xl">{milestone.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{milestone.title}</h4>
                <p className="text-sm text-white/60 mt-1">{milestone.description}</p>
                <p className="text-xs text-white/40 mt-2">
                  {new Date(milestone.date).toLocaleDateString('pt-BR', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-white/40" />
            <p className="text-white/60">Seus marcos aparecerão aqui conforme você progride</p>
          </div>
        )}
      </div>
      
      {milestones.length > 0 && (
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-verde-brasil hover:text-verde-brasil/80"
        >
          Ver Todos os Marcos
        </Button>
      )}
    </motion.div>
  );
}

// Skills Evolution Preview Component
interface SkillsEvolutionPreviewProps {
  athlete: AthleteProfile | null | undefined;
  skills: any; // From useAthleteSkills hook
}

function SkillsEvolutionPreview({ athlete, skills }: SkillsEvolutionPreviewProps) {
  // Calculate skill improvements (mock data for now)
  const skillProgress = [
    { name: "Velocidade", current: 75, previous: 68, improvement: "+10.3%" },
    { name: "Técnica", current: 82, previous: 75, improvement: "+9.3%" },
    { name: "Resistência", current: 78, previous: 72, improvement: "+8.3%" },
    { name: "Força", current: 70, previous: 65, improvement: "+7.7%" }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-morph-dark rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bebas text-white">Evolução das Habilidades</h3>
        <Badge className="bg-verde-brasil/20 text-verde-brasil border-verde-brasil/30">
          Últimos 3 meses
        </Badge>
      </div>
      
      <div className="space-y-4">
        {skillProgress.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{skill.name}</span>
              <span className="text-sm text-verde-brasil font-semibold">
                {skill.improvement}
              </span>
            </div>
            <ProgressEnhanced
              value={skill.current}
              label=""
              comparison={{ value: skill.previous, label: "3 meses atrás" }}
              className="h-2"
            />
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-verde-brasil/10 border border-verde-brasil/20">
        <p className="text-sm text-verde-brasil font-medium">
          Melhoria média: +8.9% nos últimos 3 meses
        </p>
      </div>
    </motion.div>
  );
}

// Scout Activity Widget Component
interface ScoutActivityWidgetProps {
  stats: AthleteStats | null | undefined;
}

function ScoutActivityWidget({ stats }: ScoutActivityWidgetProps) {
  const scoutViews = stats?.scoutViews || 0;
  const viewsThisWeek = Math.floor(scoutViews * 0.3); // Mock calculation
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-morph-dark rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-32 h-32 bg-verde-brasil/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-verde-brasil/20 flex items-center justify-center">
            <Eye className="w-6 h-6 text-verde-brasil" />
          </div>
          <h3 className="text-xl font-bebas text-white">Atividade de Scouts</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white">{scoutViews}</span>
              <span className="text-sm text-verde-brasil">+{viewsThisWeek} esta semana</span>
            </div>
            <p className="text-sm text-white/60 mt-1">Visualizações totais do perfil</p>
          </div>
          
          {scoutViews > 10 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-3 rounded-lg bg-verde-brasil/10 border border-verde-brasil/20"
            >
              <p className="text-sm text-verde-brasil font-medium">
                🔥 Você está no radar! Mantenha seu perfil atualizado.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Next Goals Widget Component
interface NextGoalsWidgetProps {
  athlete: AthleteProfile | null | undefined;
  stats: AthleteStats | null | undefined;
  achievements: Achievement[];
}

function NextGoalsWidget({ athlete, stats, achievements }: NextGoalsWidgetProps) {
  const goals = [
    {
      id: 1,
      title: "Melhorar Sprint",
      description: "Alcance 2.70s no sprint de 20m",
      progress: 85,
      icon: <Zap className="w-5 h-5" />,
      color: "verde"
    },
    {
      id: 2,
      title: "Nível Ouro",
      description: "Complete mais 2 testes verificados",
      progress: 60,
      icon: <Trophy className="w-5 h-5" />,
      color: "amarelo"
    },
    {
      id: 3,
      title: "100 Visualizações",
      description: `${stats?.scoutViews || 0}/100 visualizações de scouts`,
      progress: Math.min((stats?.scoutViews || 0), 100),
      icon: <Eye className="w-5 h-5" />,
      color: "azul"
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-morph-dark rounded-2xl p-6"
    >
      <h3 className="text-xl font-bebas mb-4 text-white">Próximas Metas</h3>
      
      <div className="space-y-3">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                goal.color === "verde" && "bg-verde-brasil/20 text-verde-brasil",
                goal.color === "amarelo" && "bg-amarelo-ouro/20 text-amarelo-ouro",
                goal.color === "azul" && "bg-azul-celeste/20 text-azul-celeste"
              )}>
                {goal.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{goal.title}</h4>
                <p className="text-sm text-white/60 mt-1">{goal.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        goal.color === "verde" && "bg-verde-brasil",
                        goal.color === "amarelo" && "bg-amarelo-ouro",
                        goal.color === "azul" && "bg-azul-celeste"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + (0.1 * index) }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">{goal.progress}% completo</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

