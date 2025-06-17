"use client"

import { ArrowLeftIcon, ArrowRightIcon, LinkIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Slot } from "radix-ui"
import { type ComponentProps, Fragment, type ReactNode } from "react"
import { toast } from "sonner"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandFacebookIcon } from "~/components/common/icons/brand-facebook"
import { BrandHackerNewsIcon } from "~/components/common/icons/brand-hackernews"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandMastodonIcon } from "~/components/common/icons/brand-mastodon"
import { BrandRedditIcon } from "~/components/common/icons/brand-reddit"
import { BrandWhatsAppIcon } from "~/components/common/icons/brand-whatsapp"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Note } from "~/components/common/note"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { NavItem, type NavItemProps } from "~/components/web/nav-item"
import { Dock, DockItem, DockSeparator } from "~/components/web/ui/dock"
import { config } from "~/config"

type Platform =
  | "X"
  | "Bluesky"
  | "Mastodon"
  | "Facebook"
  | "LinkedIn"
  | "HackerNews"
  | "Reddit"
  | "WhatsApp"

type ShareOption = {
  platform: Platform
  url: (shareUrl: string, shareTitle: string) => string
  icon: ReactNode
}

const shareOptions: ShareOption[] = [
  {
    platform: "X",
    url: (url, title) => `https://x.com/intent/post?text=${title}&url=${url}`,
    icon: <BrandXIcon />,
  },
  {
    platform: "Bluesky",
    url: (url, title) => `https://bsky.app/intent/compose?text=${title}+${url}`,
    icon: <BrandBlueskyIcon />,
  },
  {
    platform: "Mastodon",
    url: (url, title) => `https://mastodon.social/share?text=${title}+${url}`,
    icon: <BrandMastodonIcon />,
  },
  {
    platform: "Facebook",
    url: url => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: <BrandFacebookIcon />,
  },
  {
    platform: "LinkedIn",
    url: (url, title) => `https://linkedin.com/sharing/share-offsite?url=${url}&text=${title}`,
    icon: <BrandLinkedInIcon />,
  },
  {
    platform: "HackerNews",
    url: (url, title) => `https://news.ycombinator.com/submitlink?u=${url}&t=${title}`,
    icon: <BrandHackerNewsIcon />,
  },
  {
    platform: "Reddit",
    url: (url, title) => `https://reddit.com/submit?url=${url}&title=${title}`,
    icon: <BrandRedditIcon />,
  },
  {
    platform: "WhatsApp",
    url: (url, title) => `https://api.whatsapp.com/send?text=${title}+${url}`,
    icon: <BrandWhatsAppIcon />,
  },
]

type NavProps = ComponentProps<typeof Dock> & {
  title: string
  previous?: string
  next?: string
}

export const Nav = ({ title, previous, next, ...props }: NavProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const currentUrl = encodeURIComponent(`${config.site.url}${pathname}`)
  const shareTitle = encodeURIComponent(`${title} — ${config.site.name}`)

  const actions: (null | NavItemProps)[] = [
    {
      icon: <LinkIcon />,
      tooltip: "Copy Link",
      shortcut: "C",
      onClick: () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard")
      },
    },
  ]

  console.log(previous)

  if (previous || next) {
    actions.push(
      null,
      {
        icon: <ArrowLeftIcon />,
        tooltip: "Previous Tool",
        shortcut: "←",
        hotkey: "ArrowLeft",
        isDisabled: !previous,
        onClick: () => router.push(`/${previous}`),
      },
      {
        icon: <ArrowRightIcon />,
        tooltip: "Next Tool",
        shortcut: "→",
        hotkey: "ArrowRight",
        isDisabled: !next,
        onClick: () => router.push(`/${next}`),
      },
    )
  }

  return (
    <TooltipProvider delayDuration={0} disableHoverableContent>
      <Dock {...props}>
        {actions.map((action, i) => (
          <Fragment key={i}>
            {!action && <DockSeparator />}
            {action && <NavItem {...action} />}
          </Fragment>
        ))}

        <DockSeparator />

        <Note className="mx-1 text-xs font-medium max-lg:hidden">Share:</Note>

        {shareOptions.map(({ platform, url, icon }) => (
          <Tooltip key={platform} tooltip={`Share on ${platform}`} sideOffset={0}>
            <DockItem asChild>
              <ExternalLink
                href={url(currentUrl, shareTitle)}
                eventName="click_share"
                eventProps={{ url: currentUrl, platform }}
              >
                <Slot.Root className="size-4">{icon}</Slot.Root>
              </ExternalLink>
            </DockItem>
          </Tooltip>
        ))}
      </Dock>
    </TooltipProvider>
  )
}
