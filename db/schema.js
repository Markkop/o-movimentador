import { boolean, integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 191 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull().references(() => users.id),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  plan: varchar("plan", { length: 64 }).default("cloud_monthly").notNull(),
  status: varchar("status", { length: 64 }).default("inactive").notNull(),
  aiTier: varchar("ai_tier", { length: 64 }).default("basic").notNull(),
  syncEnabled: boolean("sync_enabled").default(false).notNull(),
  renewsAt: timestamp("renews_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const habits = pgTable("habits", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  anchor: varchar("anchor", { length: 255 }),
  cadence: varchar("cadence", { length: 64 }),
  effortLevel: integer("effort_level").default(1).notNull(),
  durationMin: integer("duration_min").default(5).notNull(),
  status: varchar("status", { length: 64 }).default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const journeys = pgTable("journeys", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 64 }).default("planned").notNull(),
  category: varchar("category", { length: 128 }),
  summary: text("summary"),
  tags: jsonb("tags").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const taskInstances = pgTable("task_instances", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull().references(() => users.id),
  habitId: varchar("habit_id", { length: 191 }).references(() => habits.id),
  title: varchar("title", { length: 255 }).notNull(),
  window: varchar("window", { length: 64 }).default("today").notNull(),
  scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
  durationMin: integer("duration_min").default(5).notNull(),
  effortLevel: integer("effort_level").default(1).notNull(),
  status: varchar("status", { length: 64 }).default("queued").notNull(),
  origin: varchar("origin", { length: 64 }).default("coach").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: varchar("id", { length: 191 }).primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull().references(() => users.id),
  taskId: varchar("task_id", { length: 191 }).references(() => taskInstances.id),
  source: varchar("source", { length: 64 }).default("manual").notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
  steps: integer("steps").default(0).notNull(),
  activeMinutes: integer("active_minutes").default(0).notNull(),
  perceivedEffort: integer("perceived_effort"),
  completed: boolean("completed").default(false).notNull(),
});
