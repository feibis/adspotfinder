import { cacheLife, cacheTag } from "next/cache"
import { type Prisma, ToolStatus } from "~/.generated/prisma/client"
import {
  attributeGroupManyPayload,
  attributeGroupOnePayload,
  attributeManyPayload,
  attributeOnePayload,
} from "~/server/web/attributes/payloads"
import { db } from "~/services/db"

// Attribute Groups
export const findAttributeGroups = async ({ where, orderBy, ...args }: Prisma.AttributeGroupFindManyArgs = {}) => {
  "use cache"

  cacheTag("attributeGroups")
  cacheLife("infinite")

  return db.attributeGroup.findMany({
    ...args,
    orderBy: orderBy ?? { order: "asc" },
    where,
    select: attributeGroupManyPayload,
  })
}

export const findAttributeGroupBySlug = async (slug: string) => {
  "use cache"

  cacheTag("attributeGroups")
  cacheLife("infinite")

  return db.attributeGroup.findUnique({
    where: { slug },
    select: attributeGroupOnePayload,
  })
}

// Attributes
export const findAttributes = async ({ where, orderBy, ...args }: Prisma.AttributeFindManyArgs = {}) => {
  "use cache"

  cacheTag("attributes")
  cacheLife("infinite")

  return db.attribute.findMany({
    ...args,
    orderBy: orderBy ?? { order: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: attributeManyPayload,
  })
}

export const findAttributeBySlug = async (slug: string) => {
  "use cache"

  cacheTag("attributes")
  cacheLife("infinite")

  return db.attribute.findUnique({
    where: { slug },
    select: attributeOnePayload,
  })
}

export const findAttributesByGroup = async (groupSlug: string) => {
  "use cache"

  cacheTag("attributes")
  cacheLife("infinite")

  return db.attribute.findMany({
    where: {
      group: { slug: groupSlug },
      tools: { some: { status: ToolStatus.Published } },
    },
    orderBy: { order: "asc" },
    select: attributeManyPayload,
  })
}

export const findAttributeSlugs = async ({ where, orderBy, ...args }: Prisma.AttributeFindManyArgs = {}) => {
  "use cache"

  cacheTag("attributes")
  cacheLife("infinite")

  return db.attribute.findMany({
    ...args,
    orderBy: orderBy ?? { order: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true },
  })
}

