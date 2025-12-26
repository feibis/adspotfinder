"use server"

import { after } from "next/server"
import { adminActionClient } from "~/lib/safe-actions"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"
import { attributeGroupSchema, attributeSchema } from "~/server/admin/attributes/schema"

// Attribute Group Actions
export const upsertAttributeGroup = adminActionClient
  .inputSchema(attributeGroupSchema)
  .action(async ({ parsedInput: { id, ...input }, ctx: { db, revalidate } }) => {
    const attributeGroup = id
      ? await db.attributeGroup.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || "",
          },
        })
      : await db.attributeGroup.create({
          data: {
            ...input,
            slug: input.slug || "",
          },
        })

    after(async () => {
      revalidate({
        paths: ["/admin/attributes/groups"],
        tags: ["attributeGroups", `attributeGroup-${attributeGroup.slug}`],
      })
    })

    return attributeGroup
  })

export const duplicateAttributeGroup = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const originalGroup = await db.attributeGroup.findUnique({
      where: { id },
      include: { attributes: { select: { id: true } } },
    })

    if (!originalGroup) {
      throw new Error("Attribute group not found")
    }

    const newName = `${originalGroup.name} (Copy)`

    const duplicatedGroup = await db.attributeGroup.create({
      data: {
        name: newName,
        slug: "",
        description: originalGroup.description,
        type: originalGroup.type,
        order: originalGroup.order,
      },
    })

    revalidate({
      paths: ["/admin/attributes/groups"],
      tags: ["attributeGroups"],
    })

    return duplicatedGroup
  })

export const deleteAttributeGroups = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.attributeGroup.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/attributes/groups"],
      tags: ["attributeGroups"],
    })

    return true
  })

// Attribute Actions
export const upsertAttribute = adminActionClient
  .inputSchema(attributeSchema)
  .action(async ({ parsedInput: { id, tools, ...input }, ctx: { db, revalidate } }) => {
    const toolIds = tools?.map(id => ({ id }))

    const attribute = id
      ? await db.attribute.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || "",
            tools: { set: toolIds },
          },
        })
      : await db.attribute.create({
          data: {
            ...input,
            slug: input.slug || "",
            tools: { connect: toolIds },
          },
        })

    after(async () => {
      revalidate({
        paths: ["/admin/attributes"],
        tags: ["attributes", `attribute-${attribute.slug}`],
      })
    })

    return attribute
  })

export const duplicateAttribute = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const originalAttribute = await db.attribute.findUnique({
      where: { id },
      include: { tools: { select: { id: true } } },
    })

    if (!originalAttribute) {
      throw new Error("Attribute not found")
    }

    const newName = `${originalAttribute.name} (Copy)`

    const duplicatedAttribute = await db.attribute.create({
      data: {
        name: newName,
        slug: "",
        value: originalAttribute.value,
        unit: originalAttribute.unit,
        order: originalAttribute.order,
        groupId: originalAttribute.groupId,
        tools: { connect: originalAttribute.tools },
      },
    })

    revalidate({
      paths: ["/admin/attributes"],
      tags: ["attributes"],
    })

    return duplicatedAttribute
  })

export const deleteAttributes = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.attribute.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/attributes"],
      tags: ["attributes"],
    })

    return true
  })

