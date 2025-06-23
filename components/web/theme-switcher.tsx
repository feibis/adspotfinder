"use client"

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
  const { theme, setTheme, resolvedTheme, forcedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted || forcedTheme) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navLinkVariants({ className })} {...props}>
        {resolvedTheme === "dark" ? (
          <MoonIcon />
        ) : resolvedTheme === "light" ? (
          <SunIcon />
        ) : (
          <LaptopIcon />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={navLinkVariants({ isActive: theme === "system", isPadded: false })}
        >
          <LaptopIcon /> System
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={navLinkVariants({ isActive: theme === "light", isPadded: false })}
        >
          <SunIcon /> Light
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={navLinkVariants({ isActive: theme === "dark", isPadded: false })}
        >
          <MoonIcon /> Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
