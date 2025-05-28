import bcrypt from "bcryptjs"
import { db } from "./db"

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  static generateSecureToken(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Date.now().toString(36)
    )
  }

  static async getUserByEmail(email: string) {
    try {
      const result = await db.query(`SELECT * FROM users WHERE email = $1 LIMIT 1`, [email])
      return result.rows[0] || null
    } catch (error) {
      console.error("Error getting user by email:", error)
      return null
    }
  }

  static async validateCredentials(email: string, password: string) {
    try {
      const user = await this.getUserByEmail(email)

      if (!user) {
        return null
      }

      const isValid = await this.verifyPassword(password, user.password)

      if (!isValid) {
        return null
      }

      return user
    } catch (error) {
      console.error("Error validating credentials:", error)
      return null
    }
  }
}
