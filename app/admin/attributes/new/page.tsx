import { AttributeForm } from "~/app/admin/attributes/_components/attribute-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findAttributeGroupList } from "~/server/admin/attributes/queries"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(() => {
  return (
    <Wrapper size="md" gap="sm">
      <AttributeForm
        title="Create attribute"
        groupsPromise={findAttributeGroupList()}
        toolsPromise={findToolList()}
      />
    </Wrapper>
  )
})

