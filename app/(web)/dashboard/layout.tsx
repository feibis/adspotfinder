import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"

const url = "/dashboard"
const title = "Dashboard"
const description = `Manage your account and tools on ${config.site.name}.`
const ogImageUrl = getOpenGraphImageUrl({ title, description })

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <div className="flex flex-col gap-4">{children}</div>
    </>
  )
}
