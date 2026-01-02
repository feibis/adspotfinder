"use client"

import { formatDate } from "@primoui/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { HashIcon, MapPinIcon, FolderIcon, InstagramIcon, MusicIcon } from "lucide-react"
import type { Shop } from "~/.generated/prisma/browser"
import { ShopActions } from "~/app/admin/shops/_components/shop-actions"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

export const getColumns = (): ColumnDef<Shop & { _count?: { locations: number; categories: number } }>[] => {
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
      size: 160,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <DataTableLink href={`/admin/shops/${row.original.slug}`} title={row.original.name} />
      ),
    },
    {
      accessorKey: "_count.locations",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Locations" />,
      cell: ({ row }) => (
        <Badge prefix={<MapPinIcon className="opacity-50 size-3!" />} className="tabular-nums">
          {row.original._count?.locations || 0}
        </Badge>
      ),
    },
    {
      accessorKey: "_count.categories",
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Categories" />,
      cell: ({ row }) => (
        <Badge prefix={<FolderIcon className="opacity-50 size-3!" />} className="tabular-nums">
          {row.original._count?.categories || 0}
        </Badge>
      ),
    },
    {
      accessorKey: "instagramFollowers",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Instagram" />,
      cell: ({ row }) => (
        <Badge prefix={<InstagramIcon className="opacity-50 size-3!" />} className="tabular-nums">
          {row.original.instagramFollowers?.toLocaleString() || "0"}
        </Badge>
      ),
    },
    {
      accessorKey: "tiktokFollowers",
      header: ({ column }) => <DataTableColumnHeader column={column} title="TikTok" />,
      cell: ({ row }) => (
        <Badge prefix={<MusicIcon className="opacity-50 size-3!" />} className="tabular-nums">
          {row.original.tiktokFollowers?.toLocaleString() || "0"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ cell }) => <Note>{formatDate(cell.getValue() as Date)}</Note>,
    },
    {
      id: "actions",
      cell: ({ row }) => <ShopActions shop={row.original} className="float-right" />,
    },
  ]
}
