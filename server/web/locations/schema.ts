import {
  createSearchParamsCache,
  type inferParserType,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

export const locationsSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(96),
  letter: parseAsString.withDefault(""),
}

export const locationsSearchParamsCache = createSearchParamsCache(locationsSearchParams)

export type LocationsFilterSchema = typeof locationsSearchParams
export type LocationsFilterParams = inferParserType<typeof locationsSearchParams>
