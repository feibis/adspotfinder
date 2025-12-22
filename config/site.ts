import { getDomain } from "@primoui/utils"
import { env } from "~/env"

export const siteConfig = {
  name: "Litelocker",
  slug: "litelocker",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,
  domain: getDomain(env.NEXT_PUBLIC_SITE_URL),
}
