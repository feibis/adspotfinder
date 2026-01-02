"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { slugify } from "@primoui/utils"
import { useRouter } from "next/navigation"
import { type ComponentProps, use } from "react"
import { toast } from "sonner"
import { ShopActions } from "~/app/admin/shops/_components/shop-actions"
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
import { upsertShop } from "~/server/admin/shops/actions"
import type { findShopBySlug } from "~/server/admin/shops/queries"
import { shopSchema } from "~/server/admin/shops/schema"
import { findLocationList } from "~/server/admin/locations/queries"
import { findShopCategoryList } from "~/server/admin/categories/queries"

type ShopFormProps = ComponentProps<"form"> & {
  shop?: Awaited<ReturnType<typeof findShopBySlug>>
  locationsPromise: ReturnType<typeof findLocationList>
  categoriesPromise: ReturnType<typeof findShopCategoryList>
}

export function ShopForm({ children, className, title, shop, locationsPromise, categoriesPromise, ...props }: ShopFormProps) {
  const router = useRouter()
  const locations = use(locationsPromise)
  const categories = use(categoriesPromise)
  const resolver = zodResolver(shopSchema)

  const { form, action, handleSubmitWithAction } = useHookFormAction(upsertShop, resolver, {
    formProps: {
      defaultValues: {
        id: shop?.id ?? "",
        name: shop?.name ?? "",
        slug: shop?.slug ?? "",
        email: shop?.email ?? "",
        phone: shop?.phone ?? "",
        websiteUrl: shop?.websiteUrl ?? "",
        description: shop?.description ?? "",
        instagramFollowers: shop?.instagramFollowers ?? undefined,
        tiktokFollowers: shop?.tiktokFollowers ?? undefined,
        locations: shop?.locations.map(l => l.id) ?? [],
        categories: shop?.categories.map(c => c.id) ?? [],
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        toast.success(`Shop successfully ${shop ? "updated" : "created"}`)
        router.push(`/admin/shops/${data?.slug}`)
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
    enabled: !shop,
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          {shop && <ShopActions shop={shop} size="md" />}
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
            <Link href="/admin/shops">Cancel</Link>
          </Button>

          <Button size="md" isPending={action.isPending}>
            {shop ? "Update shop" : "Create shop"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
