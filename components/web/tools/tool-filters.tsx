"use client"

import { useAction } from "next-safe-action/hooks"
import plur from "plur"
import { type ComponentProps, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { useFilters } from "~/contexts/filter-context"
import { findFilterOptions } from "~/server/web/actions/filters"
import type { ToolFilterSchema } from "~/server/web/tools/schema"

export const ToolFilters = ({ ...props }: ComponentProps<typeof Select>) => {
  const { filters, updateFilters } = useFilters<ToolFilterSchema>()
  const { result, execute } = useAction(findFilterOptions)

  useEffect(() => {
    execute()
  }, [execute])

  return (
    <>
      {result.data?.map(({ type, options }) => (
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
