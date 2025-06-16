import { useLocalStorage } from "@mantine/hooks"
import { LoaderIcon, SparklesIcon } from "lucide-react"
import { useState } from "react"
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

type AIGenerateProps = {
  stop: () => void
  isLoading: boolean
  onGenerate: () => void
}

export const AIGenerate = ({ stop, isLoading, onGenerate }: AIGenerateProps) => {
  const key = siteConfig.name.toLowerCase()
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [consent, setConsent] = useLocalStorage({ key: `${key}-ai-consent`, defaultValue: false })
  const { formState } = useFormContext()

  const handleGenerate = (force = false) => {
    if (!consent && !force) {
      setIsAlertOpen(true)
      return
    }

    setIsAlertOpen(false)
    setConsent(true)

    if (!formState.isValid) {
      toast.error("Invalid form data. Please check the console for more details.")
      return
    }

    onGenerate()
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="md"
        disabled={!formState.isValid}
        prefix={isLoading ? <LoaderIcon className="animate-spin" /> : <SparklesIcon />}
        onClick={() => (isLoading ? stop() : handleGenerate())}
      >
        {isLoading ? "Stop Generating" : "Generate"}
      </Button>

      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Before you continue</DialogTitle>

            <DialogDescription>
              <p>
                This action will automatically generate content for you. The process will take some
                time to complete.
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

            <Button size="md" onClick={() => handleGenerate(true)}>
              Ok, I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
