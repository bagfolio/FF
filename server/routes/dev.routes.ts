import type { Express } from "../types/express";
import { storage } from "../storage";
import { nanoid } from "nanoid";
import { hashPassword } from "../utils/password";
import type { User, InsertAthlete, InsertScout } from "@shared/schema";

// Test profiles matching the frontend
const devProfiles = {
  'athlete-1': {
    user: {
      email: 'joao.silva@test.com',
      firstName: 'João',
      lastName: 'Silva',
      userType: 'athlete' as const,
    },
    athlete: {
      fullName: 'João Silva',
      birthDate: '2008-03-15', // 16 years old
      cpf: '12345678901',
      city: 'Rio de Janeiro',
      state: 'RJ',
      phone: '21987654321',
      position: 'Atacante',
      dominantFoot: 'right' as const,
      height: 175,
      weight: 68,
      currentTeam: 'Flamengo Sub-17',
      profileComplete: true,
      parentalConsent: true,
      parentPhone: '21987654320',
      parentEmail: 'pai.joao@test.com',
      skillsAssessment: {
        pace: 85,
        shooting: 82,
        passing: 75,
        dribbling: 88,
        defending: 45,
        physical: 72
      }
    }
  },
  'athlete-2': {
    user: {
      email: 'carlos.santos@test.com',
      firstName: 'Carlos',
      lastName: 'Santos',
      userType: 'athlete' as const,
    },
    athlete: {
      fullName: 'Carlos Santos',
      birthDate: '2005-07-22', // 19 years old
      cpf: '23456789012',
      city: 'Santos',
      state: 'SP',
      phone: '13987654321',
      position: 'Meio-Campo',
      dominantFoot: 'both' as const,
      height: 180,
      weight: 75,
      currentTeam: 'Santos FC',
      profileComplete: true,
      parentalConsent: true,
      skillsAssessment: {
        pace: 78,
        shooting: 75,
        passing: 92,
        dribbling: 85,
        defending: 70,
        physical: 80
      }
    }
  },
  'athlete-3': {
    user: {
      email: 'pedro.oliveira@test.com',
      firstName: 'Pedro',
      lastName: 'Oliveira',
      userType: 'athlete' as const,
    },
    athlete: {
      fullName: 'Pedro Oliveira',
      birthDate: '2006-11-08', // 18 years old
      cpf: '34567890123',
      city: 'São Paulo',
      state: 'SP',
      phone: '11987654321',
      position: 'Zagueiro',
      dominantFoot: 'left' as const,
      height: 185,
      weight: 82,
      currentTeam: 'Corinthians Sub-20',
      profileComplete: true,
      parentalConsent: true,
      skillsAssessment: {
        pace: 70,
        shooting: 45,
        passing: 68,
        dribbling: 55,
        defending: 90,
        physical: 88
      }
    }
  },
  'athlete-4': {
    user: {
      email: 'rafael.costa@test.com',
      firstName: 'Rafael',
      lastName: 'Costa',
      userType: 'athlete' as const,
    },
    athlete: {
      fullName: 'Rafael Costa',
      birthDate: '2007-05-30', // 17 years old
      cpf: '45678901234',
      city: 'São Paulo',
      state: 'SP',
      phone: '11976543210',
      position: 'Goleiro',
      dominantFoot: 'right' as const,
      height: 190,
      weight: 85,
      currentTeam: 'Palmeiras Sub-17',
      profileComplete: true,
      parentalConsent: true,
      parentPhone: '11976543211',
      parentEmail: 'mae.rafael@test.com',
      skillsAssessment: {
        pace: 60,
        shooting: 30,
        passing: 65,
        dribbling: 40,
        defending: 85,
        physical: 82
      }
    }
  },
  'scout-1': {
    user: {
      email: 'roberto.mendes@test.com',
      firstName: 'Roberto',
      lastName: 'Mendes',
      userType: 'scout' as const,
    },
    scout: {
      fullName: 'Roberto Mendes',
      organization: 'Flamengo',
      position: 'Scout Principal',
      phone: '21999887766',
      verifiedScout: true
    }
  },
  'scout-2': {
    user: {
      email: 'ana.silva@test.com',
      firstName: 'Ana Paula',
      lastName: 'Silva',
      userType: 'scout' as const,
    },
    scout: {
      fullName: 'Ana Paula Silva',
      organization: 'Agência Elite Sports',
      position: 'Scout Regional',
      phone: '11999887766',
      verifiedScout: true
    }
  },
  'scout-3': {
    user: {
      email: 'fernando.lima@test.com',
      firstName: 'Fernando',
      lastName: 'Lima',
      userType: 'scout' as const,
    },
    scout: {
      fullName: 'Fernando Lima',
      organization: 'Santos FC',
      position: 'Coordenador de Base',
      phone: '13999887766',
      verifiedScout: true
    }
  }
};

export function setupDevRoutes(app: Express) {
  // Development-only check middleware
  const devOnly = (req: any, res: any, next: any) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'Forbidden in production' });
    }
    next();
  };

  // Quick login endpoint
  app.post('/api/dev/quick-login', devOnly, async (req, res) => {
    try {
      const { profileId } = req.body;
      
      if (!profileId || !devProfiles[profileId as keyof typeof devProfiles]) {
        return res.status(400).json({ message: 'Invalid profile ID' });
      }

      const profile = devProfiles[profileId as keyof typeof devProfiles];
      
      // Check if user already exists
      let user = await storage.getUserByEmail(profile.user.email);
      
      if (!user) {
        // Create user with hashed password
        const passwordHash = await hashPassword('Test123!@#');
        const userId = `user_${nanoid()}`;
        
        user = await storage.createUser({
          id: userId,
          email: profile.user.email,
          passwordHash,
          firstName: profile.user.firstName,
          lastName: profile.user.lastName,
          userType: profile.user.userType,
          emailVerified: true, // Auto-verify for dev
          profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user.email}`,
        });

        // Create athlete or scout profile
        if (profile.user.userType === 'athlete' && 'athlete' in profile) {
          await storage.createAthlete({
            ...profile.athlete,
            userId: user.id
          } as InsertAthlete);
        } else if (profile.user.userType === 'scout' && 'scout' in profile) {
          await storage.createScout({
            ...profile.scout,
            userId: user.id
          } as InsertScout);
        }
      }

      // Set session
      req.session.userId = user.id;
      req.session.save((err: any) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: 'Failed to save session' });
        }

        // Get role data
        const getRoleData = async () => {
          if (user.userType === 'athlete') {
            return await storage.getAthleteByUserId(user.id);
          } else if (user.userType === 'scout') {
            return await storage.getScoutByUserId(user.id);
          }
          return null;
        };

        getRoleData().then(roleData => {
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
        });
      });
    } catch (error) {
      console.error('Error in quick login:', error);
      res.status(500).json({ message: 'Failed to quick login' });
    }
  });

  // Clear all test data endpoint
  app.post('/api/dev/clear-test-data', devOnly, async (req, res) => {
    try {
      // Get all test users
      const testEmails = Object.values(devProfiles).map(p => p.user.email);
      
      for (const email of testEmails) {
        const user = await storage.getUserByEmail(email);
        if (user) {
          // Delete user (cascade will handle related data)
          await storage.deleteUser(user.id);
        }
      }

      res.json({ message: 'Test data cleared successfully' });
    } catch (error) {
      console.error('Error clearing test data:', error);
      res.status(500).json({ message: 'Failed to clear test data' });
    }
  });

  // Seed test data endpoint
  app.post('/api/dev/seed-test-data', devOnly, async (req, res) => {
    try {
      const created = [];
      
      for (const [profileId, profile] of Object.entries(devProfiles)) {
        // Check if already exists
        const existing = await storage.getUserByEmail(profile.user.email);
        if (existing) continue;

        // Create user
        const passwordHash = await hashPassword('Test123!@#');
        const userId = `user_${nanoid()}`;
        
        const user = await storage.createUser({
          id: userId,
          email: profile.user.email,
          passwordHash,
          firstName: profile.user.firstName,
          lastName: profile.user.lastName,
          userType: profile.user.userType,
          emailVerified: true,
          profileImageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user.email}`,
        });

        // Create profile
        if (profile.user.userType === 'athlete' && 'athlete' in profile) {
          await storage.createAthlete({
            ...profile.athlete,
            userId: user.id
          } as InsertAthlete);
        } else if (profile.user.userType === 'scout' && 'scout' in profile) {
          await storage.createScout({
            ...profile.scout,
            userId: user.id
          } as InsertScout);
        }

        created.push({
          profileId,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          type: user.userType
        });
      }

      res.json({ 
        message: 'Test data seeded successfully',
        created 
      });
    } catch (error) {
      console.error('Error seeding test data:', error);
      res.status(500).json({ message: 'Failed to seed test data' });
    }
  });
}