import { Stripe } from "stripe"
import { headers } from "next/headers"

// Initialize Stripe with the environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables")
}

// Create a Stripe instance
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16", // Use the latest API version
  appInfo: {
    name: "Property Management System",
    version: "1.0.0",
  },
})

// Helper function to verify Stripe webhook signatures
export async function verifyStripeWebhook(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    throw new Error("No Stripe signature found")
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined in environment variables")
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    return { event, rawBody: body }
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    throw new Error(`Webhook Error: ${err.message}`)
  }
}

// Helper function to create a payment intent
export async function createPaymentIntent(amount: number, currency = "usd", customerId?: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      ...(customerId && { customer: customerId }),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: "property_management_system",
      },
    })

    return paymentIntent
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}

// Helper function to retrieve a customer or create if not exists
export async function getOrCreateCustomer(email: string, name: string) {
  try {
    // Search for existing customer
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    })

    if (customers.data.length > 0) {
      return customers.data[0]
    }

    // Create new customer if not found
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: "property_management_system",
      },
    })

    return customer
  } catch (error) {
    console.error("Error getting or creating customer:", error)
    throw error
  }
}

// Helper function to list recent payments
export async function listRecentPayments(limit = 10) {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit,
    })

    return paymentIntents.data
  } catch (error) {
    console.error("Error listing recent payments:", error)
    throw error
  }
}
