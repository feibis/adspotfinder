import { isTruthy } from "@primoui/utils"
import { endOfDay, startOfDay } from "date-fns"
import type { Prisma } from "~/.generated/prisma/client"
import type {
  AttributeGroupsTableSchema,
  AttributesTableSchema,
} from "~/server/admin/attributes/schema"
import { db } from "~/services/db"

// Attribute Groups
export const findAttributeGroups = async (
  search: AttributeGroupsTableSchema,
  where?: Prisma.AttributeGroupWhereInput,
) => {
  const { name, page, perPage, sort, from, to, operator } = search

  const offset = (page - 1) * perPage
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.AttributeGroupWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.AttributeGroupWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  const [attributeGroups, attributeGroupsTotal] = await db.$transaction([
    db.attributeGroup.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { order: "asc" }],
      take: perPage,
      skip: offset,
      include: { _count: { select: { attributes: true } } },
    }),

    db.attributeGroup.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(attributeGroupsTotal / perPage)
  return { attributeGroups, attributeGroupsTotal, pageCount }
}

export const findAttributeGroupList = async ({ ...args }: Prisma.AttributeGroupFindManyArgs = {}) => {
  return db.attributeGroup.findMany({
    ...args,
    select: { id: true, name: true, slug: true },
    orderBy: { order: "asc" },
  })
}

export const findAttributeGroupBySlug = async (slug: string) => {
  return db.attributeGroup.findUnique({
    where: { slug },
    include: {
      attributes: { select: { id: true } },
    },
  })
}

// Attributes
export const findAttributes = async (
  search: AttributesTableSchema,
  where?: Prisma.AttributeWhereInput,
) => {
  const { name, group, page, perPage, sort, from, to, operator } = search

  const offset = (page - 1) * perPage
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.AttributeWhereInput | undefined)[] = [
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,
    group ? { group: { slug: group } } : undefined,
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const whereQuery: Prisma.AttributeWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  const [attributes, attributesTotal] = await db.$transaction([
    db.attribute.findMany({
      where: { ...whereQuery, ...where },
      orderBy: [...orderBy, { order: "asc" }],
      take: perPage,
      skip: offset,
      include: {
        group: { select: { name: true, slug: true } },
        _count: { select: { tools: true } },
      },
    }),

    db.attribute.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(attributesTotal / perPage)
  return { attributes, attributesTotal, pageCount }
}

export const findAttributeList = async ({ ...args }: Prisma.AttributeFindManyArgs = {}) => {
  return db.attribute.findMany({
    ...args,
    select: { id: true, name: true, groupId: true },
    orderBy: { order: "asc" },
  })
}

export const findAttributeBySlug = async (slug: string) => {
  return db.attribute.findUnique({
    where: { slug },
    include: {
      group: { select: { id: true, name: true, slug: true } },
      tools: { select: { id: true } },
    },
  })
}

