import type { Metadata } from "next"
import type { createTranslator, Messages } from "next-intl"
import { getTranslations } from "next-intl/server"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl, type OpenGraphParams } from "~/lib/opengraph"

type GetPageMetadataProps = {
  url: string
  ogImage?: OpenGraphParams
  metadata?: Metadata
}

/**
 * Get the metadata for a page
 * @param url - The URL of the page
 * @param title - The title of the page
 * @param description - The description of the page
 * @param metadata - The metadata for the page
 */
export const getPageMetadata = ({ url, ogImage, metadata }: GetPageMetadataProps) => {
  const defaultMetadata = Object.assign({}, metadataConfig, metadata)
  const { title, description, alternates, openGraph, ...rest } = defaultMetadata
  const ogImageUrl = getOpenGraphImageUrl(ogImage ?? { title: String(title), description })

  return {
    title,
    description,
    alternates: { ...alternates, canonical: url },
    openGraph: { ...openGraph, url, images: [{ url: ogImageUrl }] },
    ...rest,
  }
}

type TFunction = ReturnType<typeof createTranslator<Messages>>

/**
 * Get the metadata for a page with i18n
 * @param namespace - The namespace of the page
 * @param callback - The callback to get the metadata
 * @returns The metadata for the page
 */
export const getI18nMetadata = async <T extends Metadata>(
  namespace: string,
  callback: (t: TFunction) => T,
): Promise<T & { t: TFunction }> => {
  const t = await getTranslations(namespace)

  return { ...callback(t), t }
}
