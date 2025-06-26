import { getUrlHostname } from "@primoui/utils"
import { env } from "~/env"

export const siteConfig = {
  name: "Dirstarter",
  slug: "dirstarter",
  tagline: "Launch Your Directory Website and Start Making Money Today",
  description:
    "The complete boilerplate for building profitable directory websites. Start generating revenue from day one with our battle-tested stack and built-in monetization features.",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,
  domain: getUrlHostname(env.NEXT_PUBLIC_SITE_URL),
}
