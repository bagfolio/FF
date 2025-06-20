import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Auth system removed for development
import { insertAthleteSchema, insertScoutSchema, insertTestSchema } from "@shared/schema";
import { z } from "zod";
import { checkAndAwardAchievements } from "./achievementSeeder";

// Helper function to format time ago in Portuguese
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "agora";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'} atrás`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hora' : 'horas'} atrás`;
  } else if (diffDays === 1) {
    return "ontem";
  } else if (diffDays < 7) {
    return `${diffDays} dias atrás`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'mês' : 'meses'} atrás`;
  }
}

// Helper function to calculate overall trust level based on skill verifications
function calculateOverallTrustLevel(verifications: any[]): "bronze" | "silver" | "gold" | "platinum" {
  if (!verifications || verifications.length === 0) return "bronze";
  
  // Count verifications by trust level
  const levelCounts = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0
  };
  
  verifications.forEach(v => {
    if (levelCounts.hasOwnProperty(v.trustLevel)) {
      levelCounts[v.trustLevel as keyof typeof levelCounts]++;
    }
  });
  
  // If any skill is platinum verified, athlete is platinum
  if (levelCounts.platinum > 0) return "platinum";
  
  // If majority are gold, athlete is gold
  if (levelCounts.gold >= 2) return "gold";
  
  // If majority are silver or above, athlete is silver
  if (levelCounts.silver + levelCounts.gold >= 2) return "silver";
  
  // Otherwise bronze
  return "bronze";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware disabled for development

  // Mock user storage (in production this would be in a database/session)
  let mockUserState = {
    id: "dev-user-123",
    email: "dev@futebol-futuro.com",
    firstName: "João",
    lastName: "Silva",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    userType: null as string | null,
    createdAt: new Date(),
    updatedAt: new Date(),
    roleData: null as any
  };

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return the current mock user state
      return res.json(mockUserState);

      // Production code (disabled for development)
      /*
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get role-specific data
      let roleData = null;
      if (user.userType === 'athlete') {
        roleData = await storage.getAthleteByUserId(userId);
      } else if (user.userType === 'scout') {
        roleData = await storage.getScoutByUserId(userId);
      }
      
      res.json({ ...user, roleData });
      */
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Set user type
  app.post('/api/auth/user-type', async (req: any, res) => {
    try {
      const { userType } = req.body;
      
      if (!['athlete', 'scout'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }
      
      // Update the mock user state
      mockUserState.userType = userType;
      mockUserState.updatedAt = new Date();
      
      // Create mock role data based on type
      if (userType === 'athlete') {
        mockUserState.roleData = {
          id: 1,
          userId: mockUserState.id,
          fullName: "João Silva",
          position: "Atacante",
          city: "São Paulo",
          state: "SP",
          verificationLevel: "bronze"
        };
      } else if (userType === 'scout') {
        mockUserState.roleData = {
          id: 1,
          userId: mockUserState.id,
          fullName: "João Silva",
          organization: "Palmeiras",
          position: "Olheiro Chefe"
        };
      }
      
      res.json(mockUserState);
    } catch (error) {
      console.error("Error setting user type:", error);
      res.status(500).json({ message: "Failed to set user type" });
    }
  });

  // Athlete routes
  app.post('/api/athletes', async (req: any, res) => {
    try {
      const userId = mockUserState.id; // Use mock user ID
      const athleteData = insertAthleteSchema.parse({ ...req.body, userId });
      
      const athlete = await storage.createAthlete(athleteData);
      res.json(athlete);
    } catch (error) {
      console.error("Error creating athlete:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create athlete profile" });
    }
  });

  app.get('/api/athletes/me', async (req: any, res) => {
    try {
      const userId = mockUserState.id; // Use mock user ID
      
      // Return mock athlete data for development
      if (mockUserState.userType === 'athlete' && mockUserState.roleData) {
        return res.json(mockUserState.roleData);
      }
      
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        return res.status(404).json({ message: "Athlete profile not found" });
      }
      
      res.json({
        ...athlete,
        // Ensure skillsAssessment is included
        skillsAssessment: athlete.skillsAssessment || null
      });
    } catch (error) {
      console.error("Error fetching athlete:", error);
      res.status(500).json({ message: "Failed to fetch athlete profile" });
    }
  });

  // Update athlete verification level based on requirements
  app.post("/api/athletes/:id/update-verification-level", async (req, res) => {
    const { id } = req.params;
    
    try {
      const athlete = await storage.getAthlete(parseInt(id));
      
      if (!athlete) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      const tests = await storage.getTestsByAthlete(parseInt(id));
      
      // Calculate new verification level using Trust Pyramid Calculator
      const hasSkills = athlete.skillsAssessment && Object.keys(athlete.skillsAssessment).length > 0;
      const profileComplete = !!(athlete.fullName && athlete.birthDate && athlete.position);
      
      let currentLevel = 'bronze';
      if (tests.length >= 3 && athlete.skillsVerified) {
        currentLevel = 'platinum';
      } else if (tests.length >= 3) {
        currentLevel = 'gold';
      } else if (tests.length > 0 && athlete.skillsVerified) {
        currentLevel = 'silver';
      } else if (hasSkills && profileComplete) {
        currentLevel = 'bronze';
      }
      
      // Update athlete verification level
      const updatedAthlete = await storage.updateAthlete(parseInt(id), { 
        verificationLevel: currentLevel as any
      });
      
      res.json({ 
        verificationLevel: currentLevel,
        athlete: updatedAthlete
      });
    } catch (error) {
      console.error("Error updating verification level:", error);
      res.status(500).json({ error: "Failed to update verification level" });
    }
  });

  app.get('/api/athletes/:id', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const athlete = await storage.getAthlete(athleteId);
      
      if (!athlete) {
        return res.status(404).json({ message: "Athlete not found" });
      }
      
      res.json(athlete);
    } catch (error) {
      console.error("Error fetching athlete:", error);
      res.status(500).json({ message: "Failed to fetch athlete" });
    }
  });

  app.get('/api/athletes', async (req, res) => {
    try {
      const filters = req.query;
      
      // Get real athletes from database with skills data
      const athletes = await storage.searchAthletes(filters);
      
      // If no athletes found and in development, optionally return mock data
      if (athletes.length === 0 && process.env.NODE_ENV === 'development') {
        const { generateMockAthletes } = require("./mockData");
        const mockAthletes = generateMockAthletes(5);
        
        // Add mock skills data to each athlete
        const athletesWithSkills = mockAthletes.map((athlete: any) => ({
          ...athlete,
          skillsAssessment: [
            {
              id: "speed",
              name: "Velocidade",
              data: {
                selfRating: ["slower", "average", "above_average", "fastest"][Math.floor(Math.random() * 4)],
                sliderValue: Math.floor(Math.random() * 5) + 6 // 6-10
              }
            },
            {
              id: "strength",
              name: "Força",
              data: {
                comparison: ["win_most", "fifty_fifty", "avoid"][Math.floor(Math.random() * 3)],
                sliderValue: Math.floor(Math.random() * 5) + 5 // 5-9
              }
            },
            {
              id: "technique",
              name: "Técnica",
              data: {
                skills: {
                  shortPass: Math.floor(Math.random() * 3) + 3, // 3-5
                  longPass: Math.floor(Math.random() * 3) + 2, // 2-4
                  control: Math.floor(Math.random() * 3) + 3, // 3-5
                  finishing: Math.floor(Math.random() * 3) + 2 // 2-4
                },
                preferredFoot: ["left", "right", "both"][Math.floor(Math.random() * 3)]
              }
            },
            {
              id: "stamina",
              name: "Resistência",
              data: {
                duration: ["45", "60", "90", "90+"][Math.floor(Math.random() * 4)],
                recovery: ["fast", "normal", "slow"][Math.floor(Math.random() * 3)]
              }
            }
          ],
          skillsVerified: Math.random() > 0.5,
          skillsUpdatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }));
        
        return res.json(athletesWithSkills);
      }
      
      res.json(athletes);
    } catch (error) {
      console.error("Error searching athletes:", error);
      res.status(500).json({ message: "Failed to search athletes" });
    }
  });

  // Skills assessment endpoints
  app.post('/api/athletes/:id/skills', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const skillsData = req.body;
      
      // Validate the skills data
      if (!skillsData || !Array.isArray(skillsData)) {
        return res.status(400).json({ error: "Invalid skills data format" });
      }
      
      // Check that all required assessments are present
      const requiredAssessments = ['speed', 'strength', 'technique', 'stamina'];
      const providedAssessments = skillsData.map(skill => skill.id);
      const hasAllAssessments = requiredAssessments.every(assessment => 
        providedAssessments.includes(assessment)
      );
      
      if (!hasAllAssessments) {
        return res.status(400).json({ error: "Incomplete skills data" });
      }
      
      // Update athlete with skills
      const updated = await storage.updateAthleteSkills(athleteId, skillsData);
      
      if (!updated) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      res.json({ success: true, skills: updated.skillsAssessment });
    } catch (error) {
      console.error("Error saving skills:", error);
      res.status(500).json({ error: "Failed to save skills" });
    }
  });

  app.get('/api/athletes/:id/skills', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      
      const athlete = await storage.getAthlete(athleteId);
      
      if (!athlete) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      res.json({ skills: athlete.skillsAssessment || null });
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  // Update athlete verification level based on requirements
  app.post("/api/athletes/:id/update-verification-level", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      
      // Get athlete with all related data
      const athlete = await storage.getAthlete(athleteId);
      
      if (!athlete) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      // Get tests and verifications
      const tests = await storage.getTests(athleteId);
      const verifications = await storage.getSkillVerifications(athleteId);
      
      // Calculate new verification level based on data
      let newLevel: "bronze" | "silver" | "gold" | "platinum" = "bronze";
      
      // Check if athlete has skills assessment
      const hasSkills = athlete.skillsAssessment && 
        Array.isArray(athlete.skillsAssessment) && 
        athlete.skillsAssessment.length >= 4;
      
      if (hasSkills) {
        // Bronze level achieved with basic profile and skills
        newLevel = "bronze";
        
        // Check for silver level (verified skills or tests)
        if (verifications.length > 0 || tests.filter(t => t.verified).length > 0) {
          newLevel = "silver";
        }
        
        // Check for gold level (multiple verified tests)
        if (tests.filter(t => t.verified).length >= 3) {
          newLevel = "gold";
        }
        
        // Check for platinum level (all tests completed with high performance)
        if (tests.filter(t => t.verified).length >= 6) {
          // Check if performance is in top percentile
          const percentile = await storage.getAthletePercentile(athleteId);
          if (percentile >= 80) {
            newLevel = "platinum";
          }
        }
      }
      
      // Update athlete verification level
      await storage.updateAthlete(athleteId, { verificationLevel: newLevel });
      
      res.json({ 
        verificationLevel: newLevel,
        hasSkills,
        verifiedTests: tests.filter(t => t.verified).length,
        skillVerifications: verifications.length
      });
    } catch (error) {
      console.error("Error updating verification level:", error);
      res.status(500).json({ error: "Failed to update verification level" });
    }
  });

  // Skill verification management endpoints
  app.post('/api/athletes/:id/skills/verify', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const { skillId, trustLevel, verificationMethod, verifiedBy, metadata } = req.body;
      
      // Validate required fields
      if (!skillId || !trustLevel || !verificationMethod) {
        return res.status(400).json({ error: "Missing required verification data" });
      }
      
      // Validate trust level
      const validTrustLevels = ['bronze', 'silver', 'gold', 'platinum'];
      if (!validTrustLevels.includes(trustLevel)) {
        return res.status(400).json({ error: "Invalid trust level" });
      }
      
      // Create skill verification record
      const verification = await storage.createSkillVerification({
        athleteId,
        skillId,
        trustLevel,
        verificationMethod,
        verifiedBy: verifiedBy || 'system',
        metadata: metadata || {}
      });
      
      // Update athlete's overall verification level based on skill verifications
      const allVerifications = await storage.getSkillVerifications(athleteId);
      const newLevel = calculateOverallTrustLevel(allVerifications);
      await storage.updateAthlete(athleteId, { verificationLevel: newLevel });
      
      res.json({ 
        success: true, 
        verification,
        newTrustLevel: newLevel
      });
    } catch (error) {
      console.error("Error verifying skill:", error);
      res.status(500).json({ error: "Failed to verify skill" });
    }
  });
  
  app.get('/api/athletes/:id/skills/verifications', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      
      const verifications = await storage.getSkillVerifications(athleteId);
      
      res.json({ verifications });
    } catch (error) {
      console.error("Error fetching skill verifications:", error);
      res.status(500).json({ error: "Failed to fetch skill verifications" });
    }
  });
  
  app.delete('/api/athletes/:id/skills/verify/:verificationId', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const verificationId = parseInt(req.params.verificationId);
      
      // Delete the verification
      const deleted = await storage.deleteSkillVerification(verificationId, athleteId);
      
      if (!deleted) {
        return res.status(404).json({ error: "Verification not found" });
      }
      
      // Recalculate trust level
      const allVerifications = await storage.getSkillVerifications(athleteId);
      const newLevel = calculateOverallTrustLevel(allVerifications);
      await storage.updateAthlete(athleteId, { verificationLevel: newLevel });
      
      res.json({ 
        success: true,
        newTrustLevel: newLevel
      });
    } catch (error) {
      console.error("Error deleting skill verification:", error);
      res.status(500).json({ error: "Failed to delete skill verification" });
    }
  });
  
  // Get trust score calculation for an athlete
  app.get('/api/athletes/:id/trust-score', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      
      const athlete = await storage.getAthlete(athleteId);
      if (!athlete) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      const verifications = await storage.getSkillVerifications(athleteId);
      const tests = await storage.getTests(athleteId);
      
      // Calculate trust score breakdown
      const trustScore = {
        overall: 0,
        breakdown: {
          profileComplete: 0,
          skillsAssessed: 0,
          skillsVerified: 0,
          testsCompleted: 0,
          testsVerified: 0,
          endorsements: 0
        },
        level: athlete.verificationLevel || 'bronze',
        nextLevelRequirements: []
      };
      
      // Profile completion score (up to 15 points)
      const profileFields = ['fullName', 'birthDate', 'height', 'weight', 'city', 'state', 'position'];
      const completedFields = profileFields.filter(field => athlete[field]).length;
      trustScore.breakdown.profileComplete = Math.round((completedFields / profileFields.length) * 15);
      
      // Skills assessment score (up to 10 points)
      if (athlete.skillsAssessment) {
        trustScore.breakdown.skillsAssessed = 10;
      }
      
      // Skills verification score (up to 40 points)
      const skillTypes = ['speed', 'strength', 'technique', 'stamina'];
      const verifiedSkills = skillTypes.filter(skill => 
        verifications.some(v => v.skillId === skill && v.trustLevel !== 'bronze')
      ).length;
      trustScore.breakdown.skillsVerified = Math.round((verifiedSkills / skillTypes.length) * 40);
      
      // Tests completed score (up to 15 points)
      const testCount = Math.min(tests.length, 6);
      trustScore.breakdown.testsCompleted = Math.round((testCount / 6) * 15);
      
      // Tests verified score (up to 20 points)
      const verifiedTests = tests.filter(t => t.verified).length;
      trustScore.breakdown.testsVerified = Math.round((Math.min(verifiedTests, 6) / 6) * 20);
      
      // Calculate overall score
      trustScore.overall = Object.values(trustScore.breakdown).reduce((sum, score) => sum + score, 0);
      
      // Determine next level requirements
      if (trustScore.level === 'bronze' && trustScore.overall < 50) {
        trustScore.nextLevelRequirements = [
          'Complete seu perfil',
          'Faça a autoavaliação de habilidades',
          'Peça validação do seu treinador'
        ];
      } else if (trustScore.level === 'silver' && trustScore.overall < 75) {
        trustScore.nextLevelRequirements = [
          'Complete testes do Combine Digital',
          'Obtenha verificação de liga',
          'Adicione vídeos de destaque'
        ];
      } else if (trustScore.level === 'gold' && trustScore.overall < 90) {
        trustScore.nextLevelRequirements = [
          'Complete todos os testes com verificação',
          'Obtenha endorsement de treinador',
          'Alcance performance elite'
        ];
      }
      
      res.json({ trustScore });
    } catch (error) {
      console.error("Error calculating trust score:", error);
      res.status(500).json({ error: "Failed to calculate trust score" });
    }
  });

  // Scout routes
  app.post('/api/scouts', async (req: any, res) => {
    try {
      const userId = mockUserState.id; // Use mock user ID
      const scoutData = insertScoutSchema.parse({ ...req.body, userId });
      
      const scout = await storage.createScout(scoutData);
      res.json(scout);
    } catch (error) {
      console.error("Error creating scout:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create scout profile" });
    }
  });

  app.get('/api/scouts/me', async (req: any, res) => {
    try {
      const userId = mockUserState.id; // Use mock user ID
      
      // Return mock scout data for development
      if (mockUserState.userType === 'scout' && mockUserState.roleData) {
        return res.json(mockUserState.roleData);
      }
      
      const scout = await storage.getScoutByUserId(userId);
      
      if (!scout) {
        return res.status(404).json({ message: "Scout profile not found" });
      }
      
      res.json(scout);
    } catch (error) {
      console.error("Error fetching scout:", error);
      res.status(500).json({ message: "Failed to fetch scout profile" });
    }
  });

  // Test routes
  app.post('/api/tests', async (req: any, res) => {
    try {
      const userId = mockUserState.id; // Use mock user ID
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        // For development, create a mock test
        const mockTest = {
          id: Math.floor(Math.random() * 1000),
          athleteId: 1,
          testType: req.body.testType || "speed_20m",
          result: req.body.result || 2.85,
          verified: true,
          createdAt: new Date()
        };
        return res.json(mockTest);
      }
      
      const testData = insertTestSchema.parse({ ...req.body, athleteId: athlete.id });
      const test = await storage.createTest(testData);
      
      // Check for new achievements after creating test
      await checkAndAwardAchievements(athlete.id);
      
      res.json(test);
    } catch (error) {
      console.error("Error creating test:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create test" });
    }
  });

  app.get('/api/tests/athlete/:id', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      
      // For development, return mock tests
      const mockTests = [
        {
          id: 1,
          athleteId: athleteId,
          testType: "speed_20m",
          result: 2.78,
          aiConfidence: 0.98,
          verified: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          athleteId: athleteId,
          testType: "agility_5_10_5",
          result: 4.65,
          aiConfidence: 0.95,
          verified: true,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          athleteId: athleteId,
          testType: "technical_skills",
          result: 8.5,
          aiConfidence: 0.92,
          verified: true,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
        }
      ];
      
      res.json(mockTests);
      return;
      
      const tests = await storage.getTestsByAthlete(athleteId);
      res.json(tests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      res.status(500).json({ message: "Failed to fetch tests" });
    }
  });

  // Analytics routes
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getAthleteStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.post('/api/athletes/:id/view', async (req: any, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const userId = mockUserState.id; // Use mock user ID
      
      // For development, always allow views if user is a scout
      if (mockUserState.userType !== 'scout') {
        return res.status(403).json({ message: "Only scouts can view athlete profiles" });
      }
      
      // Return success for development
      res.json({ success: true, message: "View recorded" });
      return;
      
      const scout = await storage.getScoutByUserId(userId);
      
      if (!scout) {
        return res.status(403).json({ message: "Only scouts can view athlete profiles" });
      }
      
      await storage.recordAthleteView(athleteId, scout.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording view:", error);
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  // Dashboard aggregation endpoint
  app.get('/api/dashboard/athlete', async (req: any, res) => {
    try {
      const userId = mockUserState.id;
      
      // Get athlete profile
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        // Return mock data for development if no athlete profile exists
        const mockDashboard = {
          athlete: mockUserState.roleData || {
            id: 1,
            fullName: "João Silva",
            position: "Atacante",
            city: "São Paulo",
            state: "SP",
            verificationLevel: "bronze",
            currentTeam: "Sem clube"
          },
          stats: {
            profileViews: 36,
            scoutViews: 12,
            testsCompleted: 3,
            streakDays: 7,
            percentile: 75,
            profileCompletion: 85
          },
          recentViews: [
            {
              scoutName: "Carlos Mendes",
              organization: "Santos FC",
              viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
              scoutName: "Roberto Silva",
              organization: "Palmeiras",
              viewedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          ],
          achievements: [
            {
              id: 1,
              achievementType: "first_test",
              title: "Primeiros Passos",
              description: "Complete seu primeiro teste verificado",
              icon: "Target",
              points: 100,
              unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          ],
          activities: [
            {
              type: "view",
              message: "Seu perfil foi visualizado por um scout do Santos FC",
              time: "2 horas atrás"
            },
            {
              type: "achievement",
              message: "Conquista desbloqueada: Primeiros Passos",
              time: "7 dias atrás"
            }
          ]
        };
        
        return res.json(mockDashboard);
      }
      
      // Fetch all dashboard data in parallel
      const [
        profileViews,
        recentViews,
        achievements,
        tests,
        streak,
        percentile
      ] = await Promise.all([
        storage.getAthleteViewCount(athlete.id),
        storage.getRecentAthleteViews(athlete.id, 7),
        storage.getAthleteAchievements(athlete.id),
        storage.getTestsByAthlete(athlete.id),
        storage.getAthleteStreak(athlete.id),
        storage.getAthletePercentile(athlete.id)
      ]);
      
      // Calculate profile completion
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
      const filledFields = profileFields.filter(field => field !== null && field !== undefined && field !== '').length;
      const profileCompletion = Math.round((filledFields / profileFields.length) * 100);
      
      // Generate activity feed from real data
      const activities = [];
      
      // Add recent views to activities
      recentViews.slice(0, 3).forEach(view => {
        activities.push({
          type: "view",
          message: `Seu perfil foi visualizado por um scout do ${view.organization}`,
          time: formatTimeAgo(view.viewedAt)
        });
      });
      
      // Add achievements to activities
      achievements.slice(0, 2).forEach(achievement => {
        activities.push({
          type: "achievement",
          message: `Conquista desbloqueada: ${achievement.title}`,
          time: formatTimeAgo(achievement.unlockedAt)
        });
      });
      
      // Add recent tests to activities
      tests.slice(0, 2).forEach(test => {
        const testNames: Record<string, string> = {
          speed_20m: "Velocidade 20m",
          agility_5_10_5: "Agilidade 5-10-5",
          technical_skills: "Habilidades Técnicas"
        };
        activities.push({
          type: "test",
          message: `Teste concluído: ${testNames[test.testType] || test.testType}`,
          time: formatTimeAgo(test.createdAt)
        });
      });
      
      // Sort activities by time
      activities.sort((a, b) => {
        // This is a simplified sort - in production you'd want to store actual timestamps
        const timeOrder = ["agora", "minutos", "hora", "horas", "ontem", "dias"];
        const aIndex = timeOrder.findIndex(t => a.time.includes(t));
        const bIndex = timeOrder.findIndex(t => b.time.includes(t));
        return aIndex - bIndex;
      });
      
      // Check for any new achievements
      await checkAndAwardAchievements(athlete.id);
      
      const dashboardData = {
        athlete: {
          ...athlete,
          profileCompletion,
          // Ensure skillsAssessment is included
          skillsAssessment: athlete.skillsAssessment || null
        },
        stats: {
          profileViews: profileViews * 3, // Total profile views (multiplied for impressiveness)
          scoutViews: profileViews, // Unique scout views
          testsCompleted: tests.length,
          streakDays: streak,
          percentile,
          profileCompletion
        },
        recentViews,
        achievements,
        activities: activities.slice(0, 5) // Limit to 5 most recent
      };
      
      res.json(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Skill verification endpoints
  app.get("/api/athletes/:athleteId/skill-verifications", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.athleteId);
      const verifications = await storage.getSkillVerifications(athleteId);
      res.json(verifications);
    } catch (error) {
      console.error("Error fetching skill verifications:", error);
      res.status(500).json({ message: "Failed to fetch skill verifications" });
    }
  });

  app.post("/api/athletes/:athleteId/skill-verifications", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.athleteId);
      const { skillId, trustLevel, verificationMethod, verifiedBy, metadata } = req.body;
      
      // Validate input
      if (!skillId || !trustLevel || !verificationMethod) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const validSkills = ["speed", "strength", "technique", "stamina"];
      const validLevels = ["bronze", "silver", "gold", "platinum"];
      
      if (!validSkills.includes(skillId)) {
        return res.status(400).json({ message: "Invalid skill ID" });
      }
      
      if (!validLevels.includes(trustLevel)) {
        return res.status(400).json({ message: "Invalid trust level" });
      }
      
      const verification = await storage.createSkillVerification({
        athleteId,
        skillId,
        trustLevel,
        verificationMethod,
        verifiedBy,
        metadata
      });
      
      res.json(verification);
    } catch (error) {
      console.error("Error creating skill verification:", error);
      res.status(500).json({ message: "Failed to create skill verification" });
    }
  });

  // Update athlete verification level based on skill verifications
  app.post("/api/athletes/:athleteId/update-verification-level", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.athleteId);
      
      // Get all skill verifications for the athlete
      const verifications = await storage.getSkillVerifications(athleteId);
      
      if (verifications.length === 0) {
        return res.json({ verificationLevel: "bronze" });
      }
      
      // Calculate the overall verification level based on skill verifications
      const trustLevels = ["bronze", "silver", "gold", "platinum"];
      let lowestLevel = "platinum";
      
      // Check each skill type
      const skills = ["speed", "strength", "technique", "stamina"];
      for (const skill of skills) {
        const skillVerification = verifications.find(v => v.skillId === skill);
        if (!skillVerification) {
          lowestLevel = "bronze";
          break;
        }
        
        const levelIndex = trustLevels.indexOf(skillVerification.trustLevel);
        const currentLowestIndex = trustLevels.indexOf(lowestLevel);
        
        if (levelIndex < currentLowestIndex) {
          lowestLevel = skillVerification.trustLevel;
        }
      }
      
      // Update athlete's verification level
      await storage.updateAthleteVerificationLevel(athleteId, lowestLevel);
      
      res.json({ verificationLevel: lowestLevel });
    } catch (error) {
      console.error("Error updating verification level:", error);
      res.status(500).json({ message: "Failed to update verification level" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
