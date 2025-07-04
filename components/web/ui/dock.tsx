"use client"

import { Slot } from "radix-ui"
import { type ComponentProps, isValidElement } from "react"
import { Box } from "~/components/common/box"
import { cva, cx, type VariantProps } from "~/lib/utils"

const Dock = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <Box>
      <div
        className={cx(
          "relative z-20 flex flex-wrap items-center bg-background shadow-background/75 shadow-[0_0_30px_0_var(--tw-shadow-color)] backdrop-blur-xs rounded-lg py-1 px-1.5 isolate",
          className,
        )}
        {...props}
      />
    </Box>
  )
}

const dockItemVariants = cva({
  base: [
    "relative p-1 rounded-sm transition-all duration-150 ease-in-out lg:px-1.5",
    "hover:pb-2 hover:text-foreground hover:-mt-1 hover:z-10",
    "disabled:opacity-50 disabled:pointer-events-none",
  ],

  variants: {
    isActive: {
      true: "after:absolute after:mt-1 after:left-1/2 after:-translate-x-1/2 after:pointer-events-none after:bg-current after:w-2.5 after:h-px after:rounded-full",
      false: "text-secondary-foreground",
    },
  },

  defaultVariants: {
    isActive: false,
  },
})

type DockItemProps = ComponentProps<"div"> &
  VariantProps<typeof dockItemVariants> & {
    /**
     * If series to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

const DockItem = ({ className, asChild, isActive, ...props }: DockItemProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot.Root : "div"

  return <Comp className={cx(dockItemVariants({ isActive, className }))} {...props} />
}

const DockSeparator = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("w-[1px] h-4 -my-2 mx-1.5 bg-ring", className)} {...props} />
}

export { Dock, DockItem, DockSeparator }
