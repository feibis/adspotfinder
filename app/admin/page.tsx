import { AnalyticsCard } from "~/app/admin/_components/analytics-card"
import { RevenueCard } from "~/app/admin/_components/revenue-card"
import { ScheduledCard } from "~/app/admin/_components/scheduled-card"
import { StatsCard } from "~/app/admin/_components/stats-card"
import { SubscribersCard } from "~/app/admin/_components/subscribers-card"
import { UsersCard } from "~/app/admin/_components/users-card"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { H3 } from "~/components/common/heading"
import { Wrapper } from "~/components/common/wrapper"

export default withAdminPage(() => {
  return (
    <Wrapper size="lg" gap="xs">
      <H3>Dashboard</H3>

      <div className="flex flex-col gap-4 lg:col-span-3">
        <div className="grid grid-cols-2xl gap-4">
          <AnalyticsCard />
          <RevenueCard />
          <SubscribersCard />
          <UsersCard />
        </div>

        <div className="flex flex-wrap gap-4">
          <StatsCard />
        </div>

        <ScheduledCard />
      </div>
    </Wrapper>
  )
})
