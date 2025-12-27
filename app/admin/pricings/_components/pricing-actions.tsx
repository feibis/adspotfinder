"use client"

import { CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import type { Pricing } from "~/.generated/prisma/browser"
import { PricingsDeleteDialog } from "~/app/admin/pricings/_components/pricings-delete-dialog"
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
import { duplicatePricing } from "~/server/admin/pricings/actions"

type PricingActionsProps = ComponentProps<typeof Button> & {
  pricing: Pricing
}

export const PricingActions = ({ pricing, className, ...props }: PricingActionsProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const pricingPath = `/admin/pricings/${pricing.id}`
  const isPricingPage = pathname === pricingPath

  const { executeAsync } = useAction(duplicatePricing, {
    onSuccess: ({ data }) => {
      if (isPricingPage) {
        router.push(`/admin/pricings/${data.id}`)
      }
    },
  })

  const handleDuplicate = () => {
    toast.promise(
      async () => {
        const { serverError } = await executeAsync({ id: pricing.id })

        if (serverError) {
          throw new Error(serverError)
        }
      },
      {
        loading: "Duplicating pricing...",
        success: "Pricing duplicated successfully",
        error: err => `Failed to duplicate pricing: ${err.message}`,
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
          {!isPricingPage && (
            <DropdownMenuItem asChild>
              <Link href={pricingPath}>Edit</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleDuplicate}>
            <CopyIcon />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PricingsDeleteDialog pricings={[pricing]} onExecute={() => router.push("/admin/pricings")}>
        <Button
          variant="secondary"
          size="sm"
          prefix={<TrashIcon />}
          className="text-red-500"
          {...props}
        />
      </PricingsDeleteDialog>
    </Stack>
  )
}

