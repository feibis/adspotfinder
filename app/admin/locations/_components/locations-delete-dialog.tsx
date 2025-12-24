import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import type { Location } from "~/.generated/prisma/client"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteLocations } from "~/server/admin/locations/actions"

type LocationsDeleteDialogProps = PropsWithChildren<{
  locations: Location[]
  onExecute?: () => void
}>

export const LocationsDeleteDialog = ({ locations, onExecute, ...props }: LocationsDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={locations.map(({ id }) => id)}
      label="location"
      action={deleteLocations}
      callbacks={{
        onExecute: () => {
          toast.success("Location(s) deleted successfully")
          onExecute?.()
        },
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
