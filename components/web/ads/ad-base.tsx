import { isExternalUrl, removeQueryParams, setQueryParams } from "@primoui/utils"
import type { AdType } from "@prisma/client"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { ExternalLink } from "~/components/web/external-link"
import { cx } from "~/lib/utils"
import type { AdOne } from "~/server/web/ads/payloads"

type AdLinkProps = ComponentProps<typeof ExternalLink> & {
  ad: AdOne
  type?: AdType
  source?: string
  params?: Record<string, string | number | boolean>
}

/**
 * Base link component for ads that handles all tracking and link logic
 */
const AdLink = ({ ad, type, source, params, ...props }: AdLinkProps) => {
  const url = removeQueryParams(ad.websiteUrl)
  const isInternal = !isExternalUrl(url)

  return (
    <ExternalLink
      href={setQueryParams(ad.websiteUrl, Object.assign(isInternal ? { type } : {}, params))}
      target={isInternal ? "_self" : "_blank"}
      eventName="click_ad"
      eventProps={{ url, type, source }}
      doFollow
      doTrack
      {...props}
    />
  )
}

/**
 * Consistent ad badge component
 */
const AdBadge = ({ className, ...props }: ComponentProps<typeof Badge>) => {
  return (
    <Badge variant="outline" className={cx("text-muted-foreground/75", className)} {...props}>
      Ad
    </Badge>
  )
}

export { AdLink, AdBadge }
