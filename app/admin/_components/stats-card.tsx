import { StatCardHeader } from "~/app/admin/_components/stat-card-header"
import { Card } from "~/components/common/card"
import { Link } from "~/components/common/link"
import { db } from "~/services/db"

export const StatsCard = async () => {
  const stats = [
    { label: "Tools", href: "/admin/tools", query: () => db.tool.count() },
    { label: "Categories", href: "/admin/categories", query: () => db.category.count() },
    { label: "Users", href: "/admin/users", query: () => db.user.count() },
  ] as const

  const counts = await db.$transaction(stats.map(stat => stat.query()))

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={stat.label} className="w-fit grow" asChild>
          <Link href={stat.href}>
            <StatCardHeader title={stat.label} value={counts[index].toLocaleString()} />
          </Link>
        </Card>
      ))}
    </>
  )
}
