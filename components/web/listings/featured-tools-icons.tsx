import { removeQueryParams } from "@primoui/utils"
import { PlusIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"
import type { ComponentProps } from "react"
import { Card } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { ToolHoverCard } from "~/components/web/tools/tool-hover-card"
import { Favicon } from "~/components/web/ui/favicon"
import { siteConfig } from "~/config/site"
import { findTools } from "~/server/web/tools/queries"

export const FeaturedToolsIcons = async ({ ...props }: ComponentProps<typeof Card>) => {
  const t = await getTranslations("components.featured_tools")
  const tools = await findTools({ where: { isFeatured: true } })
  const showAddButton = tools.length < 12

  if (!tools.length) {
    return null
  }

  return (
    <Card hover={false} focus={false} {...props}>
      <Stack size="sm" direction="column">
        <H5 as="strong">{t("title")}</H5>
        <Note>{t("description", { siteName: siteConfig.name })}</Note>
      </Stack>

      <Stack className="gap-[7px]">
        {tools.map(tool => (
          <ToolHoverCard key={tool.slug} tool={tool}>
            <ExternalLink
              href={tool.affiliateUrl || tool.websiteUrl}
              doFollow={tool.isFeatured}
              doTrack
              eventName="click_website"
              eventProps={{
                url: removeQueryParams(tool.websiteUrl),
                isFeatured: tool.isFeatured,
                source: "supporter",
              }}
              className="hover:*:bg-muted"
            >
              <Favicon
                src={tool.faviconUrl || "/favicon.png"}
                title={tool.name}
                className="size-10 p-1.5 rounded-lg"
                contained
              />
            </ExternalLink>
          </ToolHoverCard>
        ))}

        {showAddButton && (
          <Tooltip tooltip={t("add_tooltip")}>
            <Link
              href="/submit"
              className="grid place-items-center size-10 p-1 rounded-lg border hover:bg-muted"
            >
              <PlusIcon className="size-6" />
            </Link>
          </Tooltip>
        )}
      </Stack>
    </Card>
  )
}
