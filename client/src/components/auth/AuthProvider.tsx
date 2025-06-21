import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthLoadingScreen } from "./AuthLoadingScreen";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Give a small delay to prevent flash on fast connections
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen only on initial load
  if (initialLoad && isLoading) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}