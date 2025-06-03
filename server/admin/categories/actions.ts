"use server"

import { slugify } from "@primoui/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/schema"
import { db } from "~/services/db"

export const upsertCategory = adminProcedure
  .createServerAction()
  .input(categorySchema)
  .handler(async ({ input: { id, tools, ...input } }) => {
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

    revalidateTag("categories")
    revalidateTag(`category-${category.slug}`)

    return category
  })

export const deleteCategories = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.category.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/categories")
    revalidateTag("categories")

    return true
  })
