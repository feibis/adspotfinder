"use server"

import { after } from "next/server"
import { adminActionClient } from "~/lib/safe-actions"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { shopSchema } from "~/server/admin/shops/schema"

export const upsertShop = adminActionClient
  .inputSchema(shopSchema)
  .action(async ({ parsedInput: { id, locations, categories, ...input }, ctx: { db, revalidate } }) => {
    const locationIds = locations?.map(id => ({ id }))
    const categoryIds = categories?.map(id => ({ id }))

    const shop = id
      ? await db.shop.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || "",
            locations: { set: locationIds },
            categories: { set: categoryIds },
          },
        })
      : await db.shop.create({
          data: {
            ...input,
            slug: input.slug || "",
            locations: { connect: locationIds },
            categories: { connect: categoryIds },
          },
        })

    after(async () => {
      revalidate({
        paths: ["/admin/shops"],
        tags: ["shops", `shop-${shop.slug}`],
      })
    })

    return shop
  })

export const duplicateShop = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const originalShop = await db.shop.findUnique({
      where: { id },
      include: {
        locations: { select: { id: true } },
        categories: { select: { id: true } }
      },
    })

    if (!originalShop) {
      throw new Error("Shop not found")
    }

    const newName = `${originalShop.name} (Copy)`

    const duplicatedShop = await db.shop.create({
      data: {
        name: newName,
        slug: "", // Slug will be auto-generated
        locations: { connect: originalShop.locations },
        categories: { connect: originalShop.categories },
      },
    })

    revalidate({
      paths: ["/admin/shops"],
      tags: ["shops"],
    })

    return duplicatedShop
  })

export const deleteShops = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.shop.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/shops"],
      tags: ["shops"],
    })

    return true
  })
