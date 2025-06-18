"use client"

import type { ComponentProps } from "react"
import type { Stack } from "~/components/common/stack"
import { Filters } from "~/components/web/filters"
import { ToolFilters } from "~/components/web/tools/tool-filters"
import { ToolSort } from "~/components/web/tools/tool-sort"
import { useFilters } from "~/contexts/filter-context"

export type ToolSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const ToolSearch = ({ className, placeholder, ...props }: ToolSearchProps) => {
  const { enableSort, enableFilters } = useFilters()

  return (
    <Filters placeholder={placeholder || "Search tools..."} {...props}>
      {enableFilters && <ToolFilters />}
      {enableSort && <ToolSort />}
    </Filters>
  )
}
