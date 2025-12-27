import { notFound } from "next/navigation"
import { PricingForm } from "~/app/admin/pricings/_components/pricing-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findAttributeList } from "~/server/admin/attributes/queries"
import { findPricingById } from "~/server/admin/pricings/queries"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(async ({ params }: PageProps<"/admin/pricings/[id]">) => {
  const { id } = await params
  const pricing = await findPricingById(id)

  if (!pricing) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <PricingForm
        title="Update pricing"
        pricing={pricing}
        toolsPromise={findToolList()}
        attributesPromise={findAttributeList()}
      />
    </Wrapper>
  )
})

