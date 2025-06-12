"use server"

import { z } from "zod/v4"
import { uploadScreenshot } from "~/lib/media"
import { uploadFavicon } from "~/lib/media"
import { adminActionClient } from "~/lib/safe-actions"

const mediaSchema = z.object({
  url: z.url().min(1),
  path: z
    .string()
    .min(1)
    .regex(/^[a-z0-9/_-]+$/i),
})

export const generateFavicon = adminActionClient
  .inputSchema(mediaSchema)
  .action(async ({ parsedInput: { url, path } }) => uploadFavicon(url, path))

export const generateScreenshot = adminActionClient
  .inputSchema(mediaSchema)
  .action(async ({ parsedInput: { url, path } }) => uploadScreenshot(url, path))
