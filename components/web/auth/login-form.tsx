"use client"

import { InboxIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/common/form"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { useMagicLink } from "~/hooks/use-magic-link"

export const LoginForm = ({ ...props }: ComponentProps<"form">) => {
  const router = useRouter()

  const { form, handleSignIn, isPending } = useMagicLink({
    onSuccess: email => {
      router.push(`/auth/verify?email=${email}`)
    },

    onError: ({ error }) => {
      toast.error(error.message)
    },
  })

  return (
    <Form {...form}>
      <Stack direction="column" className="items-stretch" asChild>
        <form onSubmit={form.handleSubmit(handleSignIn)} noValidate {...props}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    size="lg"
                    placeholder="Enter your email"
                    data-1p-ignore
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button suffix={<InboxIcon />} isPending={isPending}>
            Send me a Magic Link
          </Button>
        </form>
      </Stack>
    </Form>
  )
}
