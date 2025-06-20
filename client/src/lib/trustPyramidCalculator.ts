// Trust Pyramid Calculator - Connects Skills Assessment to Trust System

export interface TrustRequirement {
  id: string;
  label: string;
  completed: boolean;
  weight: number;
}

export interface TrustLevel {
  level: string;
  requirements: TrustRequirement[];
  percentage: number;
}

export interface TrustPyramidResult {
  progress: Record<string, TrustLevel>;
  overallProgress: number;
  currentLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export const calculateTrustPyramidProgress = (
  athlete: any,
  tests: any[] = [],
  activities: any[] = []
): TrustPyramidResult => {
  // Get skills from database, not localStorage
  const skills = athlete?.skillsAssessment || {};
  const hasSkills = skills && Object.keys(skills).length > 0;
  const skillsVerified = athlete?.skillsVerified === true;
  
  const progress = {
    bronze: {
      level: 'Bronze',
      requirements: [
        {
          id: 'basic_profile',
          label: 'Perfil Básico Completo',
          completed: !!(athlete?.fullName && athlete?.birthDate && athlete?.position),
          weight: 10
        },
        {
          id: 'physical_stats',
          label: 'Dados Físicos',
          completed: !!(athlete?.height && athlete?.weight),
          weight: 5
        },
        {
          id: 'skills_assessment',
          label: 'Autoavaliação de Habilidades',
          completed: hasSkills,
          weight: 10
        }
      ],
      percentage: 0
    },
    silver: {
      level: 'Prata',
      requirements: [
        {
          id: 'skills_verified',
          label: 'Habilidades Verificadas',
          completed: skillsVerified,
          weight: 20
        },
        {
          id: 'first_test',
          label: 'Primeiro Teste Completo',
          completed: tests.length > 0,
          weight: 15
        }
      ],
      percentage: 0
    },
    gold: {
      level: 'Ouro',
      requirements: [
        {
          id: 'multiple_tests',
          label: '3+ Testes Verificados',
          completed: tests.length >= 3,
          weight: 25
        },
        {
          id: 'league_data',
          label: 'Dados de Liga/Time',
          completed: !!(athlete?.currentTeam || athlete?.leagueHistory),
          weight: 15
        }
      ],
      percentage: 0
    },
    platinum: {
      level: 'Platina',
      requirements: [
        {
          id: 'scout_validation',
          label: 'Validação de Scout',
          completed: athlete?.scoutValidated === true,
          weight: 30
        },
        {
          id: 'complete_profile',
          label: 'Perfil 100% Completo',
          completed: calculateProfileCompletion(athlete) >= 100,
          weight: 20
        }
      ],
      percentage: 0
    }
  };
  
  // Calculate progress for each level
  Object.values(progress).forEach(level => {
    const completedWeight = level.requirements
      .filter(req => req.completed)
      .reduce((sum, req) => sum + req.weight, 0);
    
    const totalWeight = level.requirements.reduce((sum, req) => sum + req.weight, 0);
    
    level.percentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  });
  
  // Calculate overall progress
  let totalProgress = 0;
  let totalWeight = 0;
  
  Object.values(progress).forEach(level => {
    level.requirements.forEach(req => {
      totalWeight += req.weight;
      if (req.completed) {
        totalProgress += req.weight;
      }
    });
  });
  
  const overallProgress = totalWeight > 0 ? Math.round((totalProgress / totalWeight) * 100) : 0;
  
  return { 
    progress, 
    overallProgress, 
    currentLevel: determineLevel(overallProgress) 
  };
};

function calculateProfileCompletion(athlete: any): number {
  if (!athlete) return 0;
  
  const requiredFields = [
    'fullName', 'birthDate', 'position', 'height', 'weight', 
    'city', 'state', 'phoneNumber', 'preferredFoot'
  ];
  
  const completedFields = requiredFields.filter(field => !!athlete[field]).length;
  return Math.round((completedFields / requiredFields.length) * 100);
}

function determineLevel(progress: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
  if (progress >= 80) return 'platinum';
  if (progress >= 60) return 'gold';
  if (progress >= 30) return 'silver';
  return 'bronze';
}

export { calculateProfileCompletion };