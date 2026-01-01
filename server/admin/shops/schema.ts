import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Shop } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const shopsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Shop>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const shopsTableParamsCache = createSearchParamsCache(shopsTableParamsSchema)
export type ShopsTableSchema = Awaited<ReturnType<typeof shopsTableParamsCache.parse>>

export const shopSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  locations: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export type ShopSchema = z.infer<typeof shopSchema>
