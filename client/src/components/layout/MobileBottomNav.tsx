import { Home, User, Search, Trophy, BarChart3 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const isAthlete = user.userType === 'athlete';
  
  const athleteNavItems = [
    { icon: Home, label: "Início", href: "/athlete/dashboard" },
    { icon: User, label: "Perfil", href: "/athlete/profile" },
    { icon: Trophy, label: "Conquistas", href: "/athlete/achievements" },
    { icon: BarChart3, label: "Stats", href: "/athlete/stats" },
  ];

  const scoutNavItems = [
    { icon: Home, label: "Início", href: "/scout/dashboard" },
    { icon: Search, label: "Buscar", href: "/scout/search" },
    { icon: User, label: "Favoritos", href: "/scout/favorites" },
    { icon: BarChart3, label: "Analytics", href: "/scout/analytics" },
  ];

  const navItems = isAthlete ? athleteNavItems : scoutNavItems;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={`
                  flex flex-col items-center justify-center py-2 px-2 transition-all duration-200
                  ${isActive 
                    ? 'text-azul-celeste bg-blue-50' 
                    : 'text-gray-500 hover:text-azul-celeste hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-azul-celeste' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-azul-celeste' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}