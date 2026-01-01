import { notFound } from "next/navigation"
import { ShopForm } from "~/app/admin/shops/_components/shop-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findShopBySlug } from "~/server/admin/shops/queries"
import { findLocationList } from "~/server/admin/locations/queries"
import { findShopCategoryList } from "~/server/admin/categories/queries"

export default withAdminPage(async ({ params }: PageProps<"/admin/shops/[slug]">) => {
  const { slug } = await params
  const shop = await findShopBySlug(slug)

  if (!shop) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <ShopForm title="Update shop" shop={shop} locationsPromise={findLocationList()} categoriesPromise={findShopCategoryList()} />
    </Wrapper>
  )
})
