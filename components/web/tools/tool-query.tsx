import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs"
import type { PaginationProps } from "~/components/web/pagination"
import type { ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListing, type ToolListingProps } from "~/components/web/tools/tool-listing"
import { searchTools } from "~/server/web/tools/queries"
import { type ToolFilterParams, toolFilterParamsCache } from "~/server/web/tools/schema"

type ToolQueryProps = Omit<ToolListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<ToolFilterParams>
  where?: Prisma.ToolWhereInput
  list?: Partial<Omit<ToolListProps, "tools">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
}

const ToolQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ...props
}: ToolQueryProps) => {
  const parsedParams = toolFilterParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { tools, total } = await searchTools(params, where)

  return (
    <ToolListing
      list={{ tools, ...list }}
      pagination={{ total, pageSize: params.perPage, currentPage: params.page, ...pagination }}
      {...props}
    />
  )
}

export { ToolQuery, type ToolQueryProps }
