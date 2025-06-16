import {
  users,
  athletes,
  scouts,
  tests,
  scoutSearches,
  athleteViews,
  achievements,
  type User,
  type UpsertUser,
  type Athlete,
  type InsertAthlete,
  type Scout,
  type InsertScout,
  type Test,
  type InsertTest,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserWithRole(id: string): Promise<any>;
  
  // Athlete operations
  createAthlete(athlete: InsertAthlete): Promise<Athlete>;
  getAthlete(id: number): Promise<Athlete | undefined>;
  getAthleteByUserId(userId: string): Promise<Athlete | undefined>;
  updateAthlete(id: number, updates: Partial<InsertAthlete>): Promise<Athlete>;
  searchAthletes(filters: any): Promise<Athlete[]>;
  
  // Scout operations
  createScout(scout: InsertScout): Promise<Scout>;
  getScout(id: number): Promise<Scout | undefined>;
  getScoutByUserId(userId: string): Promise<Scout | undefined>;
  
  // Test operations
  createTest(test: InsertTest): Promise<Test>;
  getTestsByAthlete(athleteId: number): Promise<Test[]>;
  updateTest(id: number, updates: Partial<InsertTest>): Promise<Test>;
  
  // Analytics operations
  recordAthleteView(athleteId: number, scoutId: number): Promise<void>;
  getAthleteViewCount(athleteId: number): Promise<number>;
  getAthleteStats(): Promise<{ totalAthletes: number; totalVerifications: number; totalScouts: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values([userData])
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserWithRole(id: string): Promise<any> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return null;

    let roleData = null;
    if (user.userType === 'athlete') {
      [roleData] = await db.select().from(athletes).where(eq(athletes.userId, id));
    } else if (user.userType === 'scout') {
      [roleData] = await db.select().from(scouts).where(eq(scouts.userId, id));
    }

    return { ...user, roleData };
  }

  // Athlete operations
  async createAthlete(athlete: InsertAthlete): Promise<Athlete> {
    const [created] = await db.insert(athletes).values([athlete]).returning();
    return created;
  }

  async getAthlete(id: number): Promise<Athlete | undefined> {
    const [athlete] = await db.select().from(athletes).where(eq(athletes.id, id));
    return athlete;
  }

  async getAthleteByUserId(userId: string): Promise<Athlete | undefined> {
    const [athlete] = await db.select().from(athletes).where(eq(athletes.userId, userId));
    return athlete;
  }

  async updateAthlete(id: number, updates: Partial<InsertAthlete>): Promise<Athlete> {
    const updateData: Record<string, any> = { ...updates };
    // Convert Date to string if needed for database storage
    if (updateData.birthDate && updateData.birthDate instanceof Date) {
      updateData.birthDate = updateData.birthDate.toISOString().split('T')[0];
    }
    
    const [updated] = await db
      .update(athletes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(athletes.id, id))
      .returning();
    return updated;
  }

  async searchAthletes(filters: any): Promise<Athlete[]> {
    let query = db.select().from(athletes);
    
    if (filters.position) {
      query = query.where(eq(athletes.position, filters.position));
    }
    
    if (filters.city) {
      query = query.where(eq(athletes.city, filters.city));
    }
    
    if (filters.verificationLevel) {
      query = query.where(eq(athletes.verificationLevel, filters.verificationLevel));
    }
    
    return await query;
  }

  // Scout operations
  async createScout(scout: InsertScout): Promise<Scout> {
    const [created] = await db.insert(scouts).values([scout]).returning();
    return created;
  }

  async getScout(id: number): Promise<Scout | undefined> {
    const [scout] = await db.select().from(scouts).where(eq(scouts.id, id));
    return scout;
  }

  async getScoutByUserId(userId: string): Promise<Scout | undefined> {
    const [scout] = await db.select().from(scouts).where(eq(scouts.userId, userId));
    return scout;
  }

  // Test operations
  async createTest(test: InsertTest): Promise<Test> {
    const [created] = await db.insert(tests).values([test]).returning();
    return created;
  }

  async getTestsByAthlete(athleteId: number): Promise<Test[]> {
    return await db.select().from(tests).where(eq(tests.athleteId, athleteId)).orderBy(desc(tests.createdAt));
  }

  async updateTest(id: number, updates: Partial<InsertTest>): Promise<Test> {
    const [updated] = await db
      .update(tests)
      .set(updates)
      .where(eq(tests.id, id))
      .returning();
    return updated;
  }

  // Analytics operations
  async recordAthleteView(athleteId: number, scoutId: number): Promise<void> {
    await db.insert(athleteViews).values([{ athleteId, scoutId }]);
  }

  async getAthleteViewCount(athleteId: number): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(athleteViews)
      .where(eq(athleteViews.athleteId, athleteId));
    return Number(result[0]?.count || 0);
  }

  async getAthleteStats(): Promise<{ totalAthletes: number; totalVerifications: number; totalScouts: number }> {
    const [athleteCount] = await db.select({ count: sql`count(*)` }).from(athletes);
    const [scoutCount] = await db.select({ count: sql`count(*)` }).from(scouts);
    const [verificationCount] = await db
      .select({ count: sql`count(*)` })
      .from(athletes)
      .where(inArray(athletes.verificationLevel, ['silver', 'gold', 'platinum']));

    return {
      totalAthletes: Number(athleteCount.count || 0),
      totalVerifications: Number(verificationCount.count || 0),
      totalScouts: Number(scoutCount.count || 0),
    };
  }
}

export const storage = new DatabaseStorage();