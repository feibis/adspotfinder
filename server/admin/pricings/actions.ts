"use server"

import { after } from "next/server"
import { adminActionClient } from "~/lib/safe-actions"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { pricingSchema } from "~/server/admin/pricings/schema"

export const upsertPricing = adminActionClient
  .inputSchema(pricingSchema)
  .action(async ({ parsedInput: { id, attributes, ...input }, ctx: { db, revalidate } }) => {
    const attributeIds = attributes?.map(id => ({ id }))

    const pricing = id
      ? await db.pricing.update({
          where: { id },
          data: {
            ...input,
            attributes: { set: attributeIds },
          },
        })
      : await db.pricing.create({
          data: {
            ...input,
            attributes: { connect: attributeIds },
          },
        })

    after(async () => {
      revalidate({
        paths: ["/admin/pricings", `/admin/tools/${input.toolId}`],
        tags: ["pricings", `pricing-${pricing.id}`, `tool-${input.toolId}`],
      })
    })

    return pricing
  })

export const duplicatePricing = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const originalPricing = await db.pricing.findUnique({
      where: { id },
      include: { attributes: { select: { id: true } } },
    })

    if (!originalPricing) {
      throw new Error("Pricing not found")
    }

    const newName = originalPricing.name ? `${originalPricing.name} (Copy)` : undefined

    const duplicatedPricing = await db.pricing.create({
      data: {
        name: newName,
        description: originalPricing.description,
        price: originalPricing.price,
        currency: originalPricing.currency,
        period: originalPricing.period,
        unit: originalPricing.unit,
        order: originalPricing.order,
        isActive: originalPricing.isActive,
        toolId: originalPricing.toolId,
        attributes: { connect: originalPricing.attributes },
      },
    })

    revalidate({
      paths: ["/admin/pricings"],
      tags: ["pricings"],
    })

    return duplicatedPricing
  })

export const deletePricings = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.pricing.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/pricings"],
      tags: ["pricings"],
    })

    return true
  })

