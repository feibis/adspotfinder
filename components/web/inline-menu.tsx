"use client"

import { useScrollIntoView, useScrollSpy } from "@mantine/hooks"
import type { ComponentProps } from "react"
import { useEffect, useMemo } from "react"
import { Button, type ButtonProps } from "~/components/common/button"
import { Stack } from "~/components/common/stack"
import { cx } from "~/lib/utils"

type InlineMenuProps = ComponentProps<typeof Stack> & {
  items: ({ id: string } & ButtonProps)[]
}

export const InlineMenu = ({ children, className, items, ...props }: InlineMenuProps) => {
  const ids = useMemo(() => items.map(item => item.id), [items])
  const selector = useMemo(() => ids.map(id => `[id="${id}"]`).join(","), [ids])

  const { scrollIntoView, targetRef, cancel, scrollableRef } = useScrollIntoView<HTMLElement>()
  const { active, data } = useScrollSpy({ selector })

  const activeId = data[active]?.id

  useEffect(() => {
    if (!activeId) return
    const activeMenuElement = document.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`)

    if (activeMenuElement) {
      targetRef.current = activeMenuElement
      scrollIntoView({ alignment: "center" })
    }

    return cancel
  }, [activeId, cancel, scrollIntoView])

  return (
    <Stack
      size="xs"
      direction="column"
      wrap={false}
      className={cx("items-stretch overflow-y-auto overscroll-contain scroll-smooth", className)}
      ref={scrollableRef}
      asChild
      {...props}
    >
      <nav>
        {items.map(({ id, children, className, ...props }) => (
          <Button
            key={id}
            size="lg"
            variant="ghost"
            className={cx(
              "py-2 *:only:text-start hover:ring-transparent! focus-visible:ring-transparent",
              activeId === id
                ? "bg-accent text-foreground"
                : "text-muted-foreground font-normal hover:text-foreground",
              className,
            )}
            {...props}
            asChild
          >
            <a href={`#${id}`}>{children}</a>
          </Button>
        ))}

        {children}
      </nav>
    </Stack>
  )
}
