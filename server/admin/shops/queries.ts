import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { ShopsTableSchema } from "~/server/admin/shops/schema"
import { db } from "~/services/db"

export const findShops = async (search: ShopsTableSchema, where?: Prisma.ShopsWhereInput) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.ShopsWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.ShopsWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [shops, shopsTotal] = await db.$transaction([
    db.shops.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { createdAt: "asc" }],
      take: perPage,
      skip: offset,
      include: { _count: { select: { tools: true } } },
    }),

    db.shops.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(shopsTotal / perPage)
  return { shops, shopsTotal, pageCount }
}

export const findShopList = async ({ ...args }: Prisma.ShopsFindManyArgs = {}) => {
  return db.shops.findMany({
    ...args,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const findShopBySlug = async (slug: string) => {
  return db.shops.findUnique({
    where: { slug },
    include: {
      tools: { select: { id: true } },
    },
  })
}
