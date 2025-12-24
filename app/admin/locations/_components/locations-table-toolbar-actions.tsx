"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Location } from "~/.generated/prisma/browser"
import { LocationsDeleteDialog } from "~/app/admin/locations/_components/locations-delete-dialog"
import { Button } from "~/components/common/button"

interface LocationsTableToolbarActionsProps {
  table: Table<Location>
}

export const LocationsTableToolbarActions = ({ table }: LocationsTableToolbarActionsProps) => {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <LocationsDeleteDialog locations={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </LocationsDeleteDialog>
  )
}
