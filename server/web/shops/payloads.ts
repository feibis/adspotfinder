import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const shopOnePayload = {
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.ShopSelect

export const shopManyPayload = {
  name: true,
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
} satisfies Prisma.ShopSelect

export type ShopOne = Prisma.ShopGetPayload<{ select: typeof shopOnePayload }>
export type ShopMany = Prisma.ShopGetPayload<{ select: typeof shopManyPayload }>
