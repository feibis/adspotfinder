"use client"

import type { ComponentProps } from "react"
import type { Stack } from "~/components/common/stack"
import { Filters } from "~/components/web/filters/filters"
import { Sort } from "~/components/web/filters/sort"
import { TagFilters } from "~/components/web/tags/tag-filters"
import { useFilters } from "~/contexts/filter-context"
import type { TagsFilterSchema } from "~/server/web/tags/schema"

export type TagSearchProps = ComponentProps<typeof Stack> & {
  placeholder?: string
}

export const TagSearch = ({ placeholder, ...props }: TagSearchProps) => {
  const { enableSort, enableFilters } = useFilters<TagsFilterSchema>()

  const sortOptions = [
    { value: "name.asc", label: "Name (A to Z)" },
    { value: "name.desc", label: "Name (Z to A)" },
  ]

  return (
    <Filters placeholder={placeholder || "Search tags..."} {...props}>
      {enableSort && <Sort options={sortOptions} />}
      {enableFilters && <TagFilters />}
    </Filters>
  )
}
