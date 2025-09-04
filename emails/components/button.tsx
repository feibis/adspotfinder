import { setQueryParams } from "@primoui/utils"
import { Button, type ButtonProps, Section } from "@react-email/components"
import { siteConfig } from "~/config/site"

export const EmailButton = ({ children, href, ...props }: ButtonProps) => {
  return (
    <Section className="my-8 first:mt-0 last:mb-0">
      <Button
        className="rounded-md bg-neutral-950 px-5 py-3 text-center text-sm font-medium text-white no-underline"
        href={setQueryParams(href!, { ref: siteConfig.domain })}
        {...props}
      >
        {children}
      </Button>
    </Section>
  )
}
