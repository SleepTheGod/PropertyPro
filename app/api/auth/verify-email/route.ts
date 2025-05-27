import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

// Define validation schema
const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=missing_token", request.url))
    }

    // Validate token
    const result = verifyEmailSchema.safeParse({ token })
    if (!result.success) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", request.url))
    }

    // Find the email verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    })

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/login?error=invalid_token", request.url))
    }

    // Find the user by identifier (email)
    const user = await prisma.user.findFirst({
      where: {
        email: verificationToken.identifier,
      },
    })

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=user_not_found", request.url))
    }

    // Update the user's email verification status
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    })

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        token: token,
      },
    })

    return NextResponse.redirect(new URL("/login?verified=true", request.url))
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.redirect(new URL("/login?error=server_error", request.url))
  }
}
