import type { User } from "@prisma/client"
import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteUsers } from "~/server/admin/users/actions"

type UsersDeleteDialogProps = PropsWithChildren<{
  users: User[]
}>

export const UsersDeleteDialog = ({ users, ...props }: UsersDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={users.map(({ id }) => id)}
      label="user"
      action={deleteUsers}
      callbacks={{
        onNavigation: () => toast.success("User(s) deleted successfully"),
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
