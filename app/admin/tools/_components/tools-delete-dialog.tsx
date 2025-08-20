import type { Tool } from "@prisma/client"
import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteTools } from "~/server/admin/tools/actions"

type ToolsDeleteDialogProps = PropsWithChildren<{
  tools: Tool[]
}>

export const ToolsDeleteDialog = ({ tools, ...props }: ToolsDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={tools.map(({ id }) => id)}
      label="tool"
      action={deleteTools}
      callbacks={{
        onNavigation: () => toast.success("Tool(s) deleted successfully"),
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
