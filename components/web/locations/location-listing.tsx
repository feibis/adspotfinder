"use client"

import { useTranslations } from "next-intl"
import { Input } from "~/components/common/input"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { LocationList, type LocationListProps, LocationListSkeleton } from "~/components/web/locations/location-list"
import { LocationSearch, type LocationSearchProps } from "~/components/web/locations/location-search"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"
import { locationsSearchParams } from "~/server/web/locations/schema"

type LocationListingProps = {
  list: LocationListProps
  pagination: PaginationProps
  search?: LocationSearchProps
  options?: Omit<FiltersProviderProps, "schema">
}

const LocationListing = ({ list, pagination, options, search }: LocationListingProps) => {
  return (
    <FiltersProvider schema={locationsSearchParams} {...options}>
      <div className="space-y-10" id="locations">
        <LocationSearch {...search} />
        <LocationList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const LocationListingSkeleton = () => {
  const t = useTranslations("common")

  return (
    <div className="space-y-10">
      <Input size="lg" placeholder={t("loading")} disabled />
      <LocationListSkeleton />
    </div>
  )
}

export { LocationListing, LocationListingSkeleton, type LocationListingProps }
