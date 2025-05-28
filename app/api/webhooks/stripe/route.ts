import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    if (!signature) {
      console.error("No Stripe signature found")
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    console.log(`✅ Webhook received: ${event.type}`)

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(event.data.object)
        break

      case "payment_intent.payment_failed":
        await handlePaymentFailed(event.data.object)
        break

      case "customer.created":
        await handleCustomerCreated(event.data.object)
        break

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  try {
    const { id, amount, currency, customer, metadata } = paymentIntent
    const amountDollars = amount / 100

    // Update payment record in database
    await sql`
      UPDATE payments 
      SET 
        status = 'completed',
        stripe_payment_intent_id = ${id},
        amount = ${amountDollars},
        currency = ${currency},
        processed_at = NOW(),
        updated_at = NOW()
      WHERE stripe_payment_intent_id = ${id}
    `

    // If this is a rent payment, update tenant balance
    if (metadata?.type === "rent_payment" && metadata?.tenant_id) {
      await sql`
        UPDATE tenant_balances 
        SET 
          balance = balance - ${amountDollars},
          last_payment_date = NOW(),
          updated_at = NOW()
        WHERE tenant_id = ${metadata.tenant_id}
      `
    }

    // Send confirmation email/SMS
    if (customer) {
      const customerData = await stripe.customers.retrieve(customer)
      if (customerData && !("deleted" in customerData)) {
        await sendPaymentConfirmation(customerData, paymentIntent)
      }
    }

    console.log(`✅ Payment succeeded: ${id} - $${amountDollars}`)
  } catch (error) {
    console.error("Error handling payment success:", error)
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    const { id, amount, currency, last_payment_error } = paymentIntent
    const amountDollars = amount / 100

    // Update payment record
    await sql`
      UPDATE payments 
      SET 
        status = 'failed',
        error_message = ${last_payment_error?.message || "Unknown error"},
        updated_at = NOW()
      WHERE stripe_payment_intent_id = ${id}
    `

    console.log(`❌ Payment failed: ${id} - $${amountDollars} - ${last_payment_error?.message}`)
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}

async function handleCustomerCreated(customer: any) {
  try {
    const { id, email, name, phone } = customer

    // Store customer in database
    await sql`
      INSERT INTO stripe_customers (stripe_customer_id, email, name, phone, created_at)
      VALUES (${id}, ${email}, ${name}, ${phone}, NOW())
      ON CONFLICT (stripe_customer_id) DO NOTHING
    `

    console.log(`✅ Customer created: ${id} - ${email}`)
  } catch (error) {
    console.error("Error handling customer creation:", error)
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log(`✅ Invoice payment succeeded: ${invoice.id}`)
    // Handle recurring payment success
  } catch (error) {
    console.error("Error handling invoice payment success:", error)
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log(`❌ Invoice payment failed: ${invoice.id}`)
    // Handle recurring payment failure
  } catch (error) {
    console.error("Error handling invoice payment failure:", error)
  }
}

async function sendPaymentConfirmation(customer: any, paymentIntent: any) {
  // This would integrate with your email/SMS service
  console.log(`Sending payment confirmation to ${customer.email}`)
}
