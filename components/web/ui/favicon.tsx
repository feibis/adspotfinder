import Image from "next/image"
import type { ComponentProps } from "react"
import type { VariantProps } from "~/utils/cva"
import { cva, cx } from "~/utils/cva"

const faviconVariants = cva({
  base: "size-9 rounded-[0.375em] mix-blend-multiply dark:mix-blend-normal",
  variants: {
    contained: {
      true: "p-[0.1875em] border",
    },
  },
  defaultVariants: {
    contained: false,
  },
})

type FaviconProps = Omit<ComponentProps<"img">, "src" | "alt" | "width" | "height"> &
  VariantProps<typeof faviconVariants> & {
    src?: string | null
    name?: string
    size?: number
  }

export const Favicon = ({
  className,
  src,
  title,
  contained,
  size = 64,
  ...props
}: FaviconProps) => {
  if (!src) return null

  return (
    <Image
      src={src}
      alt={title ? `Favicon of ${title}` : "Favicon"}
      loading="lazy"
      width={size}
      height={size}
      className={cx(faviconVariants({ contained, className }))}
      unoptimized
      {...props}
    />
  )
}
