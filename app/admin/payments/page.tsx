"use client"

import { useState } from "react"
import { CreditCard, Download, Filter, MoreHorizontal, Search, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for payments
const initialPayments = [
  {
    id: 1,
    tenant: {
      id: 1,
      name: "John Smith",
      avatar: "/placeholder.svg?key=3gdo9",
    },
    property: "Sunset Towers",
    unit: "Apt 304",
    amount: 1250,
    date: "2024-04-15T09:30:00",
    dueDate: "2024-04-15",
    status: "Paid",
    method: "Credit Card",
    reference: "TX-123456",
  },
  {
    id: 2,
    tenant: {
      id: 2,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?key=8ej2k",
    },
    property: "Riverside Apartments",
    unit: "Apt 205",
    amount: 1250,
    date: "2024-04-15T10:45:00",
    dueDate: "2024-04-15",
    status: "Paid",
    method: "Bank Transfer",
    reference: "TX-123455",
  },
  {
    id: 3,
    tenant: {
      id: 3,
      name: "Michael Chen",
      avatar: "/placeholder.svg?key=9fk3l",
    },
    property: "Oakwood Residences",
    unit: "Apt 512",
    amount: 1250,
    date: "2024-04-14T14:20:00",
    dueDate: "2024-04-15",
    status: "Paid",
    method: "Credit Card",
    reference: "TX-123454",
  },
  {
    id: 4,
    tenant: {
      id: 4,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?key=7dk2j",
    },
    property: "Sunset Towers",
    unit: "Apt 101",
    amount: 1250,
    date: null,
    dueDate: "2024-05-15",
    status: "Overdue",
    method: null,
    reference: null,
  },
  {
    id: 5,
    tenant: {
      id: 5,
      name: "David Wilson",
      avatar: "/placeholder.svg?key=5hl9m",
    },
    property: "Riverside Apartments",
    unit: "Apt 405",
    amount: 1250,
    date: null,
    dueDate: "2024-05-15",
    status: "Pending",
    method: null,
    reference: null,
  },
]

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [payments, setPayments] = useState(initialPayments)

  const handleDeletePayment = (id: number) => {
    setPayments(payments.filter((payment) => payment.id !== id))
  }

  const filteredPayments = payments.filter(
    (payment) =>
      payment.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.method && payment.method.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (payment.reference && payment.reference.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const paidPayments = filteredPayments.filter((payment) => payment.status === "Paid")
  const pendingPayments = filteredPayments.filter((payment) => payment.status === "Pending")
  const overduePayments = filteredPayments.filter((payment) => payment.status === "Overdue")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
            Paid
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
            Pending
          </Badge>
        )
      case "Overdue":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Manage and track rent payments across all properties.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search payments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidPayments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overduePayments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Payments</CardTitle>
              <CardDescription>
                Showing {filteredPayments.length} of {payments.length} total payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={payment.tenant.avatar || "/placeholder.svg"} alt={payment.tenant.name} />
                            <AvatarFallback>
                              {payment.tenant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payment.tenant.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{payment.property}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{payment.property}</div>
                        <div className="text-xs text-muted-foreground">{payment.unit}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.method || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePayment(payment.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No payments found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Paid Payments</CardTitle>
              <CardDescription>Payments that have been successfully processed.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Payment Date</TableHead>
                    <TableHead className="hidden md:table-cell">Method</TableHead>
                    <TableHead className="hidden md:table-cell">Reference</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={payment.tenant.avatar || "/placeholder.svg"} alt={payment.tenant.name} />
                            <AvatarFallback>
                              {payment.tenant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{payment.tenant.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{payment.property}</div>
                        <div className="text-xs text-muted-foreground">{payment.unit}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {payment.date ? new Date(payment.date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                      <TableCell className="hidden md:table-cell">{payment.reference}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paidPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No paid payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payments that are due but not yet paid.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={payment.tenant.avatar || "/placeholder.svg"} alt={payment.tenant.name} />
                            <AvatarFallback>
                              {payment.tenant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{payment.tenant.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{payment.property}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>{payment.property}</div>
                        <div className="text-xs text-muted-foreground">{payment.unit}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm">Mark as Paid</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No pending payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Overdue Payments</CardTitle>
              <CardDescription>Payments that are past their due date.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Property/Unit</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="hidden md:table-cell">Days Overdue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overduePayments.map((payment) => {
                    const dueDate = new Date(payment.dueDate)
                    const today = new Date()
                    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={payment.tenant.avatar || "/placeholder.svg"}
                                alt={payment.tenant.name}
                              />
                              <AvatarFallback>
                                {payment.tenant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{payment.tenant.name}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{payment.property}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div>{payment.property}</div>
                          <div className="text-xs text-muted-foreground">{payment.unit}</div>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-500">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell text-red-500">{daysOverdue} days</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Send Reminder
                            </Button>
                            <Button size="sm">Mark as Paid</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  {overduePayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No overdue payments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Payment Overview</CardTitle>
          <CardDescription>Summary of payment status across all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium">Payment Status</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-green-500" />
                      <span>Paid</span>
                    </div>
                    <span>{paidPayments.length} payments</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${(paidPayments.length / payments.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Pending</span>
                    </div>
                    <span>{pendingPayments.length} payments</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: `${(pendingPayments.length / payments.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-red-500" />
                      <span>Overdue</span>
                    </div>
                    <span>{overduePayments.length} payments</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: `${(overduePayments.length / payments.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium">Payment Methods</h3>
              <div className="space-y-4">
                {["Credit Card", "Bank Transfer", "Cash", "Check"].map((method) => {
                  const methodPayments = payments.filter((p) => p.method === method)
                  const percentage = Math.round((methodPayments.length / paidPayments.length) * 100) || 0

                  return (
                    <div key={method} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>{method}</span>
                        </div>
                        <span>
                          {methodPayments.length} payments ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
