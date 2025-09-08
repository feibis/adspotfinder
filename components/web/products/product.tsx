"use client"

import { ArrowUpRightIcon, CheckIcon, XIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { posthog } from "posthog-js"
import { Slot } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { toast } from "sonner"
import type Stripe from "stripe"
import { Button } from "~/components/common/button"
import { Card, CardBg, type cardVariants } from "~/components/common/card"
import { H4, H5 } from "~/components/common/heading"
import { Ping } from "~/components/common/ping"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { IntervalSwitch } from "~/components/web/interval-switch"
import { Price } from "~/components/web/price"
import { useProductPrices } from "~/hooks/use-product-prices"
import type { ProductFeature } from "~/lib/products"
import { cva, cx, type VariantProps } from "~/lib/utils"
import { createStripeCheckout } from "~/server/web/actions/stripe"

const productVariants = cva({
  base: "items-stretch gap-8 basis-72 grow max-w-80 bg-transparent overflow-clip",
})

const productFeatureVariants = cva({
  base: "flex gap-3 text-sm",
})

const productFeatureCheckVariants = cva({
  base: "shrink-0 size-5 stroke-[3px] p-1 rounded-md",

  variants: {
    type: {
      positive: "bg-green-500/50",
      neutral: "bg-foreground/10",
      negative: "bg-foreground/10",
    },
  },
})

type ProductProps = ComponentProps<"div"> &
  VariantProps<typeof cardVariants> &
  VariantProps<typeof productVariants> & {
    /**
     * The product.
     */
    product: Stripe.Product

    /**
     * The features of the product.
     */
    features: ProductFeature[]

    /**
     * The prices of the product.
     */
    prices: Stripe.Price[]

    /**
     * The discount coupon.
     */
    coupon?: Stripe.Coupon

    /**
     * The metadata of the plan.
     */
    metadata?: Record<string, string>

    /**
     * Whether the product is featured.
     */
    isFeatured?: boolean

    /**
     * The URL to redirect to after a successful payment.
     */
    successUrl: string

    /**
     * The URL to redirect to after a canceled payment.
     */
    cancelUrl?: string

    /**
     * The label of the button.
     */
    buttonLabel?: ReactNode
  }

const Product = ({
  className,
  product,
  features,
  prices,
  coupon,
  metadata,
  isFeatured,
  successUrl,
  cancelUrl,
  buttonLabel,
  ...props
}: ProductProps) => {
  const { isSubscription, currentPrice, price, fullPrice, discount, interval, setInterval } =
    useProductPrices(prices, coupon)

  const { execute, isPending } = useAction(createStripeCheckout, {
    onSuccess: () => {
      posthog.capture("stripe_checkout", { product: product.name, ...metadata })
    },

    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  const onSubmit = () => {
    // Execute the action
    execute({
      line_items: [{ price: currentPrice.id, quantity: 1 }],
      mode: isSubscription ? "subscription" : "payment",
      coupon: coupon?.id,
      successUrl,
      cancelUrl,
    })
  }

  return (
    <Card
      hover={false}
      className={cx(productVariants({ className }), isFeatured && "lg:-my-3 lg:py-8")}
      {...props}
    >
      {isFeatured && <CardBg />}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <H4>{product.name}</H4>

          {isSubscription && prices.length > 1 && (
            <IntervalSwitch
              intervals={[
                { label: "Monthly", value: "month" },
                { label: "Yearly", value: "year" },
              ]}
              value={interval}
              onChange={setInterval}
              className="-my-0.5"
            />
          )}
        </div>

        {product.description && (
          <p className="text-foreground/50 text-sm text-pretty">{product.description}</p>
        )}
      </div>

      <Price
        price={price}
        fullPrice={fullPrice}
        interval={isSubscription ? "month" : "one-time"}
        discount={discount}
        coupon={coupon}
        format={{ style: "decimal", notation: "compact", maximumFractionDigits: 0 }}
        className="w-full"
        priceClassName="text-[3em]"
      />

      {!!features && (
        <Stack direction="column" className="my-auto flex-1 items-stretch">
          {features.map(({ type, name, footnote }) => (
            <div key={name} className={cx(productFeatureVariants())}>
              <Slot.Root className={cx(productFeatureCheckVariants({ type }))}>
                {type === "negative" ? <XIcon /> : <CheckIcon />}
              </Slot.Root>

              <span className={cx(type === "negative" && "opacity-50")}>{name}</span>

              {footnote && (
                <Tooltip tooltip={footnote} delayDuration={0}>
                  <Ping className="-ml-1 mt-1" />
                </Tooltip>
              )}
            </div>
          ))}
        </Stack>
      )}

      <Button
        type="button"
        variant={!price ? "secondary" : isFeatured ? "fancy" : "primary"}
        isPending={isPending}
        disabled={!price || isPending}
        suffix={!price ? <span /> : <ArrowUpRightIcon />}
        onClick={onSubmit}
      >
        {buttonLabel || "Buy Now"}
      </Button>
    </Card>
  )
}

const ProductSkeleton = () => {
  return (
    <Card hover={false} className={cx(productVariants())}>
      <div className="space-y-3">
        <H5>
          <Skeleton className="w-24">&nbsp;</Skeleton>
        </H5>

        <div className="flex flex-col gap-2">
          <Skeleton className="w-full h-4">&nbsp;</Skeleton>
          <Skeleton className="w-3/4 h-4">&nbsp;</Skeleton>
        </div>
      </div>

      <Skeleton className="w-1/4 h-[0.9em] text-[3em]">&nbsp;</Skeleton>

      <Stack direction="column" className="my-auto items-stretch">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={cx(productFeatureVariants())}>
            <div className={cx(productFeatureCheckVariants({ type: "neutral" }))}>&nbsp;</div>

            <Skeleton className="w-3/4">&nbsp;</Skeleton>
          </div>
        ))}
      </Stack>

      <Button variant="secondary" disabled>
        &nbsp;
      </Button>
    </Card>
  )
}

export { Product, ProductSkeleton, type ProductProps }
