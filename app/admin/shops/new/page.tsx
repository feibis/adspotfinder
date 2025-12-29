import { ShopForm } from "~/app/admin/shops/_components/shop-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(() => {
  return (
    <Wrapper size="md" gap="sm">
      <ShopForm title="Create shop" toolsPromise={findToolList()} />
    </Wrapper>
  )
})
