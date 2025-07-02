import type { ComponentProps } from "react"
import { cva, cx, type VariantProps } from "~/utils/cva"

const wrapperVariants = cva({
  base: "flex flex-col w-full",
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
      sm: "gap-y-fluid-sm",
      md: "gap-y-fluid-md",
      lg: "gap-y-fluid-lg",
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
