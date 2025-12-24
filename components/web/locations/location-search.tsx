"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import type { Stack } from "~/components/common/stack"
import { Filters } from "~/components/web/filters/filters"
import { Sort } from "~/components/web/filters/sort"
import { LocationFilters } from "~/components/web/locations/location-filters"
import { useFilters } from "~/contexts/filter-context"
import type { LocationsFilterSchema } from "~/server/web/locations/schema"

export type LocationSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const LocationSearch = ({ placeholder, ...props }: LocationSearchProps) => {
  const { enableSort, enableFilters } = useFilters<LocationsFilterSchema>()
  const t = useTranslations("locations.filters")

  const sortOptions = [
    { value: "name.asc", label: t("sort_name_asc") },
    { value: "name.desc", label: t("sort_name_desc") },
  ]

  return (
    <Filters placeholder={placeholder || t("search_placeholder")} {...props}>
      {enableSort && <Sort options={sortOptions} />}
      {enableFilters && <LocationFilters />}
    </Filters>
  )
}
