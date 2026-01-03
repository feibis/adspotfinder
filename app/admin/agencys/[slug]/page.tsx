import { notFound } from "next/navigation"
import { AgencyForm } from "~/app/admin/agencys/_components/agency-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findAgencyBySlug } from "~/server/admin/agencys/queries"
import { findLocationList } from "~/server/admin/locations/queries"
import { findAgencyCategoryList } from "~/server/admin/categories/queries"

export default withAdminPage(async ({ params }: PageProps<"/admin/agencys/[slug]">) => {
  const { slug } = await params
  const agency = await findAgencyBySlug(slug)

  if (!agency) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <AgencyForm title="Update agency" agency={agency} locationsPromise={findLocationList()} categoriesPromise={findAgencyCategoryList()} />
    </Wrapper>
  )
})
