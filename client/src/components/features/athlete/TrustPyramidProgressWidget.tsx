import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import TrustPyramidProgress from "@/components/ui/trust-pyramid-progress";
import { calculateTrustPyramidProgress } from "@/lib/trustPyramidCalculator";

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
  const { data: fetchedAthlete } = useQuery({
    queryKey: ["/api/athletes/me"],
    enabled: !providedAthlete, // Only fetch if not provided
  });

  // Use provided athlete or fetched athlete
  const athlete = providedAthlete || fetchedAthlete;

  // Fetch test results only if not provided
  const athleteId = athlete && 'id' in athlete ? athlete.id : undefined;
  const { data: fetchedTests } = useQuery({
    queryKey: ["/api/tests/athlete", athleteId],
    enabled: !!athleteId && !providedTests, // Only fetch if not provided
  });

  // Use provided tests or fetched tests
  const tests = providedTests || fetchedTests;

  // Calculate real pyramid progress with skills data
  const pyramidProgress = useMemo(() => {
    // Ensure tests is an array
    const testsArray = Array.isArray(tests) ? tests : [];
    
    // If we have skills data, attach it to the athlete object
    const athleteWithSkills = athlete ? {
      ...athlete,
      skillsAssessment: providedSkills || athlete.skillsAssessment
    } : null;
    
    return calculateTrustPyramidProgress(athleteWithSkills, testsArray, []);
  }, [athlete, tests, providedSkills]);

  // Use calculated level or override if provided
  const actualLevel = overrideLevel || pyramidProgress.currentLevel;

  return (
    <TrustPyramidProgress 
      currentLevel={actualLevel}
      pyramidProgress={pyramidProgress}
    />
  );
}