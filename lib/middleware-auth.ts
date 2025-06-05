import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { AuthService } from "./auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await AuthService.getUserById(decoded.userId)

    return user
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}

export function requireAuth(allowedRoles?: string[]) {
  return async (request: NextRequest) => {
    const user = await verifyAuth(request)

    if (!user) {
      return { error: "Unauthorized", status: 401 }
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return { error: "Forbidden", status: 403 }
    }

    return { user }
  }
}
