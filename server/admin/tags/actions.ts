"use server"

import { slugify } from "@primoui/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"
import { tagSchema } from "~/server/admin/tags/schema"
import { db } from "~/services/db"

export const upsertTag = adminProcedure
  .createServerAction()
  .input(tagSchema)
  .handler(async ({ input: { id, tools, ...input } }) => {
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

    revalidateTag("tags")
    revalidateTag(`tag-${tag.slug}`)

    return tag
  })

export const deleteTags = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.tag.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/tags")
    revalidateTag("tags")

    return true
  })
