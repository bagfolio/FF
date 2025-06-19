import { ReactNode, useState } from "react";
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
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

export default function AthleteSidebar({ collapsed = false, onToggle }: AthleteSidebarProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
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
      badge: "5",
      badgeType: "alert",
      description: "Histórico e notificações"
    },
  ];
  
  // Quick stats for sidebar header
  const stats = {
    level: 15,
    xp: 1250,
    nextLevelXp: 1500,
    rank: "Estrela em Ascensão",
    completedTests: 7,
    achievements: 12,
    scoutViews: 45
  };

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
        "p-4 border-b border-gray-100 bg-gradient-to-br from-verde-brasil/5 to-verde-brasil/10",
        collapsed && "p-2"
      )}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <Avatar className={cn("h-12 w-12", collapsed && "h-10 w-10")}>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName}`} />
            <AvatarFallback className="bg-verde-brasil text-white">
              {user?.firstName?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{user?.firstName || "Atleta"}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Star className="h-3 w-3 text-amarelo-ouro" />
                {stats.rank}
              </p>
            </div>
          )}
        </div>
        
        {/* XP Progress */}
        {!collapsed && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Nível {stats.level}</span>
              <span>{stats.xp}/{stats.nextLevelXp} XP</span>
            </div>
            <Progress value={(stats.xp / stats.nextLevelXp) * 100} className="h-2" />
          </div>
        )}
        
        {/* Quick Stats */}
        {!collapsed && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <Target className="h-4 w-4 mx-auto text-verde-brasil mb-1" />
              <p className="text-xs font-semibold">{stats.completedTests}</p>
              <p className="text-xs text-muted-foreground">Testes</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <Trophy className="h-4 w-4 mx-auto text-amarelo-ouro mb-1" />
              <p className="text-xs font-semibold">{stats.achievements}</p>
              <p className="text-xs text-muted-foreground">Conquistas</p>
            </div>
            <div className="text-center p-2 bg-white rounded-lg shadow-sm">
              <TrendingUp className="h-4 w-4 mx-auto text-azul-celeste mb-1" />
              <p className="text-xs font-semibold">{stats.scoutViews}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
          </div>
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
                      <Button
                        variant={active ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start relative transition-all",
                          active ? "bg-verde-brasil hover:bg-verde-brasil/90 text-white" : "hover:bg-gray-50",
                          collapsed && "justify-center px-2"
                        )}
                        onClick={() => {
                          setLocation(item.url);
                          setMobileOpen(false);
                        }}
                      >
                        {/* Active indicator */}
                        {active && (
                          <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 bg-amarelo-ouro rounded-r-full" />
                        )}
                        
                        <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.badge && (
                              <Badge 
                                variant={getBadgeVariant(item.badgeType)}
                                className="ml-auto"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={collapsed ? "visible" : "hidden"}>
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
          
          {/* Secondary Actions */}
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-muted-foreground",
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
                "w-full justify-start text-muted-foreground",
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
                "w-full justify-start text-muted-foreground",
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
      <div className="p-2 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors",
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
        "hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50 shadow-sm",
        collapsed ? "w-20" : "w-72"
      )}>
        {/* Collapse Toggle */}
        <div className="absolute -right-3 top-20 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-white shadow-md border-gray-200 hover:shadow-lg transition-shadow"
            onClick={onToggle}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>
        
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mobile Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-verde-brasil text-white shadow-lg md:hidden"
          onClick={toggleMobile}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Sidebar Overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobile}
          />
        )}

        {/* Mobile Sidebar Panel */}
        <aside className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <SidebarContent />
        </aside>
      </div>
    </>
  );
}