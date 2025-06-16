"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { formatDateTime, getRandomString, isValidUrl, slugify } from "@primoui/utils"
import { type Tool, ToolStatus } from "@prisma/client"
import { EyeIcon, PencilIcon, RefreshCwIcon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ComponentProps, useRef, useState } from "react"
import { toast } from "sonner"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolGenerateContent } from "~/app/admin/tools/_components/tool-generate-content"
import { ToolPublishActions } from "~/app/admin/tools/_components/tool-publish-actions"
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
import { Input, inputVariants } from "~/components/common/input"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Switch } from "~/components/common/switch"
import { TextArea } from "~/components/common/textarea"
import { Tooltip } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { Markdown } from "~/components/web/markdown"
import { siteConfig } from "~/config/site"
import { useComputedField } from "~/hooks/use-computed-field"
import { isToolPublished } from "~/lib/tools"
import type { findCategoryList } from "~/server/admin/categories/queries"
import { upsertTool } from "~/server/admin/tools/actions"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import { toolSchema } from "~/server/admin/tools/schema"
import { generateFavicon, generateScreenshot } from "~/server/web/actions/media"
import { cx } from "~/utils/cva"

const ToolStatusChange = ({ tool }: { tool: Tool }) => {
  return (
    <>
      <ExternalLink href={`/${tool.slug}`} className="font-semibold underline inline-block">
        {tool.name}
      </ExternalLink>{" "}
      is now {tool.status.toLowerCase()}.{" "}
      {tool.status === "Scheduled" && (
        <>
          Will be published on {formatDateTime(tool.publishedAt ?? new Date(), "long")} (
          {Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/^.+\//, "")}).
        </>
      )}
    </>
  )
}

type ToolFormProps = ComponentProps<"form"> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>
  categories: ReturnType<typeof findCategoryList>
}

export function ToolForm({
  children,
  className,
  title,
  tool,
  categories,
  ...props
}: ToolFormProps) {
  const router = useRouter()
  const resolver = zodResolver(toolSchema)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isStatusPending, setIsStatusPending] = useState(false)
  const originalStatus = useRef(tool?.status ?? ToolStatus.Draft)

  const { form, action } = useHookFormAction(upsertTool, resolver, {
    formProps: {
      defaultValues: {
        id: tool?.id ?? "",
        name: tool?.name ?? "",
        slug: tool?.slug ?? "",
        tagline: tool?.tagline ?? "",
        description: tool?.description ?? "",
        content: tool?.content ?? "",
        websiteUrl: tool?.websiteUrl ?? "",
        faviconUrl: tool?.faviconUrl ?? "",
        screenshotUrl: tool?.screenshotUrl ?? "",
        isFeatured: tool?.isFeatured ?? false,
        submitterName: tool?.submitterName ?? "",
        submitterEmail: tool?.submitterEmail ?? "",
        submitterNote: tool?.submitterNote ?? "",
        status: tool?.status ?? ToolStatus.Draft,
        publishedAt: tool?.publishedAt ?? undefined,
        categories: tool?.categories.map(c => c.id) ?? [],
        notifySubmitter: true,
      },
    },

    actionProps: {
      onSuccess: ({ data }) => {
        if (!data) return

        if (data.status !== originalStatus.current) {
          toast.success(<ToolStatusChange tool={data} />)
          originalStatus.current = data.status
        } else {
          toast.success(`Tool successfully ${tool ? "updated" : "created"}`)
        }

        // Redirect to the new tool
        router.push(`/admin/tools/${data.slug}`)
      },

      onError: ({ error }) => {
        toast.error(error.serverError)
      },

      onSettled: () => {
        setIsStatusPending(false)
      },
    },
  })

  // Set the slug based on the name
  useComputedField({
    form,
    sourceField: "name",
    computedField: "slug",
    callback: slugify,
    enabled: !tool,
  })

  // Keep track of the form values
  const [name, slug, websiteUrl, description] = form.watch([
    "name",
    "slug",
    "websiteUrl",
    "description",
  ])

  // Generate favicon
  const faviconAction = useAction(generateFavicon, {
    onSuccess: ({ data }) => {
      toast.success("Favicon successfully generated. Please save the tool to update.")
      form.setValue("faviconUrl", data)
    },

    onError: ({ error }) => toast.error(error.serverError),
  })

  // Generate screenshot
  const screenshotAction = useAction(generateScreenshot, {
    onSuccess: ({ data }) => {
      toast.success("Screenshot successfully generated. Please save the tool to update.")
      form.setValue("screenshotUrl", data)
    },

    onError: ({ error }) => toast.error(error.serverError),
  })

  const handleSubmit = form.handleSubmit((data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent)?.submitter
    const isStatusChange = submitter?.getAttribute("name") !== "submit"

    if (isStatusChange) {
      setIsStatusPending(true)
    }

    action.execute(data)
  })

  const handleStatusSubmit = (status: ToolStatus, publishedAt: Date | null) => {
    // Update form values
    form.setValue("status", status)
    form.setValue("publishedAt", publishedAt)

    // Submit the form with updated values
    handleSubmit()
  }

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <ToolGenerateContent />

          {tool && <ToolActions tool={tool} size="md" />}
        </Stack>

        {tool && (
          <Note className="w-full">
            {isToolPublished(tool) ? "View:" : "Preview:"}{" "}
            <ExternalLink href={`/${tool.slug}`} className="text-primary underline">
              {siteConfig.url}/{tool.slug}
            </ExternalLink>
            {tool.status === ToolStatus.Scheduled && tool.publishedAt && (
              <>
                <br />
                Scheduled to be published on{" "}
                <strong className="text-foreground">{formatDateTime(tool.publishedAt)}</strong>
              </>
            )}
          </Note>
        )}
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
                <Input data-1p-ignore {...field} />
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
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel isRequired>Website URL</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliateUrl"
          render={({ field }) => (
            <FormItem>
              <Stack className="w-full justify-between">
                <FormLabel>Affiliate URL</FormLabel>

                <Tooltip tooltip="If you have an affiliate link, you can enter it here. This will be displayed on the tool page.">
                  <InfoIcon className="cursor-help opacity-50" />
                </Tooltip>
              </Stack>

              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tagline"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <Stack className="w-full justify-between">
                <FormLabel>Tagline</FormLabel>
                <Note className="text-xs">Max. 60 chars</Note>
              </Stack>

              <FormControl>
                <Input {...field} />
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
              <Stack className="w-full justify-between">
                <FormLabel>Description</FormLabel>
                <Note className="text-xs">Max. 160 chars</Note>
              </Stack>
              <FormControl>
                <TextArea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-full items-stretch">
              <Stack className="justify-between">
                <FormLabel>Content</FormLabel>

                {field.value && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setIsPreviewing(prev => !prev)}
                    prefix={isPreviewing ? <PencilIcon /> : <EyeIcon />}
                    className="-my-1"
                  >
                    {isPreviewing ? "Edit" : "Preview"}
                  </Button>
                )}
              </Stack>

              <FormControl>
                {field.value && isPreviewing ? (
                  <Markdown
                    code={field.value}
                    className={cx(
                      inputVariants(),
                      "max-w-none min-h-18 bg-card border leading-normal",
                    )}
                  />
                ) : (
                  <TextArea className="min-h-18" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {tool?.submitterEmail && (
          <>
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Submitter Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Submitter Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>Submitter Note</FormLabel>
                  <FormControl>
                    <TextArea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="faviconUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Favicon URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={
                    <RefreshCwIcon className={cx(faviconAction.isPending && "animate-spin")} />
                  }
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || faviconAction.isPending}
                  onClick={() => {
                    faviconAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    })
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Favicon"
                    className="size-8 border box-content rounded-md object-contain"
                  />
                )}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem className="items-stretch">
              <Stack className="justify-between">
                <FormLabel className="flex-1">Screenshot URL</FormLabel>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  prefix={
                    <RefreshCwIcon className={cx(screenshotAction.isPending && "animate-spin")} />
                  }
                  className="-my-1"
                  disabled={!isValidUrl(websiteUrl) || screenshotAction.isPending}
                  onClick={() => {
                    screenshotAction.execute({
                      url: websiteUrl,
                      path: `tools/${slug || getRandomString(12)}`,
                    })
                  }}
                >
                  {field.value ? "Regenerate" : "Generate"}
                </Button>
              </Stack>

              <Stack size="sm">
                {field.value && (
                  <img
                    src={field.value}
                    alt="Screenshot"
                    className="h-8 max-w-32 border box-content rounded-md object-contain"
                  />
                )}

                <FormControl>
                  <Input type="url" className="flex-1" {...field} />
                </FormControl>
              </Stack>
              <FormMessage />
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
                promise={categories}
                selectedIds={field.value ?? []}
                setSelectedIds={field.onChange}
                prompt={
                  name &&
                  description &&
                  `From the list of available categories below, suggest relevant categories for this link: 
                    
                    - URL: ${websiteUrl}
                    - Meta title: ${name}
                    - Meta description: ${description}.`
                }
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem direction="row">
              <FormControl>
                <Switch onCheckedChange={field.onChange} checked={field.value} />
              </FormControl>
              <FormLabel>Feature this tool</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/tools">Cancel</Link>
          </Button>

          <ToolPublishActions
            tool={tool}
            isPending={!isStatusPending && action.isPending}
            isStatusPending={isStatusPending}
            onStatusSubmit={handleStatusSubmit}
          />
        </div>
      </form>
    </Form>
  )
}
