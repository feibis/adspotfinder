import { experimental_useObject as useObject } from "@ai-sdk/react"
import { useEffect } from "react"
import { toast } from "sonner"
import type { z } from "zod"
import { AIGenerate } from "~/components/admin/ai/generate"

type AIGenerateDescriptionProps<T extends z.ZodSchema> = {
  prompt?: string
  schema: T
  onFinish: (object: z.infer<T>) => void
}

export const AIGenerateDescription = <T extends z.ZodSchema>({
  prompt,
  schema,
  onFinish,
}: AIGenerateDescriptionProps<T>) => {
  const errorMessage = "Something went wrong. Please check the console for more details."
  const successMessage = "Content generated successfully. Please save the page to update."

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/ai/generate-description",
    schema,

    onFinish: ({ error }) => {
      error ? toast.error(errorMessage) : toast.success(successMessage)
    },

    onError: () => {
      toast.error(errorMessage)
    },
  })

  // Handle streaming updates from AI SDK
  useEffect(() => object && onFinish(object), [object])

  return (
    <AIGenerate
      onGenerate={() => submit({ prompt })}
      stop={stop}
      isLoading={isLoading}
      buttonText="Generate Description"
    />
  )
}
