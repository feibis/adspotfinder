import { removeQueryParams } from "@primoui/utils"
import { ArrowUpRightIcon, HashIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import { ToolStatus } from "~/.generated/prisma/client"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { H2, H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { FeaturedToolsIcons } from "~/components/web/listings/featured-tools-icons"
import { RelatedTools, RelatedToolsSkeleton } from "~/components/web/listings/related-tools"
import { Markdown } from "~/components/web/markdown"
import { Nav } from "~/components/web/nav"
import { OverlayImage } from "~/components/web/overlay-image"
import { ToolActions } from "~/components/web/tools/tool-actions"
import { ToolPreviewAlert } from "~/components/web/tools/tool-preview-alert"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Favicon } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { Sticky } from "~/components/web/ui/sticky"
import { Tag } from "~/components/web/ui/tag"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { metadataConfig } from "~/config/metadata"
import { getOpenGraphImageUrl } from "~/lib/opengraph"
import {
  createGraph,
  generateBreadcrumbs,
  generateSoftwareApplication,
  generateWebPage,
  getOrganization,
  getWebSite,
} from "~/lib/structured-data"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findTool, findToolSlugs } from "~/server/web/tools/queries"

type Props = PageProps<"/[slug]">

const getTool = cache(async ({ params }: Props) => {
  const { slug } = await params
  const tool = await findTool({ where: { slug } })

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne) => {
  return {
    url: `/${tool.slug}`,
    title: `${tool.name}: ${tool.tagline}`,
    description: tool.description,
  }
}

const getBreadcrumbs = (tool: ToolOne) => {
  return [
    { name: "Tools", url: "/" },
    { name: tool.name, url: `/${tool.slug}` },
  ]
}

const getStructuredData = (tool: ToolOne) => {
  const breadcrumbs = getBreadcrumbs(tool)
  const { url, title, description } = getMetadata(tool)

  return createGraph([
    getOrganization(),
    getWebSite(),
    generateBreadcrumbs(breadcrumbs),
    generateSoftwareApplication(tool),
    generateWebPage(url, title, description, `${url}#software`),
  ])
}

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({})
  return tools.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const tool = await getTool(props)
  const { url, title, description } = getMetadata(tool)
  const { name, faviconUrl } = tool
  const ogImageUrl = getOpenGraphImageUrl({ title: name, description, faviconUrl })

  return {
    title,
    description,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url, images: [{ url: ogImageUrl }] },
  }
}

export default async function (props: Props) {
  const tool = await getTool(props)
  const structuredData = getStructuredData(tool)
  const { title } = getMetadata(tool)

  const [previous, next] = await Promise.all([
    findTool({
      where: { createdAt: { lt: tool.createdAt }, status: ToolStatus.Published },
      orderBy: { createdAt: "desc" },
    }),

    findTool({
      where: { createdAt: { gt: tool.createdAt }, status: ToolStatus.Published },
      orderBy: { createdAt: "asc" },
    }),
  ])

  return (
    <>
      <Section>
        <Section.Content className="max-md:contents">
          <Sticky isOverlay>
            <Stack className="self-stretch">
              <Favicon src={tool.faviconUrl} title={tool.name} className="size-8" />

              <Stack className="flex-1 min-w-0">
                <H2 as="h1" className="leading-tight! truncate">
                  {tool.name}
                </H2>

                {tool.ownerId && <VerifiedBadge size="lg" />}
              </Stack>

              <Backdrop />
            </Stack>
          </Sticky>

          {tool.description && (
            <IntroDescription className="-mt-fluid-md pt-4">{tool.description}</IntroDescription>
          )}

          {isToolPublished(tool) && (
            <Stack className="w-full -mt-fluid-md pt-8">
              <Button suffix={<ArrowUpRightIcon />} className="md:min-w-36" asChild>
                <ExternalLink
                  href={tool.affiliateUrl || tool.websiteUrl}
                  doFollow={tool.isFeatured}
                  doTrack
                  eventName="click_website"
                  eventProps={{
                    url: removeQueryParams(tool.websiteUrl),
                    isFeatured: tool.isFeatured,
                    source: "button",
                  }}
                >
                  Visit {tool.name}
                </ExternalLink>
              </Button>
            </Stack>
          )}

          <ToolPreviewAlert tool={tool} className="self-stretch max-md:order-2" />

          {isToolPublished(tool) && tool.screenshotUrl && (
            <OverlayImage
              href={tool.affiliateUrl || tool.websiteUrl}
              doFollow={tool.isFeatured}
              eventName="click_website"
              eventProps={{
                url: removeQueryParams(tool.websiteUrl),
                isFeatured: tool.isFeatured,
                source: "image",
              }}
              src={tool.screenshotUrl}
              alt={`Screenshot of ${tool.name} website`}
              loading="eager"
              className="self-stretch max-md:order-2"
            />
          )}

          {tool.content && <Markdown code={tool.content} className="max-md:order-4" />}

          {/* Categories */}
          {!!tool.categories.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-5">
              <H5 as="strong">Categories:</H5>

              <Stack className="gap-2">
                {tool.categories?.map(({ slug, name }) => (
                  <Badge key={slug} size="lg" asChild>
                    <Link href={`/categories/${slug}`}>{name}</Link>
                  </Badge>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Tags */}
          {!!tool.tags.length && (
            <Stack direction="column" className="w-full max-md:order-6">
              <H5 as="h4">Tags:</H5>

              <Stack>
                {tool.tags.map(tag => (
                  <Tag key={tag.slug} prefix={<HashIcon />} asChild>
                    <Link href={`/tags/${tag.slug}`}>{tag.slug}</Link>
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          <Stack className="w-full md:sticky md:bottom-2 md:z-10 max-md:order-7">
            <div className="absolute -inset-x-1 -bottom-3 -top-8 -z-1 pointer-events-none bg-background mask-t-from-66% max-md:hidden" />

            <Nav className="mr-auto" title={title} previous={previous?.slug} next={next?.slug} />

            <ToolActions tool={tool} />
          </Stack>
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          {/* Advertisement */}
          <Suspense fallback={<AdCardSkeleton className="max-md:order-3" />}>
            <AdCard type="ToolPage" className="max-md:order-3" />
          </Suspense>

          {/* Featured */}
          <Suspense>
            <FeaturedToolsIcons className="max-md:order-8" />
          </Suspense>
        </Section.Sidebar>
      </Section>

      {/* Related */}
      <Suspense fallback={<RelatedToolsSkeleton tool={tool} />}>
        <RelatedTools tool={tool} />
      </Suspense>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
