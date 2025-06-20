import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

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
  const [isSyncing, setIsSyncing] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);

  // Check for localStorage data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localSkills = localStorage.getItem('authSkills');
      setHasLocalData(!!localSkills && localSkills !== '[]' && localSkills !== 'null');
    }
  }, []);

  // Fetch skills from database
  const { data: skills, isLoading, error, refetch } = useQuery<SkillData[]>({
    queryKey: [`/api/athletes/${athleteId}/skills`],
    enabled: !!athleteId,
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
  });

  // Mutation to sync skills to database
  const syncMutation = useMutation({
    mutationFn: async (skillsData: SkillData[]) => {
      const response = await fetch(`/api/athletes/${athleteId}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillsData),
      });

      if (!response.ok) {
        throw new Error('Failed to sync skills');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`/api/athletes/${athleteId}/skills`] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/athlete'] });
      queryClient.invalidateQueries({ queryKey: ['/api/athletes/me'] });
      
      // Clear localStorage after successful sync
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authSkills');
        setHasLocalData(false);
      }
    },
  });

  // Function to sync localStorage data to database
  const syncLocalToDatabase = async () => {
    if (!athleteId || !hasLocalData) return;

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
      console.error('Error syncing skills:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync on first load if there's local data but no database data
  useEffect(() => {
    if (athleteId && hasLocalData && !isLoading && (!skills || skills.length === 0)) {
      syncLocalToDatabase();
    }
  }, [athleteId, hasLocalData, isLoading, skills]);

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