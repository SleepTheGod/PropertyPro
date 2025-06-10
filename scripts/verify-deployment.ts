#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Checks if all systems are working correctly after deployment
 */

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

interface VerificationResult {
  name: string
  status: "pass" | "fail" | "warning"
  message: string
}

class DeploymentVerifier {
  private results: VerificationResult[] = []
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "") // Remove trailing slash
  }

  private async checkEndpoint(path: string, expectedStatus = 200): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}${path}`)
      return response.status === expectedStatus
    } catch (error) {
      return false
    }
  }

  private async checkDatabase(): Promise<VerificationResult> {
    try {
      const isHealthy = await this.checkEndpoint("/api/health/database")
      return {
        name: "Database Connection",
        status: isHealthy ? "pass" : "fail",
        message: isHealthy ? "Database is connected and responsive" : "Database connection failed",
      }
    } catch (error) {
      return {
        name: "Database Connection",
        status: "fail",
        message: "Unable to check database connection",
      }
    }
  }

  private async checkAuthentication(): Promise<VerificationResult> {
    try {
      const isHealthy = await this.checkEndpoint("/api/auth/session")
      return {
        name: "Authentication System",
        status: isHealthy ? "pass" : "fail",
        message: isHealthy ? "Authentication system is working" : "Authentication system failed",
      }
    } catch (error) {
      return {
        name: "Authentication System",
        status: "fail",
        message: "Unable to check authentication system",
      }
    }
  }

  private async checkStripe(): Promise<VerificationResult> {
    try {
      const isHealthy = await this.checkEndpoint("/api/health/stripe")
      return {
        name: "Stripe Integration",
        status: isHealthy ? "pass" : "warning",
        message: isHealthy ? "Stripe is configured correctly" : "Stripe configuration needs attention",
      }
    } catch (error) {
      return {
        name: "Stripe Integration",
        status: "warning",
        message: "Unable to verify Stripe configuration",
      }
    }
  }

  private async checkPages(): Promise<VerificationResult[]> {
    const pages = [
      { path: "/", name: "Landing Page" },
      { path: "/login", name: "Tenant Login" },
      { path: "/admin/login", name: "Admin Login" },
      { path: "/api/health", name: "Health Check API" },
    ]

    const results: VerificationResult[] = []

    for (const page of pages) {
      try {
        const isHealthy = await this.checkEndpoint(page.path)
        results.push({
          name: page.name,
          status: isHealthy ? "pass" : "fail",
          message: isHealthy ? `${page.name} is accessible` : `${page.name} is not accessible`,
        })
      } catch (error) {
        results.push({
          name: page.name,
          status: "fail",
          message: `Failed to check ${page.name}`,
        })
      }
    }

    return results
  }

  private async checkEnvironmentVariables(): Promise<VerificationResult> {
    const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

    const missingVars = requiredVars.filter((varName) => !process.env[varName])

    if (missingVars.length === 0) {
      return {
        name: "Environment Variables",
        status: "pass",
        message: "All required environment variables are set",
      }
    } else {
      return {
        name: "Environment Variables",
        status: "fail",
        message: `Missing variables: ${missingVars.join(", ")}`,
      }
    }
  }

  public async runVerification(): Promise<void> {
    console.log("🔍 Starting deployment verification...\n")

    // Check environment variables
    this.results.push(await this.checkEnvironmentVariables())

    // Check database
    this.results.push(await this.checkDatabase())

    // Check authentication
    this.results.push(await this.checkAuthentication())

    // Check Stripe
    this.results.push(await this.checkStripe())

    // Check pages
    const pageResults = await this.checkPages()
    this.results.push(...pageResults)

    this.printResults()
  }

  private printResults(): void {
    console.log("📊 Verification Results:")
    console.log("========================\n")

    let passCount = 0
    let failCount = 0
    let warningCount = 0

    this.results.forEach((result) => {
      const icon = result.status === "pass" ? "✅" : result.status === "warning" ? "⚠️" : "❌"
      console.log(`${icon} ${result.name}: ${result.message}`)

      if (result.status === "pass") passCount++
      else if (result.status === "fail") failCount++
      else warningCount++
    })

    console.log("\n📈 Summary:")
    console.log(`✅ Passed: ${passCount}`)
    console.log(`⚠️  Warnings: ${warningCount}`)
    console.log(`❌ Failed: ${failCount}`)

    if (failCount === 0) {
      console.log("\n🎉 Deployment verification completed successfully!")
      console.log("Your Property Management System is ready for use.")
    } else {
      console.log("\n⚠️  Some checks failed. Please review the issues above.")
    }

    console.log("\n🔗 Access your system:")
    console.log(`Admin Portal: ${this.baseUrl}/admin/login`)
    console.log(`Tenant Portal: ${this.baseUrl}/login`)
    console.log(`API Health: ${this.baseUrl}/api/health`)
  }
}

// Main execution
async function main() {
  const baseUrl = process.argv[2] || process.env.VERCEL_URL || "http://localhost:3000"

  if (!baseUrl.startsWith("http")) {
    console.error("❌ Please provide a valid URL")
    console.log("Usage: npm run verify-deployment <URL>")
    console.log("Example: npm run verify-deployment https://your-app.vercel.app")
    process.exit(1)
  }

  const verifier = new DeploymentVerifier(baseUrl)
  await verifier.runVerification()
}

if (require.main === module) {
  main().catch(console.error)
}
