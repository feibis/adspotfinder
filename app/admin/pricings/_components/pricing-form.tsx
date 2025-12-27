"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { toast } from "sonner"
import { PricingActions } from "~/app/admin/pricings/_components/pricing-actions"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { cx } from "~/lib/utils"
import { upsertPricing } from "~/server/admin/pricings/actions"
import type { findAttributeList } from "~/server/admin/attributes/queries"
import type { findPricingById } from "~/server/admin/pricings/queries"
import { pricingSchema } from "~/server/admin/pricings/schema"
import type { findToolList } from "~/server/admin/tools/queries"

type PricingFormProps = ComponentProps<"form"> & {
  pricing?: Awaited<ReturnType<typeof findPricingById>>
  toolsPromise: ReturnType<typeof findToolList>
  attributesPromise: ReturnType<typeof findAttributeList>
}

export function PricingForm({ children, className, title, pricing, toolsPromise, attributesPromise, ...props }: PricingFormProps) {
  const router = useRouter()
  const tools = use(toolsPromise)
  const attributes = use(attributesPromise)
  const resolver = zodResolver(pricingSchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(upsertPricing, resolver, {
    formProps: {
      defaultValues: {
        id: pricing?.id ?? "",
        name: pricing?.name ?? "",
        description: pricing?.description ?? "",
        price: pricing?.price ?? 0,
        currency: pricing?.currency ?? "USD",
        period: pricing?.period ?? "month",
        unit: pricing?.unit ?? "",
        order: pricing?.order ?? 0,
        isActive: pricing?.isActive ?? true,
        toolId: pricing?.toolId ?? "",
        attributes: pricing?.attributes.map((a: { id: string }) => a.id) ?? [],
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        toast.success(`Pricing successfully ${pricing ? "updated" : "created"}`)
        router.push(`/admin/pricings/${data?.id}`)
      },

      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    },
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {pricing && <PricingActions pricing={pricing} size="md" />}
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
          name="toolId"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel isRequired>Tool</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!pricing}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tool" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tools.map(tool => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.name}
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
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Small Climate Controlled Unit" {...field} value={field.value ?? ""} />
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
                <TextArea placeholder="Optional description..." {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="e.g., 49.99" 
                  value={field.value as number}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                  <SelectItem value="AUD">AUD (A$)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="month">Per Month</SelectItem>
                  <SelectItem value="year">Per Year</SelectItem>
                  <SelectItem value="week">Per Week</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder="e.g., per sq ft, per cubic meter" {...field} value={field.value ?? ""} />
              </FormControl>
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
                  type="number" 
                  value={field.value as number}
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem direction="row" className="col-span-full">
              <FormControl>
                <Switch onCheckedChange={field.onChange} checked={field.value} />
              </FormControl>
              <FormLabel>Active</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attributes"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel isRequired>Attribute Combination</FormLabel>
              <RelationSelector
                relations={attributes}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/pricings">Cancel</Link>
          </Button>

          <Button size="md" isPending={action.isPending}>
            {pricing ? "Update pricing" : "Create pricing"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

