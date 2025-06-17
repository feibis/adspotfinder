import { useHotkeys } from "@mantine/hooks"
import { Slot } from "radix-ui"
import type { ReactNode } from "react"
import { Kbd } from "~/components/common/kbd"
import { Tooltip } from "~/components/common/tooltip"
import { DockItem } from "~/components/web/ui/dock"

export type NavItemProps = {
  icon: ReactNode
  tooltip: string
  shortcut?: string
  hotkey?: string
  isActive?: boolean
  isDisabled?: boolean
  onClick?: () => void
}

export const NavItem = ({ ...props }: NavItemProps) => {
  const { icon, tooltip, shortcut, hotkey, isActive, isDisabled, onClick } = props
  const hotkeyStr = hotkey || shortcut

  useHotkeys(
    hotkeyStr ? [[hotkeyStr, () => !isDisabled && onClick?.(), { preventDefault: true }]] : [],
  )

  return (
    <Tooltip
      tooltip={
        <>
          {tooltip} {shortcut && <Kbd className="invert">{shortcut}</Kbd>}
        </>
      }
      sideOffset={0}
    >
      <DockItem isActive={isActive} asChild>
        <button type="button" onClick={onClick} disabled={isDisabled}>
          <Slot.Root className="size-4">{icon}</Slot.Root>
        </button>
      </DockItem>
    </Tooltip>
  )
}
