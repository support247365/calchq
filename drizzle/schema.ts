import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ZIP code table for programmatic SEO pages
export const zipCodes = mysqlTable("zip_codes", {
  id: int("id").autoincrement().primaryKey(),
  zip: varchar("zip", { length: 10 }).notNull().unique(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  stateName: varchar("state_name", { length: 50 }).notNull(),
  county: varchar("county", { length: 100 }),
  lat: varchar("lat", { length: 20 }),
  lng: varchar("lng", { length: 20 }),
  timezone: varchar("timezone", { length: 50 }),
  utcOffset: int("utc_offset"),
  medianIncome: int("median_income"),
  medianHomeValue: int("median_home_value"),
});

export type ZipCode = typeof zipCodes.$inferSelect;
export type InsertZipCode = typeof zipCodes.$inferInsert;