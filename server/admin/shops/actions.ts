"use server"

import { after } from "next/server"
import { adminActionClient } from "~/lib/safe-actions"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { shopSchema } from "~/server/admin/shops/schema"

export const upsertShop = adminActionClient
  .inputSchema(shopSchema)
  .action(async ({ parsedInput: { id, tools, ...input }, ctx: { db, revalidate } }) => {
    const toolIds = tools?.map(id => ({ id }))

    const shop = id
      ? await db.shops.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || "",
            tools: { set: toolIds },
          },
        })
      : await db.shops.create({
          data: {
            ...input,
            slug: input.slug || "",
            tools: { connect: toolIds },
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
    const originalShop = await db.shops.findUnique({
      where: { id },
      include: { tools: { select: { id: true } } },
    })

    if (!originalShop) {
      throw new Error("Shop not found")
    }

    const newName = `${originalShop.name} (Copy)`

    const duplicatedShop = await db.shops.create({
      data: {
        name: newName,
        slug: "", // Slug will be auto-generated
        tools: { connect: originalShop.tools },
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
    await db.shops.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/shops"],
      tags: ["shops"],
    })

    return true
  })
