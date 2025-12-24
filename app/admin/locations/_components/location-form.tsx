"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { slugify } from "@primoui/utils"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { toast } from "sonner"
import { LocationActions } from "~/app/admin/locations/_components/location-actions"
import { RelationSelector } from "~/components/admin/relation-selector"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { H3 } from "~/components/common/heading"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { useComputedField } from "~/hooks/use-computed-field"
import { cx } from "~/lib/utils"
import { upsertLocation } from "~/server/admin/locations/actions"
import type { findLocationBySlug } from "~/server/admin/locations/queries"
import { locationSchema } from "~/server/admin/locations/schema"
import type { findToolList } from "~/server/admin/tools/queries"

type LocationFormProps = ComponentProps<"form"> & {
  location?: Awaited<ReturnType<typeof findLocationBySlug>>
  toolsPromise: ReturnType<typeof findToolList>
}

export function LocationForm({ children, className, title, location, toolsPromise, ...props }: LocationFormProps) {
  const router = useRouter()
  const tools = use(toolsPromise)
  const resolver = zodResolver(locationSchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(upsertLocation, resolver, {
    formProps: {
      defaultValues: {
        id: location?.id ?? "",
        name: location?.name ?? "",
        slug: location?.slug ?? "",
        tools: location?.tools.map(t => t.id) ?? [],
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        toast.success(`Location successfully ${location ? "updated" : "created"}`)
        router.push(`/admin/locations/${data?.slug}`)
      },

      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !location,
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {location && <LocationActions location={location} size="md" />}
        </Stack>
      </Stack>

      <form
        onSubmit={handleSubmitWithAction}
        className={cx("grid gap-4 @lg:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tools"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tools</FormLabel>
              <RelationSelector
                relations={tools}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/locations">Cancel</Link>
          </Button>

          <Button size="md" isPending={action.isPending}>
            {location ? "Update location" : "Create location"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
