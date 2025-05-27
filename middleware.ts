import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Define role-based route access
const roleRoutes: Record<string, string[]> = {
  tenant: ["/dashboard", "/dashboard/payments", "/dashboard/maintenance", "/dashboard/bulletin"],
  property_manager: [
    "/dashboard",
    "/dashboard/tenants",
    "/dashboard/buildings",
    "/dashboard/maintenance",
    "/dashboard/bulletin",
  ],
  admin: ["/dashboard", "/dashboard/admin", "/dashboard/users", "/dashboard/settings"],
}

// Define public routes that don't require authentication
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get the user's token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If there's no token, redirect to login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Check if the user has access to the route based on their role
  const role = token.role as string
  const allowedRoutes = roleRoutes[role] || []

  // If the user doesn't have access to the route, redirect to dashboard
  if (!allowedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
