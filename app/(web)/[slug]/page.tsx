import { formatDate } from "@primoui/utils"
import { ToolStatus } from "@prisma/client"
import { ArrowUpRightIcon, ClockIcon, HashIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import { FeaturedTools } from "~/app/(web)/[slug]/featured-tools"
import { RelatedTools } from "~/app/(web)/[slug]/related-tools"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { H2, H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { Listing } from "~/components/web/listing"
import { Markdown } from "~/components/web/markdown"
import { Nav } from "~/components/web/nav"
import { OverlayImage } from "~/components/web/overlay-image"
import { ToolActions } from "~/components/web/tools/tool-actions"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Favicon } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { Tag } from "~/components/web/ui/tag"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { metadataConfig } from "~/config/metadata"
import { isToolPublished } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findTool, findToolSlugs } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findTool({ where: { slug } })

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne): Metadata => {
  return {
    title: `${tool.name}: ${tool.tagline}`,
    description: tool.description,
  }
}

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({})
  return tools.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/${tool.slug}`

  return {
    ...getMetadata(tool),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { url, type: "website" },
  }
}

export default async function ToolPage(props: PageProps) {
  const tool = await getTool(props)
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
    <div className="flex flex-col gap-12">
      <Section>
        <Section.Content className="max-md:contents">
          <div className="flex flex-1 flex-col items-start gap-6 max-md:order-1 md:gap-8">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Stack className="w-full">
                <Favicon src={tool.faviconUrl} title={tool.name} className="size-8" />

                <Stack className="flex-1 min-w-0">
                  <H2 as="h1" className="leading-tight! truncate">
                    {tool.name}
                  </H2>

                  {tool.ownerId && <VerifiedBadge size="lg" />}
                </Stack>
              </Stack>

              {tool.description && <IntroDescription>{tool.description}</IntroDescription>}
            </div>

            <Button suffix={<ArrowUpRightIcon />} asChild>
              <ExternalLink
                href={tool.affiliateUrl || tool.websiteUrl}
                doFollow={tool.isFeatured}
                eventName="click_website"
                eventProps={{ url: tool.websiteUrl, isFeatured: tool.isFeatured, source: "button" }}
              >
                Visit {tool.name}
              </ExternalLink>
            </Button>
          </div>

          {tool.screenshotUrl && (
            <OverlayImage
              href={tool.affiliateUrl || tool.websiteUrl}
              doFollow={tool.isFeatured}
              eventName="click_website"
              eventProps={{ url: tool.websiteUrl, isFeatured: tool.isFeatured, source: "image" }}
              src={tool.screenshotUrl}
              alt={`Screenshot of ${tool.name} website`}
              className="max-md:order-2"
            >
              Visit {tool.name}
            </OverlayImage>
          )}

          {tool.content && <Markdown code={tool.content} className="max-md:order-4" />}

          {/* Categories */}
          {!!tool.categories.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-5">
              <H5 as="strong">Categories:</H5>

              <Stack>
                {tool.categories?.map(({ slug, name }) => (
                  <Tag key={slug} href={`/categories/${slug}`} prefix={<HashIcon />}>
                    {name}
                  </Tag>
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
                  <Tag key={tag.slug} href={`/tags/${tag.slug}`} prefix={<HashIcon />}>
                    {tag.slug}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          <Stack className="relative w-full md:sticky md:-bottom-px md:py-2 md:bg-background max-md:order-7">
            <div className="absolute inset-x-0 bottom-full h-8 pointer-events-none bg-background mask-t-from-0 max-md:hidden" />

            <Nav
              className="mr-auto"
              title={`${title}`}
              previous={previous?.slug}
              next={next?.slug}
            />

            <ToolActions tool={tool} />
          </Stack>
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          {!isToolPublished(tool) && (
            <Card
              hover={false}
              focus={false}
              className="bg-yellow-500/10 border-foreground/10 max-md:order-first"
            >
              <H5>
                This is a preview only.{" "}
                {tool.publishedAt &&
                  `${tool.name} will be published on ${formatDate(tool.publishedAt)}`}
              </H5>

              <Note className="-mt-2">
                {tool.name} is not yet published and is only visible on this page. If you want to
                speed up the process, you can expedite the review below.
              </Note>

              <Button size="md" variant="fancy" prefix={<ClockIcon />} asChild>
                <Link href={`/submit/${tool.slug}`}>Publish within 24h</Link>
              </Button>
            </Card>
          )}

          {/* Advertisement */}
          {isToolPublished(tool) && (
            <Suspense fallback={<AdCardSkeleton className="max-md:order-3" />}>
              <AdCard type="ToolPage" className="max-md:order-3" />
            </Suspense>
          )}

          {/* Featured */}
          <Suspense>
            <FeaturedTools className="max-md:order-8" />
          </Suspense>
        </Section.Sidebar>
      </Section>

      {/* Related */}
      <Suspense
        fallback={
          <Listing title={`Similar to ${tool.name}:`}>
            <ToolListSkeleton count={3} />
          </Listing>
        }
      >
        <RelatedTools tool={tool} />
      </Suspense>
    </div>
  )
}
