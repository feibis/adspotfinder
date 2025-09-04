"use server"

import { getDomain } from "@primoui/utils"
import { AdType, type Prisma } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { env } from "~/env"
import { getFaviconFetchUrl } from "~/lib/media"
import { actionClient } from "~/lib/safe-actions"
import { fetchMedia } from "~/server/web/actions/media"
import { adDetailsSchema } from "~/server/web/shared/schema"
import { db } from "~/services/db"
import { stripe } from "~/services/stripe"

export const createStripeToolCheckout = actionClient
  .inputSchema(
    z.object({
      priceId: z.string(),
      tool: z.string(),
      mode: z.enum(["subscription", "payment"]),
      coupon: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { priceId, tool, mode, coupon } }) => {
    const checkout = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/submit/${tool}/success`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/submit/${tool}?cancelled=true`,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      invoice_creation: mode === "payment" ? { enabled: true } : undefined,
      metadata: mode === "payment" ? { tool } : undefined,
      subscription_data: mode === "subscription" ? { metadata: { tool } } : undefined,
      allow_promotion_codes: coupon ? undefined : true,
      discounts: coupon ? [{ coupon }] : undefined,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Redirect to the checkout session url
    redirect(checkout.url)
  })

export const createStripeAdsCheckout = actionClient
  .inputSchema(
    z.array(
      z.object({
        type: z.enum(AdType),
        price: z.coerce.number(),
        duration: z.coerce.number(),
        metadata: z.object({
          startDate: z.coerce.number(),
          endDate: z.coerce.number(),
        }),
      }),
    ),
  )
  .action(async ({ parsedInput: ads }) => {
    const adData = ads.map(({ type, metadata }) => ({
      type,
      startsAt: metadata.startDate,
      endsAt: metadata.endDate,
    }))

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "if_required",
      line_items: ads.map(({ type, price, duration }) => ({
        price_data: {
          product_data: { name: `${type} Ad` },
          unit_amount: Math.round(price * 100),
          currency: "usd",
        },
        quantity: duration,
      })),
      metadata: { ads: JSON.stringify(adData) },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      invoice_creation: { enabled: true },
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/advertise?cancelled=true`,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Redirect to the checkout session url
    redirect(checkout.url)
  })

export const createAdFromCheckout = actionClient
  .inputSchema(adDetailsSchema)
  .action(async ({ parsedInput: { sessionId, ...adDetails } }) => {
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
      revalidateTag("ads")

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
    revalidateTag("ads")

    return { success: true }
  })
