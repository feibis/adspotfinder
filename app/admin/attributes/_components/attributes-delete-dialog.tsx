import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import type { Attribute } from "~/.generated/prisma/client"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteAttributes } from "~/server/admin/attributes/actions"

type AttributesDeleteDialogProps = PropsWithChildren<{
  attributes: Attribute[]
  onExecute?: () => void
}>

export const AttributesDeleteDialog = ({
  attributes,
  onExecute,
  ...props
}: AttributesDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={attributes.map(({ id }) => id)}
      label="attribute"
      action={deleteAttributes}
      callbacks={{
        onExecute: () => {
          toast.success("Attribute(s) deleted successfully")
          onExecute?.()
        },
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}

