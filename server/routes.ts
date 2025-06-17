import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Auth system removed for development
import { insertAthleteSchema, insertScoutSchema, insertTestSchema } from "@shared/schema";
import { z } from "zod";

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
      
      res.json(athlete);
    } catch (error) {
      console.error("Error fetching athlete:", error);
      res.status(500).json({ message: "Failed to fetch athlete profile" });
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
      
      // For development, return mock athletes
      const { generateMockAthletes } = require("./mockData");
      const mockAthletes = generateMockAthletes(20);
      
      res.json(mockAthletes);
      return;
      
      const athletes = await storage.searchAthletes(filters);
      res.json(athletes);
    } catch (error) {
      console.error("Error searching athletes:", error);
      res.status(500).json({ message: "Failed to search athletes" });
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

  const httpServer = createServer(app);
  return httpServer;
}
