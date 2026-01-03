import { type Prisma, ToolStatus } from "~/.generated/prisma/client"

export const agencyOnePayload = {
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
} satisfies Prisma.AgencySelect

export const agencyManyPayload = {
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
} satisfies Prisma.AgencySelect

export type AgencyOne = Prisma.AgencyGetPayload<{ select: typeof agencyOnePayload }>
export type AgencyMany = Prisma.AgencyGetPayload<{ select: typeof agencyManyPayload }>
