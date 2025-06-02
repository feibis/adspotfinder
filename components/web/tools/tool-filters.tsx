"use client"

import plur from "plur"
import { type ComponentProps, useEffect } from "react"
import { useServerAction } from "zsa-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { useFilters } from "~/contexts/filter-context"
import { findFilterOptions } from "~/server/web/actions/filters"

export const ToolFilters = ({ ...props }: ComponentProps<typeof Select>) => {
  const { filters, updateFilters } = useFilters()
  const { execute, data } = useServerAction(findFilterOptions)

  useEffect(() => {
    execute()
  }, [execute])

  return (
    <>
      {data?.map(({ type, options }) => (
        <Select
          key={type}
          value={filters[type]}
          onValueChange={value => updateFilters({ [type]: value })}
          {...props}
        >
          <SelectTrigger size="lg" className="w-auto min-w-40 max-sm:flex-1">
            <SelectValue placeholder={`All ${plur(type)}`} />
          </SelectTrigger>

          <SelectContent align="end">
            {options.map(({ slug, name }) => (
              <SelectItem key={slug} value={slug}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </>
  )
}
