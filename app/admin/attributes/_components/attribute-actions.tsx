"use client"

import { CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type { Attribute } from "~/.generated/prisma/browser"
import { AttributesDeleteDialog } from "~/app/admin/attributes/_components/attributes-delete-dialog"
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
import { duplicateAttribute } from "~/server/admin/attributes/actions"

type AttributeActionsProps = ComponentProps<typeof Button> & {
  attribute: Attribute
}

export const AttributeActions = ({ attribute, className, ...props }: AttributeActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const attributePath = `/admin/attributes/${attribute.slug}`
  const isAttributePage = pathname === attributePath

  const { executeAsync } = useAction(duplicateAttribute, {
    onSuccess: ({ data }) => {
      if (isAttributePage) {
        router.push(`/admin/attributes/${data.slug}`)
      }
    },
  })

  const handleDuplicate = () => {
    toast.promise(
      async () => {
        const { serverError } = await executeAsync({ id: attribute.id })

        if (serverError) {
          throw new Error(serverError)
        }
      },
      {
        loading: "Duplicating attribute...",
        success: "Attribute duplicated successfully",
        error: err => `Failed to duplicate attribute: ${err.message}`,
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
          {!isAttributePage && (
            <DropdownMenuItem asChild>
              <Link href={attributePath}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/attributes/${attribute.slug}`} target="_blank">
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

      <AttributesDeleteDialog
        attributes={[attribute]}
        onExecute={() => router.push("/admin/attributes")}
      >
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </AttributesDeleteDialog>
    </Stack>
  )
}

