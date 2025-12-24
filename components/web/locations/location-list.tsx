"use client"

import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { LocationCard, LocationCardSkeleton } from "~/components/web/locations/location-card"
import { Grid } from "~/components/web/ui/grid"
import { cx } from "~/lib/utils"
import type { LocationMany } from "~/server/web/locations/payloads"

type LocationListProps = ComponentProps<typeof Grid> & {
  locations: LocationMany[]
}

const LocationList = ({ locations, className, ...props }: LocationListProps) => {
  const t = useTranslations()

  return (
    <Grid className={cx("gap-x-8", className)} {...props}>
      {locations.map(location => (
        <LocationCard key={location.slug} location={location} />
      ))}

      {!locations.length && <EmptyList>{t("locations.no_locations")}</EmptyList>}
    </Grid>
  )
}

const LocationListSkeleton = () => {
  return (
    <Grid className="gap-x-8">
      {[...Array(24)].map((_, index) => (
        <LocationCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { LocationList, LocationListSkeleton, type LocationListProps }
