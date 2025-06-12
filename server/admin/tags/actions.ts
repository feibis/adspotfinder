"use server"

import { slugify } from "@primoui/utils"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod/v4"
import { adminActionClient } from "~/lib/safe-actions"
import { tagSchema } from "~/server/admin/tags/schema"
import { db } from "~/services/db"

export const upsertTag = adminActionClient
  .inputSchema(tagSchema)
  .action(async ({ parsedInput: { id, tools, ...input } }) => {
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

    after(() => {
      revalidateTag("tags")
      revalidateTag(`tag-${tag.slug}`)
    })

    return tag
  })

export const deleteTags = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids } }) => {
    await db.tag.deleteMany({
      where: { id: { in: ids } },
    })

    after(() => {
      revalidateTag("tags")
    })

    return true
  })
