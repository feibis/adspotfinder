"use server"

import { z } from "zod/v4"
import { adminActionClient } from "~/lib/safe-actions"
import { reportSchema } from "~/server/admin/reports/schema"
import { db } from "~/services/db"

export const updateReport = adminActionClient
  .inputSchema(reportSchema)
  .action(async ({ parsedInput: { id, ...input } }) => {
    const report = await db.report.update({
      where: { id },
      data: input,
    })

    return report
  })

export const deleteReports = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids } }) => {
    await db.report.deleteMany({
      where: { id: { in: ids } },
    })

    return true
  })
