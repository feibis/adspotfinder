import { isExternalUrl } from "@primoui/utils"
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
}

/**
 * Base link component for ads that handles all tracking and link logic
 */
export const AdLink = ({ ad, type, source, ...props }: AdLinkProps) => {
  const isInternal = !isExternalUrl(ad.websiteUrl)

  return (
    <ExternalLink
      href={`${ad.websiteUrl}${isInternal ? `?type=${type}` : ""}`}
      target={isInternal ? "_self" : "_blank"}
      eventName="click_ad"
      eventProps={{ url: ad.websiteUrl, type, source }}
      doFollow
      doTrack
      {...props}
    />
  )
}

/**
 * Consistent ad badge component
 */
export const AdBadge = ({ className, ...props }: ComponentProps<typeof Badge>) => {
  return (
    <Badge variant="outline" className={cx("text-muted-foreground/75", className)} {...props}>
      Ad
    </Badge>
  )
}

