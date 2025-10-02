import type { SearchParams } from "nuqs"
import { Suspense } from "react"
import type { AdType, Prisma } from "~/.generated/prisma/client"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import type { PaginationProps } from "~/components/web/pagination"
import { ToolList, type ToolListProps } from "~/components/web/tools/tool-list"
import { ToolListing, type ToolListingProps } from "~/components/web/tools/tool-listing"
import { searchTools } from "~/server/web/tools/queries"
import { type ToolFilterParams, toolFilterParamsCache } from "~/server/web/tools/schema"

type ToolQueryProps = Omit<ToolListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<ToolFilterParams>
  where?: Prisma.ToolWhereInput
  list?: Partial<Omit<ToolListProps, "tools">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
  ad?: AdType
}

const ToolQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ad,
  ...props
}: ToolQueryProps) => {
  const parsedParams = toolFilterParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { tools, total, page, perPage } = await searchTools(params, where)

  return (
    <ToolListing pagination={{ total, perPage, page, ...pagination }} {...props}>
      <ToolList tools={tools} {...list}>
        {ad && (
          <Suspense fallback={<AdCardSkeleton isRevealed className="lg:order-1" />}>
            <AdCard type={ad} isRevealed className="lg:order-1" />
          </Suspense>
        )}
      </ToolList>
    </ToolListing>
  )
}

export { ToolQuery, type ToolQueryProps }
