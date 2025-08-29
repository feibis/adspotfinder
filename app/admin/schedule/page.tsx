import { Calendar } from "~/app/admin/schedule/calendar"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { H3 } from "~/components/common/heading"
import { Wrapper } from "~/components/common/wrapper"
import { findScheduledTools } from "~/server/admin/tools/queries"

export default withAdminPage(async () => {
  const tools = await findScheduledTools()

  return (
    <Wrapper size="lg" gap="xs">
      <H3>Schedule</H3>

      <Calendar tools={tools} className="w-full" />
    </Wrapper>
  )
})
