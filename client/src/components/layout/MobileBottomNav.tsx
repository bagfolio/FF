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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item.url);
          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.url)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 relative",
                "transition-colors duration-200",
                active ? "text-verde-brasil" : "text-gray-500"
              )}
            >
              {/* Active indicator */}
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-verde-brasil" />
              )}
              
              <div className="relative">
                <item.icon className={cn("h-5 w-5", active && "scale-110")} />
                {item.badge && (
                  <Badge 
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 min-w-4 p-0 flex items-center justify-center text-xs"
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