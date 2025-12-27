"use client"

import { formatDate } from "@primoui/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { HashIcon } from "lucide-react"
import type { Pricing } from "~/.generated/prisma/browser"
import { PricingActions } from "~/app/admin/pricings/_components/pricing-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<
  Pricing & { 
    _count?: { attributes: number }
    tool?: { name: string; slug: string }
    attributes?: Array<{ id: string; name: string; group: { name: string } }>
  }
>[] => {
  return [
    {
      id: "select",
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <RowCheckbox
          checked={table.getIsAllPageRowsSelected()}
          ref={input => {
            if (input) {
              input.indeterminate =
                table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
            }
          }}
          onChange={e => table.toggleAllPageRowsSelected(e.target.checked)}
          aria-label="Select all"
        />
      ),
      cell: ({ row, table }) => (
        <RowCheckbox
          checked={row.getIsSelected()}
          onChange={e => row.toggleSelected(e.target.checked)}
          aria-label="Select row"
          table={table}
          row={row}
        />
      ),
    },
    {
      accessorKey: "name",
      enableHiding: false,
      size: 200,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <DataTableLink
          href={`/admin/pricings/${row.original.id}`}
          title={row.original.name || `Pricing #${row.original.id.slice(0, 8)}`}
        />
      ),
    },
    {
      accessorKey: "tool.name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tool" />,
      cell: ({ row }) => <Note>{row.original.tool?.name || "-"}</Note>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => (
        <Note className="tabular-nums font-medium">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: row.original.currency || 'USD',
          }).format(Number(row.original.price))}
          {row.original.period && ` / ${row.original.period}`}
          {row.original.unit && ` ${row.original.unit}`}
        </Note>
      ),
    },
    {
      accessorKey: "_count.attributes",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Attributes" />,
      cell: ({ row }) => (
        <Badge prefix={<HashIcon className="opacity-50 size-3!" />} className="tabular-nums">
          {row.original._count?.attributes || 0}
        </Badge>
      ),
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "success" : "soft"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "order",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      cell: ({ row }) => <Note className="tabular-nums">{row.original.order}</Note>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => <Note>{formatDate(cell.getValue() as Date)}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <PricingActions pricing={row.original} className="float-right" />,
    },
  ]
}

