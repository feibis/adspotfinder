import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useLocalStorage } from "@mantine/hooks"
import { isValidUrl } from "@primoui/utils"
import { LoaderIcon, SparklesIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import { siteConfig } from "~/config/site"
import { contentSchema } from "~/server/admin/shared/schema"
import type { ToolSchema } from "~/server/admin/tools/schema"

export const ToolGenerateContent = () => {
  const key = siteConfig.name.toLowerCase()
  const errorMessage = "Something went wrong. Please check the console for more details."
  const successMessage = "Content generated successfully. Please save the tool to update."

  const { watch, setValue } = useFormContext<ToolSchema>()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [consent, setConsent] = useLocalStorage({ key: `${key}-ai-consent`, defaultValue: false })

  const [url] = watch(["websiteUrl"])

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/ai/generate-content",
    schema: contentSchema,

    onFinish: ({ error }) => {
      error ? toast.error(errorMessage) : toast.success(successMessage)
    },

    onError: () => {
      toast.error(errorMessage)
    },
  })

  // Handle streaming updates from AI SDK
  useEffect(() => {
    if (object) {
      setValue("tagline", object.tagline)
      setValue("description", object.description)
      setValue("content", object.content)
    }
  }, [object])

  const handleGenerateContent = (force = false) => {
    if (consent || force) {
      setIsAlertOpen(false)
      setConsent(true)

      if (isValidUrl(url)) {
        submit({ url })
      } else {
        toast.error("Invalid URL. Please enter a valid URL.")
      }
    } else {
      setIsAlertOpen(true)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="md"
        prefix={isLoading ? <LoaderIcon className="animate-spin" /> : <SparklesIcon />}
        disabled={!isValidUrl(url)}
        onClick={() => (isLoading ? stop() : handleGenerateContent())}
      >
        {isLoading ? "Stop Generating" : "Generate Content"}
      </Button>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Before you continue</DialogTitle>

            <DialogDescription>
              <p>
                This action will automatically generate the tagline, description, and content for
                you. The process will take some time to complete.
              </p>
              <p>
                Please note that this will <strong>overwrite any existing content</strong> you have
                entered and may also incur an <strong>AI usage fee</strong>.
              </p>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button size="md" variant="secondary">
                Cancel
              </Button>
            </DialogClose>

            <Button size="md" onClick={() => handleGenerateContent(true)}>
              Ok, I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
