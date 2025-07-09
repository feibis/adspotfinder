"use client"

import { isValidUrl } from "@primoui/utils"
import type { Tool } from "@prisma/client"
import { EllipsisIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { ToolsDeleteDialog } from "~/app/admin/tools/_components/tools-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { ExternalLink } from "~/components/web/external-link"
import { cx } from "~/lib/utils"

type ToolActionsProps = ComponentProps<typeof Button> & {
  tool: Tool
}

export const ToolActions = ({ className, tool, ...props }: ToolActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  return (
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
        {pathname !== `/admin/tools/${tool.slug}` && (
          <DropdownMenuItem asChild>
            <Link href={`/admin/tools/${tool.slug}`}>Edit</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/${tool.slug}`} target="_blank">
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {isValidUrl(tool.websiteUrl) && (
          <DropdownMenuItem asChild>
            <ExternalLink href={tool.websiteUrl}>Visit website</ExternalLink>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => setIsDeleteOpen(true)} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ToolsDeleteDialog
        open={isDeleteOpen}
        onOpenChange={() => setIsDeleteOpen(false)}
        tools={[tool]}
        showTrigger={false}
        onSuccess={() => router.push("/admin/tools")}
      />
    </DropdownMenu>
  )
}
