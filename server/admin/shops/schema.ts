import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Agency } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const agencysTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Agency>().withDefault([{ id: "name", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const agencysTableParamsCache = createSearchParamsCache(agencysTableParamsSchema)
export type AgencysTableSchema = Awaited<ReturnType<typeof agencysTableParamsCache.parse>>

export const agencySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
  instagramFollowers: z.number().int().min(0).optional(),
  tiktokFollowers: z.number().int().min(0).optional(),
  locations: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export type AgencySchema = z.infer<typeof agencySchema>
