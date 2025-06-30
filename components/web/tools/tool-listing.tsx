import { Input } from "~/components/common/input"
import { Pagination, type PaginationProps } from "~/components/web/pagination"
import { ToolList, type ToolListProps, ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolSearch, type ToolSearchProps } from "~/components/web/tools/tool-search"
import { FiltersProvider, type FiltersProviderProps } from "~/contexts/filter-context"
import { toolFilterParams } from "~/server/web/tools/schema"

type ToolListingProps = {
  list: ToolListProps
  pagination: PaginationProps
  search?: ToolSearchProps
  options?: Omit<FiltersProviderProps, "schema">
}

const ToolListing = ({ list, pagination, options, search }: ToolListingProps) => {
  return (
    // TODO: This is not working because I can't pass functions to the client components
    // I can't make this one work without the server component
    <FiltersProvider schema={toolFilterParams} {...options}>
      <div className="space-y-5" id="tools">
        <ToolSearch {...search} />
        <ToolList {...list} />
      </div>

      <Pagination {...pagination} />
    </FiltersProvider>
  )
}

const ToolListingSkeleton = () => {
  return (
    <div className="space-y-5">
      <Input size="lg" placeholder="Loading..." disabled />
      <ToolListSkeleton />
    </div>
  )
}

export { ToolListing, ToolListingSkeleton, type ToolListingProps }
