import { storage } from "./storage";

// Achievement templates
const ACHIEVEMENT_TEMPLATES = {
  first_test: {
    title: "Primeiros Passos",
    description: "Complete seu primeiro teste verificado",
    icon: "Target",
    points: 100
  },
  speed_demon: {
    title: "Relâmpago",
    description: "Entre no top 10% de velocidade da sua idade",
    icon: "Zap",
    points: 500
  },
  complete_profile: {
    title: "Profissional",
    description: "Complete 100% do seu perfil",
    icon: "Star",
    points: 200
  },
  week_streak: {
    title: "Dedicação",
    description: "Treine por 7 dias consecutivos",
    icon: "Flame",
    points: 300
  },
  verified_gold: {
    title: "Ouro Olímpico",
    description: "Alcance o nível Ouro de verificação",
    icon: "Crown",
    points: 1000
  },
  team_player: {
    title: "Trabalho em Equipe",
    description: "Receba 5 endossos de treinadores",
    icon: "Award",
    points: 400
  },
  rising_star: {
    title: "Estrela em Ascensão",
    description: "Seja visualizado por 10 olheiros",
    icon: "TrendingUp",
    points: 600
  },
  champion: {
    title: "Campeão",
    description: "Alcance o top 5% nacional",
    icon: "Trophy",
    points: 1500
  },
  verified_athlete: {
    title: "Atleta Verificado",
    description: "Complete todos os testes do Combine Digital",
    icon: "Medal",
    points: 800
  }
};

export async function checkAndAwardAchievements(athleteId: number): Promise<void> {
  try {
    // Get athlete data and existing achievements
    const [athlete, tests, views, existingAchievements] = await Promise.all([
      storage.getAthlete(athleteId),
      storage.getTestsByAthlete(athleteId),
      storage.getAthleteViewCount(athleteId),
      storage.getAthleteAchievements(athleteId)
    ]);

    if (!athlete) return;

    // Create a set of already unlocked achievement types
    const unlockedTypes = new Set(existingAchievements.map(a => a.achievementType));

    // Check for first test achievement
    if (!unlockedTypes.has('first_test') && tests.length > 0) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'first_test',
        ...ACHIEVEMENT_TEMPLATES.first_test
      });
    }

    // Check for complete profile achievement
    const profileFields = [
      athlete.fullName,
      athlete.birthDate,
      athlete.city,
      athlete.state,
      athlete.phone,
      athlete.position,
      athlete.height,
      athlete.weight,
      athlete.currentTeam
    ];
    const profileCompletion = profileFields.filter(f => f != null && f !== '').length / profileFields.length;
    
    if (!unlockedTypes.has('complete_profile') && profileCompletion >= 1) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'complete_profile',
        ...ACHIEVEMENT_TEMPLATES.complete_profile
      });
    }

    // Check for week streak achievement
    const streak = await storage.getAthleteStreak(athleteId);
    if (!unlockedTypes.has('week_streak') && streak >= 7) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'week_streak',
        ...ACHIEVEMENT_TEMPLATES.week_streak
      });
    }

    // Check for rising star achievement (10 scout views)
    if (!unlockedTypes.has('rising_star') && views >= 10) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'rising_star',
        ...ACHIEVEMENT_TEMPLATES.rising_star
      });
    }

    // Check for speed demon achievement (top 10% in speed)
    const percentile = await storage.getAthletePercentile(athleteId);
    if (!unlockedTypes.has('speed_demon') && percentile >= 90) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'speed_demon',
        ...ACHIEVEMENT_TEMPLATES.speed_demon
      });
    }

    // Check for champion achievement (top 5%)
    if (!unlockedTypes.has('champion') && percentile >= 95) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'champion',
        ...ACHIEVEMENT_TEMPLATES.champion
      });
    }

    // Check for verified athlete achievement (all 6 tests completed)
    const uniqueTestTypes = new Set(tests.map(t => t.testType));
    if (!unlockedTypes.has('verified_athlete') && uniqueTestTypes.size >= 6) {
      await storage.createAchievement({
        athleteId,
        achievementType: 'verified_athlete',
        ...ACHIEVEMENT_TEMPLATES.verified_athlete
      });
    }

    // Check for gold verification level achievement
    if (!unlockedTypes.has('verified_gold') && athlete.verificationLevel === 'gold') {
      await storage.createAchievement({
        athleteId,
        achievementType: 'verified_gold',
        ...ACHIEVEMENT_TEMPLATES.verified_gold
      });
    }

  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

// Function to get achievement by type
export function getAchievementTemplate(type: string) {
  return ACHIEVEMENT_TEMPLATES[type as keyof typeof ACHIEVEMENT_TEMPLATES];
}