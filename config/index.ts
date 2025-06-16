import { adsConfig } from "~/config/ads"
import { breadcrumbsConfig } from "~/config/breadcrumbs"
import { claimsConfig } from "~/config/claims"
import { linksConfig } from "~/config/links"
import { metadataConfig } from "~/config/metadata"
import { siteConfig } from "~/config/site"
import { submissionsConfig } from "~/config/submissions"

export const config = {
  site: siteConfig,
  links: linksConfig,
  metadata: metadataConfig,
  ads: adsConfig,
  submissions: submissionsConfig,
  claims: claimsConfig,
  breadcrumbs: breadcrumbsConfig,
}
