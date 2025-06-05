import type { Stripe } from "stripe"
import { stripe } from "~/services/stripe"

const products: Stripe.ProductCreateParams[] = [
  {
    name: "Free Listing",
    description: "Free listing with a wait time and a direct link to your website.",
    active: true,
    metadata: {},
    marketing_features: [
      { name: "• {queue} processing time" },
      { name: "✗ No content updates" },
      { name: "✗ Do-follow link to your website" },
      { name: "✗ No featured spot" },
      { name: "✗ No prominent placement" },
    ],
  },
  {
    name: "Expedited Listing",
    description: "Skip the queue and get your site published on the site within 24 hours.",
    active: true,
    metadata: { label: "Expedite Listing" },
    marketing_features: [
      { name: "✓ 24h processing time" },
      { name: "✓ Unlimited content updates" },
      { name: "✗ Do-follow link to your website" },
      { name: "✗ No featured spot" },
      { name: "✗ No prominent placement" },
    ],
  },
  {
    name: "Featured Listing",
    description: "Featured listing with a homepage spot and a prominent placement.",
    active: true,
    metadata: { label: "Feature Listing" },
    marketing_features: [
      { name: "✓ 12h processing time" },
      { name: "✓ Unlimited content updates" },
      { name: "✓ Do-follow link to your website" },
      { name: "✓ Featured spot on homepage" },
      { name: "✓ Prominent placement" },
    ],
  },
]

const prices: (Stripe.PriceCreateParams & { productName: string })[] = [
  {
    // Free Listing - $0.00
    productName: "Free Listing",
    unit_amount: 0,
    currency: "usd",
  },
  {
    // Expedited Listing - $97.00
    productName: "Expedited Listing",
    unit_amount: 9700,
    currency: "usd",
  },
  {
    // Featured Listing - Monthly $197.00
    productName: "Featured Listing",
    unit_amount: 19700,
    currency: "usd",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
  },
  {
    // Featured Listing - Yearly $1,970.00
    productName: "Featured Listing",
    unit_amount: 197000,
    currency: "usd",
    recurring: {
      interval: "year",
      interval_count: 1,
    },
  },
]

async function main() {
  const createdProducts = new Map<string, string>()

  try {
    // Create products
    for (const productData of products) {
      const product = await stripe.products.create(productData)
      createdProducts.set(productData.name, product.id)
    }

    // Create prices
    for (const { productName, ...priceData } of prices) {
      const productId = createdProducts.get(productName)

      if (!productId) {
        console.error(`❌ Product not found: ${productName}`)
        continue
      }

      await stripe.prices.create(priceData)
    }

    console.log("🎉 All products and prices replicated successfully!")
  } catch (error) {
    console.error("❌ Error replicating products:", error)
    process.exit(1)
  }
}

main().catch(console.error)
