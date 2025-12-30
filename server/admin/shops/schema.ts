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
  sort: getSortingStateParser().withDefault([{ id: "name", desc: false }]),
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
  tools: z.array(z.string()).optional(),
})

export type ShopSchema = z.infer<typeof shopSchema>
