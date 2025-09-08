import type { ComponentProps, ReactNode } from "react"
import type { Stripe } from "stripe"
import { Product, ProductSkeleton } from "~/components/web/products/product"
import { getProductFeatures, type ProductFeature, type ProductWithPrices } from "~/lib/products"

type ProductListProps = Omit<
  ComponentProps<typeof Product>,
  "product" | "prices" | "coupon" | "isFeatured" | "features" | "buttonLabel"
> & {
  products: ProductWithPrices[]
  featuresMapper?: (product: Stripe.Product) => ProductFeature[]
  buttonLabel?: (product: Stripe.Product) => ReactNode
}

const ProductList = ({
  products,
  buttonLabel,
  featuresMapper = getProductFeatures,
  ...props
}: ProductListProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {products.map(({ product, prices, coupon, isFeatured }) => (
        <Product
          key={product.id}
          product={product}
          prices={prices}
          coupon={coupon}
          isFeatured={isFeatured}
          features={featuresMapper(product)}
          buttonLabel={buttonLabel?.(product)}
          {...props}
        />
      ))}
    </div>
  )
}

const ProductListSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {[...Array(3)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  )
}

export { ProductList, ProductListSkeleton }
