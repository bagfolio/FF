import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  User, 
  Search, 
  Trophy, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  LogOut,
  Bell
} from "lucide-react";
import { Link, useLocation } from "wouter";
import MobileBottomNav from "./MobileBottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isAuthenticated) {
    return <div>{children}</div>;
  }

  const isAthlete = user?.userType === 'athlete';
  const isScout = user?.userType === 'scout';

  const athleteNavItems = [
    { icon: Home, label: "Início", href: "/athlete/dashboard" },
    { icon: User, label: "Meu Perfil", href: "/athlete/profile" },
    { icon: Trophy, label: "Conquistas", href: "/athlete/achievements" },
    { icon: BarChart3, label: "Estatísticas", href: "/athlete/stats" },
    { icon: Settings, label: "Configurações", href: "/athlete/settings" },
  ];

  const scoutNavItems = [
    { icon: Home, label: "Início", href: "/scout/dashboard" },
    { icon: Search, label: "Buscar Atletas", href: "/scout/search" },
    { icon: User, label: "Favoritos", href: "/scout/favorites" },
    { icon: BarChart3, label: "Analytics", href: "/scout/analytics" },
    { icon: Settings, label: "Configurações", href: "/scout/settings" },
  ];

  const navItems = isAthlete ? athleteNavItems : isScout ? scoutNavItems : [];

  return (
    <div className="flex min-h-screen bg-cinza-claro">
      {/* Mobile/Desktop Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          : 'w-64 bg-white shadow-lg border-r flex-shrink-0'
        }
      `}>
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b bg-gradient-to-r from-azul-celeste to-blue-700">
          <h1 className="font-bebas text-xl text-white font-bold">
            {isAthlete ? 'ATLETA' : 'SCOUT'} DASHBOARD
          </h1>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navegação */}
        <nav className="mt-6 px-4 flex-1">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-azul-celeste to-blue-600 text-white shadow-lg transform scale-105' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-azul-celeste hover:transform hover:scale-105'
                      }
                    `}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {item.label}
                  </a>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Perfil do Usuário */}
        <div className="p-4 border-t bg-gray-50 mt-auto">
          <div className="flex items-center space-x-3 mb-4 p-3 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-azul-celeste to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.firstName || 'Demo'} {user?.lastName || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'demo@email.com'}</p>
              <Badge className="mt-1 text-xs bg-green-100 text-green-700">
                {isAthlete ? 'Atleta' : 'Scout'}
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header Mobile/Desktop */}
        <header className={`
          bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30
          ${isMobile ? 'shadow-md' : 'shadow-sm'}
        `}>
          <div className="flex items-center">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="mr-3 p-2 hover:bg-azul-celeste hover:text-white transition-colors"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                {isAthlete ? 'Painel do Atleta' : 'Painel do Scout'}
              </h2>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative hover:bg-azul-celeste hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full border-2 border-white">
                3
              </Badge>
            </Button>
            {!isMobile && (
              <div className="w-8 h-8 bg-gradient-to-br from-azul-celeste to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className={`
          flex-1 overflow-auto bg-cinza-claro
          ${isMobile ? 'p-4 pb-20' : 'p-6'}
        `}>
          <div className="container-responsive">
            {children}
          </div>
        </main>
      </div>

      {/* Navegação Inferior Mobile */}
      <MobileBottomNav />

      {/* Overlay Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}