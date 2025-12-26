"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Attribute } from "~/.generated/prisma/browser"
import { AttributesDeleteDialog } from "~/app/admin/attributes/_components/attributes-delete-dialog"
import { Button } from "~/components/common/button"

interface AttributesTableToolbarActionsProps {
  table: Table<Attribute>
}

export const AttributesTableToolbarActions = ({ table }: AttributesTableToolbarActionsProps) => {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <AttributesDeleteDialog attributes={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </AttributesDeleteDialog>
  )
}

