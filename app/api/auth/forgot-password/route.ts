import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = forgotPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Validation failed", errors: result.error.format() }, { status: 400 })
    }

    const { email } = result.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // Don't reveal if user exists or not for security reasons
    if (!user) {
      // We still return success even if the user doesn't exist
      return NextResponse.json({ message: "Password reset email sent if account exists" }, { status: 200 })
    }

    // Generate a reset token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour from now

    // Store the token in the database
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    })

    // Send the password reset email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

    // In a real application, you would send an actual email
    // For now, we'll just log the URL
    console.log(`Password reset URL: ${resetUrl}`)

    // Simulate sending an email
    // await sendEmail({
    //   to: email,
    //   subject: "Reset your password",
    //   text: `Click the link to reset your password: ${resetUrl}`,
    //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    // })

    return NextResponse.json({ message: "Password reset email sent if account exists" }, { status: 200 })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
