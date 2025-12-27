import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import type { Pricing } from "~/.generated/prisma/client"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deletePricings } from "~/server/admin/pricings/actions"

type PricingsDeleteDialogProps = PropsWithChildren<{
  pricings: Pricing[]
  onExecute?: () => void
}>

export const PricingsDeleteDialog = ({ pricings, onExecute, ...props }: PricingsDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={pricings.map(({ id }) => id)}
      label="pricing"
      action={deletePricings}
      callbacks={{
        onExecute: () => {
          toast.success("Pricing(s) deleted successfully")
          onExecute?.()
        },
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}

