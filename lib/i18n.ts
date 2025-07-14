import { getRequestConfig } from "next-intl/server"

export const locales = ["en"] as const
export const defaultLocale = "en" as const

export type Locale = (typeof locales)[number]

export default getRequestConfig(async () => {
  const locale = "en"
  const timeZone = "America/New_York"
  const messages = (await import(`../messages/${locale}.json`)).default

  return { locale, timeZone, messages }
})
