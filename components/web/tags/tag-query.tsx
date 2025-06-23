import type { SearchParams } from "nuqs"
import { Pagination } from "~/components/web/pagination"
import { TagList } from "~/components/web/tags/tag-list"
import { searchTags } from "~/server/web/tags/queries"
import { tagsSearchParamsCache } from "~/server/web/tags/schema"

type TagQueryProps = {
  searchParams: Promise<SearchParams>
}

const TagQuery = async ({ searchParams }: TagQueryProps) => {
  const parsedParams = tagsSearchParamsCache.parse(await searchParams)
  const { tags, total } = await searchTags(parsedParams, {})

  return (
    <>
      <TagList tags={tags} />
      <Pagination pageSize={parsedParams.perPage} total={total} currentPage={parsedParams.page} />
    </>
  )
}

export { TagQuery }
