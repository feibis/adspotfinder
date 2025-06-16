import { notFound } from "next/navigation"
import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findToolBySlug } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const UpdateToolPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findToolBySlug(slug)

  if (!tool) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <ToolForm title={`Edit ${tool.name}`} tool={tool} categories={findCategoryList()} />
    </Wrapper>
  )
}

export default withAdminPage(UpdateToolPage)
