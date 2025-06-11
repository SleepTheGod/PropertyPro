import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth(allowedRoles?: string[]) {
  const session = await getSession()

  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden")
  }

  return session.user
}
