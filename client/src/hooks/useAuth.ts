import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error, isSuccess } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth state:', { user, isLoading, error, isSuccess });
  }

  // In development mode, always treat as authenticated if we get any user data
  const isAuthenticated = isSuccess && !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
