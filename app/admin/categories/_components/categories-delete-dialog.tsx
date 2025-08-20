import type { Category } from "@prisma/client"
import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteCategories } from "~/server/admin/categories/actions"

type CategoriesDeleteDialogProps = PropsWithChildren<{
  categories: Category[]
}>

export const CategoriesDeleteDialog = ({ categories, ...props }: CategoriesDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={categories.map(({ id }) => id)}
      label="category"
      action={deleteCategories}
      callbacks={{
        onNavigation: () => toast.success("Categories deleted successfully"),
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
