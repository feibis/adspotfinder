import {
  createSearchParamsCache,
  type inferParserType,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

export const shopsSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(96),
  letter: parseAsString.withDefault(""),
}

export const shopsSearchParamsCache = createSearchParamsCache(shopsSearchParams)

export type ShopsFilterSchema = typeof shopsSearchParams
export type ShopsFilterParams = inferParserType<typeof shopsSearchParams>
