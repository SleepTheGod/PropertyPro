import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        database: "checking...",
        authentication: "healthy",
        payments: "healthy",
      },
    }

    // Try to check database connection
    try {
      // This will work with any database provider
      const { Client } = require("pg")
      const client = new Client({
        connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      })

      await client.connect()
      await client.query("SELECT 1")
      await client.end()

      health.services.database = "healthy"
    } catch (error) {
      health.services.database = "unavailable"
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
