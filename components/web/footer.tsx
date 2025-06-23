"use client"

import { formatNumber } from "@primoui/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { H5, H6 } from "~/components/common/heading"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { BuiltWith } from "~/components/web/built-with"
import { CTAForm } from "~/components/web/cta-form"
import { ExternalLink } from "~/components/web/external-link"
import { ThemeSwitcher } from "~/components/web/theme-switcher"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"

type FooterProps = ComponentProps<"div"> & {
  hideCTA?: boolean
}

export const Footer = ({ children, className, hideCTA, ...props }: FooterProps) => {
  return (
    <footer className="flex flex-col gap-y-8 mt-auto pt-8 border-t border-foreground/10 md:pt-10 lg:pt-12">
      <div
        className={cx("grid grid-cols-3 gap-y-8 gap-x-4 md:gap-x-6 md:grid-cols-16", className)}
        {...props}
      >
        <Stack
          direction="column"
          className="flex flex-col items-start gap-4 col-span-full md:col-span-6"
        >
          <Stack size="lg" direction="column" className="min-w-0 max-w-64">
            <H5 as="strong" className="px-0.5">
              Subscribe to our newsletter
            </H5>

            <Note className="-mt-2 px-0.5 first:mt-0">
              Join {formatNumber(5000, "standard")}+ other members and get updates straight to your
              inbox.
            </Note>

            <CTAForm />
          </Stack>

          <Stack className="text-lg opacity-75">
            <Tooltip tooltip="Toggle theme">
              <ThemeSwitcher />
            </Tooltip>

            <Tooltip tooltip="RSS Feed">
              <ExternalLink href={config.links.feed} className={navLinkVariants()}>
                <RssIcon />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="Contact us">
              <ExternalLink href={`mailto:${config.site.email}`} className={navLinkVariants()}>
                <AtSignIcon />
              </ExternalLink>
            </Tooltip>

            <Tooltip tooltip="View source code">
              <ExternalLink href={config.links.github} className={navLinkVariants()}>
                <BrandGitHubIcon />
              </ExternalLink>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="column" className="text-sm md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavLink href="/">Tools</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/tags">Tags</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/submit">Submit</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
        </Stack>
      </div>

      <BuiltWith medium="footer" />

      {children}
    </footer>
  )
}
