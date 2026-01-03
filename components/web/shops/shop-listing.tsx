"use client"

import { useTranslations } from "next-intl"
import { Input } from "~/components/common/input"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { AgencyList, type AgencyListProps, AgencyListSkeleton } from "~/components/web/agencys/agency-list"
import { AgencySearch, type AgencySearchProps } from "~/components/web/agencys/agency-search"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"
import { agencysSearchParams } from "~/server/web/agencys/schema"

type AgencyListingProps = {
  list: AgencyListProps
  pagination: PaginationProps
  search?: AgencySearchProps
  options?: Omit<FiltersProviderProps, "schema">
}

const AgencyListing = ({ list, pagination, options, search }: AgencyListingProps) => {
  return (
    <FiltersProvider schema={agencysSearchParams} {...options}>
      <div className="space-y-10" id="agencys">
        <AgencySearch {...search} />
        <AgencyList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const AgencyListingSkeleton = () => {
  const t = useTranslations("common")

  return (
    <div className="space-y-10">
      <Input size="lg" placeholder={t("loading")} disabled />
      <AgencyListSkeleton />
    </div>
  )
}

export { AgencyListing, AgencyListingSkeleton, type AgencyListingProps }
