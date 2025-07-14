"use server"

import { slugify } from "@primoui/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { adminActionClient } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/schema"
import { db } from "~/services/db"

export const upsertCategory = adminActionClient
  .inputSchema(categorySchema)
  .action(async ({ parsedInput: { id, tools, ...input } }) => {
    const toolIds = tools?.map(id => ({ id }))

    const category = id
      ? await db.category.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            tools: { set: toolIds },
          },
        })
      : await db.category.create({
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            tools: { connect: toolIds },
          },
        })

    after(() => {
      revalidatePath("/admin/categories")
      revalidateTag("categories")
      revalidateTag(`category-${category.slug}`)
    })

    return category
  })

export const deleteCategories = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids } }) => {
    await db.category.deleteMany({
      where: { id: { in: ids } },
    })

    after(() => {
      revalidatePath("/admin/categories")
      revalidateTag("categories")
    })

    return true
  })
