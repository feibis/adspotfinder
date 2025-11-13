"use client"

import { formatDate } from "@primoui/utils"
import type { ColumnDef } from "@tanstack/react-table"
import {
  CalendarPlusIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useQueryStates } from "nuqs"
import { useMemo } from "react"
import { type Tool, ToolStatus } from "~/.generated/prisma/browser"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { useDataTable } from "~/hooks/use-data-table"
import { isToolPublished } from "~/lib/tools"
import type { findTools } from "~/server/admin/tools/queries"
import { toolsTableParamsSchema } from "~/server/admin/tools/schema"
import type { DataTableFilterField } from "~/types"

export const DashboardTable = ({ tools, pageCount }: Awaited<ReturnType<typeof findTools>>) => {
  const locale = useLocale()
  const t = useTranslations("pages.dashboard.table")
  const [{ perPage, sort }] = useQueryStates(toolsTableParamsSchema)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo((): ColumnDef<Tool>[] => {
    return [
      {
        accessorKey: "name",
        enableHiding: false,
        size: 160,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t("columns.name")} />,
        cell: ({ row }) => {
          const { name, slug, faviconUrl } = row.original

          return <DataTableLink href={`/${slug}`} image={faviconUrl} title={name} />
        },
      },
      {
        accessorKey: "publishedAt",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("columns.published_at")} />
        ),
        cell: ({ row }) => {
          const { status, publishedAt } = row.original

          switch (status) {
            case ToolStatus.Published:
              return (
                <Stack size="sm" wrap={false}>
                  <CircleIcon className="stroke-3 text-green-600/75 dark:text-green-500/75" />
                  <Note className="font-medium">{formatDate(publishedAt!, "medium", locale)}</Note>
                </Stack>
              )
            case ToolStatus.Scheduled:
              return (
                <Stack size="sm" wrap={false}>
                  <CircleDotDashedIcon className="stroke-3 text-yellow-700/75 dark:text-yellow-500/75" />
                  <Note className="font-medium">
                    {formatDate(publishedAt!, "medium", locale)} ({t("status.scheduled")})
                  </Note>
                </Stack>
              )
            case ToolStatus.Draft:
              return (
                <Stack size="sm" wrap={false}>
                  <CircleDashedIcon className="stroke-3 text-muted-foreground/75" />
                  <span className="text-muted-foreground/75">{t("status.awaiting_review")}</span>
                </Stack>
              )
            default:
              return ""
          }
        },
      },
      {
        accessorKey: "createdAt",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("columns.created_at")} />
        ),
        cell: ({ row }) => <Note>{formatDate(row.getValue<Date>("createdAt"))}</Note>,
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const { slug, isFeatured } = row.original
          const isPublished = isToolPublished(row.original)

          if (isPublished && isFeatured) {
            return null
          }

          return (
            <Button
              size="sm"
              variant="secondary"
              prefix={
                !isPublished ? (
                  <CalendarPlusIcon className="text-green-600 dark:text-green-400" />
                ) : (
                  <SparklesIcon className="text-blue-600 dark:text-blue-400" />
                )
              }
              className="float-right -my-1"
              asChild
            >
              <Link href={`/submit/${slug}`}>
                {!isPublished ? t("actions.publish") : t("actions.feature")}
              </Link>
            </Button>
          )
        },
      },
    ]
  }, [t])

  // Search filters
  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: t("filters.name_label"),
      placeholder: t("filters.name_placeholder"),
    },
  ]

  const { table } = useDataTable({
    data: tools,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
      columnVisibility: { createdAt: false },
    },
    getRowId: originalRow => originalRow.slug,
  })

  return (
    <DataTable table={table} emptyState={t("empty_state")}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <Button size="md" variant="primary" prefix={<PlusIcon />} asChild>
          <Link href="/submit">{t("submit_button")}</Link>
        </Button>
      </DataTableToolbar>
    </DataTable>
  )
}
