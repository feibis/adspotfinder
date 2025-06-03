"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { slugify } from "@primoui/utils"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { TagActions } from "~/app/admin/tags/_components/tag-actions"
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
import { upsertTag } from "~/server/admin/tags/actions"
import type { findTagBySlug } from "~/server/admin/tags/queries"
import { tagSchema } from "~/server/admin/tags/schema"
import type { findToolList } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type TagFormProps = ComponentProps<"form"> & {
  tag?: Awaited<ReturnType<typeof findTagBySlug>>
  tools: ReturnType<typeof findToolList>
}

export function TagForm({ children, className, title, tag, tools, ...props }: TagFormProps) {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name ?? "",
      slug: tag?.slug ?? "",
      tools: tag?.tools.map(t => t.id) ?? [],
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tag,
  })

  // Upsert tag
  const upsertAction = useServerAction(upsertTag, {
    onSuccess: ({ data }) => {
      toast.success(`Tag successfully ${tag ? "updated" : "created"}`)

      // If not updating a tag, or slug has changed, redirect to the new tag
      if (!tag || data.slug !== tag?.slug) {
        router.push(`/admin/tags/${data.slug}`)
      }
    },

    onError: ({ err }) => toast.error(err.message),
  })

  const handleSubmit = form.handleSubmit(data => {
    upsertAction.execute({ id: tag?.id, ...data })
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {tag && <TagActions tag={tag} size="md" />}
        </Stack>
      </Stack>

      <form
        onSubmit={handleSubmit}
        className={cx("grid gap-4 @sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
              <FormLabel>Slug</FormLabel>
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
                promise={tools}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
              />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tags">Cancel</Link>
          </Button>

          <Button size="md" isPending={upsertAction.isPending}>
            {tag ? "Update tag" : "Create tag"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
