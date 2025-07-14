"use server"

import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { removeS3Directories } from "~/lib/media"
import { adminActionClient } from "~/lib/safe-actions"
import { userSchema } from "~/server/admin/users/schema"
import { db } from "~/services/db"

export const updateUser = adminActionClient
  .inputSchema(userSchema)
  .action(async ({ parsedInput: { id, ...input } }) => {
    const user = await db.user.update({
      where: { id },
      data: input,
    })

    after(() => {
      revalidatePath("/admin/users")
    })

    return user
  })

export const deleteUsers = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids } }) => {
    await db.user.deleteMany({
      where: { id: { in: ids }, role: { not: "admin" } },
    })

    after(() => {
      revalidatePath("/admin/users")
    })

    // Remove the user images from S3 asynchronously
    after(async () => {
      await removeS3Directories(ids.map(id => `users/${id}`))
    })

    return true
  })

export const updateUserRole = adminActionClient
  .inputSchema(userSchema.pick({ id: true, role: true }))
  .action(async ({ parsedInput: { id, role } }) => {
    const user = await db.user.update({
      where: { id },
      data: { role },
    })

    after(() => {
      revalidatePath("/admin/users")
    })

    return user
  })
