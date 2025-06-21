import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireUserType?: "athlete" | "scout" | null;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requireUserType, redirectTo = "/" }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    setLocation(redirectTo);
    return null;
  }

  // Check user type if required
  if (requireUserType && user?.userType !== requireUserType) {
    // If user has no type, redirect to user type selection
    if (!user?.userType) {
      setLocation("/auth/welcome");
      return null;
    }
    
    // Wrong user type, redirect to appropriate dashboard
    if (user.userType === "athlete") {
      setLocation("/athlete/dashboard");
    } else if (user.userType === "scout") {
      setLocation("/scout/dashboard");
    }
    return null;
  }

  // User is authenticated and has correct type (if required)
  return <>{children}</>;
}