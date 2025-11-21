import "dotenv/config"
import path from "node:path"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  // Database connection URL for migrations (moved from schema.prisma in Prisma 7)
  datasource: {
    url: env("DATABASE_URL"),
  },

  schema: path.join("prisma", "schema.prisma"),

  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "bun prisma/seed.ts",
  },
})
