import { PricingForm } from "~/app/admin/pricings/_components/pricing-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findAttributeList } from "~/server/admin/attributes/queries"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(() => {
  return (
    <Wrapper size="md" gap="sm">
      <PricingForm
        title="Create pricing"
        toolsPromise={findToolList()}
        attributesPromise={findAttributeList()}
      />
    </Wrapper>
  )
})

