import { Prisma } from "@prisma/client"
import { categoryManyPayload } from "~/server/web/categories/payloads"
import { tagManyPayload } from "~/server/web/tags/payloads"

export const toolCategoriesPayload = Prisma.validator<Prisma.Tool$categoriesArgs>()({
  select: categoryManyPayload,
  orderBy: { name: "asc" },
})

export const toolTagsPayload = Prisma.validator<Prisma.Tool$tagsArgs>()({
  select: tagManyPayload,
  orderBy: { name: "asc" },
})

export const toolOwnerPayload = Prisma.validator<Prisma.Tool$ownerArgs>()({
  select: { id: true },
})

export const toolOnePayload = Prisma.validator<Prisma.ToolSelect>()({
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
})

export const toolManyPayload = Prisma.validator<Prisma.ToolSelect>()({
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
})

export type ToolOne = Prisma.ToolGetPayload<{ select: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ select: typeof toolManyPayload }>
