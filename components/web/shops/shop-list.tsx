"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { ShopCard, ShopCardSkeleton } from "~/components/web/shops/shop-card"
import { Grid } from "~/components/web/ui/grid"
import { cx } from "~/lib/utils"
import type { ShopMany } from "~/server/web/shops/payloads"

type ShopListProps = ComponentProps<typeof Grid> & {
  shops: ShopMany[]
}

const ShopList = ({ shops, className, ...props }: ShopListProps) => {
  const t = useTranslations()

  return (
    <Grid className={cx("gap-x-8", className)} {...props}>
      {shops.map(shop => (
        <ShopCard key={shop.slug} shop={shop} />
      ))}

      {!shops.length && <EmptyList>{t("shops.no_shops")}</EmptyList>}
    </Grid>
  )
}

const ShopListSkeleton = () => {
  return (
    <Grid className="gap-x-8">
      {[...Array(24)].map((_, index) => (
        <ShopCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { ShopList, ShopListSkeleton, type ShopListProps }
