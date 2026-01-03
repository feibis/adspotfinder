"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Agency } from "~/.generated/prisma/browser"
import { AgencysDeleteDialog } from "~/app/admin/agencys/_components/agencys-delete-dialog"
import { Button } from "~/components/common/button"

interface AgencysTableToolbarActionsProps {
  table: Table<Agency>
}

export const AgencysTableToolbarActions = ({ table }: AgencysTableToolbarActionsProps) => {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <AgencysDeleteDialog agencys={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </AgencysDeleteDialog>
  )
}
