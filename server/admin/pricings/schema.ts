import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import type { Pricing } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const pricingsTableParamsSchema = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Pricing>().withDefault([{ id: "order", desc: false }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
}

export const pricingsTableParamsCache = createSearchParamsCache(pricingsTableParamsSchema)
export type PricingsTableSchema = Awaited<ReturnType<typeof pricingsTableParamsCache.parse>>

export const pricingSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  currency: z.string().default("USD"),
  period: z.string().default("month"),
  unit: z.string().optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
  toolId: z.string().min(1, "Tool is required"),
  attributes: z.array(z.string()).min(1, "At least one attribute is required"),
})

export type PricingSchema = z.infer<typeof pricingSchema>

