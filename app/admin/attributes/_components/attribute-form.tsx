"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { slugify } from "@primoui/utils"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { toast } from "sonner"
import { AttributeActions } from "~/app/admin/attributes/_components/attribute-actions"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { useComputedField } from "~/hooks/use-computed-field"
import { cx } from "~/lib/utils"
import { upsertAttribute } from "~/server/admin/attributes/actions"
import type { findAttributeBySlug, findAttributeGroupList } from "~/server/admin/attributes/queries"
import { attributeSchema } from "~/server/admin/attributes/schema"
import type { findToolList } from "~/server/admin/tools/queries"

type AttributeFormProps = ComponentProps<"form"> & {
  attribute?: Awaited<ReturnType<typeof findAttributeBySlug>>
  groupsPromise: ReturnType<typeof findAttributeGroupList>
  toolsPromise: ReturnType<typeof findToolList>
}

export function AttributeForm({
  children,
  className,
  title,
  attribute,
  groupsPromise,
  toolsPromise,
  ...props
}: AttributeFormProps) {
  const router = useRouter()
  const groups = use(groupsPromise)
  const tools = use(toolsPromise)
  const resolver = zodResolver(attributeSchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(upsertAttribute, resolver, {
    formProps: {
      defaultValues: {
        id: attribute?.id ?? "",
        name: attribute?.name ?? "",
        slug: attribute?.slug ?? "",
        value: attribute?.value ?? "",
        unit: attribute?.unit ?? "",
        order: attribute?.order ?? 0,
        groupId: attribute?.groupId ?? groups[0]?.id ?? "",
        tools: attribute?.tools.map(t => t.id) ?? [],
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        toast.success(`Attribute successfully ${attribute ? "updated" : "created"}`)
        router.push(`/admin/attributes/${data?.slug}`)
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
    enabled: !attribute,
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {attribute && <AttributeActions attribute={attribute} size="md" />}
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
                <Input {...field} placeholder="e.g., Medium (50-100 sq ft)" />
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
          name="groupId"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={e => field.onChange(Number.parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., 50-100" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., sq ft" />
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
            <Link href="/admin/attributes">Cancel</Link>
          </Button>

          <Button size="md" isPending={action.isPending}>
            {attribute ? "Update attribute" : "Create attribute"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

