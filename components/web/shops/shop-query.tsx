import type { SearchParams } from "nuqs"
import type { Prisma } from "~/.generated/prisma/client"
import type { PaginationProps } from "~/components/web/pagination"
import type { ShopListProps } from "~/components/web/shops/shop-list"
import { ShopListing, type ShopListingProps } from "~/components/web/shops/shop-listing"
import { searchShops } from "~/server/web/shops/queries"
import { type ShopsFilterParams, shopsSearchParamsCache } from "~/server/web/shops/schema"

type ShopQueryProps = Omit<ShopListingProps, "list" | "pagination"> & {
  searchParams: Promise<SearchParams>
  overrideParams?: Partial<ShopsFilterParams>
  where?: Prisma.ShopWhereInput
  list?: Partial<Omit<ShopListProps, "shops">>
  pagination?: Partial<Omit<PaginationProps, "total" | "pageSize">>
}

const ShopQuery = async ({
  searchParams,
  overrideParams,
  where,
  list,
  pagination,
  ...props
}: ShopQueryProps) => {
  const parsedParams = shopsSearchParamsCache.parse(await searchParams)
  const params = { ...parsedParams, ...overrideParams }
  const { shops, total, page, perPage } = await searchShops(params, where)

  return (
    <ShopListing
      list={{ shops, ...list }}
      pagination={{ total, perPage, page, ...pagination }}
      {...props}
    />
  )
}

export { ShopQuery, type ShopQueryProps }
