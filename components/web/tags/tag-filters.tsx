"use client"

import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { config } from "~/config"
import { useFilters } from "~/contexts/filter-context"
import type { TagsFilterSchema } from "~/server/web/tags/schema"
import { cx } from "~/utils/cva"

export const TagFilters = ({ className, ...props }: ComponentProps<"div">) => {
  const { filters, updateFilters } = useFilters<TagsFilterSchema>()

  return (
    <div className={cx("flex flex-wrap gap-1 w-full md:justify-between", className)} {...props}>
      {config.site.alphabet.split("").map(letter => (
        <Button
          key={letter}
          variant={filters.letter === letter ? "primary" : "secondary"}
          className="px-2 py-1 text-sm font-medium text-center rounded-sm uppercase md:flex-1"
          onClick={() => updateFilters({ letter })}
        >
          {letter}
        </Button>
      ))}
    </div>
  )
}
