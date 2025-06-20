import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type", { enum: ["athlete", "scout", "admin"] }),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  used: boolean("used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_password_reset_tokens_token").on(table.token),
  index("IDX_password_reset_tokens_expires").on(table.expires),
]);

// Remember me tokens table
export const rememberMeTokens = pgTable("remember_me_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_remember_me_tokens_token").on(table.token),
  index("IDX_remember_me_tokens_expires").on(table.expires),
]);

// Athletes table
export const athletes = pgTable("athletes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("full_name").notNull(),
  birthDate: date("birth_date").notNull(),
  cpf: varchar("cpf", { length: 11 }).unique(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  phone: varchar("phone"),
  parentPhone: varchar("parent_phone"), // For minors
  parentEmail: varchar("parent_email"), // For minors
  position: varchar("position").notNull(),
  secondaryPosition: varchar("secondary_position"),
  dominantFoot: varchar("dominant_foot", { enum: ["left", "right", "both"] }).notNull(),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  currentTeam: varchar("current_team"),
  verificationLevel: varchar("verification_level", { 
    enum: ["bronze", "silver", "gold", "platinum"] 
  }).default("bronze"),
  profileComplete: boolean("profile_complete").default(false),
  parentalConsent: boolean("parental_consent").default(false),
  // Skills assessment fields
  skillsAssessment: jsonb("skills_assessment"),
  skillsUpdatedAt: timestamp("skills_updated_at"),
  skillsVerified: boolean("skills_verified").default(false),
  skillsVerificationDate: timestamp("skills_verification_date"),
  skillsVerifiedBy: varchar("skills_verified_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scouts table
export const scouts = pgTable("scouts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("full_name").notNull(),
  organization: varchar("organization").notNull(),
  position: varchar("position").notNull(),
  phone: varchar("phone"),
  verifiedScout: boolean("verified_scout").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tests table
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  testType: varchar("test_type").notNull(), // "speed_20m", "agility_5_10_5", "technical_skills"
  videoUrl: text("video_url"),
  result: decimal("result", { precision: 6, scale: 3 }), // Time in seconds or score
  aiConfidence: decimal("ai_confidence", { precision: 5, scale: 4 }), // 0-1 confidence score
  verified: boolean("verified").default(false),
  verifiedBy: varchar("verified_by"), // AI or admin ID
  metadata: jsonb("metadata"), // Additional test data
  createdAt: timestamp("created_at").defaultNow(),
});

// Scout searches table
export const scoutSearches = pgTable("scout_searches", {
  id: serial("id").primaryKey(),
  scoutId: integer("scout_id").notNull().references(() => scouts.id, { onDelete: "cascade" }),
  searchName: varchar("search_name"),
  filters: jsonb("filters").notNull(), // Search criteria
  lastUsed: timestamp("last_used").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Athlete views table (for tracking scout interest)
export const athleteViews = pgTable("athlete_views", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  scoutId: integer("scout_id").notNull().references(() => scouts.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Skill verifications table (for tracking individual skill verification)
export const skillVerifications = pgTable("skill_verifications", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  skillId: varchar("skill_id").notNull(), // speed, strength, technique, stamina
  trustLevel: varchar("trust_level", { 
    enum: ["bronze", "silver", "gold", "platinum"] 
  }).notNull(),
  verificationMethod: varchar("verification_method").notNull(), // self_assessment, coach_endorsement, league_stats, ai_verified
  verifiedBy: varchar("verified_by"), // coach ID, league ID, or "ai"
  verifiedAt: timestamp("verified_at").defaultNow(),
  metadata: jsonb("metadata"), // Additional verification data
  expiresAt: timestamp("expires_at"), // Some verifications might expire
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  achievementType: varchar("achievement_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  points: integer("points").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Daily check-ins table
export const checkins = pgTable("checkins", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  mood: jsonb("mood").notNull(), // { emoji, label, value, color, xp }
  intensity: integer("intensity").notNull(), // Training duration in minutes
  trainingFocus: jsonb("training_focus"), // Training areas and time allocation
  reflection: text("reflection"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_checkins_athlete_created").on(table.athleteId, table.createdAt),
]);

// Activities feed table
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull().references(() => athletes.id, { onDelete: "cascade" }),
  type: varchar("type", { 
    enum: ["checkin", "test", "achievement", "view", "skill_update", "rank_change", "system"] 
  }).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"), // Type-specific data (e.g., test results, achievement details)
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_activities_athlete_created").on(table.athleteId, table.createdAt),
  index("IDX_activities_type").on(table.type),
]);

// Subscription plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(), // "basic", "pro", "elite"
  displayName: varchar("display_name").notNull(), // "Revela Basic", "Revela Pro", "Revela Elite"
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Monthly price in BRL
  currency: varchar("currency", { length: 3 }).default("BRL"),
  features: jsonb("features").notNull(), // Array of feature strings
  maxProfiles: integer("max_profiles").default(1), // Number of athlete profiles allowed
  verificationTests: integer("verification_tests").default(0), // Monthly AI verification tests
  scoutVisibility: boolean("scout_visibility").default(false), // Whether visible to scouts
  prioritySupport: boolean("priority_support").default(false),
  stripeProductId: varchar("stripe_product_id"), // Stripe product ID
  stripePriceId: varchar("stripe_price_id"), // Stripe price ID
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions table
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  planId: integer("plan_id").notNull().references(() => subscriptionPlans.id),
  stripeSubscriptionId: varchar("stripe_subscription_id").unique(),
  stripeCustomerId: varchar("stripe_customer_id"),
  status: varchar("status", { 
    enum: ["active", "canceled", "past_due", "paused", "trialing"] 
  }).notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  trialEnd: timestamp("trial_end"),
  metadata: jsonb("metadata"), // Additional subscription data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_user_subscriptions_user").on(table.userId),
  index("IDX_user_subscriptions_status").on(table.status),
]);

// Payment methods table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  stripePaymentMethodId: varchar("stripe_payment_method_id").notNull(),
  type: varchar("type").notNull(), // "card", "boleto", "pix"
  last4: varchar("last4", { length: 4 }), // Last 4 digits of card
  brand: varchar("brand"), // Card brand (visa, mastercard, etc.)
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_payment_methods_user").on(table.userId),
]);

// Payment transactions table
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscription_id").references(() => userSubscriptions.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("BRL"),
  status: varchar("status", { 
    enum: ["succeeded", "processing", "failed", "refunded", "pending"] 
  }).notNull(),
  type: varchar("type", { 
    enum: ["subscription", "one_time", "refund"] 
  }).notNull(),
  description: text("description"),
  failureReason: text("failure_reason"),
  metadata: jsonb("metadata"), // Additional transaction data
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_payment_transactions_user").on(table.userId),
  index("IDX_payment_transactions_status").on(table.status),
]);

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { 
    enum: ["scout_view", "achievement", "test_result", "subscription", "system", "parental_consent"] 
  }).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  actionUrl: varchar("action_url"), // Optional link to relevant page
  imageUrl: varchar("image_url"), // Optional image/icon URL
  metadata: jsonb("metadata"), // Type-specific data
  read: boolean("read").default(false),
  readAt: timestamp("read_at"),
  emailSent: boolean("email_sent").default(false),
  pushSent: boolean("push_sent").default(false),
  expiresAt: timestamp("expires_at"), // Optional expiration
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_notifications_user_read").on(table.userId, table.read),
  index("IDX_notifications_created").on(table.createdAt),
  index("IDX_notifications_type").on(table.type),
]);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  athlete: one(athletes, { fields: [users.id], references: [athletes.userId] }),
  scout: one(scouts, { fields: [users.id], references: [scouts.userId] }),
  subscriptions: many(userSubscriptions),
  paymentMethods: many(paymentMethods),
  transactions: many(paymentTransactions),
  notifications: many(notifications),
}));

export const athletesRelations = relations(athletes, ({ one, many }) => ({
  user: one(users, { fields: [athletes.userId], references: [users.id] }),
  tests: many(tests),
  views: many(athleteViews),
  achievements: many(achievements),
  skillVerifications: many(skillVerifications),
  checkins: many(checkins),
  activities: many(activities),
}));

export const scoutsRelations = relations(scouts, ({ one, many }) => ({
  user: one(users, { fields: [scouts.userId], references: [users.id] }),
  searches: many(scoutSearches),
  views: many(athleteViews),
}));

export const testsRelations = relations(tests, ({ one }) => ({
  athlete: one(athletes, { fields: [tests.athleteId], references: [athletes.id] }),
}));

export const checkinsRelations = relations(checkins, ({ one }) => ({
  athlete: one(athletes, { fields: [checkins.athleteId], references: [athletes.id] }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  athlete: one(athletes, { fields: [activities.athleteId], references: [athletes.id] }),
}));

export const subscriptionPlansRelations = relations(subscriptionPlans, ({ many }) => ({
  subscriptions: many(userSubscriptions),
}));

export const userSubscriptionsRelations = relations(userSubscriptions, ({ one, many }) => ({
  user: one(users, { fields: [userSubscriptions.userId], references: [users.id] }),
  plan: one(subscriptionPlans, { fields: [userSubscriptions.planId], references: [subscriptionPlans.id] }),
  transactions: many(paymentTransactions),
}));

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  user: one(users, { fields: [paymentMethods.userId], references: [users.id] }),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  user: one(users, { fields: [paymentTransactions.userId], references: [users.id] }),
  subscription: one(userSubscriptions, { fields: [paymentTransactions.subscriptionId], references: [userSubscriptions.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  passwordHash: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  userType: true,
  emailVerified: true,
  emailVerificationToken: true,
  emailVerificationExpires: true,
});

export const insertAthleteSchema = createInsertSchema(athletes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  cpf: z.string().min(11).max(11).regex(/^\d{11}$/, "CPF deve conter 11 dígitos"),
  birthDate: z.string(),
});

export const insertScoutSchema = createInsertSchema(scouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestSchema = createInsertSchema(tests).omit({
  id: true,
  createdAt: true,
});

export const insertCheckinSchema = createInsertSchema(checkins).omit({
  id: true,
  createdAt: true,
}).extend({
  mood: z.object({
    emoji: z.string(),
    label: z.string(),
    value: z.number(),
    color: z.string(),
    xp: z.number(),
  }),
  intensity: z.number().min(0).max(300), // Max 5 hours
  trainingFocus: z.object({
    areas: z.array(z.object({
      id: z.string(),
      name: z.string(),
      time: z.number(),
      drills: z.array(z.object({
        id: z.string(),
        name: z.string(),
        duration: z.number(),
      })).optional(),
    })),
    totalAllocatedTime: z.number(),
  }).nullable(),
  reflection: z.string().optional(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
  used: true,
});

export const insertRememberMeTokenSchema = createInsertSchema(rememberMeTokens).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSubscriptionSchema = createInsertSchema(userSubscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  read: true,
  readAt: true,
  emailSent: true,
  pushSent: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Athlete = typeof athletes.$inferSelect;
export type InsertAthlete = z.infer<typeof insertAthleteSchema>;
export type Scout = typeof scouts.$inferSelect;
export type InsertScout = z.infer<typeof insertScoutSchema>;
export type Test = typeof tests.$inferSelect;
export type InsertTest = z.infer<typeof insertTestSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type AthleteView = typeof athleteViews.$inferSelect;
export type SkillVerification = typeof skillVerifications.$inferSelect;
export type Checkin = typeof checkins.$inferSelect;
export type InsertCheckin = z.infer<typeof insertCheckinSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type RememberMeToken = typeof rememberMeTokens.$inferSelect;
export type InsertRememberMeToken = z.infer<typeof insertRememberMeTokenSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = z.infer<typeof insertUserSubscriptionSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
