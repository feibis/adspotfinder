"use server"

import { after } from "next/server"
import { adminActionClient } from "~/lib/safe-actions"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { agencySchema } from "~/server/admin/agencys/schema"

export const upsertAgency = adminActionClient
  .inputSchema(agencySchema)
  .action(async ({ parsedInput: { id, locations, categories, ...input }, ctx: { db, revalidate } }) => {
    const locationIds = locations?.map(id => ({ id }))
    const categoryIds = categories?.map(id => ({ id }))

    const agency = id
      ? await db.agency.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || "",
            locations: { set: locationIds },
            categories: { set: categoryIds },
          },
        })
      : await db.agency.create({
          data: {
            ...input,
            slug: input.slug || "",
            locations: { connect: locationIds },
            categories: { connect: categoryIds },
          },
        })

    after(async () => {
      revalidate({
        paths: ["/admin/agencys"],
        tags: ["agencys", `agency-${agency.slug}`],
      })
    })

    return agency
  })

export const duplicateAgency = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const originalAgency = await db.agency.findUnique({
      where: { id },
      include: {
        locations: { select: { id: true } },
        categories: { select: { id: true } }
      },
    })

    if (!originalAgency) {
      throw new Error("Agency not found")
    }

    const newName = `${originalAgency.name} (Copy)`

    const duplicatedAgency = await db.agency.create({
      data: {
        name: newName,
        slug: "", // Slug will be auto-generated
        locations: { connect: originalAgency.locations },
        categories: { connect: originalAgency.categories },
      },
    })

    revalidate({
      paths: ["/admin/agencys"],
      tags: ["agencys"],
    })

    return duplicatedAgency
  })

export const deleteAgencys = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.agency.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/agencys"],
      tags: ["agencys"],
    })

    return true
  })
