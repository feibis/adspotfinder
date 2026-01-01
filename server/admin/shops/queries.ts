import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { ShopsTableSchema } from "~/server/admin/shops/schema"
import { db } from "~/services/db"

export const findShops = async (search: ShopsTableSchema, where?: Prisma.ShopWhereInput) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.ShopWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.ShopWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [shops, shopsTotal] = await db.$transaction([
    db.shop.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { createdAt: "asc" }],
      take: perPage,
      skip: offset,
      include: {
        _count: {
          select: {
            locations: true,
            categories: true
          }
        }
      },
    }),

    db.shop.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(shopsTotal / perPage)
  return { shops, shopsTotal, pageCount }
}

export const findShopList = async ({ ...args }: Prisma.ShopFindManyArgs = {}) => {
  return db.shop.findMany({
    ...args,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const findShopBySlug = async (slug: string) => {
  return db.shop.findUnique({
    where: { slug },
    include: {
      locations: { select: { id: true, name: true } },
      categories: { select: { id: true, name: true } },
    },
  })
}
