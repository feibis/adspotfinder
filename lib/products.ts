import { addDays, differenceInMonths } from "date-fns"
import plur from "plur"
import type Stripe from "stripe"
import { submissionsConfig } from "~/config/submissions"
import { stripe } from "~/services/stripe"

const SYMBOLS = {
  positive: "✓ ",
  neutral: "• ",
  negative: "✗ ",
} as const

type SymbolType = keyof typeof SYMBOLS

export type ProductInterval = "month" | "year"

export type ProductFeature = {
  name: string
  footnote?: string
  type?: keyof typeof SYMBOLS
}

export type ProductWithPrices = {
  product: Stripe.Product
  prices: Stripe.Price[]
  coupon: Stripe.Coupon | undefined
  isFeatured: boolean
}

export const getQueueLength = (queueLength: number) => {
  const queueDays = Math.ceil((queueLength / submissionsConfig.postingRate) * 7)
  const queueMonths = Math.max(differenceInMonths(addDays(new Date(), queueDays), new Date()), 1)

  return `${queueMonths} ${plur("month", queueMonths)}`
}

const getFeatureType = (featureName?: string) => {
  return Object.keys(SYMBOLS).find(key => featureName?.startsWith(SYMBOLS[key as SymbolType])) as
    | SymbolType
    | undefined
}

const removeSymbol = (name: string, type?: SymbolType) => {
  return type ? name.replace(SYMBOLS[type], "") : name
}

/**
 * Get the price amount from a Stripe price object or string.
 *
 * @param price - The price to get the amount from.
 * @returns The price amount.
 */
const getPriceAmount = (price?: Stripe.Price | string | null) => {
  return typeof price === "object" && price !== null ? (price.unit_amount ?? 0) : 0
}

/*
 * Sort products by price
 */
export const sortProductsByPrice = (products: Stripe.Product[]) => {
  return products.sort((a, b) => getPriceAmount(a.default_price) - getPriceAmount(b.default_price))
}

/**
 * Get the tool listing products for pricing.
 *
 * @param products - The products to get for pricing.
 * @param isPublished - Whether the tool is published.
 * @returns The products for pricing.
 */
export const getListingProducts = (
  products: Stripe.Product[],
  coupon: Stripe.Coupon | undefined,
  isPublished: boolean,
) => {
  return (
    products
      // Filter out products that are not listings
      .filter(({ name }) => name.includes("Listing"))

      // Sort by price
      .sort((a, b) => getPriceAmount(a.default_price) - getPriceAmount(b.default_price))

      // Filter out expedited products if the tool is published
      .filter(({ name }) => !isPublished || !name.includes("Expedited"))

      // Filter out products that are not eligible for the coupon
      .filter(product => isProductDiscounted(product.id, coupon) || product.name.includes("Free"))

      // Clean up the name
      .map(({ name, ...product }) => ({ ...product, name: name.replace("Listing", "").trim() }))
  )
}

/**
 * Determine if a product should be featured in the UI.
 *
 * @param index - The index of the product in the list.
 * @param products - The list of all products.
 * @param coupon - The coupon being applied, if any.
 * @param isDiscounted - Whether the product is eligible for a discount.
 * @returns Whether the product should be featured.
 */
const isProductFeatured = (
  index: number,
  products: Stripe.Product[],
  coupon?: Stripe.Coupon,
  isDiscounted = true,
) => {
  if (!coupon) return index === products.length - 1

  const lastDiscountedIndex = getLastDiscountedProductIndex(products, coupon)
  return isDiscounted && index === lastDiscountedIndex
}

/**
 * Check if a product is eligible for a discount with the given coupon.
 *
 * @param productId - The ID of the product to check.
 * @param coupon - The coupon to check against.
 * @returns Whether the product is eligible for the discount.
 */
const isProductDiscounted = (productId: string, coupon?: Stripe.Coupon) => {
  return !coupon?.applies_to || coupon.applies_to.products.includes(productId)
}

/**
 * Find the index of the last discounted product in a list of products.
 *
 * @param products - The list of products to check.
 * @param coupon - The coupon to check against.
 * @returns The index of the last discounted product, or -1 if none are discounted.
 */
const getLastDiscountedProductIndex = (products: Stripe.Product[], coupon?: Stripe.Coupon) => {
  return products.reduce((lastId, p, id) => (isProductDiscounted(p.id, coupon) ? id : lastId), -1)
}

/**
 * Get the normalized features of a product.
 *
 * @param product - The product to get the features of.
 * @returns The normalized features of the product.
 */
export const getProductFeatures = (product: Stripe.Product) => {
  return product.marketing_features.map(feature => {
    const type = getFeatureType(feature.name)
    const name = removeSymbol(feature.name || "", type)

    return { name, type } satisfies ProductFeature
  })
}

/**
 * Get the features of a product.
 *
 * @param product - The product to get the features of.
 * @param isPublished - Whether the tool is published.
 * @param queue - The length of the queue.
 * @returns The features of the product.
 */
export const getProductListingFeatures = (
  product: Stripe.Product,
  isPublished: boolean,
  queue: number,
) => {
  const queueTemplate = "{queue}"
  const queueFootnote = "Calculated based on the number of tools in the queue."

  return getProductFeatures(product)
    .filter(({ name }) => !isPublished || !name.includes("processing time"))
    .map(({ name, type }) => {
      const isQueueFeature = name.includes(queueTemplate)

      return {
        type,
        name: isQueueFeature ? name.replace(queueTemplate, getQueueLength(queue)) : name,
        footnote: isQueueFeature ? queueFootnote : undefined,
      } satisfies ProductFeature
    })
}

/**
 * Fetch prices for a list of products and prepare them for display.
 *
 * @param products - The list of products to prepare.
 * @param coupon - The coupon being applied, if any.
 * @param stripe - The Stripe instance to use for fetching prices.
 * @returns A promise that resolves to an array of products with their prices and discount status.
 */
export const getProductsWithPrices = async (products: Stripe.Product[], coupon?: Stripe.Coupon) => {
  return Promise.all(
    products.map(async (product, index) => {
      const prices = await stripe.prices.list({ product: product.id, active: true })
      const isDiscounted = isProductDiscounted(product.id, coupon)

      return {
        product,
        prices: prices.data,
        coupon: isDiscounted ? coupon : undefined,
        isFeatured: isProductFeatured(index, products, coupon, isDiscounted),
      } satisfies ProductWithPrices
    }),
  )
}
