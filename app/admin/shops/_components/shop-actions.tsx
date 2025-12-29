"use client"

import { CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type { Shops } from "~/.generated/prisma/browser"
import { ShopsDeleteDialog } from "~/app/admin/shops/_components/shops-delete-dialog"
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
import { duplicateShop } from "~/server/admin/shops/actions"

type ShopActionsProps = ComponentProps<typeof Button> & {
  shop: Shops
}

export const ShopActions = ({ shop, className, ...props }: ShopActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const shopPath = `/admin/shops/${shop.slug}`
  const isShopPage = pathname === shopPath

  const { executeAsync } = useAction(duplicateShop, {
    onSuccess: ({ data }) => {
      if (isShopPage) {
        router.push(`/admin/shops/${data.slug}`)
      }
    },
  })

  const handleDuplicate = () => {
    toast.promise(
      async () => {
        const { serverError } = await executeAsync({ id: shop.id })

        if (serverError) {
          throw new Error(serverError)
        }
      },
      {
        loading: "Duplicating shop...",
        success: "Shop duplicated successfully",
        error: err => `Failed to duplicate shop: ${err.message}`,
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
          {!isShopPage && (
            <DropdownMenuItem asChild>
              <Link href={shopPath}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href={`/shops/${shop.slug}`} target="_blank">
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

      <ShopsDeleteDialog shops={[shop]} onExecute={() => router.push("/admin/shops")}>
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </ShopsDeleteDialog>
    </Stack>
  )
}
