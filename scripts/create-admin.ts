import bcrypt from "bcryptjs"
import { db } from "../lib/db"

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.query(`SELECT * FROM users WHERE email = $1 AND role = $2 LIMIT 1`, [
      "admin@example.com",
      "admin",
    ])

    if (existingAdmin.rows.length > 0) {
      console.log("Admin user already exists")
      return
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash("password", saltRounds)

    // Create admin user
    await db.query(
      `INSERT INTO users (name, email, password, role, email_verified) 
       VALUES ($1, $2, $3, $4, $5)`,
      ["Admin User", "admin@example.com", hashedPassword, "admin", true],
    )

    console.log("Admin user created successfully")
  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    process.exit(0)
  }
}

createAdminUser()
