import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { ReportType } from "@prisma/client"
import { sentenceCase } from "change-case"
import type { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { RadioGroup, RadioGroupItem } from "~/components/common/radio-group"
import { TextArea } from "~/components/common/textarea"
import { LoginDialog } from "~/components/web/auth/login-dialog"
import { useSession } from "~/lib/auth-client"
import { reportTool } from "~/server/web/actions/report"
import { reportToolSchema } from "~/server/web/shared/schema"
import type { ToolOne } from "~/server/web/tools/payloads"

type ToolReportDialogProps = {
  tool: ToolOne
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ToolReportDialog = ({ tool, isOpen, setIsOpen }: ToolReportDialogProps) => {
  const { data: session } = useSession()
  const resolver = zodResolver(reportToolSchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(reportTool, resolver, {
    formProps: {
      defaultValues: {
        toolSlug: tool.slug,
        type: ReportType.BrokenLink,
        message: "",
      },
    },

    actionProps: {
      onSuccess: () => {
        toast.success("Thank you for your report. We'll take a look at it shortly.")
        setIsOpen(false)
        form.reset()
      },

      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    },
  })

  if (!session?.user) {
    return <LoginDialog isOpen={isOpen} setIsOpen={setIsOpen} />
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Report {tool.name}</DialogTitle>
          <DialogDescription>What is happening with this tool?</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmitWithAction} className="grid gap-6" noValidate>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid gap-3"
                    >
                      {Object.values(ReportType).map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <RadioGroupItem value={type} id={`r${type}`} />
                          <FormLabel htmlFor={`r${type}`}>{sentenceCase(type)}</FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (optional)</FormLabel>
                  <FormControl>
                    <TextArea
                      placeholder="Provide additional details about the issue..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>

              <Button type="submit" className="min-w-28" isPending={action.isPending}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
