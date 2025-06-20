import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SkillData {
  id: string;
  name: string;
  data: any;
}

interface UseAthleteSkillsReturn {
  skills: SkillData[] | null;
  isLoading: boolean;
  error: Error | null;
  isSyncing: boolean;
  hasLocalData: boolean;
  syncLocalToDatabase: () => Promise<void>;
  refetch: () => void;
}

export function useAthleteSkills(athleteId: number | undefined): UseAthleteSkillsReturn {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Check for localStorage data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localSkills = localStorage.getItem('authSkills');
      setHasLocalData(!!localSkills && localSkills !== '[]' && localSkills !== 'null');
    }
  }, []);

  // Fetch skills from database with retry logic
  const { data: skills, isLoading, error, refetch } = useQuery<SkillData[]>({
    queryKey: [`/api/athletes/${athleteId}/skills`],
    enabled: !!athleteId && isOnline,
    select: (response: any) => {
      // Handle different response formats
      if (response?.skills) {
        return response.skills;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return null;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if offline
      if (!navigator.onLine) return false;
      // Max 3 retries
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutation to sync skills to database with error handling
  const syncMutation = useMutation({
    mutationFn: async (skillsData: SkillData[]) => {
      // Check if online first
      if (!navigator.onLine) {
        throw new Error('offline');
      }

      try {
        const response = await fetch(`/api/athletes/${athleteId}/skills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(skillsData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          
          // Special handling for 404 - athlete doesn't exist
          if (response.status === 404) {
            throw new Error('athlete_not_found');
          }
          
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
      } catch (error: any) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('network_error');
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`/api/athletes/${athleteId}/skills`] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/athlete'] });
      queryClient.invalidateQueries({ queryKey: ['/api/athletes/me'] });
      queryClient.invalidateQueries({ queryKey: [`/api/athletes/${athleteId}/trust-score`] });
      
      // Clear localStorage after successful sync
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authSkills');
        setHasLocalData(false);
      }
      
      // Reset retry count on success
      setRetryCount(0);
      
      toast({
        title: "Sucesso!",
        description: "Suas habilidades foram sincronizadas com sucesso.",
      });
    },
    onError: (error: Error) => {
      console.error('Error syncing skills:', error);
      
      if (error.message === 'offline') {
        toast({
          title: "Sem conexão",
          description: "Você está offline. As habilidades serão sincronizadas quando a conexão for restaurada.",
          variant: "default",
        });
      } else if (error.message === 'network_error') {
        toast({
          title: "Erro de rede",
          description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
          variant: "destructive",
        });
      } else if (error.message === 'athlete_not_found') {
        // Don't retry for 404 errors
        toast({
          title: "Perfil não encontrado",
          description: "Seu perfil de atleta não foi encontrado. Por favor, complete o cadastro primeiro.",
          variant: "destructive",
        });
        // Don't clear localStorage - keep the skills for when athlete is created
      } else {
        setRetryCount(prev => prev + 1);
        if (retryCount < 3) {
          // Schedule retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
          toast({
            title: "Erro ao sincronizar",
            description: `Tentando novamente em ${Math.round(delay / 1000)} segundos...`,
            variant: "destructive",
          });
          setTimeout(() => syncLocalToDatabase(), delay);
        } else {
          toast({
            title: "Erro persistente",
            description: "Não conseguimos sincronizar após várias tentativas. Suas habilidades estão salvas localmente.",
            variant: "destructive",
          });
        }
      }
    },
  });

  // Function to sync localStorage data to database with error handling
  const syncLocalToDatabase = useCallback(async () => {
    if (!athleteId || !hasLocalData || isSyncing) {
      if (!athleteId && hasLocalData) {
        console.log('Skills in localStorage but no athlete ID yet - waiting for profile creation');
      }
      return;
    }

    setIsSyncing(true);
    try {
      const localSkills = localStorage.getItem('authSkills');
      if (localSkills) {
        const parsedSkills = JSON.parse(localSkills);
        if (Array.isArray(parsedSkills) && parsedSkills.length > 0) {
          await syncMutation.mutateAsync(parsedSkills);
        }
      }
    } catch (error) {
      console.error('Error parsing or syncing skills:', error);
      // If JSON parsing fails, clear corrupted data
      if (error instanceof SyntaxError) {
        localStorage.removeItem('authSkills');
        setHasLocalData(false);
        toast({
          title: "Dados corrompidos",
          description: "Os dados locais estavam corrompidos e foram removidos. Por favor, refaça a avaliação.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSyncing(false);
    }
  }, [athleteId, hasLocalData, isSyncing, syncMutation, toast]);

  // Auto-sync on first load if there's local data but no database data
  useEffect(() => {
    if (athleteId && hasLocalData && !isLoading && (!skills || skills.length === 0) && isOnline) {
      // First verify the athlete exists
      fetch(`/api/athletes/${athleteId}`)
        .then(response => {
          if (response.ok) {
            // Athlete exists, proceed with sync
            syncLocalToDatabase();
          } else if (response.status === 404) {
            console.warn(`Athlete with ID ${athleteId} not found. Skipping skills sync.`);
            // Clear the invalid athlete ID from localStorage if needed
            toast({
              title: "Perfil não encontrado",
              description: "Por favor, complete seu perfil de atleta primeiro.",
              variant: "default",
            });
          }
        })
        .catch(error => {
          console.error('Error checking athlete existence:', error);
        });
    }
  }, [athleteId, hasLocalData, isLoading, skills, isOnline, syncLocalToDatabase, toast]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (hasLocalData && athleteId) {
        toast({
          title: "Conexão restaurada",
          description: "Sincronizando dados pendentes...",
        });
        syncLocalToDatabase();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Sem conexão",
        description: "Você está offline. Suas alterações serão salvas localmente.",
        variant: "default",
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [hasLocalData, athleteId, toast, syncLocalToDatabase]);

  // Persist to localStorage when offline
  const saveToLocalStorage = useCallback((skillsData: SkillData[]) => {
    try {
      localStorage.setItem('authSkills', JSON.stringify(skillsData));
      setHasLocalData(true);
      toast({
        title: "Salvo localmente",
        description: "Suas habilidades foram salvas e serão sincronizadas quando você estiver online.",
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas habilidades localmente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    skills: skills || null,
    isLoading,
    error: error as Error | null,
    isSyncing: isSyncing || syncMutation.isPending,
    hasLocalData,
    syncLocalToDatabase,
    refetch,
  };
}

// Helper function to calculate trust level from skills
export function calculateSkillsTrustLevel(skills: SkillData[] | null): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (!skills || skills.length === 0) return 'bronze';
  
  // For now, having skills assessment completed gives bronze level
  // This will be enhanced with verification data later
  return 'bronze';
}

// Helper function to check if skills are complete
export function areSkillsComplete(skills: SkillData[] | null): boolean {
  if (!skills || !Array.isArray(skills)) return false;
  
  const requiredSkills = ['speed', 'strength', 'technique', 'stamina'];
  const skillIds = skills.map(s => s.id);
  
  return requiredSkills.every(skill => skillIds.includes(skill));
}