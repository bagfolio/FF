import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error, isSuccess } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // Set initial data to prevent loading on subsequent page loads
    initialData: () => {
      // Check if we have cached user data
      const cached = localStorage.getItem('auth-user-cache');
      return cached ? JSON.parse(cached) : undefined;
    },
  });

  // Cache user data for faster subsequent loads
  if (user && !error) {
    localStorage.setItem('auth-user-cache', JSON.stringify(user));
  }

  // In development mode, always treat as authenticated if we get any user data
  const isAuthenticated = isSuccess && !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
