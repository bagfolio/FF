import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { isUnauthorizedError } from "@/lib/authUtils";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/auth";

export function useAuth() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: user, isLoading, error, isSuccess, refetch } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await api.get("/api/auth/user");
      return response.data;
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors
      if (error?.response?.status === 401 || isUnauthorizedError(error)) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Handle authentication errors
  const isAuthError = error && (
    (error as any)?.response?.status === 401 || 
    isUnauthorizedError(error as Error)
  );
  
  if (isAuthError) {
    // Clear all queries
    queryClient.clear();
    // Only redirect from protected pages, not from public pages
    const publicPaths = ['/', '/auth', '/test', '/trust-pyramid-demo', '/style-guide'];
    const isPublicPath = publicPaths.some(path => 
      window.location.pathname === path || 
      window.location.pathname.startsWith(path + '/')
    );
    
    if (!isPublicPath) {
      // Redirect to landing page from protected routes
      setLocation('/');
    }
  }

  const isAuthenticated = isSuccess && !!user && !error;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout');
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logout realizado com sucesso",
        description: "Até breve!",
      });
      setLocation('/');
    },
    onError: () => {
      toast({
        title: "Erro ao fazer logout",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    refetch,
    logout,
  };
}
