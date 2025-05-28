import { Suspense } from "react"
import { listRecentPayments } from "@/lib/stripe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

// Server component to fetch and display payments
async function PaymentsTable() {
  // This runs on the server
  const payments = await listRecentPayments(25)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-mono text-xs">{payment.id}</TableCell>
            <TableCell>{formatCurrency(payment.amount / 100, payment.currency)}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  payment.status === "succeeded"
                    ? "bg-green-100 text-green-800"
                    : payment.status === "processing"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {payment.status}
              </span>
            </TableCell>
            <TableCell>{formatDate(new Date(payment.created * 1000))}</TableCell>
            <TableCell>{payment.customer || "Guest"}</TableCell>
          </TableRow>
        ))}
        {payments.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
              No payments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Payment Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$12,345.67</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Successful Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">98.2%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">156</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading payments...</div>}>
            <PaymentsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
