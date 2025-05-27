import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

// Define validation schema
const sendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = sendVerificationSchema.safeParse(body)
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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 400 })
    }

    // Generate a verification token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 3600000) // 24 hours from now

    // Store the token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    // Send the verification email
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`

    // In a real application, you would send an actual email
    // For now, we'll just log the URL
    console.log(`Verification URL: ${verificationUrl}`)

    // Simulate sending an email
    // await sendEmail({
    //   to: email,
    //   subject: "Verify your email address",
    //   text: `Click the link to verify your email: ${verificationUrl}`,
    //   html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    // })

    return NextResponse.json({ message: "Verification email sent" }, { status: 200 })
  } catch (error) {
    console.error("Send verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
