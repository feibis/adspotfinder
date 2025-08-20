"use server"

import { slugify } from "@primoui/utils"
import { adminActionClient } from "~/lib/safe-actions"
import { categorySchema } from "~/server/admin/categories/schema"
import { idsSchema } from "~/server/admin/shared/schema"

export const upsertCategory = adminActionClient
  .inputSchema(categorySchema)
  .action(async ({ parsedInput: { id, tools, ...input }, ctx: { db, revalidate } }) => {
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

    revalidate({
      paths: ["/admin/categories"],
      tags: ["categories", `category-${category.slug}`],
    })

    return category
  })

export const deleteCategories = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.category.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/categories"],
      tags: ["categories"],
    })

    return true
  })
