import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(), // A number that grows for each message
  text: text("text").notNull(),   // The message text
  timestamp: timestamp("timestamp").defaultNow().notNull(), // When it was sent
});