import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface SubscriptionPlan {
  id: number;
  name: string;
  displayName: string;
  price: number;
  currency: string;
  features: string[];
  maxProfiles: number;
  verificationTests: number;
  scoutVisibility: boolean;
  prioritySupport: boolean;
}

export interface UserSubscription {
  id: number;
  userId: string;
  planId: number;
  status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

interface SubscriptionData {
  subscription: UserSubscription | null;
  plan: SubscriptionPlan | null;
}

export function useSubscription() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch current subscription
  const { data, isLoading, error } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription/current"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch available plans
  const { data: plans = [] } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/subscription/plans"],
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Create checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await api.post('/api/subscription/create-checkout', { planId });
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar sessão de pagamento",
        description: error.response?.data?.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Create portal session
  const createPortalMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/subscription/create-portal');
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe portal
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao acessar portal de assinatura",
        description: error.response?.data?.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/subscription/cancel');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/current"] });
      toast({
        title: "Assinatura cancelada",
        description: "Sua assinatura será cancelada no final do período atual",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.response?.data?.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Resume subscription
  const resumeSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/subscription/resume');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/current"] });
      toast({
        title: "Assinatura reativada",
        description: "Sua assinatura foi reativada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao reativar assinatura",
        description: error.response?.data?.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const hasActiveSubscription = data?.subscription?.status === 'active' || data?.subscription?.status === 'trialing';
  const isPro = hasActiveSubscription && data?.plan?.name !== 'basic';
  const isElite = hasActiveSubscription && data?.plan?.name === 'elite';
  const canAccessScouts = hasActiveSubscription && (data?.plan?.scoutVisibility || false);
  const remainingTests = data?.plan?.verificationTests || 0;

  return {
    // Data
    subscription: data?.subscription,
    plan: data?.plan,
    plans,
    isLoading,
    error,

    // Status checks
    hasActiveSubscription,
    isPro,
    isElite,
    canAccessScouts,
    remainingTests,

    // Actions
    createCheckout: createCheckoutMutation.mutate,
    createPortal: createPortalMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    resumeSubscription: resumeSubscriptionMutation.mutate,

    // Loading states
    isCreatingCheckout: createCheckoutMutation.isPending,
    isCreatingPortal: createPortalMutation.isPending,
    isCanceling: cancelSubscriptionMutation.isPending,
    isResuming: resumeSubscriptionMutation.isPending,
  };
}

// Hook to check feature access based on subscription
export function useFeatureAccess() {
  const { plan, hasActiveSubscription } = useSubscription();

  return {
    canUploadVideos: hasActiveSubscription,
    canAccessCombineTests: hasActiveSubscription && plan?.verificationTests !== 0,
    canBeSeenByScouts: hasActiveSubscription && (plan?.scoutVisibility || false),
    canAccessPrioritySupport: hasActiveSubscription && (plan?.prioritySupport || false),
    maxProfiles: plan?.maxProfiles || 1,
    monthlyTests: plan?.verificationTests || 0,
  };
}