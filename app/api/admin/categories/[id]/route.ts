import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// PUT - Update category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, color, icon, is_active, sort_order } = await request.json()
    const categoryId = Number.parseInt(params.id)

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const result = await db.query(
      `
      UPDATE bulletin_categories 
      SET 
        name = $1,
        description = $2,
        color = $3,
        icon = $4,
        is_active = $5,
        sort_order = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `,
      [name, description, color, icon, is_active, sort_order, categoryId],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ category: result.rows[0] })
  } catch (error) {
    console.error("Error updating category:", error)
    if (error.code === "23505") {
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

// DELETE - Delete category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const categoryId = Number.parseInt(params.id)

    // Check if category has posts
    const postCheck = await db.query("SELECT COUNT(*) as count FROM bulletin_posts WHERE category_id = $1", [
      categoryId,
    ])

    if (Number.parseInt(postCheck.rows[0].count) > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with existing posts. Please move or delete posts first.",
        },
        { status: 409 },
      )
    }

    const result = await db.query("DELETE FROM bulletin_categories WHERE id = $1 RETURNING *", [categoryId])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
