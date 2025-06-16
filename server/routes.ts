import type { Express } from "express";
import { createServer, type Server } from "http";
import { isAuthenticated } from "./middleware/auth.middleware";

// Controllers
import * as authController from "./controllers/auth.controller";
import * as athleteController from "./controllers/athlete.controller";
import * as mockController from "./controllers/mock.controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes (public)
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);
  app.post('/api/auth/logout', authController.logout);

  // Protected auth routes
  app.get('/api/auth/user', isAuthenticated, authController.getCurrentUser);
  app.put('/api/auth/user-type', isAuthenticated, authController.setUserType);

  // Athlete routes
  app.get('/api/athletes', mockController.getMockAthletes); // Public for search
  app.post('/api/athletes', isAuthenticated, athleteController.createAthleteProfile);
  app.get('/api/athletes/me', isAuthenticated, athleteController.getCurrentAthleteProfile);
  app.put('/api/athletes/me', isAuthenticated, athleteController.updateAthleteProfile);
  app.get('/api/athletes/:id', athleteController.getAthleteProfile);

  // Mock data routes (for development)
  app.get('/api/mock/athletes', mockController.getMockAthletes);
  app.get('/api/mock/tests', mockController.getMockTests);
  app.get('/api/mock/scout', mockController.getMockScoutProfile);

  // Scout routes
  app.get('/api/scouts/me', isAuthenticated, mockController.getMockScoutProfile);

  const httpServer = createServer(app);
  return httpServer;
}