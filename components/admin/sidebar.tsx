"use client"

import { useMediaQuery } from "@mantine/hooks"
import { cx } from "cva"
import {
  DockIcon,
  ExternalLinkIcon,
  GalleryHorizontalEndIcon,
  GemIcon,
  GlobeIcon,
  LogOutIcon,
  TagIcon,
  TriangleAlertIcon,
  UsersIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Nav } from "~/components/admin/nav"
import { Button } from "~/components/common/button"
import { Kbd } from "~/components/common/kbd"
import { Tooltip } from "~/components/common/tooltip"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { siteConfig } from "~/config/site"
import { useSearch } from "~/contexts/search-context"
import { signOut } from "~/lib/auth-client"

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()
  const search = useSearch()

  const handleOpenSite = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    window.open(siteConfig.url, "_self")
  }

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You've been signed out successfully")
          router.push("/")
        },
      },
    })
  }

  return (
    <Nav
      isCollapsed={!!isMobile}
      className={cx("sticky top-0 h-dvh z-40 border-r", isMobile ? "w-12" : "w-48")}
      links={[
        {
          title: siteConfig.name,
          href: "/admin",
          prefix: <LogoSymbol />,
        },

        undefined, // Separator

        {
          title: "Tools",
          href: "/admin/tools",
          prefix: <GemIcon />,
        },
        {
          title: "Categories",
          href: "/admin/categories",
          prefix: <GalleryHorizontalEndIcon />,
        },
        {
          title: "Tags",
          href: "/admin/tags",
          prefix: <TagIcon />,
        },
        {
          title: "Users",
          href: "/admin/users",
          prefix: <UsersIcon />,
        },
        {
          title: "Reports",
          href: "/admin/reports",
          prefix: <TriangleAlertIcon />,
        },

        undefined, // Separator

        {
          title: "Visit Site",
          href: "/admin/site",
          prefix: <GlobeIcon />,
          suffix: (
            <Tooltip tooltip="Open site in new tab">
              <Button
                variant="secondary"
                onClick={handleOpenSite}
                className="-my-0.5 px-1 py-[0.2em] text-xs/tight rounded-sm"
              >
                <ExternalLinkIcon className="size-3" />
              </Button>
            </Tooltip>
          ),
        },
        {
          title: "Quick Menu",
          href: "#",
          onClick: search.open,
          prefix: <DockIcon />,
          suffix: <Kbd meta>K</Kbd>,
        },
        {
          title: "Logout",
          href: "#",
          onClick: handleSignOut,
          prefix: <LogOutIcon />,
        },
      ]}
    />
  )
}
