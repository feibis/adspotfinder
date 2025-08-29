import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import { Chart, type ChartData } from "~/app/admin/_components/chart"
import { StatCardHeader } from "~/app/admin/_components/stat-card-header"
import { Card } from "~/components/common/card"
import { stripe } from "~/services/stripe"

const getRevenue = async () => {
  "use cache"

  cacheTag("revenue")
  cacheLife("minutes")

  try {
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))

    // Get balance charges for revenue data
    const { data: charges } = await stripe.charges.list({
      created: { gte: Math.floor(thirtyDaysAgo.getTime() / 1000) },
      limit: 100,
    })

    // Process daily revenue data
    const revenueByDate = charges
      .filter(({ status }) => status === "succeeded")
      .reduce<Record<string, number>>((acc, charge) => {
        const date = format(new Date(charge.created * 1000), "yyyy-MM-dd")
        const amount = charge.amount / 100 // Convert from cents
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
    const totalRevenue = charges.reduce((sum, charge) => sum + charge.amount / 100, 0)

    // Calculate average daily revenue
    const averageRevenue = results.reduce((sum, day) => sum + day.value, 0) / results.length

    return { results, totalRevenue, averageRevenue }
  } catch (error) {
    console.error("Revenue error:", error)
    return { results: [], totalRevenue: 0, averageRevenue: 0 }
  }
}

const RevenueCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalRevenue, averageRevenue } = await getRevenue()

  return (
    <Card hover={false} focus={false} {...props}>
      <StatCardHeader
        title="Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        note="last 30 days"
      />

      <Chart
        data={results}
        dataPrefix="$"
        average={averageRevenue}
        className="w-full"
        cellClassName="bg-chart-5"
      />
    </Card>
  )
}

export { RevenueCard }
