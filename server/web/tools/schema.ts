import {
  createSearchParamsCache,
  type inferParserType,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import { adsConfig } from "~/config/ads"

export const toolFilterParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(adsConfig.enabled ? 35 : 36),
  category: parseAsString.withDefault(""),
}

export const toolFilterParamsCache = createSearchParamsCache(toolFilterParams)

export type ToolFilterSchema = typeof toolFilterParams
export type ToolFilterParams = inferParserType<typeof toolFilterParams>
