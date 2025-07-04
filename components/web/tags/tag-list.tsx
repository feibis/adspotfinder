import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { TagCard, TagCardSkeleton } from "~/components/web/tags/tag-card"
import { Grid } from "~/components/web/ui/grid"
import { cx } from "~/lib/utils"
import type { TagMany } from "~/server/web/tags/payloads"

type TagListProps = ComponentProps<typeof Grid> & {
  tags: TagMany[]
}

const TagList = ({ tags, className, ...props }: TagListProps) => {
  return (
    <Grid className={cx("md:gap-8", className)} {...props}>
      {tags.map(tag => (
        <TagCard key={tag.slug} tag={tag} />
      ))}

      {!tags.length && <EmptyList>No tags found.</EmptyList>}
    </Grid>
  )
}

const TagListSkeleton = () => {
  return (
    <Grid className="md:gap-8">
      {[...Array(24)].map((_, index) => (
        <TagCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { TagList, TagListSkeleton }
