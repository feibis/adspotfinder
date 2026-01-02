import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const shopOnePayload = {
  name: true,
  slug: true,
  email: true,
  phone: true,
  websiteUrl: true,
  description: true,
  instagramFollowers: true,
  tiktokFollowers: true,
  _count: {
    select: {
      locations: true,
      categories: true
    }
  },
  locations: { select: { id: true, name: true, slug: true } },
  categories: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ShopSelect

export const shopManyPayload = {
  name: true,
  slug: true,
  instagramFollowers: true,
  tiktokFollowers: true,
  _count: {
    select: {
      locations: true,
      categories: true
    }
  },
} satisfies Prisma.ShopSelect

export type ShopOne = Prisma.ShopGetPayload<{ select: typeof shopOnePayload }>
export type ShopMany = Prisma.ShopGetPayload<{ select: typeof shopManyPayload }>
