import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'athlete' | 'scout' | null;
}

export function useAuth() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      const isAuthenticatedRoute = location.startsWith('/athlete/') || location.startsWith('/scout/') || location === '/home';
      
      if (isAuthenticatedRoute) {
        setUser({
          id: '1',
          email: 'demo@futebol-futuro.com',
          firstName: 'Demo',
          lastName: 'User',
          userType: location.startsWith('/athlete/') ? 'athlete' : location.startsWith('/scout/') ? 'scout' : null
        });
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [location]);

  const isAuthenticated = location.startsWith('/athlete/') || location.startsWith('/scout/') || location === '/home';

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}