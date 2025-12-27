import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { PricingsTableSchema } from "~/server/admin/pricings/schema"
import { db } from "~/services/db"

export const findPricings = async (
  search: PricingsTableSchema,
  where?: Prisma.PricingWhereInput,
) => {
  const { name, page, perPage, sort, from, to, operator } = search

  const offset = (page - 1) * perPage
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.PricingWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.PricingWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  const [pricings, pricingsTotal] = await db.$transaction([
    db.pricing.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { createdAt: "asc" }],
      take: perPage,
      skip: offset,
      include: {
        tool: { select: { name: true, slug: true } },
        attributes: { select: { id: true, name: true, group: { select: { name: true } } } },
        _count: { select: { attributes: true } },
      },
    }),

    db.pricing.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(pricingsTotal / perPage)
  return { pricings, pricingsTotal, pageCount }
}

export const findPricingList = async ({ toolId, ...args }: { toolId?: string } & Prisma.PricingFindManyArgs = {}) => {
  return db.pricing.findMany({
    where: { isActive: true, ...(toolId && { toolId }) },
    ...args,
    select: { 
      id: true, 
      name: true, 
      price: true, 
      currency: true, 
      period: true,
      unit: true,
      attributes: { select: { id: true, name: true } },
    },
    orderBy: { order: "asc" },
  })
}

export const findPricingById = async (id: string) => {
  return db.pricing.findUnique({
    where: { id },
    include: {
      tool: { select: { id: true, name: true, slug: true } },
      attributes: { select: { id: true } },
    },
  })
}

