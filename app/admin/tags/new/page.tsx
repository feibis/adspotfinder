import { TagForm } from "~/app/admin/tags/_components/tag-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

const CreateTagPage = () => {
  return (
    <Wrapper size="md" gap="sm">
      <TagForm title="Create tag" toolsPromise={findToolList()} />
    </Wrapper>
  )
}

export default withAdminPage(CreateTagPage)
