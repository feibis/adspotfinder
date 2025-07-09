import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { Grid } from "~/components/web/ui/grid"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolListProps = ComponentProps<typeof Grid> & {
  tools: ToolMany[]
}

const ToolList = ({ children, tools, ...props }: ToolListProps) => {
  return (
    <Grid {...props}>
      {tools.map((tool, order) => (
        <ToolCard key={tool.slug} tool={tool} style={{ order }} />
      ))}

      {tools.length ? children : <EmptyList>No tools found for the given filters.</EmptyList>}
    </Grid>
  )
}

const ToolListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <Grid>
      {[...Array(count)].map((_, index) => (
        <ToolCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { ToolList, ToolListSkeleton, type ToolListProps }
