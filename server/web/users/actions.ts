"use server"

import { getRandomString } from "@primoui/utils"
import { z } from "zod/v4"
import { uploadToS3Storage } from "~/lib/media"
import { userActionClient } from "~/lib/safe-actions"
import { fileSchema } from "~/server/web/shared/schema"

export const uploadUserImage = userActionClient
  .inputSchema(z.object({ id: z.string(), file: fileSchema }))
  .action(async ({ parsedInput: { id, file } }) => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const extension = file.name.split(".").pop() || "jpg"
    const key = `users/${id}/${getRandomString()}.${extension}`
    const imageUrl = await uploadToS3Storage(buffer, key)

    return imageUrl
  })
