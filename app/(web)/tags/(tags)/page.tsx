import type { Metadata } from "next"
import { Suspense } from "react"
import { TagListSkeleton } from "~/components/web/tags/tag-list"
import { TagQuery } from "~/components/web/tags/tag-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"

const url = "/tags"
const title = "Browse Tags"
const ogImageUrl = getOpenGraphImageUrl({ title })

export const metadata: Metadata = {
  title,
  alternates: { ...metadataConfig.alternates, canonical: url },
  openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
}

export default function (props: PageProps<"/tags">) {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/tags",
            name: "Tags",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
      </Intro>

      <Suspense fallback={<TagListSkeleton />}>
        <TagQuery searchParams={props.searchParams} options={{ enableFilters: true }} />
      </Suspense>
    </>
  )
}
