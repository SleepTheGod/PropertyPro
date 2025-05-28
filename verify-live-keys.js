import { Stripe } from "stripe"
import dotenv from "dotenv"

dotenv.config()

// Initialize Stripe with the live key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function verifyLiveKeys() {
  try {
    console.log("🔍 Verifying Stripe live keys...")

    // Check if we're in live mode
    const account = await stripe.account.retrieve()

    if (!account.charges_enabled) {
      console.error("⚠️ WARNING: Your Stripe account is not fully activated for charges")
      return false
    }

    if (process.env.STRIPE_SECRET_KEY.startsWith("sk_test_")) {
      console.error("⚠️ ERROR: You are still using TEST keys. Please update to LIVE keys")
      return false
    }

    console.log("✅ Stripe live keys verified successfully")
    console.log(`🏢 Connected to Stripe account: ${account.business_profile.name}`)
    console.log(`💰 Account status: ${account.charges_enabled ? "Active" : "Pending"}`)

    // Verify webhook endpoints
    const webhooks = await stripe.webhookEndpoints.list()
    console.log(`🔔 Active webhooks: ${webhooks.data.length}`)

    return true
  } catch (error) {
    console.error("❌ Error verifying Stripe keys:", error.message)
    return false
  }
}

verifyLiveKeys()
