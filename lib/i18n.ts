import { getRequestConfig } from "next-intl/server"
import type messages from "../messages/en"

export const locales = ["en"] as const
export const defaultLocale = "en" as const

export type Locale = (typeof locales)[number]
export type LocaleLoaders = Record<Locale, () => Promise<{ default: typeof messages }>>

const localeLoaders = {
  en: () => import("../messages/en"),
} satisfies LocaleLoaders

export const loadMessages = async (locale: Locale) => (await localeLoaders[locale]()).default

export default getRequestConfig(async () => {
  // TODO: get locale from headers or URL params
  const locale = defaultLocale
  const timeZone = "America/New_York"
  const messages = (await localeLoaders[locale]()).default

  return { locale, timeZone, messages }
})
