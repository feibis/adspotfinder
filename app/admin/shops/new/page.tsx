import { ShopForm } from "~/app/admin/shops/_components/shop-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findLocationList } from "~/server/admin/locations/queries"
import { findShopCategoryList } from "~/server/admin/categories/queries"

export default withAdminPage(() => {
  return (
    <Wrapper size="md" gap="sm">
      <ShopForm title="Create shop" locationsPromise={findLocationList()} categoriesPromise={findShopCategoryList()} />
    </Wrapper>
  )
})
