import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const wrapperVariants = cva({
  base: "@container flex flex-col w-full",
  variants: {
    alignment: {
      start: "mr-auto",
      center: "mx-auto",
      end: "ml-auto",
    },
    size: {
      sm: "max-w-(--breakpoint-sm)",
      md: "max-w-(--breakpoint-md)",
      lg: "max-w-(--breakpoint-lg)",
    },
    gap: {
      sm: "gap-8",
      md: "gap-12",
      lg: "gap-16",
    },
  },
  defaultVariants: {
    alignment: "start",
    gap: "md",
  },
})

type WrapperProps = ComponentProps<"div"> & VariantProps<typeof wrapperVariants>

export const Wrapper = ({ className, alignment, size, gap, ...props }: WrapperProps) => {
  return <div className={cx(wrapperVariants({ alignment, size, gap, className }))} {...props} />
}
