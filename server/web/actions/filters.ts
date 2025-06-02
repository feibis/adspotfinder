"use server"

import type { ReactNode } from "react"
import { createServerAction } from "zsa"
import { findCategories } from "~/server/web/categories/queries"
import type { filterParamsSchema } from "~/server/web/shared/schema"

type FilterOption = {
  slug: string
  name: ReactNode
  count: number
}

type FilterOptions = Array<{
  type: Exclude<keyof typeof filterParamsSchema, "q" | "sort" | "page" | "perPage">
  options: FilterOption[]
}>

export const findFilterOptions = createServerAction().handler(async () => {
  const [categories] = await Promise.all([findCategories({})])

  const filterOptions: FilterOptions = [
    {
      type: "category",
      options: categories.map(({ slug, name, _count }) => ({
        slug,
        name,
        count: _count.tools,
      })),
    },
  ]

  return filterOptions.filter(({ options }) => options.length)
})
