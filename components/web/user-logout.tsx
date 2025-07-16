"use client"

import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { signOut } from "~/lib/auth-client"

export const UserLogout = ({ ...props }: ComponentProps<"button">) => {
  const router = useRouter()

  const handleSignOut = async () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh()
          toast.success("You've been signed out successfully")
        },
      },
    })
  }

  return <button type="button" onClick={handleSignOut} {...props} />
}
