import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import { locationManyPayload, locationOnePayload } from "~/server/web/locations/payloads"
import type { LocationsFilterParams } from "~/server/web/locations/schema"
import { db } from "~/services/db"

export const searchLocations = async (search: LocationsFilterParams, where?: Prisma.LocationWhereInput) => {
  "use cache"

  cacheTag("locations")
  cacheLife("infinite")

  const { q, letter, sort, page, perPage } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.LocationWhereInput = {
    tools: { some: { status: ToolStatus.Published } },
    ...(q && { name: { contains: q, mode: "insensitive" } }),
  }

  // Filter by letter if provided
  if (letter) {
    if (/^[A-Za-z]$/.test(letter)) {
      // Single alphabet letter - find locations starting with this letter
      whereQuery.name = {
        startsWith: letter.toUpperCase(),
        mode: "insensitive",
      }
    } else {
      // Non-alphabetic character (e.g., "#" for numbers/symbols) - find locations that don't start with alphabet letters
      whereQuery.NOT = {
        OR: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(char => ({
          name: { startsWith: char, mode: "insensitive" },
        })),
      }
    }
  }

  const [locations, total] = await db.$transaction([
    db.location.findMany({
      orderBy: sortBy ? { [sortBy]: sortOrder } : { name: "asc" },
      where: { ...whereQuery, ...where },
      select: locationManyPayload,
      take,
      skip,
    }),

    db.location.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  console.log(`Locations search: ${Math.round(performance.now() - start)}ms`)

  return { locations, total, page, perPage }
}

export const findLocationSlugs = async ({ where, orderBy, ...args }: Prisma.LocationFindManyArgs) => {
  "use cache"

  cacheTag("locations")
  cacheLife("infinite")

  return db.location.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLocation = async ({ where, ...args }: Prisma.LocationFindFirstArgs = {}) => {
  "use cache"

  cacheTag("location", `location-${where?.slug}`)
  cacheLife("infinite")

  return db.location.findFirst({
    ...args,
    where,
    select: locationOnePayload,
  })
}
