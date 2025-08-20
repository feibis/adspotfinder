import type { Tag } from "@prisma/client"
import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteTags } from "~/server/admin/tags/actions"

type TagsDeleteDialogProps = PropsWithChildren<{
  tags: Tag[]
}>

export const TagsDeleteDialog = ({ tags, ...props }: TagsDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={tags.map(({ id }) => id)}
      label="tag"
      action={deleteTags}
      callbacks={{
        onNavigation: () => toast.success("Tag(s) deleted successfully"),
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
