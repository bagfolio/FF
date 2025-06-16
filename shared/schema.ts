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
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type", { enum: ["athlete", "scout", "admin"] }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  athlete: one(athletes, { fields: [users.id], references: [athletes.userId] }),
  scout: one(scouts, { fields: [users.id], references: [scouts.userId] }),
}));

export const athletesRelations = relations(athletes, ({ one, many }) => ({
  user: one(users, { fields: [athletes.userId], references: [users.id] }),
  tests: many(tests),
  views: many(athleteViews),
  achievements: many(achievements),
}));

export const scoutsRelations = relations(scouts, ({ one, many }) => ({
  user: one(users, { fields: [scouts.userId], references: [users.id] }),
  searches: many(scoutSearches),
  views: many(athleteViews),
}));

export const testsRelations = relations(tests, ({ one }) => ({
  athlete: one(athletes, { fields: [tests.athleteId], references: [athletes.id] }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  userType: true,
});

export const insertAthleteSchema = createInsertSchema(athletes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  cpf: z.string().min(11).max(11).regex(/^\d{11}$/, "CPF deve conter 11 dígitos"),
  birthDate: z.string().transform((str) => new Date(str)),
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
