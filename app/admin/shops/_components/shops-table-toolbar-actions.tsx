"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Shop } from "~/.generated/prisma/browser"
import { ShopsDeleteDialog } from "~/app/admin/shops/_components/shops-delete-dialog"
import { Button } from "~/components/common/button"

interface ShopsTableToolbarActionsProps {
  table: Table<Shop>
}

export const ShopsTableToolbarActions = ({ table }: ShopsTableToolbarActionsProps) => {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <ShopsDeleteDialog shops={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </ShopsDeleteDialog>
  )
}
