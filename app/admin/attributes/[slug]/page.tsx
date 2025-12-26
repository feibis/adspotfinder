import { notFound } from "next/navigation"
import { AttributeForm } from "~/app/admin/attributes/_components/attribute-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findAttributeBySlug, findAttributeGroupList } from "~/server/admin/attributes/queries"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(async ({ params }: PageProps<"/admin/attributes/[slug]">) => {
  const { slug } = await params
  const attribute = await findAttributeBySlug(slug)

  if (!attribute) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <AttributeForm
        title="Update attribute"
        attribute={attribute}
        groupsPromise={findAttributeGroupList()}
        toolsPromise={findToolList()}
      />
    </Wrapper>
  )
})

