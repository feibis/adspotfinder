import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const stickyVariants = cva({
  base: "md:sticky md:top-(--header-offset) md:z-49",

  variants: {
    isOverlay: {
      true: "md:p-(--sticky-offset) md:-m-(--sticky-offset) md:bg-background",
      false: "md:pt-(--sticky-offset) md:-mt-(--sticky-offset)",
    },
  },

  defaultVariants: {
    isOverlay: false,
  },
})

type StickyProps = ComponentProps<"div"> & VariantProps<typeof stickyVariants>

export const Sticky = ({ className, isOverlay, ...props }: StickyProps) => {
  return <Slot.Root className={cx(stickyVariants({ isOverlay, className }))} {...props} />
}
