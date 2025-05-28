import { Stripe } from "stripe"
import dotenv from "dotenv"
import fs from "fs"

dotenv.config()

// Initialize Stripe with the live key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function setupPaymentMonitoring() {
  try {
    console.log("🔔 Setting up payment monitoring...")

    // Create a webhook endpoint for monitoring
    const webhook = await stripe.webhookEndpoints.create({
      url: `https://your-production-domain.com/api/webhooks/stripe`,
      enabled_events: [
        "charge.failed",
        "charge.succeeded",
        "payment_intent.payment_failed",
        "payment_intent.succeeded",
        "invoice.payment_failed",
        "invoice.payment_succeeded",
      ],
      description: "Production payment monitoring",
    })

    console.log(`✅ Webhook endpoint created: ${webhook.id}`)
    console.log(`🔑 Webhook signing secret: ${webhook.secret}`)
    console.log("⚠️ IMPORTANT: Update your STRIPE_WEBHOOK_SECRET with this value")

    // Create monitoring configuration
    const monitoringConfig = {
      alertEmail: "alerts@your-domain.com",
      alertThreshold: 3, // Alert after 3 failed payments
      dailySummary: true,
      logFailedPayments: true,
    }

    fs.writeFileSync("config/payment-monitoring.json", JSON.stringify(monitoringConfig, null, 2))

    console.log("✅ Payment monitoring configured successfully")
    return true
  } catch (error) {
    console.error("❌ Error setting up payment monitoring:", error.message)
    return false
  }
}

setupPaymentMonitoring()
