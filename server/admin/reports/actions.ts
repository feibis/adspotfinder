"use server"

import { z } from "zod"
import { adminActionClient } from "~/lib/safe-actions"
import { reportSchema } from "~/server/admin/reports/schema"

export const updateReport = adminActionClient
  .inputSchema(reportSchema)
  .action(async ({ parsedInput: { id, ...input }, ctx: { db, revalidate } }) => {
    const report = await db.report.update({
      where: { id },
      data: input,
    })

    revalidate({
      paths: ["/admin/reports"],
    })

    return report
  })

export const deleteReports = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.report.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/reports"],
    })

    return true
  })
