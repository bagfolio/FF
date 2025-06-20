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
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (isUnauthorizedError(error as Error)) {
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
  if (error && isUnauthorizedError(error as Error)) {
    // Clear all queries
    queryClient.clear();
    // Only redirect if not already on an auth page
    if (!window.location.pathname.startsWith('/auth') && 
        !window.location.pathname.startsWith('/api/login') &&
        window.location.pathname !== '/') {
      // For email/password auth, redirect to landing page instead of OAuth login
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
