"use client"

import type { Report } from "@prisma/client"
import { EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { ReportsDeleteDialog } from "~/app/admin/reports/_components/reports-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { cx } from "~/lib/utils"

type ReportActionsProps = ComponentProps<typeof Button> & {
  report: Report
}

export const ReportActions = ({ report, className, ...props }: ReportActionsProps) => {
  const pathname = usePathname()

  return (
    <Stack size="sm" wrap={false}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="secondary"
            size="sm"
            prefix={<EllipsisIcon />}
            className={cx("data-[state=open]:bg-accent", className)}
            {...props}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8}>
          {pathname !== `/admin/reports/${report.id}` && (
            <DropdownMenuItem asChild>
              <Link href={`/admin/reports/${report.id}`}>Edit</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ReportsDeleteDialog reports={[report]}>
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </ReportsDeleteDialog>
    </Stack>
  )
}
