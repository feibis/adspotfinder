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
import { NavLink } from "~/components/web/ui/nav-link"

type ThemeSwitcherProps = ComponentProps<typeof DropdownMenuTrigger>

export const ThemeSwitcher = ({ className, ...props }: ThemeSwitcherProps) => {
  const { themes, theme, setTheme, resolvedTheme, forcedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || forcedTheme) return null

  const getThemeIcon = (theme: string) => {
    switch (theme) {
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
      <NavLink className={className} asChild>
        <DropdownMenuTrigger {...props}>
          {getThemeIcon(resolvedTheme ?? "system")}
        </DropdownMenuTrigger>
      </NavLink>

      <DropdownMenuContent align="start">
        {themes.map(t => (
          <NavLink key={t} isActive={theme === t} isPadded={false} prefix={getThemeIcon(t)} asChild>
            <DropdownMenuItem onClick={() => setTheme(t)}>{capitalCase(t)}</DropdownMenuItem>
          </NavLink>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
