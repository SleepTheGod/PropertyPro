import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { verifyAuth } from "@/lib/middleware-auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency = "usd", tenantId, propertyId, description, type = "rent_payment" } = await req.json()

    // Validate required fields
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 })
    }

    // Get tenant information
    const tenant = await sql`
      SELECT 
        t.*,
        u.email,
        u.first_name,
        u.last_name,
        u.phone,
        p.address as property_address
      FROM tenants t
      JOIN users u ON t.user_id = u.id
      JOIN properties p ON t.property_id = p.id
      WHERE t.id = ${tenantId}
    `

    if (tenant.length === 0) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    const tenantData = tenant[0]

    // Get or create Stripe customer
    let customerId = tenantData.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: tenantData.email,
        name: `${tenantData.first_name} ${tenantData.last_name}`,
        phone: tenantData.phone,
        metadata: {
          tenant_id: tenantId,
          property_id: propertyId || tenantData.property_id,
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Update tenant with Stripe customer ID
      await sql`
        UPDATE tenants 
        SET stripe_customer_id = ${customerId}, updated_at = NOW()
        WHERE id = ${tenantId}
      `
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      description: description || `${type.replace("_", " ")} - ${tenantData.property_address}`,
      metadata: {
        tenant_id: tenantId,
        property_id: propertyId || tenantData.property_id,
        type,
        user_id: user.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Store payment record in database
    await sql`
      INSERT INTO payments (
        tenant_id, 
        property_id, 
        amount, 
        currency, 
        description, 
        type, 
        status, 
        stripe_payment_intent_id,
        created_by,
        created_at,
        updated_at
      ) VALUES (
        ${tenantId}, 
        ${propertyId || tenantData.property_id}, 
        ${amount}, 
        ${currency}, 
        ${description || `${type.replace("_", " ")} - ${tenantData.property_address}`}, 
        ${type}, 
        'pending', 
        ${paymentIntent.id},
        ${user.id},
        NOW(),
        NOW()
      )
    `

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customer: {
        name: `${tenantData.first_name} ${tenantData.last_name}`,
        email: tenantData.email,
        property: tenantData.property_address,
      },
    })
  } catch (error: any) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment intent",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
