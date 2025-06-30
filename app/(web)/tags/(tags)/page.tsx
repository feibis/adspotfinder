import type { Metadata } from "next"
import type { SearchParams } from "nuqs"
import { Suspense } from "react"
import { TagListSkeleton } from "~/components/web/tags/tag-list"
import { TagQuery } from "~/components/web/tags/tag-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Browse Tags",
  openGraph: { ...metadataConfig.openGraph, url: "/tags" },
  alternates: { ...metadataConfig.alternates, canonical: "/tags" },
}

export default function Tags(props: PageProps) {
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
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
      </Intro>

      <Suspense fallback={<TagListSkeleton />}>
        <TagQuery searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
