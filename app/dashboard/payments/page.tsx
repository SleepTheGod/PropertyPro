"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check, CreditCard, DollarSign, FileText, Receipt } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaymentsPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentAmount, setPaymentAmount] = useState("1250")
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment submission logic here
    setPaymentSubmitted(true)
    setTimeout(() => {
      setPaymentSubmitted(false)
      // Reset form or redirect
    }, 3000)
  }

  // Mock payment data
  const tenant = {
    balance: 1250,
    dueDate: "May 15, 2024",
    lateFee: 50,
    graceDate: "May 20, 2024",
  }

  const paymentHistory = [
    { id: 1, date: "Apr 15, 2024", amount: 1250, status: "Paid", method: "Credit Card", reference: "TX-123456" },
    { id: 2, date: "Mar 15, 2024", amount: 1250, status: "Paid", method: "Bank Transfer", reference: "TX-123455" },
    { id: 3, date: "Feb 15, 2024", amount: 1250, status: "Paid", method: "Credit Card", reference: "TX-123454" },
    { id: 4, date: "Jan 15, 2024", amount: 1250, status: "Paid", method: "Credit Card", reference: "TX-123453" },
    { id: 5, date: "Dec 15, 2023", amount: 1250, status: "Paid", method: "Bank Transfer", reference: "TX-123452" },
  ]

  const savedPaymentMethods = [
    { id: 1, type: "card", name: "Visa ending in 4242", expiry: "05/25", default: true },
    { id: 2, type: "bank", name: "Checking ****6789", bank: "Chase", default: false },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage your rent payments and view payment history.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tenant.balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Due on {tenant.dueDate}</p>
          </CardContent>
        </Card>

        {/* Late Fee */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Late Fee</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tenant.lateFee.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Applied after {tenant.graceDate}</p>
          </CardContent>
        </Card>

        {/* Last Payment */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paymentHistory[0].amount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Paid on {paymentHistory[0].date}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="make-payment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="make-payment">Make a Payment</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="autopay">AutoPay</TabsTrigger>
        </TabsList>

        <TabsContent value="make-payment">
          <Card>
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Pay your rent securely online with multiple payment options.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {paymentSubmitted && (
                  <Alert className="bg-green-50 text-green-800 border-green-200">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Payment Successful!</AlertTitle>
                    <AlertDescription>
                      Your payment of ${Number.parseFloat(paymentAmount).toFixed(2)} has been processed successfully.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      className="pl-8"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="space-y-2">
                      {savedPaymentMethods.map((method) => (
                        <div key={method.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={`saved-${method.id}`} id={`saved-${method.id}`} />
                          <Label htmlFor={`saved-${method.id}`} className="flex items-center gap-2 cursor-pointer">
                            {method.type === "card" ? (
                              <CreditCard className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                            <span>{method.name}</span>
                            {method.default && <span className="text-xs text-muted-foreground">(Default)</span>}
                          </Label>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-4 w-4" />
                          <span>New Credit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                          <FileText className="h-4 w-4" />
                          <span>New Bank Account</span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiration Date</Label>
                        <Input id="expiry" placeholder="MM/YY" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="routing">Routing Number</Label>
                      <Input id="routing" placeholder="123456789" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account">Account Number</Label>
                      <Input id="account" placeholder="987654321" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-type">Account Type</Label>
                      <Select required>
                        <SelectTrigger id="account-type">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checking">Checking</SelectItem>
                          <SelectItem value="savings">Savings</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Holder Name</Label>
                      <Input id="account-name" placeholder="John Doe" required />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="save-payment"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="save-payment" className="text-sm font-normal">
                    Save this payment method for future payments
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Pay ${Number.parseFloat(paymentAmount).toFixed(2)}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payment-history">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View your past rent payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentHistory.length === 0 ? (
                <p>No payment history available.</p>
              ) : (
                <div className="grid gap-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border rounded-md p-4">
                      <div className="font-semibold">{payment.date}</div>
                      <div className="text-sm text-muted-foreground">Amount: ${payment.amount.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Method: {payment.method}</div>
                      <div className="text-sm text-muted-foreground">Reference: {payment.reference}</div>
                      <div className="text-sm text-muted-foreground">Status: {payment.status}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your saved payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedPaymentMethods.length === 0 ? (
                <p>No payment methods saved.</p>
              ) : (
                <div className="space-y-2">
                  {savedPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between border rounded-md p-4">
                      <div>
                        <div className="font-semibold">{method.name}</div>
                        {method.type === "card" ? (
                          <div className="text-sm text-muted-foreground">Expiry: {method.expiry}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Bank: {method.bank}</div>
                        )}
                      </div>
                      {method.default && <span className="text-xs text-muted-foreground">(Default)</span>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autopay">
          <Card>
            <CardHeader>
              <CardTitle>AutoPay</CardTitle>
              <CardDescription>Set up automatic rent payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Coming soon!</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
