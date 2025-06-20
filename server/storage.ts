import {
  users,
  athletes,
  scouts,
  tests,
  scoutSearches,
  athleteViews,
  achievements,
  skillVerifications,
  type User,
  type UpsertUser,
  type Athlete,
  type InsertAthlete,
  type Scout,
  type InsertScout,
  type Test,
  type InsertTest,
  type SkillVerification,
  checkins,
  activities,
  type Checkin,
  type InsertCheckin,
  type Activity,
  type InsertActivity,
  subscriptionPlans,
  userSubscriptions,
  paymentMethods,
  paymentTransactions,
  type SubscriptionPlan,
  type InsertSubscriptionPlan,
  type UserSubscription,
  type InsertUserSubscription,
  type PaymentMethod,
  type InsertPaymentMethod,
  type PaymentTransaction,
  type InsertPaymentTransaction,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  
  // Athlete operations
  createAthlete(athlete: InsertAthlete): Promise<Athlete>;
  getAthlete(id: number): Promise<Athlete | undefined>;
  getAthleteByUserId(userId: string): Promise<Athlete | undefined>;
  updateAthlete(id: number, updates: Partial<InsertAthlete>): Promise<Athlete>;
  updateAthleteSkills(id: number, skills: any): Promise<Athlete>;
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
  
  // Dashboard operations
  getRecentAthleteViews(athleteId: number, days?: number): Promise<any[]>;
  getAthleteAchievements(athleteId: number): Promise<any[]>;
  createAchievement(achievement: {
    athleteId: number;
    achievementType: string;
    title: string;
    description?: string;
    icon?: string;
    points?: number;
  }): Promise<any>;
  getAthleteStreak(athleteId: number): Promise<number>;
  getAthletePercentile(athleteId: number): Promise<number>;
  
  // Skill verification operations
  getSkillVerifications(athleteId: number): Promise<SkillVerification[]>;
  createSkillVerification(verification: {
    athleteId: number;
    skillId: string;
    trustLevel: string;
    verificationMethod: string;
    verifiedBy?: string;
    metadata?: any;
  }): Promise<SkillVerification>;
  deleteSkillVerification(verificationId: number, athleteId: number): Promise<boolean>;
  updateAthleteVerificationLevel(athleteId: number, level: string): Promise<void>;
  getTests(athleteId: number): Promise<Test[]>;
  
  // Checkin operations
  createCheckin(checkin: InsertCheckin): Promise<Checkin>;
  getTodayCheckin(athleteId: number): Promise<Checkin | undefined>;
  getCheckinHistory(athleteId: number, limit?: number): Promise<Checkin[]>;
  getCheckinStreak(athleteId: number): Promise<number>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getAthleteActivities(athleteId: number, filters?: { type?: string; limit?: number }): Promise<Activity[]>;
  markActivitiesAsRead(athleteId: number, activityIds: number[]): Promise<void>;
  getRecentActivities(limit?: number): Promise<any[]>;
  
  // Scout operations extended
  getScoutViewCount(scoutId: number): Promise<number>;
  getScoutRecentViews(scoutId: number, days?: number): Promise<any[]>;
  
  // Payment operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  updateUserSubscription(id: number, updates: Partial<InsertUserSubscription>): Promise<UserSubscription>;
  getUserPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod>;
  deletePaymentMethod(id: number): Promise<void>;
  createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction>;
  getUserTransactions(userId: string, limit?: number): Promise<PaymentTransaction[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
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
  
  async createUser(userData: UpsertUser): Promise<User> {
    return this.upsertUser(userData);
  }
  
  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
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

  async updateAthleteSkills(id: number, skills: any): Promise<Athlete> {
    const [updated] = await db
      .update(athletes)
      .set({ 
        skillsAssessment: skills,
        skillsUpdatedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(athletes.id, id))
      .returning();
    return updated;
  }

  async searchAthletes(filters: any): Promise<Athlete[]> {
    const conditions = [];
    
    // Apply filters
    if (filters.position) {
      conditions.push(eq(athletes.position, filters.position));
    }
    if (filters.state) {
      conditions.push(eq(athletes.state, filters.state));
    }
    if (filters.verificationLevel) {
      conditions.push(eq(athletes.verificationLevel, filters.verificationLevel));
    }
    
    const query = db.select().from(athletes);
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(athletes.updatedAt));
    }
    return await query.orderBy(desc(athletes.updatedAt));
  }

  // Scout operations
  async createScout(scout: InsertScout): Promise<Scout> {
    const [created] = await db.insert(scouts).values(scout).returning();
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
    const [created] = await db.insert(tests).values(test).returning();
    return created;
  }

  async getTestsByAthlete(athleteId: number): Promise<Test[]> {
    return await db
      .select()
      .from(tests)
      .where(eq(tests.athleteId, athleteId))
      .orderBy(desc(tests.createdAt));
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
    await db.insert(athleteViews).values({ athleteId, scoutId });
  }

  async getAthleteViewCount(athleteId: number): Promise<number> {
    const [result] = await db
      .select({ count: sql<number>`count(*)` })
      .from(athleteViews)
      .where(eq(athleteViews.athleteId, athleteId));
    return result.count;
  }

  async getAthleteStats(): Promise<{ totalAthletes: number; totalVerifications: number; totalScouts: number }> {
    const [athleteCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(athletes);
    
    const [testCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tests)
      .where(eq(tests.verified, true));
    
    const [scoutCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(scouts);

    return {
      totalAthletes: athleteCount.count,
      totalVerifications: testCount.count,
      totalScouts: scoutCount.count,
    };
  }

  // Dashboard specific operations
  async getRecentAthleteViews(athleteId: number, days: number = 7): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await db
      .select({
        id: athleteViews.id,
        scoutId: athleteViews.scoutId,
        viewedAt: athleteViews.viewedAt,
        scoutName: scouts.fullName,
        organization: scouts.organization
      })
      .from(athleteViews)
      .innerJoin(scouts, eq(athleteViews.scoutId, scouts.id))
      .where(
        and(
          eq(athleteViews.athleteId, athleteId),
          sql`${athleteViews.viewedAt} >= ${cutoffDate}`
        )
      )
      .orderBy(desc(athleteViews.viewedAt))
      .limit(10);
  }

  async getAthleteAchievements(athleteId: number): Promise<any[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.athleteId, athleteId))
      .orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(achievement: {
    athleteId: number;
    achievementType: string;
    title: string;
    description?: string;
    icon?: string;
    points?: number;
  }): Promise<any> {
    const [created] = await db.insert(achievements).values(achievement).returning();
    return created;
  }

  async getAthleteStreak(athleteId: number): Promise<number> {
    // Get all test dates for the athlete, ordered by date
    const testDates = await db
      .select({ date: sql<string>`DATE(${tests.createdAt})` })
      .from(tests)
      .where(eq(tests.athleteId, athleteId))
      .orderBy(desc(tests.createdAt));

    if (testDates.length === 0) return 0;

    // Check if the most recent test was today or yesterday
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mostRecentTest = new Date(testDates[0].date);
    const daysDiff = Math.floor((today.getTime() - mostRecentTest.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) return 0; // Streak is broken

    let streak = 1;
    for (let i = 1; i < testDates.length; i++) {
      const currentDate = new Date(testDates[i - 1].date);
      const previousDate = new Date(testDates[i].date);
      const diff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  async getAthletePercentile(athleteId: number): Promise<number> {
    const athlete = await this.getAthlete(athleteId);
    if (!athlete) return 50;

    // Get all athletes in the same age range and position
    const birthYear = new Date(athlete.birthDate).getFullYear();
    const ageRange = 2; // +/- 2 years

    const peers = await db
      .select({
        id: athletes.id,
        avgResult: sql<number>`AVG(CAST(${tests.result} AS FLOAT))`
      })
      .from(athletes)
      .leftJoin(tests, eq(athletes.id, tests.athleteId))
      .where(
        and(
          eq(athletes.position, athlete.position),
          sql`EXTRACT(YEAR FROM ${athletes.birthDate}) BETWEEN ${birthYear - ageRange} AND ${birthYear + ageRange}`,
          eq(tests.testType, 'speed_20m'),
          eq(tests.verified, true)
        )
      )
      .groupBy(athletes.id);

    if (peers.length < 5) return 75; // Not enough data, return good percentile

    // Get this athlete's average performance
    const myPerformance = peers.find(p => p.id === athleteId);
    if (!myPerformance || !myPerformance.avgResult) return 50;

    // Calculate percentile (lower time is better for speed tests)
    const betterThanCount = peers.filter(p => 
      p.avgResult && p.avgResult > myPerformance.avgResult
    ).length;

    return Math.round((betterThanCount / peers.length) * 100);
  }

  // Skill verification operations
  async getSkillVerifications(athleteId: number): Promise<SkillVerification[]> {
    return await db
      .select()
      .from(skillVerifications)
      .where(eq(skillVerifications.athleteId, athleteId))
      .orderBy(desc(skillVerifications.verifiedAt));
  }

  async createSkillVerification(verification: {
    athleteId: number;
    skillId: string;
    trustLevel: string;
    verificationMethod: string;
    verifiedBy?: string;
    metadata?: any;
  }): Promise<SkillVerification> {
    const [created] = await db
      .insert(skillVerifications)
      .values({
        ...verification,
        trustLevel: verification.trustLevel as "bronze" | "silver" | "gold" | "platinum",
      })
      .returning();
    return created;
  }

  async deleteSkillVerification(verificationId: number, athleteId: number): Promise<boolean> {
    const result = await db
      .delete(skillVerifications)
      .where(
        and(
          eq(skillVerifications.id, verificationId),
          eq(skillVerifications.athleteId, athleteId)
        )
      );
    return (result.rowCount ?? 0) > 0;
  }

  async updateAthleteVerificationLevel(athleteId: number, level: string): Promise<void> {
    await db
      .update(athletes)
      .set({ 
        verificationLevel: level as "bronze" | "silver" | "gold" | "platinum",
        updatedAt: new Date()
      })
      .where(eq(athletes.id, athleteId));
  }
  
  async getTests(athleteId: number): Promise<Test[]> {
    return await db
      .select()
      .from(tests)
      .where(eq(tests.athleteId, athleteId))
      .orderBy(desc(tests.createdAt));
  }

  // Checkin operations
  async createCheckin(checkinData: InsertCheckin): Promise<Checkin> {
    const [checkin] = await db
      .insert(checkins)
      .values(checkinData)
      .returning();
    return checkin;
  }

  async getTodayCheckin(athleteId: number): Promise<Checkin | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [checkin] = await db
      .select()
      .from(checkins)
      .where(
        and(
          eq(checkins.athleteId, athleteId),
          sql`${checkins.createdAt} >= ${today}`,
          sql`${checkins.createdAt} < ${tomorrow}`
        )
      )
      .limit(1);
    
    return checkin;
  }

  async getCheckinHistory(athleteId: number, limit: number = 30): Promise<Checkin[]> {
    return await db
      .select()
      .from(checkins)
      .where(eq(checkins.athleteId, athleteId))
      .orderBy(desc(checkins.createdAt))
      .limit(limit);
  }

  async getCheckinStreak(athleteId: number): Promise<number> {
    // Get checkins ordered by date descending
    const checkinHistory = await db
      .select()
      .from(checkins)
      .where(eq(checkins.athleteId, athleteId))
      .orderBy(desc(checkins.createdAt));
    
    if (checkinHistory.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if there's a checkin today
    const todayCheckin = checkinHistory.find(c => {
      const checkinDate = new Date(c.createdAt!);
      checkinDate.setHours(0, 0, 0, 0);
      return checkinDate.getTime() === currentDate.getTime();
    });
    
    // If no checkin today, check if there was one yesterday
    if (!todayCheckin) {
      currentDate.setDate(currentDate.getDate() - 1);
      const yesterdayCheckin = checkinHistory.find(c => {
        const checkinDate = new Date(c.createdAt!);
        checkinDate.setHours(0, 0, 0, 0);
        return checkinDate.getTime() === currentDate.getTime();
      });
      
      if (!yesterdayCheckin) return 0;
    }
    
    // Count consecutive days
    for (const checkin of checkinHistory) {
      const checkinDate = new Date(checkin.createdAt!);
      checkinDate.setHours(0, 0, 0, 0);
      
      if (checkinDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (checkinDate.getTime() < currentDate.getTime()) {
        break;
      }
    }
    
    return streak;
  }

  // Activity operations
  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(activityData)
      .returning();
    return activity;
  }

  async getAthleteActivities(
    athleteId: number, 
    filters?: { type?: string; limit?: number }
  ): Promise<Activity[]> {
    let conditions = [eq(activities.athleteId, athleteId)];
    
    if (filters?.type && filters.type !== 'all') {
      conditions.push(eq(activities.type, filters.type as any));
    }
    
    return await db
      .select()
      .from(activities)
      .where(and(...conditions))
      .orderBy(desc(activities.createdAt))
      .limit(filters?.limit || 50);
  }

  async markActivitiesAsRead(athleteId: number, activityIds: number[]): Promise<void> {
    if (activityIds.length === 0) return;
    
    await db
      .update(activities)
      .set({ isRead: true })
      .where(
        and(
          eq(activities.athleteId, athleteId),
          inArray(activities.id, activityIds)
        )
      );
  }
  
  async getRecentActivities(limit: number = 10): Promise<any[]> {
    const recentActivities = await db
      .select({
        id: activities.id,
        type: activities.type,
        title: activities.title,
        message: activities.message,
        metadata: activities.metadata,
        createdAt: activities.createdAt,
        athleteId: activities.athleteId,
        athleteName: athletes.fullName,
        athleteLocation: sql`${athletes.city} || ', ' || ${athletes.state}`
      })
      .from(activities)
      .leftJoin(athletes, eq(activities.athleteId, athletes.id))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
      
    return recentActivities;
  }
  
  async getScoutViewCount(scoutId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(distinct ${athleteViews.athleteId})` })
      .from(athleteViews)
      .where(eq(athleteViews.scoutId, scoutId));
      
    return result[0]?.count || 0;
  }
  
  async getScoutRecentViews(scoutId: number, days: number = 7): Promise<any[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    return await db
      .select({
        athleteId: athleteViews.athleteId,
        viewedAt: athleteViews.viewedAt,
        athleteName: athletes.fullName,
        athletePosition: athletes.position,
        athleteCity: athletes.city,
        athleteState: athletes.state
      })
      .from(athleteViews)
      .innerJoin(athletes, eq(athleteViews.athleteId, athletes.id))
      .where(
        and(
          eq(athleteViews.scoutId, scoutId),
          sql`${athleteViews.viewedAt} >= ${since}`
        )
      )
      .orderBy(desc(athleteViews.viewedAt));
  }
  
  // Payment operations
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.active, true))
      .orderBy(subscriptionPlans.price);
  }
  
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, id));
    return plan;
  }
  
  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [subscription] = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(desc(userSubscriptions.createdAt))
      .limit(1);
    return subscription;
  }
  
  async createUserSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const [created] = await db
      .insert(userSubscriptions)
      .values(subscription)
      .returning();
    return created;
  }
  
  async updateUserSubscription(id: number, updates: Partial<InsertUserSubscription>): Promise<UserSubscription> {
    const [updated] = await db
      .update(userSubscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSubscriptions.id, id))
      .returning();
    return updated;
  }
  
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.userId, userId))
      .orderBy(desc(paymentMethods.isDefault), desc(paymentMethods.createdAt));
  }
  
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const [created] = await db
      .insert(paymentMethods)
      .values(method)
      .returning();
    return created;
  }
  
  async updatePaymentMethod(id: number, updates: Partial<InsertPaymentMethod>): Promise<PaymentMethod> {
    const [updated] = await db
      .update(paymentMethods)
      .set(updates)
      .where(eq(paymentMethods.id, id))
      .returning();
    return updated;
  }
  
  async deletePaymentMethod(id: number): Promise<void> {
    await db
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, id));
  }
  
  async createPaymentTransaction(transaction: InsertPaymentTransaction): Promise<PaymentTransaction> {
    const [created] = await db
      .insert(paymentTransactions)
      .values(transaction)
      .returning();
    return created;
  }
  
  async getUserTransactions(userId: string, limit: number = 50): Promise<PaymentTransaction[]> {
    return await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.userId, userId))
      .orderBy(desc(paymentTransactions.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
