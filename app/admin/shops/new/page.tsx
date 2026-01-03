import { AgencyForm } from "~/app/admin/agencys/_components/agency-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findLocationList } from "~/server/admin/locations/queries"
import { findAgencyCategoryList } from "~/server/admin/categories/queries"

export default withAdminPage(() => {
  return (
    <Wrapper size="md" gap="sm">
      <AgencyForm title="Create agency" locationsPromise={findLocationList()} categoriesPromise={findAgencyCategoryList()} />
    </Wrapper>
  )
})
