"use server"

import { AdType } from "@prisma/client"
import z from "zod"
import { adsConfig } from "~/config/ads"
import { actionClient } from "~/lib/safe-actions"
import type { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"

const findAdWithFallbackSchema = z.object({
  type: z.enum(AdType),
  explicitAd: z
    .object({
      type: z.enum(AdType),
      websiteUrl: z.url(),
      name: z.string(),
      description: z.string().nullish(),
      buttonLabel: z.string().nullish(),
      faviconUrl: z.url().nullish(),
      bannerUrl: z.url().nullish(),
    })
    .nullish(),
  fallback: z.array(z.enum(["all", "default"])).default(["all", "default"]),
})

/**
 * Finds an ad based on the provided parameters.
 * @param input - The ad data to find.
 * @returns The ad that was found or null if not found.
 */
export const findAdWithFallback = actionClient
  .inputSchema(findAdWithFallbackSchema)
  .action(async ({ parsedInput: { type, explicitAd, fallback } }) => {
    let ad: AdOne | null = null

    if (!adsConfig.enabled) {
      return null
    }

    // If ad is explicitly provided, use it directly
    if (explicitAd !== undefined) {
      return explicitAd as AdOne | null
    }

    // Try to find ad for specific type
    if (type) {
      ad = await findAd({ where: { type } })
    }

    // Try fallback to "All" type if enabled and specific type not found
    if (!ad && fallback.includes("all")) {
      ad = await findAd({ where: { type: "All" } })
    }

    // Try fallback to default ad if enabled and no ad found
    if (!ad && fallback.includes("default")) {
      ad = adsConfig.defaultAd
    }

    return ad
  })
