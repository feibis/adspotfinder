import { eachDayOfInterval, format, isSameDay, startOfDay, subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import { Chart, type ChartData } from "~/app/admin/_components/chart"
import { StatCardHeader } from "~/app/admin/_components/stat-card-header"
import { Card } from "~/components/common/card"
import { db } from "~/services/db"

const getUsers = async () => {
  "use cache"

  cacheTag("users")
  cacheLife("minutes")

  const users = await db.user.findMany({
    where: { createdAt: { gte: startOfDay(subDays(new Date(), 30)) } },
  })

  const results: ChartData[] = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date(),
  }).map(day => ({
    date: format(day, "yyyy-MM-dd"),
    value: users.filter(user => isSameDay(user.createdAt, day)).length,
  }))

  const totalUsers = users.length
  const averageUsers = results.reduce((sum, day) => sum + day.value, 0) / results.length

  return {
    results,
    totalUsers,
    averageUsers,
  }
}

const UsersCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalUsers, averageUsers } = await getUsers()

  return (
    <Card hover={false} focus={false} {...props}>
      <StatCardHeader title="Users" value={totalUsers.toLocaleString()} note="last 30 days" />

      <Chart
        data={results}
        dataLabel="User"
        average={averageUsers}
        className="w-full"
        cellClassName="bg-chart-1"
      />
    </Card>
  )
}

export { UsersCard }
