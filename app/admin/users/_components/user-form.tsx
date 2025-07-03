"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks"
import { useAction } from "next-safe-action/hooks"
import { type ChangeEvent, type ComponentProps, useState } from "react"
import { toast } from "sonner"
import { UserActions } from "~/app/admin/users/_components/user-actions"
import { Avatar, AvatarImage } from "~/components/common/avatar"
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
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { updateUser } from "~/server/admin/users/actions"
import type { findUserById } from "~/server/admin/users/queries"
import { userSchema } from "~/server/admin/users/schema"
import { fileSchema, VALID_IMAGE_TYPES } from "~/server/web/shared/schema"
import { uploadUserImage } from "~/server/web/users/actions"
import { cx } from "~/utils/cva"

type UserFormProps = ComponentProps<"form"> & {
  user: NonNullable<Awaited<ReturnType<typeof findUserById>>>
}

export function UserForm({ children, className, title, user, ...props }: UserFormProps) {
  const resolver = zodResolver(userSchema)
  const [imageError, setImageError] = useState<string | null>(null)

  // Update user
  const { form, action, handleSubmitWithAction } = useHookFormAction(updateUser, resolver, {
    formProps: {
      defaultValues: {
        id: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
        image: user?.image ?? "",
      },
    },

    actionProps: {
      onSuccess: () => {
        toast.success("User successfully updated")
      },

      onError: ({ error }) => {
        toast.error(error.serverError)
      },
    },
  })

  // Upload user image
  const uploadAction = useAction(uploadUserImage, {
    onSuccess: ({ data }) => {
      setImageError(null)
      toast.success("User image successfully uploaded. Please save the user to update.")
      form.setValue("image", data)
    },

    onError: ({ error }) => {
      const { serverError, validationErrors } = error

      serverError && toast.error(serverError)
      validationErrors?.file?._errors?.[0] && setImageError(validationErrors.file._errors[0])
    },
  })

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const { data, error } = await fileSchema.safeParseAsync(file)

    if (error) {
      setImageError(JSON.parse(error.message)[0]?.message)
      return
    }

    setImageError(null)
    uploadAction.execute({ id: user.id, file: data })
  }

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <UserActions user={user} size="md" />
        </Stack>
      </Stack>

      <form
        onSubmit={handleSubmitWithAction}
        className={cx("grid gap-4 @sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <div className="grid gap-4 @sm:grid-cols-2">
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>

              <FormControl>
                <Input {...field} type="hidden" />
              </FormControl>

              <Stack size="sm" className="w-full">
                {field.value && (
                  <Avatar className="size-8 border box-content">
                    <AvatarImage src={field.value} />
                  </Avatar>
                )}

                <div className="flex-1">
                  <FormControl>
                    <Input
                      type="file"
                      accept={VALID_IMAGE_TYPES.join(",")}
                      hover
                      onChange={handleImageChange}
                    />
                  </FormControl>
                </div>
              </Stack>

              {imageError && <Hint>{imageError}</Hint>}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/users">Cancel</Link>
          </Button>

          <Button size="md" isPending={action.isPending || uploadAction.isPending}>
            Update user
          </Button>
        </div>
      </form>
    </Form>
  )
}
