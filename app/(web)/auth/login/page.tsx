import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Login } from "~/components/web/auth/login"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"

const url = "/auth/login"
const title = "Sign in"
const description = "Get access to the dashboard and manage your submitted tools."
const ogImageUrl = getOpenGraphImageUrl({ title, description })

export const metadata: Metadata = {
  title,
  description,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

export default function () {
  return (
    <>
      <Intro>
        <IntroTitle size="h3">{title}</IntroTitle>
        <IntroDescription className="md:text-sm">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LoaderIcon className="animate-spin mx-auto" />}>
        <Login />
      </Suspense>
    </>
  )
}
