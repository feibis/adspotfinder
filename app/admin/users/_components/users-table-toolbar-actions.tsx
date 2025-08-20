"use client"

import type { User } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import { Button } from "~/components/common/button"
import { UsersDeleteDialog } from "./users-delete-dialog"

interface UsersTableToolbarActionsProps {
  table: Table<User>
}

export function UsersTableToolbarActions({ table }: UsersTableToolbarActionsProps) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <UsersDeleteDialog users={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </UsersDeleteDialog>
  )
}
