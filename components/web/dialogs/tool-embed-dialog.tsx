import { useClipboard } from "@mantine/hooks"
import { CheckIcon, ClipboardIcon } from "lucide-react"
import { useTheme } from "next-themes"
import type { Dispatch, SetStateAction } from "react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Input } from "~/components/common/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { TextArea } from "~/components/common/textarea"
import { siteConfig } from "~/config/site"
import { cx } from "~/lib/utils"
import type { ToolOne } from "~/server/web/tools/payloads"

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const

type Theme = (typeof THEMES)[number]["value"]

type EmbedForm = {
  theme: Theme
  width: number
  height: number
}

type ToolEmbedDialogProps = {
  tool: ToolOne
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const ToolEmbedDialog = ({ tool, isOpen, setIsOpen }: ToolEmbedDialogProps) => {
  const { resolvedTheme } = useTheme()
  const clipboard = useClipboard({ timeout: 2000 })

  const form = useForm<EmbedForm>({
    defaultValues: { theme: resolvedTheme as Theme, width: 200, height: 50 },
    mode: "onChange",
  })

  const { watch } = form
  const theme = watch("theme")
  const width = watch("width")
  const height = watch("height")

  const toolLink = useMemo(() => {
    return `${siteConfig.url}/${tool.slug}`
  }, [tool.slug])

  const badgeUrl = useMemo(() => {
    const params = new URLSearchParams({ theme, width: String(width), height: String(height) })
    return `${toolLink}/badge.svg?${params.toString()}`
  }, [theme, width, height, toolLink])

  const utm = new URLSearchParams({
    utm_source: siteConfig.slug,
    utm_medium: "badge",
    utm_campaign: "embed",
    utm_content: `tool-${tool.slug}`,
  })

  const embedCode = useMemo(
    () =>
      `<a href="${toolLink}?${utm.toString()}" target="_blank"><img src="${badgeUrl}" width="${width}" height="${height}" alt="${tool.name} badge" loading="lazy" /></a>`,
    [badgeUrl, width, height, tool.name, toolLink, utm],
  )

  const previewBg = theme === "dark" ? "bg-black" : "bg-white"

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Embed the {tool.name} badge</DialogTitle>
          <DialogDescription>
            Use the following badge to showcase your tool on your website or documentation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="grid w-full gap-x-3 gap-y-5 sm:grid-cols-3"
            autoComplete="off"
            onSubmit={e => e.preventDefault()}
          >
            <FormField
              control={form.control}
              name="theme"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange} {...field}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width</FormLabel>
                  <FormControl>
                    <Input type="number" min={100} max={600} step={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input type="number" min={30} max={200} step={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full">
              <div className="text-xs mb-1 text-foreground/60">Preview</div>
              <Card
                className={cx(
                  "flex items-center justify-center min-h-20 bg-background overflow-clip",
                  previewBg,
                )}
                hover={false}
              >
                <img
                  src={badgeUrl}
                  width={width}
                  height={height}
                  alt={`${tool.name} badge preview`}
                  className="block"
                  draggable={false}
                />
              </Card>
            </div>

            <div className="col-span-full">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="text-xs text-foreground/60">Embed code</div>

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => clipboard.copy(embedCode)}
                  prefix={clipboard.copied ? <CheckIcon /> : <ClipboardIcon />}
                  className={cx(clipboard.copied && "text-green-600")}
                >
                  {clipboard.copied ? "Copied!" : "Copy"}
                </Button>
              </div>

              <TextArea
                value={embedCode}
                readOnly
                className="block font-mono text-xs cursor-pointer"
                onFocus={e => e.target.select()}
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
