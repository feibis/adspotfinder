"use client"

import { isExternalUrl, setQueryParams } from "@primoui/utils"
import { type Properties, posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { siteConfig } from "~/config/site"

type ExternalLinkProps = ComponentProps<"a"> & {
  doTrack?: boolean
  doFollow?: boolean
  eventName?: string
  eventProps?: Properties
}

export const ExternalLink = ({
  href,
  target = "_blank",
  doTrack = false,
  doFollow = false,
  eventName,
  eventProps,
  ...props
}: ExternalLinkProps) => {
  const addTracking = doTrack && !href?.includes("utm_")
  const finalHref = addTracking ? setQueryParams(href!, { utm_source: siteConfig.domain }) : href
  const isExternal = isExternalUrl(finalHref)

  return (
    <a
      href={finalHref!}
      target={target}
      rel={`noopener${doFollow ? "" : " nofollow"}`}
      onClick={() => isExternal && eventName && posthog.capture(eventName, eventProps)}
      {...props}
    />
  )
}
