"use client"

import type { ComponentProps } from "react"
import type { Stack } from "~/components/common/stack"
import { Filters } from "~/components/web/filters/filters"
import { Sort } from "~/components/web/filters/sort"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { useFilters } from "~/contexts/filter-context"

export type ToolSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const ToolSearch = ({ className, placeholder, ...props }: ToolSearchProps) => {
  const { enableSort, enableFilters } = useFilters()

  const sortOptions = [
    { value: "publishedAt.desc", label: "Latest" },
    { value: "name.asc", label: "Name (A to Z)" },
    { value: "name.desc", label: "Name (Z to A)" },
  ]

  return (
    <Filters placeholder={placeholder || "Search tools..."} {...props}>
      {enableFilters && <ToolFilters />}
      {enableSort && <Sort options={sortOptions} />}
    </Filters>
  )
}
