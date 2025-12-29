"use server"

import type { ReactNode } from "react"
import { ToolStatus } from "~/.generated/prisma/client"
import { actionClient } from "~/lib/safe-actions"
import { findCategories } from "~/server/web/categories/queries"
import type { ToolFilterParams } from "~/server/web/tools/schema"
import { db } from "~/services/db"

type FilterOption = {
  slug: string
  name: ReactNode
  count: number
  flag?: string | null
  displayName?: string | null
}

type FilterOptions = Array<{
  type: Exclude<keyof ToolFilterParams, "q" | "sort" | "page" | "perPage">
  options: FilterOption[]
}>

export const findFilterOptions = actionClient.action(async () => {
  const [categories, locations] = await Promise.all([
    findCategories({}),
    db.location.findMany({
      where: {
        tools: {
          some: {
            status: ToolStatus.Published,
          },
        },
      },
      select: {
        slug: true,
        name: true,
        displayName: true,
        flag: true,
        _count: {
          select: {
            tools: {
              where: {
                status: ToolStatus.Published,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ])

  const filterOptions: FilterOptions = [
    {
      type: "category",
      options: categories.map(({ slug, name, _count }) => ({
        slug,
        name,
        count: _count.tools,
      })),
    },
    {
      type: "country",
      options: locations.map(({ slug, name, displayName, flag, _count }) => ({
        slug,
        name: displayName || name,
        flag,
        displayName,
        count: _count.tools,
      })),
    },
  ]

  return filterOptions.filter(({ options }) => options.length)
})
