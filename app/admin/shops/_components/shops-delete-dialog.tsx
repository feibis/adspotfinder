import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import type { Agency } from "~/.generated/prisma/client"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteAgencys } from "~/server/admin/agencys/actions"

type AgencysDeleteDialogProps = PropsWithChildren<{
  agencys: Agency[]
  onExecute?: () => void
}>

export const AgencysDeleteDialog = ({ agencys, onExecute, ...props }: AgencysDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={agencys.map(({ id }) => id)}
      label="agency"
      action={deleteAgencys}
      callbacks={{
        onExecute: () => {
          toast.success("Agency(s) deleted successfully")
          onExecute?.()
        },
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
