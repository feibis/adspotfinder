import { notFound } from "next/navigation"
import { LocationForm } from "~/app/admin/locations/_components/location-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findLocationBySlug } from "~/server/admin/locations/queries"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(async ({ params }: PageProps<"/admin/locations/[slug]">) => {
  const { slug } = await params
  const location = await findLocationBySlug(slug)

  if (!location) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <LocationForm title="Update location" location={location} toolsPromise={findToolList()} />
    </Wrapper>
  )
})
