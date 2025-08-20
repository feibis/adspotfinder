import type { Report } from "@prisma/client"
import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteReports } from "~/server/admin/reports/actions"

type ReportsDeleteDialogProps = PropsWithChildren<{
  reports: Report[]
}>

export const ReportsDeleteDialog = ({ reports, ...props }: ReportsDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={reports.map(({ id }) => id)}
      label="report"
      action={deleteReports}
      callbacks={{
        onNavigation: () => toast.success("Report(s) deleted successfully"),
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
