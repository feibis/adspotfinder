"use server"

import { tryCatch } from "@primoui/utils"
import wretch from "wretch"
import { z } from "zod"
import { getFaviconFetchUrl, getScreenshotFetchUrl, uploadToS3Storage } from "~/lib/media"
import { actionClient } from "~/lib/safe-actions"
import { fileSchema } from "~/server/web/shared/schema"

const pathSchema = z.object({
  path: z.string().regex(/^[a-z0-9/_-]+$/i),
})

const fetchMediaSchema = pathSchema.extend({
  url: z.url().min(1),
  type: z.enum(["favicon", "screenshot"]).default("favicon"),
})

const uploadMediaSchema = pathSchema.extend({
  file: fileSchema,
})

export const fetchMedia = actionClient
  .inputSchema(fetchMediaSchema)
  .action(async ({ parsedInput: { url, path, type } }) => {
    const endpoint = type === "favicon" ? getFaviconFetchUrl(url) : getScreenshotFetchUrl(url)
    const { data, error } = await tryCatch(wretch(endpoint).get().arrayBuffer().then(Buffer.from))

    if (error) {
      console.error("Failed to fetch media:", error)
      throw error
    }

    return await uploadToS3Storage(data, path)
  })

export const uploadMedia = actionClient
  .inputSchema(uploadMediaSchema)
  .action(async ({ parsedInput: { file, path } }) => {
    const buffer = Buffer.from(await file.arrayBuffer())

    return await uploadToS3Storage(buffer, path)
  })
