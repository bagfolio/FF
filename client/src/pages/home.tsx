import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "@/components/ui/loading-screen";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user type
      if (user.userType === "athlete") {
        setLocation("/athlete/dashboard");
      } else if (user.userType === "scout") {
        setLocation("/scout/dashboard");
      } else {
        // User hasn't selected a type yet, show type selection
        setLocation("/");
      }
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <LoadingScreen />;
}
