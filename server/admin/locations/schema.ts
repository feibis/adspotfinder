import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Location } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const locationsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Location>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const locationsTableParamsCache = createSearchParamsCache(locationsTableParamsSchema)
export type LocationsTableSchema = Awaited<ReturnType<typeof locationsTableParamsCache.parse>>

export const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  type: z.enum(["country", "city"]).default("country"),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  stateCode: z.string().optional(),
  emoji: z.string().optional(),
  tools: z.array(z.string()).optional(),
})

export type LocationSchema = z.infer<typeof locationSchema>
