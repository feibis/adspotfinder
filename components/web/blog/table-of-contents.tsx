"use client"

import { useScrollSpy } from "@mantine/hooks"
import { AlignLeftIcon } from "lucide-react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { useEffect, useMemo } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import type { Heading } from "~/lib/headings"
import { cx } from "~/lib/utils"

type TableOfContentsProps = ComponentProps<typeof Stack> & {
  headings: Heading[]
}

export const TableOfContents = ({ headings, className, ...props }: TableOfContentsProps) => {
  const t = useTranslations("posts")
  const selector = useMemo(() => headings.map(h => `[id="${h.id}"]`).join(","), [headings])
  const { active, data } = useScrollSpy({ selector })
  const activeId = data[active]?.id

  useEffect(() => {
    if (!activeId) return

    const activeMenuElement = document.querySelector(`nav a[href="#${activeId}"]`)
    activeMenuElement?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [activeId])

  // Find minimum heading level to calculate absolute indentation
  const minLevel = useMemo(() => Math.min(...headings.map(h => h.level)), [headings])

  // Don't render if no headings
  if (!headings?.length) {
    return null
  }

  return (
    <Stack
      size="lg"
      direction="column"
      wrap={false}
      className={cx("items-stretch overflow-hidden", className)}
      {...props}
    >
      <Stack size="sm" wrap={false}>
        <AlignLeftIcon className="text-muted-foreground" />

        <H6 as="strong" className="text-muted-foreground">
          {t("on_this_page")}
        </H6>
      </Stack>

      <nav className="overflow-y-auto overscroll-contain scroll-smooth">
        {headings.map(heading => {
          const isActive = activeId === heading.id
          const indentLevel = heading.level - minLevel

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cx(
                "relative block py-1 text-sm leading-relaxed border-l-2 border-accent",
                // Indentation based on absolute level
                indentLevel === 0 && "pl-4",
                indentLevel === 1 && "pl-8",
                indentLevel === 2 && "pl-10",
                indentLevel >= 3 && "pl-12",
                // Active state
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {heading.text}

              {isActive && (
                <motion.div
                  className="absolute z-10 -left-0.5 inset-y-0 w-0.5 bg-foreground rounded-full"
                  layoutId="toc-indicator"
                  transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
                />
              )}
            </a>
          )
        })}
      </nav>
    </Stack>
  )
}
