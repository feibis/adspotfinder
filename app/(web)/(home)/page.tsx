import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { StructuredData } from "~/components/web/structured-data"
import { siteConfig } from "~/config/site"
import { getPageData } from "~/lib/pages"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const title = `${siteConfig.name} - ${t("brand.tagline")}`
  const description = t("brand.description")

  return getPageData(siteConfig.url, title, description)
})

export default async function (props: PageProps<"/">) {
  const { structuredData } = await getData()

  return (
    <>
      <Hero />

      <StructuredData data={structuredData} />
    </>
  )
}
