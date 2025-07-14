"use server"

import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
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

    after(() => {
      revalidatePath("/admin/reports")
    })

    return report
  })

export const deleteReports = adminActionClient
  .inputSchema(z.object({ ids: z.array(z.string()) }))
  .action(async ({ parsedInput: { ids } }) => {
    await db.report.deleteMany({
      where: { id: { in: ids } },
    })

    after(() => {
      revalidatePath("/admin/reports")
    })

    return true
  })
