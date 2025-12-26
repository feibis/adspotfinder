import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Attribute, AttributeGroup } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

// Attribute Groups
export const attributeGroupsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<AttributeGroup>().withDefault([{ id: "order", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const attributeGroupsTableParamsCache = createSearchParamsCache(attributeGroupsTableParamsSchema)
export type AttributeGroupsTableSchema = Awaited<ReturnType<typeof attributeGroupsTableParamsCache.parse>>

export const attributeGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["single", "multiple", "range"]).default("multiple"),
  order: z.number().default(0),
})

export type AttributeGroupSchema = z.infer<typeof attributeGroupSchema>

// Attributes
export const attributesTableParamsSchema = {
  name: parseAsString.withDefault(""),
  group: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Attribute>().withDefault([{ id: "order", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const attributesTableParamsCache = createSearchParamsCache(attributesTableParamsSchema)
export type AttributesTableSchema = Awaited<ReturnType<typeof attributesTableParamsCache.parse>>

export const attributeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  value: z.string().optional(),
  unit: z.string().optional(),
  order: z.number().default(0),
  groupId: z.string().min(1, "Group is required"),
  tools: z.array(z.string()).optional(),
})

export type AttributeSchema = z.infer<typeof attributeSchema>

