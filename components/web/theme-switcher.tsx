"use client"

import { capitalCase } from "change-case"
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { type ComponentProps, useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { navLinkVariants } from "~/components/web/ui/nav-link"

type ThemeSwitcherProps = ComponentProps<typeof DropdownMenuTrigger>

export const ThemeSwitcher = ({ className, ...props }: ThemeSwitcherProps) => {
  const { themes, theme, setTheme, resolvedTheme, forcedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || forcedTheme) return null

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case "light":
        return <SunIcon />
      case "dark":
        return <MoonIcon />
      default:
        return <LaptopIcon />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navLinkVariants({ className })} {...props}>
        {getThemeIcon(resolvedTheme ?? "system")}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {themes.map(t => (
          <DropdownMenuItem
            key={t}
            onClick={() => setTheme(t)}
            className={navLinkVariants({ isActive: theme === t, isPadded: false })}
          >
            {getThemeIcon(t)}
            {capitalCase(t)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
