import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Home, 
  Zap, 
  Trophy, 
  Activity, 
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Target,
  TrendingUp,
  Bell,
  Star,
  Menu,
  X,
  Flame,
  Calendar
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { StreakDisplay } from "@/components/features/athlete/StreakDisplay";

interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: any;
  badge?: string | number;
  badgeType?: "new" | "count" | "alert";
  description?: string;
}

interface AthleteSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const updateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setDisplayValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };

    animationFrame = requestAnimationFrame(updateValue);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Fetch athlete stats (replace with actual API endpoint)
async function fetchAthleteStats() {
  // Simulated API call - replace with actual endpoint
  return {
    level: 15,
    xp: 1250,
    nextLevelXp: 1500,
    rank: "Estrela em Ascensão",
    completedTests: 7,
    achievements: 12,
    scoutViews: 45,
    streak: 7,
    weeklyProgress: 85
  };
}

export default function AthleteSidebar({ collapsed = false, onToggle }: AthleteSidebarProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Check if user has checked in today
  const { data: todayCheckIn } = useQuery({
    queryKey: ['/api/checkin/today'],
    queryFn: async () => {
      const today = new Date().toDateString();
      const saved = localStorage.getItem('lastCheckIn');
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Date(parsed.timestamp).toDateString() === today;
      }
      return false;
    },
    staleTime: 60000, // 1 minute
  });
  
  // Fetch dynamic stats
  const { data: stats = {
    level: 0,
    xp: 0,
    nextLevelXp: 1,
    rank: "Iniciante",
    completedTests: 0,
    achievements: 0,
    scoutViews: 0,
    streak: 0,
    weeklyProgress: 0
  }} = useQuery({
    queryKey: ['athlete-stats'],
    queryFn: fetchAthleteStats,
    staleTime: 60000, // 1 minute
  });
  
  // Main navigation sections
  const mainNavItems: NavItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "/athlete/dashboard",
      icon: Home,
      description: "Visão geral do seu progresso"
    },
    {
      id: "daily-checkin",
      title: "Check-in Diário",
      url: "/athlete/daily-checkin",
      icon: Calendar,
      badge: !todayCheckIn ? "!" : undefined,
      badgeType: !todayCheckIn ? "alert" : undefined,
      description: "Complete seu check-in diário"
    },
    {
      id: "combine",
      title: "Combine Digital",
      url: "/athlete/combine",
      icon: Zap,
      badge: "3",
      badgeType: "count",
      description: "Testes de performance"
    },
    {
      id: "achievements",
      title: "Conquistas",
      url: "/athlete/achievements",
      icon: Trophy,
      badge: "Nova",
      badgeType: "new",
      description: "Suas medalhas e conquistas"
    },
    {
      id: "activity",
      title: "Atividade",
      url: "/athlete/activity",
      icon: Activity,
      badge: stats.streak > 0 ? stats.streak : undefined,
      badgeType: stats.streak > 0 ? "alert" : undefined,
      description: "Histórico e notificações"
    },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const isActive = (url: string) => location === url;

  const getBadgeVariant = (type?: string) => {
    switch (type) {
      case "new": return "secondary";
      case "alert": return "destructive";
      default: return "default";
    }
  };

  // Mobile sidebar toggle
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Sidebar content component (shared between desktop and mobile)
  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className={cn(
        "p-4 border-b border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md",
        collapsed && "p-2"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className={cn(
              "h-12 w-12 ring-2 ring-white/20 ring-offset-2 ring-offset-transparent",
              collapsed && "h-10 w-10"
            )}>
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`} />
              <AvatarFallback className="bg-gradient-to-br from-verde-brasil to-amarelo-ouro text-white font-bold">
                {user?.firstName?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-white truncate">{user?.firstName || "Atleta"}</h3>
              <p className="text-xs text-white/60 flex items-center gap-1">
                <Star className="h-3 w-3 text-amarelo-ouro" />
                {stats.rank}
              </p>
            </div>
          )}
        </div>
        
        {/* XP Progress */}
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-1"
          >
            <div className="flex justify-between text-xs text-white/60">
              <span>Nível {stats.level}</span>
              <span>
                <AnimatedCounter value={stats.xp} />/{stats.nextLevelXp} XP
              </span>
            </div>
            <div className="relative">
              <Progress 
                value={(stats.xp / stats.nextLevelXp) * 100} 
                className="h-2 bg-white/10"
              />
              <motion.div
                className="absolute inset-0 h-2 bg-gradient-to-r from-verde-brasil to-amarelo-ouro rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
        
        {/* Quick Stats with Glassmorphic Cards */}
        {!collapsed && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="stat-card glass-morph text-center p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="stat-icon-glow mb-2">
                <Target className="h-4 w-4 mx-auto text-verde-brasil" />
              </div>
              <p className="text-sm font-bold text-white">
                <AnimatedCounter value={stats.completedTests} />
              </p>
              <p className="text-xs text-white/60">Testes</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="stat-card glass-morph text-center p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="stat-icon-glow mb-2">
                <Trophy className="h-4 w-4 mx-auto text-amarelo-ouro" />
              </div>
              <p className="text-sm font-bold text-white">
                <AnimatedCounter value={stats.achievements} />
              </p>
              <p className="text-xs text-white/60">Conquistas</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              className="stat-card glass-morph text-center p-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="stat-icon-glow mb-2">
                <TrendingUp className="h-4 w-4 mx-auto text-azul-celeste" />
              </div>
              <p className="text-sm font-bold text-white">
                <AnimatedCounter value={stats.scoutViews} />
              </p>
              <p className="text-xs text-white/60">Views</p>
            </motion.div>
          </div>
        )}

        {/* Enhanced Streak Counter with StreakDisplay */}
        {!collapsed && stats.streak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 flex justify-center"
          >
            <StreakDisplay 
              streak={stats.streak} 
              size="small"
              showWarning={stats.streak === 1}
            />
          </motion.div>
        )}
      </div>
      
      {/* Main Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const active = isActive(item.url);
              return (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={active ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start relative transition-all",
                            active 
                              ? "bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 text-white shadow-lg shadow-verde-brasil/20" 
                              : "hover:bg-white/10 text-white/80 hover:text-white",
                            collapsed && "justify-center px-2"
                          )}
                          onClick={() => {
                            setLocation(item.url);
                            setMobileOpen(false);
                          }}
                        >
                          {/* Active indicator */}
                          {active && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 bg-amarelo-ouro rounded-r-full shadow-lg shadow-amarelo-ouro/50"
                            />
                          )}
                          
                          <item.icon className={cn(
                            "h-5 w-5", 
                            !collapsed && "mr-3",
                            active && "drop-shadow-glow"
                          )} />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left font-medium">{item.title}</span>
                              {item.badge && (
                                <Badge 
                                  variant={getBadgeVariant(item.badgeType)}
                                  className={cn(
                                    "ml-auto",
                                    item.badgeType === "alert" && "bg-orange-500/20 text-orange-400 border-orange-500/30 flex items-center gap-1"
                                  )}
                                >
                                  {item.badgeType === "alert" && stats.streak > 0 && (
                                    <Flame className="h-3 w-3" />
                                  )}
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className={cn(
                        "bg-black/90 border-white/20 text-white",
                        collapsed ? "visible" : "hidden"
                      )}
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-white/60">{item.description}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
          
          {/* Secondary Actions */}
          <div className="my-4 h-px bg-white/10" />
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-white/60 hover:text-white hover:bg-white/10",
                collapsed && "justify-center px-2"
              )}
              onClick={() => setLocation('/athlete/profile')}
            >
              <User className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && <span>Perfil</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-white/60 hover:text-white hover:bg-white/10",
                collapsed && "justify-center px-2"
              )}
              onClick={() => setLocation('/athlete/settings')}
            >
              <Settings className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && <span>Configurações</span>}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-white/60 hover:text-white hover:bg-white/10",
                collapsed && "justify-center px-2"
              )}
              onClick={() => setLocation('/athlete/help')}
            >
              <HelpCircle className={cn("h-4 w-4", !collapsed && "mr-3")} />
              {!collapsed && <span>Ajuda</span>}
            </Button>
          </div>
        </div>
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-2 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors",
            collapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col fixed left-0 top-0 h-screen transition-all duration-300 z-navigation",
        "bg-black/40 backdrop-blur-xl border-r border-white/10",
        collapsed ? "w-20" : "w-72"
      )}>
        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-20 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="h-6 w-6 rounded-full bg-black/60 backdrop-blur-md shadow-lg border border-white/20 hover:border-white/40 transition-all flex items-center justify-center"
            onClick={onToggle}
          >
            {collapsed ? <ChevronRight className="h-3 w-3 text-white" /> : <ChevronLeft className="h-3 w-3 text-white" />}
          </motion.button>
        </div>
        
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mobile Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-20 right-4 z-floating h-14 w-14 rounded-full bg-gradient-to-r from-verde-brasil to-verde-brasil/80 text-white shadow-2xl shadow-verde-brasil/30 md:hidden flex items-center justify-center"
          onClick={toggleMobile}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-navigation md:hidden"
              onClick={toggleMobile}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar Panel */}
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: mobileOpen ? 0 : "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 h-full w-72 bg-black/90 backdrop-blur-xl z-modal md:hidden border-r border-white/10 safe-area-top safe-area-bottom"
        >
          <SidebarContent />
        </motion.aside>
      </div>
    </>
  );
}

