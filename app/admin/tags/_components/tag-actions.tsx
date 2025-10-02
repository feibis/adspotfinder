"use client"

import { EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import type { Tag } from "~/.generated/prisma/browser"
import { TagsDeleteDialog } from "~/app/admin/tags/_components/tags-delete-dialog"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { cx } from "~/lib/utils"

type TagActionsProps = ComponentProps<typeof Button> & {
  tag: Tag
}

export const TagActions = ({ tag, className, ...props }: TagActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()

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
          {pathname !== `/admin/tags/${tag.slug}` && (
            <DropdownMenuItem asChild>
              <Link href={`/admin/tags/${tag.slug}`}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/tags/${tag.slug}`} target="_blank">
              View
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TagsDeleteDialog tags={[tag]} onExecute={() => router.push("/admin/tags")}>
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </TagsDeleteDialog>
    </Stack>
  )
}
