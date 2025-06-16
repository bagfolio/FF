import { ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "./Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Search, 
  Trophy, 
  Settings, 
  LogOut,
  Home,
  BarChart3,
  Target,
  MessageSquare,
  Bell
} from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinza-claro">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-verde-brasil"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const isAthlete = user?.userType === 'athlete';
  const isScout = user?.userType === 'scout';

  const sidebarItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: isAthlete ? "/athlete/dashboard" : "/scout/dashboard",
      active: location === (isAthlete ? "/athlete/dashboard" : "/scout/dashboard")
    },
    ...(isAthlete ? [
      { 
        icon: User, 
        label: "Perfil", 
        path: "/athlete/profile",
        active: location === "/athlete/profile"
      },
      { 
        icon: Target, 
        label: "Testes", 
        path: "/athlete/tests",
        active: location === "/athlete/tests"
      },
      { 
        icon: BarChart3, 
        label: "Estatísticas", 
        path: "/athlete/stats",
        active: location === "/athlete/stats"
      },
      { 
        icon: Trophy, 
        label: "Conquistas", 
        path: "/athlete/achievements",
        active: location === "/athlete/achievements"
      }
    ] : []),
    ...(isScout ? [
      { 
        icon: Search, 
        label: "Buscar Atletas", 
        path: "/scout/search",
        active: location === "/scout/search"
      },
      { 
        icon: User, 
        label: "Favoritos", 
        path: "/scout/favorites",
        active: location === "/scout/favorites"
      },
      { 
        icon: BarChart3, 
        label: "Relatórios", 
        path: "/scout/reports",
        active: location === "/scout/reports"
      }
    ] : []),
    { 
      icon: MessageSquare, 
      label: "Mensagens", 
      path: "/messages",
      active: location === "/messages"
    },
    { 
      icon: Settings, 
      label: "Configurações", 
      path: "/settings",
      active: location === "/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-cinza-claro flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-verde-brasil to-green-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bebas text-xl azul-celeste">FUTEBOL FUTURO</h1>
              <p className="text-xs text-gray-500">Descoberta de Talentos</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-azul-celeste to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName || user?.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  className={cn(
                    "text-xs",
                    isAthlete ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  )}
                >
                  {isAthlete ? "Atleta" : "Scout"}
                </Badge>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setLocation(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  item.active 
                    ? "bg-verde-brasil text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900"
            onClick={() => {
              // Implement logout logic
              localStorage.removeItem('auth_token');
              setLocation('/');
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.active)?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>
              
              {/* Quick Actions */}
              {isAthlete && (
                <Button 
                  size="sm" 
                  className="btn-primary"
                  onClick={() => setLocation("/athlete/tests")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Realizar Teste
                </Button>
              )}
              
              {isScout && (
                <Button 
                  size="sm" 
                  className="btn-primary"
                  onClick={() => setLocation("/scout/search")}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Atletas
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}