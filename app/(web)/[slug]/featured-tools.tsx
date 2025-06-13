import { PlusIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { Card } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { ToolHoverCard } from "~/components/web/tools/tool-hover-card"
import { Favicon } from "~/components/web/ui/favicon"
import { siteConfig } from "~/config/site"
import { findTools } from "~/server/web/tools/queries"

export const FeaturedTools = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await findTools({ where: { isFeatured: true } })
  const showAddButton = tools.length < 12

  if (!tools.length) {
    return null
  }

  return (
    <Card hover={false} focus={false} {...props}>
      <Stack size="sm" direction="column">
        <H5 as="strong">Featured projects</H5>
        <Note>{siteConfig.name} is made possible by the following supporters:</Note>
      </Stack>

      <Stack className="gap-2">
        {tools.map(tool => (
          <ToolHoverCard key={tool.slug} tool={tool}>
            <ExternalLink
              href={tool.websiteUrl}
              doFollow={tool.isFeatured}
              eventName="click_website"
              eventProps={{
                url: tool.websiteUrl,
                isFeatured: tool.isFeatured,
                source: "supporter",
              }}
            >
              <Favicon
                src={tool.faviconUrl}
                title={tool.name}
                className="size-9 rounded-lg"
                contained
              />
            </ExternalLink>
          </ToolHoverCard>
        ))}

        {showAddButton && (
          <Tooltip tooltip="Get your project featured">
            <Link
              href="/submit"
              className="grid place-items-center size-9 p-1 rounded-lg border hover:bg-accent"
            >
              <PlusIcon className="size-6" />
            </Link>
          </Tooltip>
        )}
      </Stack>
    </Card>
  )
}
