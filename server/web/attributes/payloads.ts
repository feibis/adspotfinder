import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const attributeGroupOnePayload = {
  id: true,
  name: true,
  slug: true,
  description: true,
  type: true,
  order: true,
} satisfies Prisma.AttributeGroupSelect

export const attributeGroupManyPayload = {
  id: true,
  name: true,
  slug: true,
  description: true,
  type: true,
  order: true,
  _count: { select: { attributes: true } },
} satisfies Prisma.AttributeGroupSelect

export const attributeOnePayload = {
  id: true,
  name: true,
  slug: true,
  value: true,
  unit: true,
  order: true,
  groupId: true,
  group: { select: { name: true, slug: true, type: true } },
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.AttributeSelect

export const attributeManyPayload = {
  id: true,
  name: true,
  slug: true,
  value: true,
  unit: true,
  order: true,
  groupId: true,
  group: { select: { name: true, slug: true, type: true } },
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.AttributeSelect

export type AttributeGroupOne = Prisma.AttributeGroupGetPayload<{
  select: typeof attributeGroupOnePayload
}>
export type AttributeGroupMany = Prisma.AttributeGroupGetPayload<{
  select: typeof attributeGroupManyPayload
}>
export type AttributeOne = Prisma.AttributeGetPayload<{ select: typeof attributeOnePayload }>
export type AttributeMany = Prisma.AttributeGetPayload<{ select: typeof attributeManyPayload }>

