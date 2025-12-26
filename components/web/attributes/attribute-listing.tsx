"use client"

import { useTranslations } from "next-intl"
import { Input } from "~/components/common/input"
import {
  AttributeList,
  type AttributeListProps,
  AttributeListSkeleton,
} from "~/components/web/attributes/attribute-list"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"
import { attributesSearchParams } from "~/server/web/attributes/schema"

type AttributeListingProps = {
  list: AttributeListProps
  pagination: PaginationProps
  options?: Omit<FiltersProviderProps, "schema">
}

const AttributeListing = ({ list, pagination, options }: AttributeListingProps) => {
  return (
    <FiltersProvider schema={attributesSearchParams} {...options}>
      <div className="space-y-10" id="attributes">
        <AttributeList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const AttributeListingSkeleton = () => {
  const t = useTranslations("common")

  return (
    <div className="space-y-10">
      <Input size="lg" placeholder={t("loading")} disabled />
      <AttributeListSkeleton />
    </div>
  )
}

export { AttributeListing, AttributeListingSkeleton, type AttributeListingProps }

