"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Checkbox } from "~/components/common/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { TextArea } from "~/components/common/textarea"
import { FeatureNudge } from "~/components/web/feature-nudge"
import { useSession } from "~/lib/auth-client"
import { isToolPublished } from "~/lib/tools"
import { cx } from "~/lib/utils"
import { submitTool } from "~/server/web/actions/submit"
import { submitToolSchema } from "~/server/web/shared/schema"

export const SubmitForm = ({ className, ...props }: ComponentProps<"form">) => {
  const router = useRouter()
  const { data: session } = useSession()
  const resolver = zodResolver(submitToolSchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(submitTool, resolver, {
    formProps: {
      values: {
        name: "",
        websiteUrl: "",
        submitterName: session?.user.name || "",
        submitterEmail: session?.user.email || "",
        submitterNote: "",
        newsletterOptIn: true,
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        form.reset()

        if (!data) return

        // Capture event
        posthog.capture("submit_tool", { slug: data.slug })

        if (isToolPublished(data)) {
          if (data.isFeatured) {
            toast.info(`${data.name} has already been published.`)
          } else {
            toast.custom(t => <FeatureNudge tool={data} t={t} />, {
              duration: Number.POSITIVE_INFINITY,
            })
          }
          router.push(`/${data.slug}`)
        } else {
          toast.success(`${data.name} has been submitted.`)
          router.push(`/submit/${data.slug}`)
        }
      },
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmitWithAction}
        className={cx("grid w-full gap-5 @md:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="submitterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Your Name:</FormLabel>
              <FormControl>
                <Input size="lg" placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Your Email:</FormLabel>
              <FormControl>
                <Input type="email" size="lg" placeholder="john@doe.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Name:</FormLabel>
              <FormControl>
                <Input size="lg" placeholder="PostHog" data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Website URL:</FormLabel>
              <FormControl>
                <Input type="url" size="lg" placeholder="https://posthog.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submitterNote"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Note:</FormLabel>
              <FormControl>
                <TextArea size="lg" placeholder="Any additional information..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newsletterOptIn"
          render={({ field }) => (
            <FormItem className="flex-row items-center col-span-full">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="font-normal">I'd like to receive free email updates</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-full">
          <Button variant="primary" isPending={action.isPending} className="flex min-w-32">
            Submit
          </Button>
        </div>

        {action.result.serverError && (
          <Hint className="col-span-full">{action.result.serverError}</Hint>
        )}
      </form>
    </Form>
  )
}
