import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"

// Define validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Validation failed", errors: result.error.format() }, { status: 400 })
    }

    const { token, password } = result.data

    // Find the password reset token
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    })

    if (!passwordReset) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update the user's password
    await prisma.user.update({
      where: {
        id: passwordReset.userId,
      },
      data: {
        password: hashedPassword,
      },
    })

    // Delete the used token
    await prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    })

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
