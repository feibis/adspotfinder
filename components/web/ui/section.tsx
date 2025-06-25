import type { ComponentProps } from "react"
import { Sticky } from "~/components/web/ui/sticky"
import { cx } from "~/utils/cva"

export const SectionBase = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cx("grid items-start gap-6 md:grid-cols-3 lg:gap-8", className)} {...props} />
  )
}

export const SectionContent = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx("flex flex-col gap-8 md:col-span-2 md:gap-10 lg:gap-12", className)}
      {...props}
    />
  )
}

export const SectionSidebar = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <Sticky>
      <div className={cx("flex flex-col gap-6 w-full", className)} {...props} />
    </Sticky>
  )
}

export const Section = Object.assign(SectionBase, {
  Content: SectionContent,
  Sidebar: SectionSidebar,
})
