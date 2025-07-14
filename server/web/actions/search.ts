"use server"

import { ToolStatus } from "@prisma/client"
import { z } from "zod"
import { actionClient } from "~/lib/safe-actions"
import { db } from "~/services/db"

export const searchItems = actionClient
  .inputSchema(z.object({ query: z.string() }))
  .action(async ({ parsedInput: { query } }) => {
    const start = performance.now()

    const [tools, categories, tags] = await Promise.all([
      db.tool.findMany({
        where: {
          status: ToolStatus.Published,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { tagline: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { name: "asc" },
        take: 10,
      }),

      db.category.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 10,
      }),

      db.tag.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 10,
      }),
    ])

    console.log(`Search: ${Math.round(performance.now() - start)}ms`)

    return { tools, categories, tags }
  })
