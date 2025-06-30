import type { ComponentProps } from "react"
import { Listing } from "~/components/web/listing"
import { ToolList, ToolListSkeleton } from "~/components/web/tools/tool-list"
import { findTools } from "~/server/web/tools/queries"

type FeaturedToolsProps = ComponentProps<typeof Listing>

const FeaturedTools = async ({ title = "Featured Tools", ...props }: FeaturedToolsProps) => {
  const tools = await findTools({ where: { isFeatured: true } })

  if (!tools.length) {
    return null
  }

  return (
    <Listing title={title} {...props}>
      <ToolList tools={tools} enableAds={false} />
    </Listing>
  )
}

const FeaturedToolsSkeleton = ({ title = "Featured Tools", ...props }: FeaturedToolsProps) => {
  return (
    <Listing title={title} {...props}>
      <ToolListSkeleton />
    </Listing>
  )
}

export { FeaturedTools, FeaturedToolsSkeleton }
