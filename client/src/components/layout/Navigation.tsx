import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Search, Home, Menu, Zap, Trophy, Activity } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const isAthletePage = location.startsWith("/athlete/");
  
  // Try to use sidebar context if available
  let hasSidebar = false;
  try {
    const sidebar = useSidebar();
    hasSidebar = !!sidebar;
  } catch (e) {
    // Not in a sidebar context
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            {isAthletePage && isMobile && hasSidebar && (
              <SidebarTrigger className="md:hidden" />
            )}
            <Link href="/">
              <h1 className="font-bebas text-2xl verde-brasil cursor-pointer">FUTEBOL FUTURO</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.userType === "athlete" && !isAthletePage && (
              <>
                <Link href="/athlete/dashboard">
                  <Button 
                    variant={isActive("/athlete/dashboard") ? "default" : "ghost"}
                    className={isActive("/athlete/dashboard") ? "bg-verde-brasil" : ""}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
              </>
            )}

            {user?.userType === "scout" && (
              <>
                <Link href="/scout/dashboard">
                  <Button 
                    variant={isActive("/scout/dashboard") ? "default" : "ghost"}
                    className={isActive("/scout/dashboard") ? "bg-verde-brasil" : ""}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/scout/search">
                  <Button 
                    variant={isActive("/scout/search") ? "default" : "ghost"}
                    className={isActive("/scout/search") ? "bg-verde-brasil" : ""}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Talentos
                  </Button>
                </Link>
              </>
            )}

            <div className="flex items-center gap-2 pl-4 border-l">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.firstName || "Usuário"}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && !isAthletePage && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user?.userType === "athlete" && (
                <>
                  <Link href="/athlete/dashboard">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/athlete/combine">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Combine Digital
                    </Button>
                  </Link>
                  <Link href="/athlete/achievements">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Conquistas
                    </Button>
                  </Link>
                  <Link href="/athlete/activity">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Atividade
                    </Button>
                  </Link>
                </>
              )}

              {user?.userType === "scout" && (
                <>
                  <Link href="/scout/dashboard">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/scout/search">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Buscar Talentos
                    </Button>
                  </Link>
                </>
              )}

              <div className="border-t pt-2">
                <div className="flex items-center gap-2 px-3 py-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {user?.firstName || "Usuário"}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
