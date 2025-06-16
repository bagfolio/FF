import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const token = localStorage.getItem('auth_token');
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!token) return null;
      
      try {
        return await apiRequest("/api/auth/user", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth-user-cache');
        throw error;
      }
    },
    retry: false,
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token && !error,
  };
}