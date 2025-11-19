import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { cva, cx, type VariantProps } from "~/lib/utils"

const boxVariants = cva({
  base: "border outline-3 outline-transparent transition-colors duration-100 ease-out",

  variants: {
    hover: {
      true: "not-disabled:cursor-pointer hover:not-disabled:outline-3 hover:not-disabled:outline-border/50 hover:not-disabled:border-ring",
    },
    focus: {
      true: "focus-visible:outline-3 focus-visible:outline-border/50 focus-visible:border-ring",
    },
    focusWithin: {
      true: "focus-within:outline-3 focus-within:outline-border/50 focus-within:border-ring",
    },
  },
})

type BoxProps = ComponentProps<"div"> & VariantProps<typeof boxVariants>

const Box = ({ hover, focus, focusWithin, className, ...props }: BoxProps) => {
  return (
    <Slot.Root className={cx(boxVariants({ hover, focus, focusWithin, className }))} {...props} />
  )
}

export { Box, boxVariants, type BoxProps }
