import {
  createSearchParamsCache,
  type inferParserType,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

export const attributesSearchParams = {
  q: parseAsString.withDefault(""),
  group: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(96),
}

export const attributesSearchParamsCache = createSearchParamsCache(attributesSearchParams)

export type AttributesFilterSchema = typeof attributesSearchParams
export type AttributesFilterParams = inferParserType<typeof attributesSearchParams>

