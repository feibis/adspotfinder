import { notFound } from "next/navigation"
import { ShopForm } from "~/app/admin/shops/_components/shop-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/common/wrapper"
import { findShopBySlug } from "~/server/admin/shops/queries"
import { findToolList } from "~/server/admin/tools/queries"

export default withAdminPage(async ({ params }: PageProps<"/admin/shops/[slug]">) => {
  const { slug } = await params
  const shop = await findShopBySlug(slug)

  if (!shop) {
    return notFound()
  }

  return (
    <Wrapper size="md" gap="sm">
      <ShopForm title="Update shop" shop={shop} toolsPromise={findToolList()} />
    </Wrapper>
  )
})
