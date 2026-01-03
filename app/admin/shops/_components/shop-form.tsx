"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { slugify } from "@primoui/utils"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { toast } from "sonner"
import { AgencyActions } from "~/app/admin/agencys/_components/agency-actions"
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
import { upsertAgency } from "~/server/admin/agencys/actions"
import type { findAgencyBySlug } from "~/server/admin/agencys/queries"
import { agencySchema } from "~/server/admin/agencys/schema"
import { findLocationList } from "~/server/admin/locations/queries"
import { findAgencyCategoryList } from "~/server/admin/categories/queries"

type AgencyFormProps = ComponentProps<"form"> & {
  agency?: Awaited<ReturnType<typeof findAgencyBySlug>>
  locationsPromise: ReturnType<typeof findLocationList>
  categoriesPromise: ReturnType<typeof findAgencyCategoryList>
}

export function AgencyForm({ children, className, title, agency, locationsPromise, categoriesPromise, ...props }: AgencyFormProps) {
  const router = useRouter()
  const locations = use(locationsPromise)
  const categories = use(categoriesPromise)
  const resolver = zodResolver(agencySchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(upsertAgency, resolver, {
    formProps: {
      defaultValues: {
        id: agency?.id ?? "",
        name: agency?.name ?? "",
        slug: agency?.slug ?? "",
        email: agency?.email ?? "",
        phone: agency?.phone ?? "",
        websiteUrl: agency?.websiteUrl ?? "",
        description: agency?.description ?? "",
        instagramFollowers: agency?.instagramFollowers ?? undefined,
        tiktokFollowers: agency?.tiktokFollowers ?? undefined,
        locations: agency?.locations.map(l => l.id) ?? [],
        categories: agency?.categories.map(c => c.id) ?? [],
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        toast.success(`Agency successfully ${agency ? "updated" : "created"}`)
        router.push(`/admin/agencys/${data?.slug}`)
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
    enabled: !agency,
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {agency && <AgencyActions agency={agency} size="md" />}
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
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
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagramFollowers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram Followers</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tiktokFollowers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TikTok Followers</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  value={field.value ?? ""}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locations"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Locations</FormLabel>
              <RelationSelector
                relations={locations}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Categories</FormLabel>
              <RelationSelector
                relations={categories}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/agencys">Cancel</Link>
          </Button>

          <Button size="md" isPending={action.isPending}>
            {agency ? "Update agency" : "Create agency"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
