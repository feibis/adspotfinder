"use client"

import { formatNumber } from "@primoui/utils"
import { AtSignIcon, RssIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { H5, H6 } from "~/components/common/heading"
import { BrandGitHubIcon } from "~/components/common/icons/brand-github"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { CTAForm } from "~/components/web/cta-form"
import { ExternalLink } from "~/components/web/external-link"
import { NavLink } from "~/components/web/ui/nav-link"
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
            <H5 as="strong" className="px-0.5 font-medium">
              Subscribe to our newsletter
            </H5>

            <Note className="-mt-2 px-0.5 first:mt-0">
              Join {formatNumber(5000, "standard")}+ other members and get updates straight to your
              inbox.
            </Note>

            <CTAForm />
          </Stack>

          <Stack className="text-sm/normal">
            <Tooltip tooltip="RSS Feed">
              <NavLink
                href={config.links.feed}
                target="_blank"
                rel="nofollow noreferrer"
                aria-label="RSS Feed"
              >
                <RssIcon className="size-[1.44em]" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="Contact us">
              <NavLink
                href={`mailto:${config.site.email}`}
                target="_blank"
                rel="nofollow noreferrer"
                aria-label="Contact us"
              >
                <AtSignIcon className="size-[1.44em] stroke-[1.25]" />
              </NavLink>
            </Tooltip>

            <Tooltip tooltip="View source code">
              <NavLink href={config.links.github} target="_blank" rel="nofollow noreferrer">
                <BrandGitHubIcon className="size-[1.44em] stroke-[1.25]" />
              </NavLink>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3 md:col-start-8">
          <H6 as="strong">Browse:</H6>

          <NavLink href="/">Tools</NavLink>
          <NavLink href="/categories">Categories</NavLink>
          <NavLink href="/tags">Tags</NavLink>
          <NavLink href="/blog">Blog</NavLink>
        </Stack>

        <Stack direction="column" className="text-sm/normal md:col-span-3">
          <H6 as="strong">Quick Links:</H6>

          <NavLink href="/submit">Submit</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/advertise">Advertise</NavLink>
        </Stack>
      </div>

      <Stack size="sm" className="w-full">
        <Note as="span">Built with</Note>

        <ExternalLink
          href={config.links.madeWith}
          className="contents font-medium text-sm text-foreground hover:text-secondary-foreground"
          doFollow
        >
          <svg
            viewBox="0 0 216 251"
            role="img"
            aria-label="Dirstarter Logo"
            className="h-4 w-auto fill-current"
          >
            <path d="M0 105v93c0 3.18.29 6.35 2.53 8.6l42.25 42.24C48.56 252.62 55 250.34 55 245v-93c0-3.19-1.05-6.36-3.31-8.62l-42.6-42.6C5.28 96.97-.02 99.64 0 105Zm74-49v132c0 3.18.79 6.14 3.03 8.38l42.25 42.24c3.77 3.78 10.72.73 10.72-4.62V103c0-3.18-1.55-6.5-3.8-8.76L83.56 51.62C79.8 47.84 74 50.66 74 56Zm74-50v155c0 3.18.84 6.6 3.08 8.85l54.99 54.98c3.78 3.78 9.93 1.02 9.93-4.33v-155c0-3.18-.76-6.1-3.01-8.36L157.62 1.77C153.84-2 148 .66 148 6Z" />
          </svg>
          Dirstarter
        </ExternalLink>
      </Stack>

      {children}
    </footer>
  )
}
