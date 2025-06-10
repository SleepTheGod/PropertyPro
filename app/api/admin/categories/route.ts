import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// GET - Fetch all categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await db.query(`
      SELECT 
        id,
        name,
        description,
        color,
        icon,
        is_active,
        sort_order,
        created_at,
        (SELECT COUNT(*) FROM bulletin_posts WHERE category_id = bulletin_categories.id) as post_count
      FROM bulletin_categories 
      ORDER BY sort_order ASC, name ASC
    `)

    return NextResponse.json({ categories: result.rows })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, color, icon, is_active, sort_order } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const result = await db.query(
      `
      INSERT INTO bulletin_categories (name, description, color, icon, is_active, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [name, description || null, color || "#3B82F6", icon || "folder", is_active !== false, sort_order || 0],
    )

    return NextResponse.json({ category: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)
    if (error.code === "23505") {
      // Unique constraint violation
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
