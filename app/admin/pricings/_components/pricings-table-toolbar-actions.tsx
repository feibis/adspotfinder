"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Pricing } from "~/.generated/prisma/browser"
import { PricingsDeleteDialog } from "~/app/admin/pricings/_components/pricings-delete-dialog"
import { Button } from "~/components/common/button"

interface PricingsTableToolbarActionsProps {
  table: Table<Pricing>
}

export const PricingsTableToolbarActions = ({ table }: PricingsTableToolbarActionsProps) => {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <PricingsDeleteDialog pricings={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </PricingsDeleteDialog>
  )
}

