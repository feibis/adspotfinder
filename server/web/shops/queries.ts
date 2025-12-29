import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import { shopManyPayload, shopOnePayload } from "~/server/web/shops/payloads"
import type { ShopsFilterParams } from "~/server/web/shops/schema"
import { db } from "~/services/db"

export const searchShops = async (search: ShopsFilterParams, where?: Prisma.ShopsWhereInput) => {
  "use cache"

  cacheTag("shops")
  cacheLife("infinite")

  const { q, letter, sort, page, perPage } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.ShopsWhereInput = {
    tools: { some: { status: ToolStatus.Published } },
    ...(q && { name: { contains: q, mode: "insensitive" } }),
  }

  // Filter by letter if provided
  if (letter) {
    if (/^[A-Za-z]$/.test(letter)) {
      // Single alphabet letter - find shops starting with this letter
      whereQuery.name = {
        startsWith: letter.toUpperCase(),
        mode: "insensitive",
      }
    } else {
      // Non-alphabetic character (e.g., "#" for numbers/symbols) - find shops that don't start with alphabet letters
      whereQuery.NOT = {
        OR: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => ({
          name: { startsWith: char, mode: "insensitive" },
        })),
      }
    }
  }

  const [shops, total] = await db.$transaction([
    db.shops.findMany({
      orderBy: sortBy ? { [sortBy]: sortOrder } : { name: "asc" },
      where: { ...whereQuery, ...where },
      select: shopManyPayload,
      take,
      skip,
    }),

    db.shops.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  console.log(`Shops search: ${Math.round(performance.now() - start)}ms`)

  return { shops, total, page, perPage }
}

export const findShopSlugs = async ({ where, orderBy, ...args }: Prisma.ShopsFindManyArgs) => {
  "use cache"

  cacheTag("shops")
  cacheLife("infinite")

  return db.shops.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findShop = async ({ where, ...args }: Prisma.ShopsFindFirstArgs = {}) => {
  "use cache"

  cacheTag("shop", `shop-${where?.slug}`)
  cacheLife("infinite")

  return db.shops.findFirst({
    ...args,
    where,
    select: shopOnePayload,
  })
}
