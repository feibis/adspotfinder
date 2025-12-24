import { LocationForm } from "~/app/admin/locations/_components/location-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(() => {
  return (
    <Wrapper size="md" gap="sm">
      <LocationForm title="Create location" toolsPromise={findToolList()} />
    </Wrapper>
  )
})
