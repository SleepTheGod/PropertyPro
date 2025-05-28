import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await AuthService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password)

    // Create user
    const result = await db.query(
      `INSERT INTO users (name, email, password, phone, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, role`,
      [name, email, hashedPassword, phone || null, role],
    )

    const newUser = result.rows[0]

    return NextResponse.json({
      success: true,
      user: newUser,
    })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
