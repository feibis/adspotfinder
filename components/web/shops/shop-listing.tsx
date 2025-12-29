"use client"

import { useTranslations } from "next-intl"
import { Input } from "~/components/common/input"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { ShopList, type ShopListProps, ShopListSkeleton } from "~/components/web/shops/shop-list"
import { ShopSearch, type ShopSearchProps } from "~/components/web/shops/shop-search"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"
import { shopsSearchParams } from "~/server/web/shops/schema"

type ShopListingProps = {
  list: ShopListProps
  pagination: PaginationProps
  search?: ShopSearchProps
  options?: Omit<FiltersProviderProps, "schema">
}

const ShopListing = ({ list, pagination, options, search }: ShopListingProps) => {
  return (
    <FiltersProvider schema={shopsSearchParams} {...options}>
      <div className="space-y-10" id="shops">
        <ShopSearch {...search} />
        <ShopList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const ShopListingSkeleton = () => {
  const t = useTranslations("common")

  return (
    <div className="space-y-10">
      <Input size="lg" placeholder={t("loading")} disabled />
      <ShopListSkeleton />
    </div>
  )
}

export { ShopListing, ShopListingSkeleton, type ShopListingProps }
