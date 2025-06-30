import { Listing } from "~/components/web/listing"
import { ToolList, ToolListSkeleton } from "~/components/web/tools/tool-list"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findRelatedTools } from "~/server/web/tools/queries"

const RelatedTools = async ({ tool }: { tool: ToolOne }) => {
  const tools = await findRelatedTools({ slug: tool.slug })

  if (!tools.length) {
    return null
  }

  return (
    <Listing title={`Similar to ${tool.name}`}>
      <ToolList tools={tools} enableAds={false} />
    </Listing>
  )
}

const RelatedToolsSkeleton = () => {
  return (
    <Listing title="Similar tools">
      <ToolListSkeleton count={3} />
    </Listing>
  )
}

export { RelatedTools, RelatedToolsSkeleton }
