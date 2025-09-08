"use server"

import { getDomain } from "@primoui/utils"
import { AdType, type Prisma } from "@prisma/client"
import z from "zod"
import { adsConfig } from "~/config/ads"
import { getFaviconFetchUrl } from "~/lib/media"
import { actionClient } from "~/lib/safe-actions"
import { fetchMedia } from "~/server/web/actions/media"
import type { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"
import { adDetailsSchema } from "~/server/web/shared/schema"
import { stripe } from "~/services/stripe"

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

export const createAdFromCheckout = actionClient
  .inputSchema(adDetailsSchema)
  .action(async ({ parsedInput: { sessionId, ...adDetails }, ctx: { db, revalidate } }) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const email = session.customer_details?.email ?? ""
    const ads: Omit<Omit<Prisma.AdCreateInput, "email">, keyof typeof adDetails>[] = []

    if (session.status !== "complete") {
      throw new Error("Checkout session is not complete")
    }

    const adDomain = getDomain(adDetails.websiteUrl)
    const faviconFetchUrl = getFaviconFetchUrl(adDetails.websiteUrl)
    const faviconPath = `ads/${adDomain}/favicon`

    // Upload favicon
    const { data: faviconUrl } = await fetchMedia({ url: faviconFetchUrl, path: faviconPath })

    // Check if ads already exist for specific sessionId
    const existingAds = await db.ad.findMany({
      where: { sessionId },
    })

    // If ads already exist, update them
    if (existingAds.length) {
      await db.ad.updateMany({
        where: { sessionId },
        data: { ...adDetails, faviconUrl },
      })

      // Revalidate the cache
      revalidate({ tags: ["ads"] })

      return { success: true }
    }

    switch (session.mode) {
      // Handle one-time payment ads
      case "payment": {
        if (!session.metadata?.ads) {
          throw new Error("Invalid session for ad creation")
        }

        const adsSchema = z.array(
          z.object({
            type: z.enum(AdType),
            startsAt: z.coerce.number().transform(date => new Date(date)),
            endsAt: z.coerce.number().transform(date => new Date(date)),
          }),
        )

        // Parse the ads from the session metadata
        const parsedAds = adsSchema.parse(JSON.parse(session.metadata.ads))

        // Add ads to create later
        ads.push(...parsedAds)

        break
      }

      // Handle subscription-based ads
      case "subscription": {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        if (!subscription.metadata?.ads) {
          throw new Error("Invalid session for ad creation")
        }

        const adsSchema = z.array(
          z.object({
            type: z.enum(AdType),
            alternatives: z.array(z.string()),
          }),
        )

        // Parse the ads from the session metadata
        const parsedAds = adsSchema.parse(JSON.parse(subscription.metadata.ads))

        // Add ads to create later
        ads.push(
          ...parsedAds.map(({ type, alternatives }) => ({
            type,
            subscriptionId: subscription.id,
            startsAt: new Date(),
            endsAt: new Date(new Date().setFullYear(new Date().getFullYear() + 10)),
            alternatives: { connect: alternatives.map(slug => ({ slug })) },
          })),
        )

        break
      }

      default: {
        throw new Error("Invalid session for ad creation")
      }
    }

    // Create ads in a transaction
    await db.$transaction(
      ads.map(ad => db.ad.create({ data: { ...ad, ...adDetails, email, faviconUrl, sessionId } })),
    )

    // Revalidate the cache
    revalidate({ tags: ["ads"] })

    return { success: true }
  })
