import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import type { ChartData } from "~/components/admin/chart"
import { MetricChart } from "~/components/admin/metrics/metric-chart"
import type { Card } from "~/components/common/card"
import { stripe } from "~/services/stripe"

const getRevenue = async () => {
  "use cache"

  cacheTag("revenue")
  cacheLife("minutes")

  try {
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))

    // Get balance charges for revenue data
    const { data } = await stripe.charges.list({
      created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
      limit: 100,
    })

    // Filter out non-successful and refunded charges
    const charges = data.filter(({ status, refunded }) => status === "succeeded" && !refunded)

    // Process daily revenue data
    const revenueByDate = charges.reduce<Record<string, number>>((acc, charge) => {
      const date = format(new Date(charge.created * 1000), "yyyy-MM-dd")
      const amount = Math.round(charge.amount / 100) // Convert from cents and round to 2 decimal places
      acc[date] = (acc[date] || 0) + amount
      return acc
    }, {})

    // Fill in missing dates with 0
    const results: ChartData[] = eachDayOfInterval({
      start: thirtyDaysAgo,
      end: new Date(),
    }).map(day => ({
      date: format(day, "yyyy-MM-dd"),
      value: revenueByDate[format(day, "yyyy-MM-dd")] || 0,
    }))

    // Calculate total revenue
    const totalRevenue = charges.reduce((sum, charge) => sum + Math.round(charge.amount / 100), 0)

    // Calculate average daily revenue
    const averageRevenue = results.reduce((sum, day) => sum + day.value, 0) / results.length

    return { results, totalRevenue, averageRevenue }
  } catch (error) {
    console.error("Revenue error:", error)
    return { results: [], totalRevenue: 0, averageRevenue: 0 }
  }
}

const RevenueMetric = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalRevenue, averageRevenue } = await getRevenue()

  return (
    <MetricChart
      header={{
        title: "Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        note: "last 30 days",
      }}
      chart={{
        data: results,
        dataPrefix: "$",
        average: averageRevenue,
        cellClassName: "bg-chart-5",
      }}
      {...props}
    />
  )
}

export { RevenueMetric }
