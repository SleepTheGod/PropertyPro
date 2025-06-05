import bcryptjs from "bcryptjs"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: "admin" | "tenant" | "landlord"
  phone?: string
  created_at: Date
  updated_at: Date
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcryptjs.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcryptjs.compare(password, hashedPassword)
  }

  static generateSecureToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36)
    )
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT id, email, first_name, last_name, role, phone, password, created_at, updated_at
        FROM users 
        WHERE email = ${email} AND active = true
        LIMIT 1
      `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user by email:", error)
      return null
    }
  }

  static async validateCredentials(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email)

      if (!user) {
        return null
      }

      const isValid = await this.verifyPassword(password, (user as any).password)

      if (!isValid) {
        return null
      }

      // Remove password from returned user object
      const { password: _, ...userWithoutPassword } = user as any
      return userWithoutPassword
    } catch (error) {
      console.error("Error validating credentials:", error)
      return null
    }
  }

  static async createUser(userData: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: "admin" | "tenant" | "landlord"
    phone?: string
  }): Promise<User | null> {
    try {
      const hashedPassword = await this.hashPassword(userData.password)

      const result = await sql`
        INSERT INTO users (email, password, first_name, last_name, role, phone, created_at, updated_at)
        VALUES (
          ${userData.email}, 
          ${hashedPassword}, 
          ${userData.first_name}, 
          ${userData.last_name}, 
          ${userData.role}, 
          ${userData.phone || null}, 
          NOW(), 
          NOW()
        )
        RETURNING id, email, first_name, last_name, role, phone, created_at, updated_at
      `

      return result[0] || null
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT id, email, first_name, last_name, role, phone, created_at, updated_at
        FROM users 
        WHERE id = ${id} AND active = true
        LIMIT 1
      `
      return result[0] || null
    } catch (error) {
      console.error("Error getting user by ID:", error)
      return null
    }
  }
}
