import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import TrustPyramidProgress from "@/components/ui/trust-pyramid-progress";
import { calculateTrustPyramidProgress } from "@/lib/trustPyramidCalculator";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrustPyramidProgressWidgetProps {
  currentLevel?: "bronze" | "silver" | "gold" | "platinum";
  athlete?: any; // Accept athlete data from parent
  skills?: any[]; // Accept skills data from parent
  tests?: any[]; // Accept tests data from parent
}

export function TrustPyramidProgressWidget({ 
  currentLevel: overrideLevel,
  athlete: providedAthlete,
  skills: providedSkills,
  tests: providedTests
}: TrustPyramidProgressWidgetProps = {}) {
  // Fetch athlete data only if not provided
  const { 
    data: fetchedAthlete, 
    isLoading: isLoadingAthlete,
    error: athleteError,
    refetch: refetchAthlete
  } = useQuery({
    queryKey: ["/api/athletes/me"],
    enabled: !providedAthlete, // Only fetch if not provided
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use provided athlete or fetched athlete
  const athlete = providedAthlete || fetchedAthlete;

  // Fetch test results only if not provided
  const athleteId = athlete && 'id' in athlete ? athlete.id : undefined;
  const { 
    data: fetchedTests,
    isLoading: isLoadingTests,
    error: testsError,
    refetch: refetchTests
  } = useQuery({
    queryKey: ["/api/tests/athlete", athleteId],
    enabled: !!athleteId && !providedTests, // Only fetch if not provided
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use provided tests or fetched tests
  const tests = providedTests || fetchedTests;

  // Handle loading states
  const isLoading = (!providedAthlete && isLoadingAthlete) || (!providedTests && isLoadingTests);
  const hasError = athleteError || testsError;

  // Calculate real pyramid progress with skills data
  const pyramidProgress = useMemo(() => {
    try {
      // Ensure tests is an array
      const testsArray = Array.isArray(tests) ? tests : [];
      
      // If we have skills data, attach it to the athlete object
      const athleteWithSkills = athlete ? {
        ...athlete,
        skillsAssessment: providedSkills || athlete.skillsAssessment
      } : null;
      
      return calculateTrustPyramidProgress(athleteWithSkills, testsArray, []);
    } catch (error) {
      console.error('Error calculating trust pyramid progress:', error);
      // Return default values on error
      return {
        progress: {
          bronze: { level: 'Bronze', requirements: [], percentage: 0 },
          silver: { level: 'Prata', requirements: [], percentage: 0 },
          gold: { level: 'Ouro', requirements: [], percentage: 0 },
          platinum: { level: 'Platina', requirements: [], percentage: 0 },
        },
        overallProgress: 0,
        currentLevel: 'bronze' as const,
      };
    }
  }, [athlete, tests, providedSkills]);

  // Use calculated level or override if provided
  const actualLevel = overrideLevel || pyramidProgress.currentLevel;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 bg-white/10 rounded w-3/4 mx-auto"></div>
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Erro ao carregar dados
        </h3>
        <p className="text-white/60 text-sm mb-4">
          Não foi possível carregar o progresso da pirâmide de confiança.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (athleteError) refetchAthlete();
            if (testsError) refetchTests();
          }}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Handle empty data gracefully
  if (!athlete && !providedAthlete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white/60 text-sm">
          Complete seu perfil para visualizar seu progresso
        </p>
      </div>
    );
  }

  return (
    <TrustPyramidProgress 
      currentLevel={actualLevel}
      pyramidProgress={pyramidProgress}
    />
  );
}