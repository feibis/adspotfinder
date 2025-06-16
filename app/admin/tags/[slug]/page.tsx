import { notFound } from "next/navigation"
import { TagForm } from "~/app/admin/tags/_components/tag-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findTagBySlug } from "~/server/admin/tags/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const UpdateTagPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const tag = await findTagBySlug(slug)

  if (!tag) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <TagForm title="Update tag" tag={tag} tools={findToolList()} />
    </Wrapper>
  )
}

export default withAdminPage(UpdateTagPage)
