"use server"

import { after } from "next/server"
import { adminActionClient } from "~/lib/safe-actions"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { locationSchema } from "~/server/admin/locations/schema"

export const upsertLocation = adminActionClient
  .inputSchema(locationSchema)
  .action(async ({ parsedInput: { id, tools, ...input }, ctx: { db, revalidate } }) => {
    const toolIds = tools?.map(id => ({ id }))

    const location = id
      ? await db.location.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || "",
            tools: { set: toolIds },
          },
        })
      : await db.location.create({
          data: {
            ...input,
            slug: input.slug || "",
            tools: { connect: toolIds },
          },
        })

    after(async () => {
      revalidate({
        paths: ["/admin/locations"],
        tags: ["locations", `location-${location.slug}`],
      })
    })

    return location
  })

export const duplicateLocation = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const originalLocation = await db.location.findUnique({
      where: { id },
      include: { tools: { select: { id: true } } },
    })

    if (!originalLocation) {
      throw new Error("Location not found")
    }

    const newName = `${originalLocation.name} (Copy)`

    const duplicatedLocation = await db.location.create({
      data: {
        name: newName,
        slug: "", // Slug will be auto-generated
        tools: { connect: originalLocation.tools },
      },
    })

    revalidate({
      paths: ["/admin/locations"],
      tags: ["locations"],
    })

    return duplicatedLocation
  })

export const deleteLocations = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.location.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/locations"],
      tags: ["locations"],
    })

    return true
  })
