"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login")
    },
  })

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Check if user has the required role
  if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
    return fallback || redirect("/dashboard")
  }

  // User has the required role, render children
  return <>{children}</>
}
