import { performance } from "node:perf_hooks"
import { getRandomElement } from "@primoui/utils"
import { cacheLife, cacheTag } from "next/cache"
import { Prisma, ToolStatus } from "~/.generated/prisma/client"
import { toolManyPayload, toolOnePayload } from "~/server/web/tools/payloads"
import type { ToolFilterParams } from "~/server/web/tools/schema"
import { db } from "~/services/db"

export const searchTools = async (search: ToolFilterParams, where?: Prisma.ToolWhereInput) => {
  "use cache"

  cacheTag("tools")
  cacheLife("infinite")

  const { q, category, country, sort, page, perPage } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    ...(category && { categories: { some: { slug: category } } }),
    ...(country && { locations: { some: { slug: country } } }),
  }

  if (q) {
    whereQuery.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { tagline: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ]
  }

  // Handle price sorting with raw SQL for efficiency
  if (sortBy === "price") {
    const tools = await db.$queryRaw<Array<{ id: string }>>`
      SELECT DISTINCT t.id
      FROM "Tool" t
      LEFT JOIN "Pricing" p ON p."toolId" = t.id AND p."isActive" = true
      WHERE t.status = ${ToolStatus.Published}
        ${category ? Prisma.sql`AND EXISTS (SELECT 1 FROM "_CategoryToTool" ct WHERE ct."B" = t.id AND ct."A" IN (SELECT id FROM "Category" WHERE slug = ${category}))` : Prisma.empty}
        ${country ? Prisma.sql`AND EXISTS (SELECT 1 FROM "_LocationToTool" lt WHERE lt."B" = t.id AND lt."A" IN (SELECT id FROM "Location" WHERE slug = ${country}))` : Prisma.empty}
        ${q ? Prisma.sql`AND (t.name ILIKE ${`%${q}%`} OR t.tagline ILIKE ${`%${q}%`} OR t.description ILIKE ${`%${q}%`})` : Prisma.empty}
      GROUP BY t.id
      ORDER BY MIN(p.price) ${sortOrder === "desc" ? Prisma.sql`DESC NULLS LAST` : Prisma.sql`ASC NULLS LAST`}
      LIMIT ${take}
      OFFSET ${skip}
    `

    const toolIds = tools.map(t => t.id)
    const toolsData = await db.tool.findMany({
      where: { id: { in: toolIds } },
      select: toolManyPayload,
    })

    // Maintain the order from the raw query
    const orderedTools = toolIds
      .map(id => toolsData.find(t => t.id === id))
      .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined)

    const total = await db.tool.count({ where: { ...whereQuery, ...where } })

    console.log(`Tools search (price sort): ${Math.round(performance.now() - start)}ms`)

    return { tools: orderedTools, total, page, perPage }
  }

  // Standard sorting
  const [tools, total] = await db.$transaction([
    db.tool.findMany({
      orderBy: sortBy ? { [sortBy]: sortOrder } : [{ isFeatured: "desc" }, { createdAt: "desc" }],
      where: { ...whereQuery, ...where },
      select: toolManyPayload,
      take,
      skip,
    }),

    db.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  console.log(`Tools search: ${Math.round(performance.now() - start)}ms`)

  return { tools, total, page, perPage }
}

export const findRelatedTools = async ({
  where,
  slug,
  ...args
}: Prisma.ToolFindManyArgs & { slug: string }) => {
  "use cache"

  cacheTag("related-tools")
  cacheLife("minutes")

  const relatedWhereClause = {
    ...where,
    AND: [
      { status: ToolStatus.Published },
      { slug: { not: slug } },
      { categories: { some: { tools: { some: { slug } } } } },
    ],
  } satisfies Prisma.ToolWhereInput

  const take = 3
  const itemCount = await db.tool.count({ where: relatedWhereClause })
  const skip = Math.max(0, Math.floor(Math.random() * itemCount) - take)
  const properties = ["id", "name"] satisfies (keyof Prisma.ToolOrderByWithRelationInput)[]
  const orderBy = getRandomElement(properties)
  const orderDir = getRandomElement(["asc", "desc"] as const)

  return db.tool.findMany({
    ...args,
    where: relatedWhereClause,
    select: toolManyPayload,
    orderBy: { [orderBy]: orderDir },
    take,
    skip,
  })
}

export const findTools = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache"

  cacheTag("tools")
  cacheLife("infinite")

  return db.tool.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    orderBy: orderBy ?? [{ isFeatured: "desc" }, { createdAt: "desc" }],
    select: toolManyPayload,
  })
}

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache"

  cacheTag("tools")
  cacheLife("infinite")

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const countSubmittedTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  return db.tool.count({
    ...args,
    where: {
      status: { notIn: [ToolStatus.Published] },
      submitterEmail: { not: null },
      ...where,
    },
  })
}

export const findTool = async ({ where, ...args }: Prisma.ToolFindFirstArgs = {}) => {
  "use cache"

  cacheTag("tool", `tool-${where?.slug}`)
  cacheLife("infinite")

  return db.tool.findFirst({
    ...args,
    where,
    select: toolOnePayload,
  })
}
