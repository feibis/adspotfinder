"use client"

import type { Category } from "@prisma/client"
import { EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { CategoriesDeleteDialog } from "~/app/admin/categories/_components/categories-delete-dialog"
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

type CategoryActionsProps = ComponentProps<typeof Button> & {
  category: Category
}

export const CategoryActions = ({ category, className, ...props }: CategoryActionsProps) => {
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
          {pathname !== `/admin/categories/${category.slug}` && (
            <DropdownMenuItem asChild>
              <Link href={`/admin/categories/${category.slug}`}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/categories/${category.slug}`} target="_blank">
              View
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoriesDeleteDialog
        categories={[category]}
        onExecute={() => router.push("/admin/categories")}
      >
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </CategoriesDeleteDialog>
    </Stack>
  )
}
