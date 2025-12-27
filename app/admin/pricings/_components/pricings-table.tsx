"use client"

import { PlusIcon } from "lucide-react"
import { useQueryStates } from "nuqs"
import { use, useMemo } from "react"
import type { Pricing } from "~/.generated/prisma/browser"
import { getColumns } from "~/app/admin/pricings/_components/pricings-table-columns"
import { PricingsTableToolbarActions } from "~/app/admin/pricings/_components/pricings-table-toolbar-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import type { findPricings } from "~/server/admin/pricings/queries"
import { pricingsTableParamsSchema } from "~/server/admin/pricings/schema"
import type { DataTableFilterField } from "~/types"

type PricingsTableProps = {
  pricingsPromise: ReturnType<typeof findPricings>
}

export function PricingsTable({ pricingsPromise }: PricingsTableProps) {
  const { pricings, pricingsTotal, pageCount } = use(pricingsPromise)
  const [{ perPage, sort }] = useQueryStates(pricingsTableParamsSchema)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo(() => getColumns(), [])

  // Search filters
  const filterFields: DataTableFilterField<Pricing>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Filter by name...",
    },
  ]

  const { table } = useDataTable({
    data: pricings,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
  })

  return (
    <DataTable table={table}>
      <DataTableHeader
        title="Pricings"
        total={pricingsTotal}
        callToAction={
          <Button variant="primary" size="md" prefix={<PlusIcon />} asChild>
            <Link href="/admin/pricings/new">
              <div className="max-sm:sr-only">New pricing</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <PricingsTableToolbarActions table={table} />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}

