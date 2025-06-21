import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { insertAthleteSchema, insertScoutSchema, insertTestSchema, insertCheckinSchema } from "@shared/schema";
import { z } from "zod";
import { checkAndAwardAchievements } from "./achievementSeeder";
import { AuthService } from "./services/auth.service";
import { passwordSchema, generateSecureToken } from "./utils/password";
import { emailSchema, cpfSchema } from "./utils/validation";
import { setupDevRoutes } from "./routes/dev.routes";
import { emailService } from "./services/email.service";
import { setupMediaRoutes } from "./routes/media.routes";
import { setupNotificationRoutes } from "./routes/notification.routes";
import { notificationService } from "./services/notification.service";
import path from "path";

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
  const authService = new AuthService();
  
  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      // Check database connection
      const dbHealthy = await storage.healthCheck();
      
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        version: process.env.npm_package_version || 'unknown',
        uptime: process.uptime(),
        checks: {
          database: dbHealthy ? 'healthy' : 'unhealthy',
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            unit: 'MB'
          }
        }
      };
      
      if (!dbHealthy) {
        health.status = 'degraded';
      }
      
      res.status(health.status === 'ok' ? 200 : 503).json(health);
    } catch (error) {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  });
  
  // Test route for debugging auth
  app.get('/test-auth', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'test-auth.html'));
  });

  // Helper to get authenticated user ID from request
  async function getAuthenticatedUserId(req: any): Promise<string> {
    // Check if we're in development mode with bypass auth
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      // Use the simulated user from the auth middleware
      if (req.user?.claims?.sub) {
        // Ensure the dev user exists in the database
        let user = await storage.getUser(req.user.claims.sub);
        if (!user) {
          // Create the dev user if it doesn't exist
          user = await storage.createUser({
            id: req.user.claims.sub,
            email: req.user.claims.email || "dev@futebol-futuro.com",
            firstName: req.user.claims.first_name || "Dev",
            lastName: req.user.claims.last_name || "User",
            profileImageUrl: req.user.claims.profile_image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            userType: null,
            emailVerified: true
          });
        }
        return user.id;
      }
      
      // Fallback: get or create a dev user
      const users = await storage.getAllUsers();
      if (users.length > 0) {
        return users[0].id;
      }
      
      // Create a development user if none exists
      const devUser = await storage.createUser({
        id: "dev-user-" + Date.now(),
        email: "dev@futebol-futuro.com",
        firstName: "Dev",
        lastName: "User",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        userType: null,
        emailVerified: true
      });
      
      return devUser.id;
    }
    
    // Production: get user ID from authenticated session
    if (!req.user?.claims?.sub) {
      throw new Error("User not authenticated");
    }
    
    return req.user.claims.sub;
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      // Get user from database
      let user = await storage.getUser(userId);
      
      if (!user) {
        // Create user if doesn't exist (development only)
        user = await storage.createUser({
          id: userId,
          email: "dev@futebol-futuro.com",
          firstName: "Dev",
          lastName: "User",
          profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          userType: null,
          emailVerified: true
        });
      }
      
      // Get role-specific data from database
      let roleData = null;
      if (user.userType === 'athlete') {
        roleData = await storage.getAthleteByUserId(userId);
      } else if (user.userType === 'scout') {
        roleData = await storage.getScoutByUserId(userId);
      }
      
      res.json({ ...user, roleData });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Set user type
  app.post('/api/auth/user-type', isAuthenticated, async (req: any, res) => {
    try {
      const { userType } = req.body;
      const userId = await getAuthenticatedUserId(req);
      
      if (!['athlete', 'scout'].includes(userType)) {
        return res.status(400).json({ message: "Invalid user type" });
      }
      
      // Update user in database
      const updatedUser = await storage.updateUser(userId, {
        userType
      });
      
      // Get updated user with role data
      let roleData = null;
      if (userType === 'athlete') {
        roleData = await storage.getAthleteByUserId(userId);
      } else if (userType === 'scout') {
        roleData = await storage.getScoutByUserId(userId);
      }
      
      res.json({ ...updatedUser, roleData });
    } catch (error) {
      console.error("Error setting user type:", error);
      res.status(500).json({ message: "Failed to set user type" });
    }
  });

  // Combined registration endpoints
  app.post('/api/auth/register/athlete', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      // Start a transaction to ensure atomicity
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user already has a type
      if (user.userType) {
        return res.status(400).json({ message: "User already has a profile type" });
      }
      
      // Parse and validate athlete data
      const athleteData = insertAthleteSchema.parse({ ...req.body, userId });
      
      // Update user type and create athlete profile
      const [updatedUser, athlete] = await Promise.all([
        storage.updateUser(userId, { userType: 'athlete' }),
        storage.createAthlete(athleteData)
      ]);
      
      res.json({
        user: updatedUser,
        athlete
      });
    } catch (error) {
      console.error("Error registering athlete:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register athlete" });
    }
  });

  app.post('/api/auth/register/scout', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      // Start a transaction to ensure atomicity
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user already has a type
      if (user.userType) {
        return res.status(400).json({ message: "User already has a profile type" });
      }
      
      // Parse and validate scout data
      const scoutData = insertScoutSchema.parse({ ...req.body, userId });
      
      // Update user type and create scout profile
      const [updatedUser, scout] = await Promise.all([
        storage.updateUser(userId, { userType: 'scout' }),
        storage.createScout(scoutData)
      ]);
      
      res.json({
        user: updatedUser,
        scout
      });
    } catch (error) {
      console.error("Error registering scout:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register scout" });
    }
  });

  // Email/Password Auth Routes
  
  // Register with email/password
  app.post('/api/auth/register', async (req, res) => {
    try {
      // Define registration schema
      const registerSchema = z.object({
        email: emailSchema,
        password: passwordSchema,
        firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
        lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
        userType: z.enum(['athlete', 'scout'])
      });

      const data = registerSchema.parse(req.body);
      
      // Register user
      const user = await authService.register(data);
      
      // Set session
      req.session.userId = user.id;
      req.session.save();
      
      res.json({ 
        message: 'Cadastro realizado com sucesso! Verifique seu email.',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      console.error("Error registering user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Erro de validação", 
          errors: error.errors 
        });
      }
      if (error instanceof Error && error.message === 'Este email já está cadastrado') {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Falha ao criar conta" });
    }
  });

  // Login with email/password
  app.post('/api/auth/login', async (req, res) => {
    try {
      const loginSchema = z.object({
        email: emailSchema,
        password: z.string().min(1, 'Senha é obrigatória'),
        rememberMe: z.boolean().optional()
      });

      const credentials = loginSchema.parse(req.body);
      
      // Login user
      const { user, rememberMeToken } = await authService.login(credentials);
      
      // Set session
      req.session.userId = user.id;
      req.session.save();
      
      // Set remember me cookie if requested
      if (rememberMeToken) {
        res.cookie('remember_me', rememberMeToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Only secure in production
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
      }
      
      // Get role data
      let roleData = null;
      if (user.userType === 'athlete') {
        roleData = await storage.getAthleteByUserId(user.id);
      } else if (user.userType === 'scout') {
        roleData = await storage.getScoutByUserId(user.id);
      }
      
      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          emailVerified: user.emailVerified,
          profileImageUrl: user.profileImageUrl
        },
        roleData
      });
    } catch (error) {
      console.error("Error logging in:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Erro de validação", 
          errors: error.errors 
        });
      }
      if (error instanceof Error) {
        if (error.message === 'Email ou senha incorretos' || 
            error.message === 'Por favor, faça login com sua conta social') {
          return res.status(401).json({ message: error.message });
        }
      }
      res.status(500).json({ message: "Falha ao fazer login" });
    }
  });

  // Verify email
  app.get('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: 'Token inválido' });
      }
      
      await authService.verifyEmail(token);
      
      // Redirect to success page
      res.redirect('/auth/email-verified');
    } catch (error) {
      console.error("Error verifying email:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Falha ao verificar email" });
    }
  });

  // Request password reset
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const { email } = z.object({ email: emailSchema }).parse(req.body);
      
      await authService.requestPasswordReset(email);
      
      // Always return success to prevent email enumeration
      res.json({ 
        message: 'Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.' 
      });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Email inválido", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Falha ao solicitar redefinição de senha" });
    }
  });

  // Reset password
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const resetSchema = z.object({
        token: z.string().min(1, 'Token é obrigatório'),
        password: passwordSchema
      });

      const { token, password } = resetSchema.parse(req.body);
      
      await authService.resetPassword(token, password);
      
      res.json({ message: 'Senha redefinida com sucesso!' });
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Erro de validação", 
          errors: error.errors 
        });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Falha ao redefinir senha" });
    }
  });

  // Enhanced logout with cleanup
  app.post('/api/auth/logout', async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      
      if (userId) {
        await authService.logout(userId);
      }
      
      // Clear session
      req.session?.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });
      
      // Clear remember me cookie
      res.clearCookie('remember_me');
      
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error("Error logging out:", error);
      res.status(500).json({ message: "Falha ao fazer logout" });
    }
  });

  // Email verification
  app.post('/api/auth/verify-email', async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Token de verificação é obrigatório' });
      }
      
      await authService.verifyEmail(token);
      
      res.json({ message: 'Email verificado com sucesso!' });
    } catch (error) {
      console.error("Error verifying email:", error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Falha ao verificar email" });
    }
  });

  // Resend verification email
  app.post('/api/auth/resend-verification', async (req: any, res) => {
    try {
      const userId = req.session?.userId || req.user?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: 'Não autenticado' });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      if (user.emailVerified) {
        return res.status(400).json({ message: 'Email já verificado' });
      }
      
      // Generate new verification token
      const emailVerificationToken = generateSecureToken();
      const emailVerificationExpires = new Date();
      emailVerificationExpires.setHours(emailVerificationExpires.getHours() + 24);
      
      // Update user with new token
      await storage.updateUser(userId, {
        emailVerificationToken,
        emailVerificationExpires
      });
      
      // Send email
      try {
        await emailService.sendVerificationEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          emailVerificationToken
        );
      } catch (error) {
        console.error('Failed to send verification email:', error);
        return res.status(500).json({ message: 'Falha ao enviar email de verificação' });
      }
      
      res.json({ message: 'Email de verificação enviado' });
    } catch (error) {
      console.error("Error resending verification email:", error);
      res.status(500).json({ message: "Falha ao reenviar email de verificação" });
    }
  });

  // Athlete routes
  app.post('/api/athletes', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
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
      const userId = await getAuthenticatedUserId(req);
      
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

  // Update athlete skills - POST endpoint for skills sync
  app.post('/api/athletes/:id/skills', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const { skills } = req.body;
      
      if (!skills) {
        return res.status(400).json({ error: "Skills data is required" });
      }
      
      const updatedAthlete = await storage.updateAthleteSkills(athleteId, skills);
      
      if (!updatedAthlete) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      res.json({ 
        success: true, 
        athlete: updatedAthlete,
        skillsAssessment: updatedAthlete.skillsAssessment
      });
    } catch (error) {
      console.error("Error updating athlete skills:", error);
      res.status(500).json({ error: "Failed to update athlete skills" });
    }
  });

  // Update athlete skills - PUT endpoint for compatibility
  app.put('/api/athletes/:id/skills', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const { skills } = req.body;
      
      if (!skills) {
        return res.status(400).json({ error: "Skills data is required" });
      }
      
      const updatedAthlete = await storage.updateAthleteSkills(athleteId, skills);
      
      if (!updatedAthlete) {
        return res.status(404).json({ error: "Athlete not found" });
      }
      
      res.json({ 
        success: true, 
        athlete: updatedAthlete,
        skillsAssessment: updatedAthlete.skillsAssessment
      });
    } catch (error) {
      console.error("Error updating athlete skills:", error);
      res.status(500).json({ error: "Failed to update athlete skills" });
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
      
      // Return empty array if no athletes found
      // Mock data has been removed - using real data only
      
      res.json(athletes);
    } catch (error) {
      console.error("Error searching athletes:", error);
      res.status(500).json({ message: "Failed to search athletes" });
    }
  });

  // Recent athletes endpoint for scouts
  app.get('/api/athletes/recent', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Get recently created athletes
      const athletes = await storage.searchAthletes({ limit, orderBy: 'createdAt' });
      
      res.json(athletes);
    } catch (error) {
      console.error("Error fetching recent athletes:", error);
      res.status(500).json({ message: "Failed to fetch recent athletes" });
    }
  });
  
  // Get athlete achievements
  app.get('/api/athletes/:id/achievements', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const achievements = await storage.getAthleteAchievements(athleteId);
      
      // Map to frontend format
      const formattedAchievements = achievements.map(achievement => ({
        id: achievement.id.toString(),
        name: achievement.title,
        description: achievement.description || '',
        iconKey: achievement.icon || 'trophy',
        points: achievement.points || 0,
        unlockedAt: achievement.unlockedAt,
        category: getCategoryFromType(achievement.achievementType),
        rarity: getRarityFromPoints(achievement.points || 0)
      }));
      
      res.json(formattedAchievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  
  // Helper functions for achievements
  function getCategoryFromType(type: string): string {
    const categoryMap: Record<string, string> = {
      first_test: 'performance',
      speed_demon: 'performance',
      all_rounder: 'performance',
      perfectionist: 'performance',
      complete_profile: 'profile',
      verified_gold: 'profile',
      team_player: 'profile',
      media_star: 'profile',
      week_streak: 'engagement',
      month_warrior: 'engagement',
      year_legend: 'engagement',
      rising_star: 'social',
      popular_athlete: 'social',
      influencer: 'social',
      champion: 'elite',
      legend: 'elite'
    };
    return categoryMap[type] || 'performance';
  }
  
  function getRarityFromPoints(points: number): string {
    if (points >= 1000) return 'legendary';
    if (points >= 500) return 'epic';
    if (points >= 200) return 'rare';
    return 'common';
  }

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
      const trustScore: {
        overall: number;
        breakdown: Record<string, number>;
        level: string;
        nextLevelRequirements: string[];
      } = {
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
      const completedFields = profileFields.filter(field => athlete[field as keyof typeof athlete]).length;
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
      const userId = await getAuthenticatedUserId(req);
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
      const userId = await getAuthenticatedUserId(req);
      
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
      const userId = await getAuthenticatedUserId(req);
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        return res.status(403).json({ message: "Only athletes can create tests" });
      }
      
      const testData = insertTestSchema.parse({ ...req.body, athleteId: athlete.id });
      const test = await storage.createTest(testData);
      
      // Create activity entry for test completion
      const testTypeNames: Record<string, string> = {
        speed_20m: "Velocidade 20m",
        agility_5_10_5: "Agilidade 5-10-5",
        technical_skills: "Habilidades Técnicas"
      };
      
      await storage.createActivity({
        athleteId: athlete.id,
        type: "test",
        title: "Teste Concluído",
        message: `${testTypeNames[testData.testType] || testData.testType} - Resultado: ${testData.result}`,
        metadata: {
          testId: test.id,
          testType: testData.testType,
          result: testData.result,
          verified: test.verified
        }
      });
      
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
  
  // Performance history endpoint
  app.get('/api/athletes/:id/performance-history', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const tests = await storage.getTestsByAthlete(athleteId);
      
      // Group tests by date and calculate average performance
      const history = tests.reduce((acc: any[], test) => {
        const date = new Date(test.createdAt || new Date());
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        let monthData = acc.find(item => item.month === monthKey);
        if (!monthData) {
          monthData = { month: monthKey, speed: 0, technique: 0, testCount: 0 };
          acc.push(monthData);
        }
        
        // Simple scoring based on test type
        if (test.testType.includes('speed')) {
          monthData.speed += 85 - ((test.result as unknown as number) * 10); // Lower time = higher score
        } else if (test.testType.includes('technical')) {
          monthData.technique += (test.result as unknown as number); // Higher count = higher score
        }
        monthData.testCount++;
        
        return acc;
      }, []);
      
      // Average the scores
      history.forEach(item => {
        if (item.testCount > 0) {
          item.speed = Math.round(item.speed / item.testCount);
          item.technique = Math.round(item.technique / item.testCount);
        }
      });
      
      res.json(history);
    } catch (error) {
      console.error("Error fetching performance history:", error);
      res.status(500).json({ message: "Failed to fetch performance history" });
    }
  });
  
  // Performance metrics endpoint
  app.get('/api/athletes/:id/performance-metrics', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const tests = await storage.getTestsByAthlete(athleteId);
      
      // Calculate strength and mental metrics based on available data
      const metrics = {
        strength: 0,
        mental: 0
      };
      
      // Simple calculation based on test count and completion
      metrics.strength = Math.min(100, tests.length * 15);
      metrics.mental = Math.min(100, tests.filter(t => t.verified).length * 20);
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching performance metrics:", error);
      res.status(500).json({ message: "Failed to fetch performance metrics" });
    }
  });
  
  // Scout stats endpoint
  app.get('/api/scouts/:id/stats', async (req, res) => {
    try {
      const scoutId = parseInt(req.params.id);
      
      // Get scout's viewing history and other stats
      const viewCount = await storage.getScoutViewCount(scoutId);
      const recentViews = await storage.getScoutRecentViews(scoutId, 7);
      
      const stats = {
        athletesDiscovered: viewCount,
        profilesViewed: viewCount * 2, // Estimate multiple views per athlete
        newTalentsThisWeek: recentViews.length,
        contactsMade: Math.floor(viewCount * 0.3) // Estimate 30% contact rate
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching scout stats:", error);
      res.status(500).json({ message: "Failed to fetch scout stats" });
    }
  });
  
  // Social proof notifications endpoint
  app.get('/api/notifications/social-proof', async (req, res) => {
    try {
      // Get recent activities across all athletes for social proof
      const recentActivities = await storage.getRecentActivities(10);
      
      // Format as notifications
      const notifications = recentActivities.map(activity => ({
        id: activity.id.toString(),
        type: activity.type,
        athleteName: activity.athleteName || 'Um atleta',
        location: activity.athleteLocation || 'Brasil',
        action: getNotificationAction(activity.type),
        time: formatTimeAgo(activity.createdAt),
        metadata: activity.metadata
      }));
      
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching social proof notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  
  // Helper function for notification actions
  function getNotificationAction(type: string): string {
    const actionMap: Record<string, string> = {
      test: 'completou um teste',
      achievement: 'desbloqueou uma conquista',
      checkin: 'fez check-in diário',
      skill_update: 'atualizou suas habilidades',
      rank_change: 'subiu no ranking'
    };
    return actionMap[type] || 'teve uma atualização';
  }

  app.post('/api/athletes/:id/view', async (req: any, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const userId = await getAuthenticatedUserId(req);
      
      const scout = await storage.getScoutByUserId(userId);
      
      if (!scout) {
        return res.status(403).json({ message: "Only scouts can view athlete profiles" });
      }
      
      await storage.recordAthleteView(athleteId, scout.id);
      
      // Create activity entry for the athlete being viewed
      await storage.createActivity({
        athleteId: athleteId,
        type: "view",
        title: "Perfil Visualizado",
        message: `Seu perfil foi visualizado por um scout do ${scout.organization}`,
        metadata: {
          scoutId: scout.id,
          organization: scout.organization
        }
      });
      
      // Send notification to athlete
      await notificationService.notifyScoutView(athleteId, scout.id);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording view:", error);
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  // Dashboard aggregation endpoint
  app.get('/api/dashboard/athlete', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      // Get athlete profile
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        return res.status(404).json({ message: "Athlete profile not found" });
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
        storage.getCheckinStreak(athlete.id), // Use checkin streak instead
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
      const activities: any[] = [];
      
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
          time: formatTimeAgo(test.createdAt || new Date())
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

  // Daily check-in endpoints
  app.post('/api/checkin/submit', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        return res.status(403).json({ message: "Only athletes can submit check-ins" });
      }
      
      // Check if already checked in today
      const todayCheckin = await storage.getTodayCheckin(athlete.id);
      if (todayCheckin) {
        return res.status(400).json({ message: "Already checked in today" });
      }
      
      // Validate and create checkin
      const checkinData = insertCheckinSchema.parse({ ...req.body, athleteId: athlete.id });
      const checkin = await storage.createCheckin(checkinData);
      
      // Calculate XP earned
      const xpEarned = checkinData.mood.xp + Math.floor(checkinData.intensity / 10);
      
      // Create activity entry
      await storage.createActivity({
        athleteId: athlete.id,
        type: "checkin",
        title: "Check-in Diário Concluído",
        message: `Humor: ${checkinData.mood.label}, Intensidade: ${checkinData.intensity} min`,
        metadata: {
          xpEarned,
          mood: checkinData.mood.label,
          intensity: checkinData.intensity,
          streak: await storage.getCheckinStreak(athlete.id)
        }
      });
      
      // Check for new achievements
      await checkAndAwardAchievements(athlete.id);
      
      res.json({ 
        checkin,
        xpEarned,
        streak: await storage.getCheckinStreak(athlete.id)
      });
    } catch (error) {
      console.error("Error submitting check-in:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit check-in" });
    }
  });
  
  app.get('/api/checkin/today', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      const athlete = await storage.getAthleteByUserId(userId);
      
      if (!athlete) {
        return res.status(403).json({ message: "Only athletes can check daily status" });
      }
      
      const todayCheckin = await storage.getTodayCheckin(athlete.id);
      res.json({ hasCheckedIn: !!todayCheckin, checkin: todayCheckin });
    } catch (error) {
      console.error("Error checking today's check-in:", error);
      res.status(500).json({ message: "Failed to check today's status" });
    }
  });
  
  app.get('/api/checkin/athlete/:id/history', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 30;
      
      const history = await storage.getCheckinHistory(athleteId, limit);
      const streak = await storage.getCheckinStreak(athleteId);
      
      res.json({ history, streak });
    } catch (error) {
      console.error("Error fetching check-in history:", error);
      res.status(500).json({ message: "Failed to fetch check-in history" });
    }
  });

  // Activity feed endpoints
  app.get('/api/athletes/:id/activities', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const type = req.query.type as string;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const activities = await storage.getAthleteActivities(athleteId, { type, limit });
      
      // Format activities for frontend
      const formattedActivities = activities.map(activity => ({
        id: activity.id.toString(),
        type: activity.type,
        title: activity.title,
        message: activity.message,
        time: formatTimeAgo(activity.createdAt || new Date()),
        date: getActivityDate(activity.createdAt || new Date()),
        metadata: activity.metadata,
        isNew: !activity.isRead,
        icon: getActivityIcon(activity.type)
      }));
      
      res.json(formattedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  
  app.post('/api/athletes/:id/activities/mark-read', async (req, res) => {
    try {
      const athleteId = parseInt(req.params.id);
      const { activityIds } = req.body;
      
      if (!Array.isArray(activityIds)) {
        return res.status(400).json({ message: "activityIds must be an array" });
      }
      
      await storage.markActivitiesAsRead(athleteId, activityIds);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking activities as read:", error);
      res.status(500).json({ message: "Failed to mark activities as read" });
    }
  });

  // Helper function to format activity date
  function getActivityDate(date: Date): string {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now.getTime() - activityDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 14) return "1 semana atrás";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'mês' : 'meses'} atrás`;
  }
  
  // Helper function to get activity icon name
  function getActivityIcon(type: string): string {
    const iconMap: Record<string, string> = {
      checkin: "calendar-check",
      test: "play",
      achievement: "trophy",
      view: "eye",
      skill_update: "trending-up",
      rank_change: "award",
      system: "bell"
    };
    return iconMap[type] || "bell";
  }

  // Payment and Subscription Routes
  
  // Get available subscription plans
  app.get('/api/subscription/plans', async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });
  
  // Get user's current subscription
  app.get('/api/subscription/current', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      const subscription = await storage.getUserSubscription(userId);
      
      if (!subscription) {
        return res.json({ subscription: null });
      }
      
      // Include plan details
      const plan = await storage.getSubscriptionPlan(subscription.planId);
      
      res.json({
        subscription,
        plan
      });
    } catch (error) {
      console.error("Error fetching user subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });
  
  // Create Stripe checkout session
  app.post('/api/subscription/create-checkout', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      const { planId } = req.body;
      
      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }
      
      // Import stripe service
      const { stripeService } = await import('./services/stripe.service');
      
      if (!stripeService.isConfigured()) {
        return res.status(503).json({ 
          message: "Payment system is not configured. Please set STRIPE_SECRET_KEY." 
        });
      }
      
      const successUrl = `${req.protocol}://${req.get('host')}/athlete/dashboard?subscription=success`;
      const cancelUrl = `${req.protocol}://${req.get('host')}/athlete/dashboard?subscription=cancelled`;
      
      const checkoutUrl = await stripeService.createCheckoutSession(
        userId,
        planId,
        successUrl,
        cancelUrl
      );
      
      res.json({ url: checkoutUrl });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  
  // Create Stripe portal session for managing subscription
  app.post('/api/subscription/create-portal', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      const { stripeService } = await import('./services/stripe.service');
      
      if (!stripeService.isConfigured()) {
        return res.status(503).json({ 
          message: "Payment system is not configured" 
        });
      }
      
      const returnUrl = `${req.protocol}://${req.get('host')}/athlete/dashboard`;
      const portalUrl = await stripeService.createPortalSession(userId, returnUrl);
      
      res.json({ url: portalUrl });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to create portal session" });
    }
  });
  
  // Cancel subscription
  app.post('/api/subscription/cancel', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      const { stripeService } = await import('./services/stripe.service');
      
      if (!stripeService.isConfigured()) {
        // If Stripe not configured, just update local status
        const subscription = await storage.getUserSubscription(userId);
        if (subscription) {
          await storage.updateUserSubscription(subscription.id, {
            status: 'canceled',
            cancelAtPeriodEnd: true
          });
        }
        return res.json({ message: "Subscription cancelled" });
      }
      
      await stripeService.cancelSubscription(userId);
      res.json({ message: "Subscription will be cancelled at the end of the billing period" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to cancel subscription" });
    }
  });
  
  // Resume cancelled subscription
  app.post('/api/subscription/resume', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      
      const { stripeService } = await import('./services/stripe.service');
      
      if (!stripeService.isConfigured()) {
        return res.status(503).json({ 
          message: "Payment system is not configured" 
        });
      }
      
      await stripeService.resumeSubscription(userId);
      res.json({ message: "Subscription resumed successfully" });
    } catch (error) {
      console.error("Error resuming subscription:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to resume subscription" });
    }
  });
  
  // Stripe webhook endpoint
  app.post('/api/stripe/webhook', async (req, res) => {
    try {
      const { stripeService } = await import('./services/stripe.service');
      
      if (!stripeService.isConfigured()) {
        return res.status(503).json({ 
          message: "Stripe is not configured" 
        });
      }
      
      const signature = req.headers['stripe-signature'] as string;
      await stripeService.handleWebhook(req.body, signature);
      
      res.json({ received: true });
    } catch (error) {
      console.error("Error handling Stripe webhook:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Webhook error" });
    }
  });
  
  // Get user's payment methods
  app.get('/api/payment-methods', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      const methods = await storage.getUserPaymentMethods(userId);
      res.json(methods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      res.status(500).json({ message: "Failed to fetch payment methods" });
    }
  });
  
  // Get user's transaction history
  app.get('/api/transactions', async (req: any, res) => {
    try {
      const userId = await getAuthenticatedUserId(req);
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Setup media routes
  setupMediaRoutes(app);

  // Setup notification routes
  setupNotificationRoutes(app);

  // Setup development routes (only in development)
  if (process.env.NODE_ENV !== 'production') {
    setupDevRoutes(app);
  }

  const httpServer = createServer(app);
  return httpServer;
}
