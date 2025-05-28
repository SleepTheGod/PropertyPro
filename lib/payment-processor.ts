import { stripe } from "./stripe"
import { sendPaymentConfirmationEmail } from "./email"
import { sendPaymentConfirmationSMS } from "./sms"
import { updatePaymentRecord } from "./database"

// Process successful payment
export async function processPaymentSucceeded(paymentIntent: any) {
  try {
    console.log(`Processing successful payment: ${paymentIntent.id}`)

    // Extract payment details
    const { amount, currency, customer, metadata } = paymentIntent
    const amountFormatted = (amount / 100).toFixed(2)

    // Update payment record in database
    await updatePaymentRecord(paymentIntent.id, {
      status: "succeeded",
      amount: amountFormatted,
      currency,
      customerId: customer,
      metadata,
      processedAt: new Date(),
    })

    // Get customer details if available
    let customerEmail = ""
    let customerName = ""
    let customerPhone = ""

    if (customer) {
      const customerDetails = await stripe.customers.retrieve(customer)
      if (customerDetails && !("deleted" in customerDetails)) {
        customerEmail = customerDetails.email || ""
        customerName = customerDetails.name || ""
        customerPhone = customerDetails.phone || ""
      }
    }

    // Send confirmation email if we have an email
    if (customerEmail) {
      await sendPaymentConfirmationEmail(customerEmail, customerName, paymentIntent.id, amountFormatted, currency)
    }

    // Send confirmation SMS if we have a phone number
    if (customerPhone) {
      await sendPaymentConfirmationSMS(customerPhone, paymentIntent.id, amountFormatted, currency)
    }

    console.log(`Payment ${paymentIntent.id} processed successfully`)
    return true
  } catch (error) {
    console.error("Error processing payment success:", error)
    // Still return true to acknowledge the webhook
    return true
  }
}

// Process failed payment
export async function processPaymentFailed(paymentIntent: any) {
  try {
    console.log(`Processing failed payment: ${paymentIntent.id}`)

    // Extract payment details
    const { amount, currency, customer, last_payment_error } = paymentIntent
    const amountFormatted = (amount / 100).toFixed(2)
    const errorMessage = last_payment_error?.message || "Unknown error"

    // Update payment record in database
    await updatePaymentRecord(paymentIntent.id, {
      status: "failed",
      amount: amountFormatted,
      currency,
      customerId: customer,
      errorMessage,
      processedAt: new Date(),
    })

    // Get customer details if available
    let customerEmail = ""
    let customerName = ""

    if (customer) {
      const customerDetails = await stripe.customers.retrieve(customer)
      if (customerDetails && !("deleted" in customerDetails)) {
        customerEmail = customerDetails.email || ""
        customerName = customerDetails.name || ""
      }
    }

    // Send failure notification to admin
    // This would be implemented in a real system

    console.log(`Failed payment ${paymentIntent.id} processed`)
    return true
  } catch (error) {
    console.error("Error processing payment failure:", error)
    // Still return true to acknowledge the webhook
    return true
  }
}
