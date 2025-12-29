import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const shopOnePayload = {
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.ShopsSelect

export const shopManyPayload = {
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.ShopsSelect

export type ShopOne = Prisma.ShopsGetPayload<{ select: typeof shopOnePayload }>
export type ShopMany = Prisma.ShopsGetPayload<{ select: typeof shopManyPayload }>
