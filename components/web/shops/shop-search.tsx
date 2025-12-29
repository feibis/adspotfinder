"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import type { Stack } from "~/components/common/stack"
import { Filters } from "~/components/web/filters/filters"
import { Sort } from "~/components/web/filters/sort"
import { ShopFilters } from "~/components/web/shops/shop-filters"
import { useFilters } from "~/contexts/filter-context"
import type { ShopsFilterSchema } from "~/server/web/shops/schema"

export type ShopSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const ShopSearch = ({ placeholder, ...props }: ShopSearchProps) => {
  const { enableSort, enableFilters } = useFilters<ShopsFilterSchema>()
  const t = useTranslations("shops.filters")

  const sortOptions = [
    { value: "name.asc", label: t("sort_name_asc") },
    { value: "name.desc", label: t("sort_name_desc") },
  ]

  return (
    <Filters placeholder={placeholder || t("search_placeholder")} {...props}>
      {enableSort && <Sort options={sortOptions} />}
      {enableFilters && <ShopFilters />}
    </Filters>
  )
}
