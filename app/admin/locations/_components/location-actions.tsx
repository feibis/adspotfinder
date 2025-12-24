"use client"

import { CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type { Location } from "~/.generated/prisma/browser"
import { LocationsDeleteDialog } from "~/app/admin/locations/_components/locations-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { cx } from "~/lib/utils"
import { duplicateLocation } from "~/server/admin/locations/actions"

type LocationActionsProps = ComponentProps<typeof Button> & {
  location: Location
}

export const LocationActions = ({ location, className, ...props }: LocationActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const locationPath = `/admin/locations/${location.slug}`
  const isLocationPage = pathname === locationPath

  const { executeAsync } = useAction(duplicateLocation, {
    onSuccess: ({ data }) => {
      if (isLocationPage) {
        router.push(`/admin/locations/${data.slug}`)
      }
    },
  })

  const handleDuplicate = () => {
    toast.promise(
      async () => {
        const { serverError } = await executeAsync({ id: location.id })

        if (serverError) {
          throw new Error(serverError)
        }
      },
      {
        loading: "Duplicating location...",
        success: "Location duplicated successfully",
        error: err => `Failed to duplicate location: ${err.message}`,
      },
    )
  }

  return (
    <Stack size="sm" wrap={false}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open menu"
            variant="secondary"
            size="sm"
            prefix={<EllipsisIcon />}
            className={cx("data-[state=open]:bg-accent", className)}
            {...props}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8}>
          {!isLocationPage && (
            <DropdownMenuItem asChild>
              <Link href={locationPath}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/locations/${location.slug}`} target="_blank">
              View
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleDuplicate}>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LocationsDeleteDialog locations={[location]} onExecute={() => router.push("/admin/locations")}>
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </LocationsDeleteDialog>
    </Stack>
  )
}
