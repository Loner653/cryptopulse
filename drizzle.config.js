import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load the .env.local file
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./lib/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});