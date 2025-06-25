import { Listing } from "~/components/web/listing"
import { ToolList } from "~/components/web/tools/tool-list"
import { findTools } from "~/server/web/tools/queries"

export const FeaturedTools = async () => {
  const tools = await findTools({ where: { isFeatured: true } })

  if (!tools.length) {
    return null
  }

  return (
    <Listing title="Featured Tools">
      <ToolList tools={tools} enableAds={false} />
    </Listing>
  )
}
