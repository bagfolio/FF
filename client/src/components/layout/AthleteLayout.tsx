import { ReactNode } from "react";
import { useLocation } from "wouter";
import Navigation from "./Navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Zap, 
  Trophy, 
  Activity, 
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AthleteLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export default function AthleteLayout({ children }: AthleteLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Main navigation items
  const mainNavItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/athlete/dashboard",
      icon: Home,
    },
    {
      title: "Combine Digital",
      url: "/athlete/combine",
      icon: Zap,
      badge: "3",
      badgeVariant: "default"
    },
    {
      title: "Conquistas",
      url: "/athlete/achievements",
      icon: Trophy,
      badge: "Novo",
      badgeVariant: "secondary"
    },
    {
      title: "Atividade",
      url: "/athlete/activity",
      icon: Activity,
      badge: "5",
      badgeVariant: "destructive"
    },
  ];
  
  // Secondary navigation items
  const secondaryNavItems: NavItem[] = [
    {
      title: "Perfil",
      url: "/athlete/profile",
      icon: User,
    },
    {
      title: "Configurações",
      url: "/athlete/settings",
      icon: Settings,
    },
    {
      title: "Ajuda",
      url: "/athlete/help",
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-verde-brasil to-green-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Atleta</span>
                <span className="text-xs text-muted-foreground">
                  {user?.firstName || "Jogador"}
                </span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        tooltip={item.title}
                      >
                        <a href={item.url} className="relative">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badgeVariant}
                              className="ml-auto h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                          {location === item.url && (
                            <div className="absolute left-0 top-1/2 h-6 w-1 -translate-x-2 -translate-y-1/2 rounded-r-full bg-verde-brasil" />
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Mais</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryNavItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        tooltip={item.title}
                      >
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}