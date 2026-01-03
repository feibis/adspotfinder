import type { SearchParams } from "nuqs"
import type { Prisma } from "~/.generated/prisma/client"
import type { PaginationProps } from "~/components/web/pagination"
import type { AgencyListProps } from "~/components/web/agencys/agency-list"
import { AgencyListing, type AgencyListingProps } from "~/components/web/agencys/agency-listing"
import { searchAgencys } from "~/server/web/agencys/queries"
import { type AgencysFilterParams, agencysSearchParamsCache } from "~/server/web/agencys/schema"

type AgencyQueryProps = Omit<AgencyListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<AgencysFilterParams>
  where?: Prisma.AgencyWhereInput
  list?: Partial<Omit<AgencyListProps, "agencys">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
}

const AgencyQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ...props
}: AgencyQueryProps) => {
  const parsedParams = agencysSearchParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { agencys, total, page, perPage } = await searchAgencys(params, where)

  return (
    <AgencyListing
      list={{ agencys, ...list }}
      pagination={{ total, perPage, page, ...pagination }}
      {...props}
    />
  )
}

export { AgencyQuery, type AgencyQueryProps }
