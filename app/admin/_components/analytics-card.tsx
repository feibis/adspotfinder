import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import { Chart } from "~/app/admin/_components/chart"
import { StatCardHeader } from "~/app/admin/_components/stat-card-header"
import { Card } from "~/components/common/card"
import { getTotalAnalytics } from "~/lib/analytics"

const getAnalytics = async () => {
  "use cache"

  cacheTag("analytics")
  cacheLife("minutes")

  return await getTotalAnalytics()
}

const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalVisitors, averageVisitors } = await getAnalytics()

  return (
    <Card hover={false} focus={false} {...props}>
      <StatCardHeader title="Visitors" value={totalVisitors.toLocaleString()} note="last 30 days" />

      <Chart
        data={results}
        dataLabel="Visitor"
        average={averageVisitors}
        className="w-full"
        cellClassName="bg-chart-4"
      />
    </Card>
  )
}

export { AnalyticsCard }
