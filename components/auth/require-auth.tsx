"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface RequireAuthProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function RequireAuth({ children, allowedRoles = [] }: RequireAuthProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If the user is not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    // If roles are specified and the user's role is not allowed, redirect to dashboard
    if (
      status === "authenticated" &&
      allowedRoles.length > 0 &&
      session?.user?.role &&
      !allowedRoles.includes(session.user.role)
    ) {
      router.push("/dashboard")
    }
  }, [status, session, router, pathname, allowedRoles])

  // Show loading state while checking authentication
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // If roles are specified and the user's role is not allowed, don't render children
  if (allowedRoles.length > 0 && session?.user?.role && !allowedRoles.includes(session.user.role)) {
    return null
  }

  // Render children if authenticated and authorized
  return <>{children}</>
}
