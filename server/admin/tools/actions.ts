"use server"

import { slugify } from "@primoui/utils"
import { ToolStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod/v4"
import { removeS3Directories } from "~/lib/media"
import { notifySubmitterOfToolPublished, notifySubmitterOfToolScheduled } from "~/lib/notifications"
import { adminActionClient } from "~/lib/safe-actions"
import { toolSchema } from "~/server/admin/tools/schema"
import { db } from "~/services/db"

export const upsertTool = adminActionClient
  .inputSchema(toolSchema)
  .action(async ({ parsedInput: { id, categories, notifySubmitter, ...input } }) => {
    const categoryIds = categories?.map(id => ({ id }))
    const existingTool = id ? await db.tool.findUnique({ where: { id } }) : null

    const tool = id
      ? // If the tool exists, update it
        await db.tool.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            categories: { set: categoryIds },
          },
        })
      : // Otherwise, create it
        await db.tool.create({
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            categories: { connect: categoryIds },
          },
        })

    // Revalidate the tools
    after(() => {
      revalidateTag("tools")
      revalidateTag(`tool-${tool.slug}`)

      if (tool.status === ToolStatus.Scheduled) {
        // Revalidate the schedule if the tool is scheduled
        revalidateTag("schedule")
      }
    })

    after(async () => {
      if (notifySubmitter && (!existingTool || existingTool.status !== tool.status)) {
        // Notify the submitter of the tool published
        await notifySubmitterOfToolPublished(tool)

        // Notify the submitter of the tool scheduled for publication
        await notifySubmitterOfToolScheduled(tool)
      }
    })

    return tool
  })

export const deleteTools = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    })

    after(() => {
      revalidateTag("tools")
    })

    // Remove the tool images from S3 asynchronously
    after(async () => await removeS3Directories(tools.map(({ slug }) => `tools/${slug}`)))

    return true
  })
