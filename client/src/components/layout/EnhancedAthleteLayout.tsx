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
    <div className="flex min-h-screen bg-gray-50">
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
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Logo for mobile */}
            <div className="md:hidden">
              <h1 className="font-bebas text-2xl text-verde-brasil">FUTEBOL FUTURO</h1>
            </div>
            
            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex items-center flex-1 max-w-xl mr-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar testes, conquistas, atividades..." 
                  className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="p-3">
                      <div className="flex items-start gap-3 w-full">
                        <div className={cn(
                          "h-2 w-2 rounded-full mt-2",
                          notification.unread ? "bg-verde-brasil" : "bg-transparent"
                        )} />
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm",
                            notification.unread && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Há 2 horas
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-azul-celeste">
                    Ver todas as notificações
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Quick Actions - Desktop only */}
              <div className="hidden md:flex items-center gap-2">
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-verde-brasil hover:bg-verde-brasil/90"
                  onClick={() => window.location.href = '/athlete/combine'}
                >
                  Novo Teste
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-gray-50">
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