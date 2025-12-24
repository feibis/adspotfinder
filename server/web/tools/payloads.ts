import type { Prisma } from "~/.generated/prisma/client"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { tagManyPayload } from "~/server/web/tags/payloads"
import { locationManyPayload } from "~/server/web/locations/payloads"

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
} satisfies Prisma.ToolSelect

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
