import type { ComponentProps } from "react"
import { MDXComponents } from "~/components/web/mdx-components"
import { Stat } from "~/components/web/ui/stat"
import { cva, cx, type VariantProps } from "~/lib/utils"

const statsVariants = cva({
  base: "flex flex-wrap items-start justify-between gap-x-4 gap-y-8",

  variants: {
    alignment: {
      start: "items-start justify-between text-start",
      center: "items-center justify-around text-center",
      end: "items-end justify-between text-end",
    },
  },

  defaultVariants: {
    alignment: "center",
  },
})

type StatsProps = ComponentProps<"div"> & VariantProps<typeof statsVariants>

export const Stats = ({ alignment, className, ...props }: StatsProps) => {
  const stats = [
    { value: 250000, label: "Monthly Pageviews" },
    { value: 2000, label: "Listed Tools" },
    { value: 5000, label: "Newsletter Subscribers" },
  ]

  return (
    <div className={cx(statsVariants({ alignment, className }))} {...props}>
      {stats.map(({ value, label }, index) => (
        <MDXComponents.a
          key={`${index}-${label}`}
          className="space-y-1 basis-40 hover:[&[href]]:opacity-80 lg:basis-48"
        >
          <Stat
            value={value}
            format={{ notation: "compact" }}
            locales="en-US"
            // @ts-expect-error
            style={{ "--number-flow-char-height": "0.75em" }}
            className="text-5xl font-display font-semibold"
          />

          <p className="text-sm text-muted-foreground lg:text-base">{label}</p>
        </MDXComponents.a>
      ))}
    </div>
  )
}
