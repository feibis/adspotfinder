import { redirect } from "next/navigation"
import { createLoader, parseAsString, type SearchParams } from "nuqs/server"
import type { ComponentProps } from "react"
import type { Stripe } from "stripe"
import { ProductList } from "~/components/web/products/product-list"
import { getProductsWithPrices, sortProductsByPrice } from "~/lib/products"
import { stripe } from "~/services/stripe"

type ProductQueryProps = Omit<ComponentProps<typeof ProductList>, "products" | "coupon"> & {
  searchParams: Promise<SearchParams>
  filter?: (product: Stripe.Product) => boolean
  mapper?: (product: Stripe.Product) => Stripe.Product
}

export const ProductQuery = async ({
  searchParams,
  filter,
  mapper,
  ...props
}: ProductQueryProps) => {
  const loadSearchParams = createLoader({ discountCode: parseAsString.withDefault("") })
  const { discountCode } = await loadSearchParams(searchParams)

  const [stripeProducts, stripePromo] = await Promise.all([
    // Products
    stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    }),

    // Promotion code
    discountCode
      ? stripe.promotionCodes.list({
          code: String(discountCode),
          limit: 1,
          active: true,
          expand: ["data.coupon.applies_to"],
        })
      : undefined,
  ])

  const coupon = stripePromo?.data[0]?.coupon
  const products = sortProductsByPrice(stripeProducts.data)
  const filteredProducts = filter ? products.filter(filter) : products
  const mappedProducts = mapper ? filteredProducts.map(mapper) : filteredProducts

  // If there are no products, redirect to the success page
  if (mappedProducts.length === 0) {
    redirect(props.successUrl)
  }

  return <ProductList products={await getProductsWithPrices(mappedProducts, coupon)} {...props} />
}
