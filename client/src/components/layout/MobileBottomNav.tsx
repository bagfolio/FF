import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Zap, 
  Trophy, 
  Activity,
  User
} from "lucide-react";

interface NavItem {
  id: string;
  title: string;
  url: string;
  icon: any;
  badge?: string | number;
}

export default function MobileBottomNav() {
  const [location, setLocation] = useLocation();
  
  const navItems: NavItem[] = [
    {
      id: "dashboard",
      title: "Início",
      url: "/athlete/dashboard",
      icon: Home,
    },
    {
      id: "combine",
      title: "Testes",
      url: "/athlete/combine",
      icon: Zap,
      badge: "3",
    },
    {
      id: "achievements",
      title: "Conquistas",
      url: "/athlete/achievements",
      icon: Trophy,
    },
    {
      id: "activity",
      title: "Atividade",
      url: "/athlete/activity",
      icon: Activity,
      badge: "5",
    },
    {
      id: "profile",
      title: "Perfil",
      url: "/athlete/profile",
      icon: User,
    },
  ];

  const isActive = (url: string) => location === url;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 z-navigation md:hidden safe-area-bottom">
      <div className="grid grid-cols-5 h-20">
        {navItems.map((item) => {
          const active = isActive(item.url);
          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 relative touch-target",
                "transition-all duration-200",
                active ? "text-verde-brasil" : "text-white/60 hover:text-white"
              )}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-verde-brasil to-amarelo-ouro shadow-lg shadow-verde-brasil/50" />
              )}
              
              <div className="relative">
                <item.icon className={cn(
                  "h-5 w-5 transition-all", 
                  active && "scale-110 drop-shadow-glow"
                )} />
                {item.badge && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-4 min-w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn("text-xs", active && "font-medium")}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}