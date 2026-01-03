import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type { AgencysTableSchema } from "~/server/admin/agencys/schema"
import { db } from "~/services/db"

export const findAgencys = async (search: AgencysTableSchema, where?: Prisma.AgencyWhereInput) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.AgencyWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.AgencyWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [agencys, agencysTotal] = await db.$transaction([
    db.agency.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { createdAt: "asc" }],
      take: perPage,
      skip: offset,
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        websiteUrl: true,
        description: true,
        instagramFollowers: true,
        tiktokFollowers: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            locations: true,
            categories: true
          }
        }
      },
    }),

    db.agency.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(agencysTotal / perPage)
  return { agencys, agencysTotal, pageCount }
}

export const findAgencyList = async ({ ...args }: Prisma.AgencyFindManyArgs = {}) => {
  return db.agency.findMany({
    ...args,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const findAgencyBySlug = async (slug: string) => {
  return db.agency.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      email: true,
      phone: true,
      websiteUrl: true,
      description: true,
      instagramFollowers: true,
      tiktokFollowers: true,
      createdAt: true,
      updatedAt: true,
      locations: { select: { id: true, name: true } },
      categories: { select: { id: true, name: true } },
    },
  })
}
