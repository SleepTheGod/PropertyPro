import { NextResponse } from "next/server"
import { createPaymentIntent, getOrCreateCustomer } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const { amount, currency = "usd", email, name, description } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create or get customer if email is provided
    let customerId
    if (email && name) {
      const customer = await getOrCreateCustomer(email, name)
      customerId = customer.id
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(amount, currency, customerId)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
