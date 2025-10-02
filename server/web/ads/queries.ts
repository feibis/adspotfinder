import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { Prisma } from "~/.generated/prisma/client"
import { adManyPayload, adOnePayload } from "~/server/web/ads/payloads"
import { db } from "~/services/db"

export const findAds = async ({ where, orderBy, ...args }: Prisma.AdFindManyArgs) => {
  "use cache"

  cacheTag("ads")
  cacheLife("hours")

  return db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    select: adManyPayload,
  })
}

export const findAd = async ({ where, orderBy, ...args }: Prisma.AdFindFirstArgs) => {
  "use cache"

  cacheTag("ad")
  cacheLife("minutes")

  // Find all matching ads
  const matchingAds = await db.ad.findMany({
    ...args,
    orderBy: orderBy ?? { startsAt: "desc" },
    where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() }, ...where },
    select: adOnePayload,
  })

  // Return null if no ads found
  if (matchingAds.length === 0) {
    return null
  }

  // Return a random ad from the matching ones
  const randomIndex = Math.floor(Math.random() * matchingAds.length)
  return matchingAds[randomIndex]
}
