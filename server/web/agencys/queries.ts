import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import { agencyManyPayload, agencyOnePayload } from "~/server/web/agencys/payloads"
import type { AgencysFilterParams } from "~/server/web/agencys/schema"
import { db } from "~/services/db"

export const searchAgencys = async (search: AgencysFilterParams, where?: Prisma.AgencyWhereInput) => {
  "use cache"

  cacheTag("agencys")
  cacheLife("infinite")

  const { q, letter, sort, page, perPage } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.AgencyWhereInput = {
    ...(q && { name: { contains: q, mode: "insensitive" } }),
  }

  // Filter by letter if provided
  if (letter) {
    if (/^[A-Za-z]$/.test(letter)) {
      // Single alphabet letter - find agencys starting with this letter
      whereQuery.name = {
        startsWith: letter.toUpperCase(),
        mode: "insensitive",
      }
    } else {
      // Non-alphabetic character (e.g., "#" for numbers/symbols) - find agencys that don't start with alphabet letters
      whereQuery.NOT = {
        OR: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => ({
          name: { startsWith: char, mode: "insensitive" },
        })),
      }
    }
  }

  const [agencys, total] = await db.$transaction([
    db.agency.findMany({
      orderBy: sortBy ? { [sortBy]: sortOrder } : { name: "asc" },
      where: { ...whereQuery, ...where },
      select: agencyManyPayload,
      take,
      skip,
    }),

    db.agency.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  console.log(`Agencys search: ${Math.round(performance.now() - start)}ms`)

  return { agencys, total, page, perPage }
}

export const findAgencySlugs = async ({ where, orderBy, ...args }: Prisma.AgencyFindManyArgs) => {
  "use cache"

  cacheTag("agencys")
  cacheLife("infinite")

  return db.agency.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: where,
    select: { slug: true, updatedAt: true },
  })
}

export const findAgency = async ({ where, ...args }: Prisma.AgencyFindFirstArgs = {}) => {
  "use cache"

  cacheTag("agency", `agency-${where?.slug}`)
  cacheLife("infinite")

  return db.agency.findFirst({
    ...args,
    where,
    select: agencyOnePayload,
  })
}
