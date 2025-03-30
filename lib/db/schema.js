import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").notNull().unique(),
    password: text("password").notNull(), // Will store hashed password
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    userId: serial("user_id").notNull().references(() => users.id), // Link to users
    text: text("text").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
});