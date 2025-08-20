"use server"

import { slugify } from "@primoui/utils"
import { adminActionClient } from "~/lib/safe-actions"
import { idsSchema } from "~/server/admin/shared/schema"
import { tagSchema } from "~/server/admin/tags/schema"

export const upsertTag = adminActionClient
  .inputSchema(tagSchema)
  .action(async ({ parsedInput: { id, tools, ...input }, ctx: { db, revalidate } }) => {
    const toolIds = tools?.map(id => ({ id }))

    const tag = id
      ? await db.tag.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            tools: { set: toolIds },
          },
        })
      : await db.tag.create({
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            tools: { connect: toolIds },
          },
        })

    revalidate({
      paths: ["/admin/tags"],
      tags: ["tags", `tag-${tag.slug}`],
    })

    return tag
  })

export const deleteTags = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.tag.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/tags"],
      tags: ["tags"],
    })

    return true
  })
