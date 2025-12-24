import type { SearchParams } from "nuqs"
import type { Prisma } from "~/.generated/prisma/client"
import type { PaginationProps } from "~/components/web/pagination"
import type { LocationListProps } from "~/components/web/locations/location-list"
import { LocationListing, type LocationListingProps } from "~/components/web/locations/location-listing"
import { searchLocations } from "~/server/web/locations/queries"
import { type LocationsFilterParams, locationsSearchParamsCache } from "~/server/web/locations/schema"

type LocationQueryProps = Omit<LocationListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<LocationsFilterParams>
  where?: Prisma.LocationWhereInput
  list?: Partial<Omit<LocationListProps, "locations">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
}

const LocationQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ...props
}: LocationQueryProps) => {
  const parsedParams = locationsSearchParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { locations, total, page, perPage } = await searchLocations(params, where)

  return (
    <LocationListing
      list={{ locations, ...list }}
      pagination={{ total, perPage, page, ...pagination }}
      {...props}
    />
  )
}

export { LocationQuery, type LocationQueryProps }
