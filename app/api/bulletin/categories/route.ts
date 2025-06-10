import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch active categories for bulletin board
export async function GET() {
  try {
    const result = await db.query(`
      SELECT id, name, description, color, icon
      FROM bulletin_categories 
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC
    `)

    return NextResponse.json({ categories: result.rows })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
