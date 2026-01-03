"use client"

import { useHotkeys } from "@mantine/hooks"
import {
  CalendarDaysIcon,
  ChevronDownIcon,
  FilterIcon,
  GalleryHorizontalEndIcon,
  MapPinIcon,
  SearchIcon,
  TagIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { type ComponentProps, useEffect, useState } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ThemeSwitcher } from "~/components/web/theme-switcher"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { Logo } from "~/components/web/ui/logo"
import { NavLink } from "~/components/web/ui/nav-link"
import { UserMenu } from "~/components/web/user-menu"
import { adsConfig } from "~/config/ads"
import { useSearch } from "~/contexts/search-context"
import { cx } from "~/lib/utils"

const Header = ({ className, ...props }: ComponentProps<"div">) => {
  const pathname = usePathname()
  const search = useSearch()
  const t = useTranslations()
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useHotkeys([["Escape", () => setNavOpen(false)]])

  // Close the mobile navigation when the user navigates to a new page
  useEffect(() => setNavOpen(false), [pathname])

  return (
    <header
      className={cx("fixed top-(--header-top) inset-x-0 z-50 bg-background", className)}
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <Container>
        <div className="flex items-center py-4 gap-6 text-base h-(--header-height) md:gap-8 lg:gap-10">
          <Stack size="md" wrap={false} className="min-w-0">
            <Logo className="min-w-0" />
          </Stack>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 flex-1 max-lg:hidden">
            <DropdownMenu>
              <NavLink
                className="gap-1"
                suffix={<ChevronDownIcon className="group-data-[state=open]:-rotate-180" />}
                asChild
              >
                <DropdownMenuTrigger>{t("navigation.browse")}</DropdownMenuTrigger>
              </NavLink>

              <DropdownMenuContent align="start" className="min-w-48">
                <DropdownMenuItem asChild>
                  <NavLink href="/?sort=publishedAt.desc" prefix={<CalendarDaysIcon />} className="text-base py-2">
                    {t("navigation.latest_tools")}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/categories" prefix={<GalleryHorizontalEndIcon />} className="text-base py-2">
                    {t("navigation.categories")}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/tags" prefix={<TagIcon />} className="text-base py-2">
                    {t("navigation.tags")}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/locations" prefix={<MapPinIcon />} className="text-base py-2">
                    {t("navigation.locations")}
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/attributes" prefix={<FilterIcon />} className="text-base py-2">
                    {t("navigation.attributes")}
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink href="/about">{t("navigation.about")}</NavLink>
            {adsConfig.enabled && <NavLink href="/advertise">{t("navigation.advertise")}</NavLink>}
          </nav>

          <Stack size="md" wrap={false} className="justify-end max-lg:grow">
            <Button size="md" variant="ghost" className="p-2 text-lg hover:bg-primary/5" onClick={search.open}>
              <SearchIcon className="size-5" />
            </Button>

            <Button size="md" variant="ghost" className="p-2 -ml-1 text-lg max-sm:hidden hover:bg-primary/5" asChild>
              <ThemeSwitcher />
            </Button>

            <Button size="md" variant="fancy" className="font-medium max-lg:hidden" asChild>
              <Link href="/submit">{t("navigation.submit")}</Link>
            </Button>

            <div className="max-lg:hidden">
              <UserMenu />
            </div>

            <button
              type="button"
              onClick={() => setNavOpen(!isNavOpen)}
              className="lg:hidden p-2 hover:bg-primary/5 rounded-md transition-colors"
            >
              <Hamburger className="size-6" />
            </button>
          </Stack>
        </div>

        <nav
          className={cx(
            "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-8 px-8 grid grid-cols-2 place-items-start place-content-start gap-x-8 gap-y-10 bg-background/95 backdrop-blur-xl border-t border-border/50 transition-all duration-300 lg:hidden text-lg",
            isNavOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
          )}
        >
          <NavLink href="/?sort=publishedAt.desc">{t("navigation.latest_tools")}</NavLink>
          <NavLink href="/categories">{t("navigation.categories")}</NavLink>
          <NavLink href="/tags">{t("navigation.tags")}</NavLink>
          <NavLink href="/locations">{t("navigation.locations")}</NavLink>
          <NavLink href="/attributes">{t("navigation.attributes")}</NavLink>
          <NavLink href="/submit">{t("navigation.submit")}</NavLink>
          <NavLink href="/auth/login">{t("navigation.sign_in")}</NavLink>
          <NavLink href="/about">{t("navigation.about")}</NavLink>
          {adsConfig.enabled && <NavLink href="/advertise">{t("navigation.advertise")}</NavLink>}
        </nav>
      </Container>
    </header>
  )
}

export { Header }
