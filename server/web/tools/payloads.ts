import type { Prisma } from "~/.generated/prisma/client"
import { attributeManyPayload } from "~/server/web/attributes/payloads"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { locationManyPayload } from "~/server/web/locations/payloads"
import { tagManyPayload } from "~/server/web/tags/payloads"

export const toolCategoriesPayload = {
  select: categoryManyPayload,
  orderBy: { name: "asc" },
} satisfies Prisma.Tool$categoriesArgs

export const toolTagsPayload = {
  select: tagManyPayload,
  orderBy: { name: "asc" },
} satisfies Prisma.Tool$tagsArgs

export const toolLocationsPayload = {
  select: locationManyPayload,
  orderBy: { name: "asc" },
} satisfies Prisma.Tool$locationsArgs

export const toolAttributesPayload = {
  select: attributeManyPayload,
  orderBy: { order: "asc" },
} satisfies Prisma.Tool$attributesArgs

export const toolPricingsPayload = {
  select: {
    id: true,
    name: true,
    description: true,
    price: true,
    currency: true,
    period: true,
    unit: true,
    isActive: true,
    attributes: {
      select: {
        id: true,
        name: true,
        slug: true,
        value: true,
        unit: true,
        group: { select: { name: true, slug: true } },
      },
    },
  },
  where: { isActive: true },
  orderBy: { order: "asc" },
} satisfies Prisma.Tool$pricingsArgs

export const toolOwnerPayload = {
  select: { id: true },
} satisfies Prisma.Tool$ownerArgs

export const toolOnePayload = {
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  tagline: true,
  description: true,
  content: true,
  faviconUrl: true,
  screenshotUrl: true,
  isFeatured: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  categories: toolCategoriesPayload,
  tags: toolTagsPayload,
  locations: toolLocationsPayload,
  attributes: toolAttributesPayload,
  pricings: toolPricingsPayload,
} satisfies Prisma.ToolSelect

export const toolManyPayload = {
  id: true,
  name: true,
  slug: true,
  websiteUrl: true,
  affiliateUrl: true,
  tagline: true,
  description: true,
  faviconUrl: true,
  isFeatured: true,
  publishedAt: true,
  updatedAt: true,
  ownerId: true,
  categories: toolCategoriesPayload,
  attributes: toolAttributesPayload,
} satisfies Prisma.ToolSelect

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
