import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import type { Shop } from "~/.generated/prisma/client"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteShops } from "~/server/admin/shops/actions"

type ShopsDeleteDialogProps = PropsWithChildren<{
  shops: Shop[]
  onExecute?: () => void
}>

export const ShopsDeleteDialog = ({ shops, onExecute, ...props }: ShopsDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={shops.map(({ id }) => id)}
      label="shop"
      action={deleteShops}
      callbacks={{
        onExecute: () => {
          toast.success("Shop(s) deleted successfully")
          onExecute?.()
        },
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
