"use client"

import { CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type { Agency } from "~/.generated/prisma/browser"
import { AgencysDeleteDialog } from "~/app/admin/agencys/_components/agencys-delete-dialog"
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
import { duplicateAgency } from "~/server/admin/agencys/actions"

type AgencyActionsProps = ComponentProps<typeof Button> & {
  agency: Agency
}

export const AgencyActions = ({ agency, className, ...props }: AgencyActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const agencyPath = `/admin/agencys/${agency.slug}`
  const isAgencyPage = pathname === agencyPath

  const { executeAsync } = useAction(duplicateAgency, {
    onSuccess: ({ data }) => {
      if (isAgencyPage) {
        router.push(`/admin/agencys/${data.slug}`)
      }
    },
  })

  const handleDuplicate = () => {
    toast.promise(
      async () => {
        const { serverError } = await executeAsync({ id: agency.id })

        if (serverError) {
          throw new Error(serverError)
        }
      },
      {
        loading: "Duplicating agency...",
        success: "Agency duplicated successfully",
        error: err => `Failed to duplicate agency: ${err.message}`,
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
          {!isAgencyPage && (
            <DropdownMenuItem asChild>
              <Link href={agencyPath}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/agencys/${agency.slug}`} target="_blank">
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

      <AgencysDeleteDialog agencys={[agency]} onExecute={() => router.push("/admin/agencys")}>
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </AgencysDeleteDialog>
    </Stack>
  )
}
