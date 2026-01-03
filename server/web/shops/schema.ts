import {
  createSearchParamsCache,
  type inferParserType,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"

export const agencysSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(96),
  letter: parseAsString.withDefault(""),
}

export const agencysSearchParamsCache = createSearchParamsCache(agencysSearchParams)

export type AgencysFilterSchema = typeof agencysSearchParams
export type AgencysFilterParams = inferParserType<typeof agencysSearchParams>
