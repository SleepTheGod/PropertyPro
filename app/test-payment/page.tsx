"use client"

import { useState } from "react"
import PaymentForm from "@/components/payment-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestPaymentPage() {
  const [amount, setAmount] = useState(10.0)
  const [tenantId, setTenantId] = useState("1")
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentResult, setPaymentResult] = useState<any>(null)

  const handlePaymentSuccess = (paymentIntent: any) => {
    setPaymentResult({
      success: true,
      paymentIntent,
    })
    setShowPaymentForm(false)
  }

  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      error,
    })
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Test Stripe Payment Integration</h1>

      {!showPaymentForm && !paymentResult && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Test Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="tenantId">Tenant ID</Label>
              <Input id="tenantId" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
            </div>

            <Button onClick={() => setShowPaymentForm(true)} className="w-full">
              Start Payment Test
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Test Card Numbers:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  <strong>Success:</strong> 4242 4242 4242 4242
                </li>
                <li>
                  <strong>Declined:</strong> 4000 0000 0000 0002
                </li>
                <li>
                  <strong>Insufficient Funds:</strong> 4000 0000 0000 9995
                </li>
                <li>
                  <strong>Any future date for expiry, any 3-digit CVC</strong>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {showPaymentForm && (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
            ← Back to Setup
          </Button>

          <PaymentForm
            amount={amount}
            tenantId={tenantId}
            description="Test payment"
            type="test_payment"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      )}

      {paymentResult && (
        <Card>
          <CardHeader>
            <CardTitle>{paymentResult.success ? "✅ Payment Successful" : "❌ Payment Failed"}</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentResult.success ? (
              <div className="space-y-2">
                <p>
                  <strong>Payment ID:</strong> {paymentResult.paymentIntent.id}
                </p>
                <p>
                  <strong>Amount:</strong> ${(paymentResult.paymentIntent.amount / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {paymentResult.paymentIntent.status}
                </p>
              </div>
            ) : (
              <p className="text-red-600">{paymentResult.error}</p>
            )}

            <Button
              onClick={() => {
                setPaymentResult(null)
                setShowPaymentForm(false)
              }}
              className="mt-4"
            >
              Test Another Payment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
