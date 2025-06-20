import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "./Navigation";
import AthleteSidebar from "./AthleteSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MobileBottomNav from "./MobileBottomNav";

interface EnhancedAthleteLayoutProps {
  children: ReactNode;
}

export default function EnhancedAthleteLayout({ children }: EnhancedAthleteLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "Nova conquista desbloqueada!", type: "achievement", unread: true },
    { id: 2, title: "Scout do Santos FC visualizou seu perfil", type: "view", unread: true },
    { id: 3, title: "Você subiu para o 78º percentil", type: "rank", unread: false },
  ]);
  
  const unreadCount = notifications.filter(n => n.unread).length;

  // Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', newState.toString());
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Sidebar */}
      <AthleteSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
      />
      
      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        "md:pl-72",
        sidebarCollapsed && "md:pl-20"
      )}>
        {/* Enhanced Top Navigation */}
        <header className="sticky top-0 z-header bg-black/40 backdrop-blur-xl border-b border-white/10 safe-area-top">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Logo for mobile */}
            <div className="md:hidden">
              <h1 className="font-bebas text-2xl text-transparent bg-clip-text bg-gradient-to-r from-verde-brasil to-amarelo-ouro">REVELA</h1>
            </div>
            
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mr-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input 
                  placeholder="Buscar testes, conquistas, atividades..." 
                  className="pl-10 pr-4 bg-white/5 border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 transition-all"
                />
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/10">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-black/90 backdrop-blur-xl border-white/10 text-white">
                  <DropdownMenuLabel className="text-white/80">Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3 hover:bg-white/10 focus:bg-white/10">
                      <div className="flex items-start gap-3 w-full">
                        <div className={cn(
                          "h-2 w-2 rounded-full mt-2",
                          notification.unread ? "bg-verde-brasil shadow-lg shadow-verde-brasil/50" : "bg-transparent"
                        )} />
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm text-white",
                            notification.unread && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-white/40 mt-1">
                            Há 2 horas
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-center text-sm text-verde-brasil hover:bg-white/10 focus:bg-white/10">
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Quick Actions - Desktop only */}
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-gradient-to-r from-verde-brasil to-verde-brasil/80 hover:from-verde-brasil/90 hover:to-verde-brasil/70 shadow-lg shadow-verde-brasil/20 text-white"
                  onClick={() => window.location.href = '/athlete/combine'}
                >
                  Novo Teste
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <div className="h-full">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}