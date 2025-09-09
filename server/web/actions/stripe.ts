"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { siteConfig } from "~/config/site"
import { actionClient } from "~/lib/safe-actions"
import { stripe } from "~/services/stripe"

const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
})

const recurringSchema = z.object({
  interval: z.enum(["day", "week", "month", "year"]),
  interval_count: z.number().default(1),
})

const lineItemSchema = z.union([
  // Existing price ID
  z.object({
    price: z.string(),
    quantity: z.number().default(1),
  }),

  // Price data for custom pricing
  z.object({
    price_data: z.object({
      product_data: productSchema,
      unit_amount: z.number(),
      currency: z.string(),
      recurring: recurringSchema.optional(),
    }),
    quantity: z.number().default(1),
  }),
])

export const createStripeCheckout = actionClient
  .inputSchema(
    z.object({
      lineItems: z.array(lineItemSchema),
      mode: z.enum(["subscription", "payment"]),
      metadata: z.record(z.string(), z.string()).optional(),
      coupon: z.string().optional(),
      successUrl: z.string(),
      cancelUrl: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput: { lineItems, successUrl, cancelUrl, mode, metadata, coupon } }) => {
    const checkout = await stripe.checkout.sessions.create({
      mode,
      customer_creation: "if_required",
      line_items: lineItems,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      invoice_creation: mode === "payment" ? { enabled: true } : undefined,
      metadata: mode === "payment" ? metadata : undefined,
      subscription_data: mode === "subscription" && metadata ? { metadata } : undefined,
      allow_promotion_codes: coupon ? undefined : true,
      discounts: coupon ? [{ coupon }] : undefined,
      success_url: `${siteConfig.url}${successUrl}?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ? `${siteConfig.url}${cancelUrl}?cancelled=true` : undefined,
    })

    if (!checkout.url) {
      throw new Error("Unable to create a new Stripe Checkout Session.")
    }

    // Redirect to the checkout session url
    redirect(checkout.url)
  })
