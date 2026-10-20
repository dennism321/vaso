import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Uses DATABASE_URL from the environment (.env locally, project settings on Vercel).
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
