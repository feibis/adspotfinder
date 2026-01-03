"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import type { Stack } from "~/components/common/stack"
import { Filters } from "~/components/web/filters/filters"
import { Sort } from "~/components/web/filters/sort"
import { AgencyFilters } from "~/components/web/agencys/agency-filters"
import { useFilters } from "~/contexts/filter-context"
import type { AgencysFilterSchema } from "~/server/web/agencys/schema"

export type AgencySearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const AgencySearch = ({ placeholder, ...props }: AgencySearchProps) => {
  const { enableSort, enableFilters } = useFilters<AgencysFilterSchema>()
  const t = useTranslations("agencys.filters")

  const sortOptions = [
    { value: "name.asc", label: t("sort_name_asc") },
    { value: "name.desc", label: t("sort_name_desc") },
  ]

  return (
    <Filters placeholder={placeholder || t("search_placeholder")} {...props}>
      {enableSort && <Sort options={sortOptions} />}
      {enableFilters && <AgencyFilters />}
    </Filters>
  )
}
