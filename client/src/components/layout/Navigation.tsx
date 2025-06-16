import { Button } from "@/components/ui/button";
import { Search, Home, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-bebas text-2xl verde-brasil cursor-pointer">FUTEBOL FUTURO</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/home">
              <Button 
                variant={isActive("/home") ? "default" : "ghost"}
                className={isActive("/home") ? "bg-verde-brasil" : ""}
              >
                <Home className="w-4 h-4 mr-2" />
                Início
              </Button>
            </Link>
            
            <Link href="/athlete/dashboard">
              <Button 
                variant={isActive("/athlete/dashboard") ? "default" : "ghost"}
                className={isActive("/athlete/dashboard") ? "bg-verde-brasil" : ""}
              >
                <User className="w-4 h-4 mr-2" />
                Atleta
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
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/home">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Início
                </Button>
              </Link>
              
              <Link href="/athlete/dashboard">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Atleta
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}