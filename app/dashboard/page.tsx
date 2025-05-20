"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Building, Calendar, CreditCard, MessageSquare, Plus, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false)

  // Mock data
  const tenant = {
    name: "Alex Johnson",
    unit: "Apt 302",
    property: "Sunset Towers",
    avatar: "/placeholder.svg?height=40&width=40",
    balance: 0,
    nextPayment: {
      amount: 1500,
      dueDate: "May 1, 2024",
      status: "upcoming",
    },
    leaseEnd: "Oct 31, 2024",
  }

  const maintenanceRequests = [
    {
      id: "REQ-2024-042",
      title: "Leaking Faucet in Kitchen",
      status: "in-progress",
      priority: "medium",
      date: "Apr 15, 2024",
      lastUpdate: "Apr 16, 2024",
      description: "The kitchen sink faucet is leaking from the base when turned on.",
    },
    {
      id: "REQ-2024-039",
      title: "Broken Light Fixture in Bathroom",
      status: "scheduled",
      priority: "low",
      date: "Apr 10, 2024",
      lastUpdate: "Apr 12, 2024",
      description: "The light fixture in the main bathroom is not working properly.",
    },
    {
      id: "REQ-2024-036",
      title: "AC Not Cooling Properly",
      status: "completed",
      priority: "high",
      date: "Apr 5, 2024",
      lastUpdate: "Apr 8, 2024",
      description: "The air conditioning unit is running but not cooling the apartment.",
    },
  ]

  const announcements = [
    {
      id: 1,
      title: "Building Maintenance Notice",
      date: "Apr 29, 2024",
      content: "The water will be shut off on May 5th from 10am-2pm for routine maintenance. Please plan accordingly.",
    },
    {
      id: 2,
      title: "Community BBQ",
      date: "Apr 27, 2024",
      content: "Join us for a community BBQ in the courtyard on May 20th at 4pm. Food and drinks will be provided.",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Rent Due",
      date: "May 1, 2024",
      type: "payment",
    },
    {
      id: 2,
      title: "Building Maintenance",
      date: "May 5, 2024",
      time: "10:00 AM - 2:00 PM",
      type: "maintenance",
    },
    {
      id: 3,
      title: "Community BBQ",
      date: "May 20, 2024",
      time: "4:00 PM",
      type: "event",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "scheduled":
        return "bg-yellow-500"
      case "pending":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {tenant.name}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tenant Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Your Information</CardTitle>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={tenant.avatar || "/placeholder.svg"} alt={tenant.name} />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{tenant.name}</div>
                <div className="text-sm text-muted-foreground">{tenant.unit}</div>
                <div className="text-sm text-muted-foreground">{tenant.property}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 pt-3">
            <div className="grid w-full grid-cols-2 gap-2 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Lease Ends</span>
                <span>{tenant.leaseEnd}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Balance</span>
                <span>${tenant.balance.toFixed(2)}</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Payment Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Next Payment</CardTitle>
          </CardHeader>
          <CardContent className="pb-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${tenant.nextPayment.amount}</div>
              <Badge variant={tenant.nextPayment.status === "overdue" ? "destructive" : "outline"}>
                {tenant.nextPayment.status === "overdue" ? "Overdue" : "Upcoming"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Due on {tenant.nextPayment.dueDate}</p>
          </CardContent>
          <CardFooter className="pt-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/payments">
                Make Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/maintenance">
                <Plus className="mr-2 h-4 w-4" />
                New Maintenance Request
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/payments">
                <CreditCard className="mr-2 h-4 w-4" />
                View Payment History
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/bulletin">
                <MessageSquare className="mr-2 h-4 w-4" />
                Community Bulletin
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Maintenance Requests */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>Your recent maintenance requests</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Maintenance Request</DialogTitle>
                  <DialogDescription>Submit a new maintenance request for your unit.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Issue Title
                    </label>
                    <input
                      id="title"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="e.g., Leaking Faucet"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Please describe the issue in detail..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="priority" className="text-sm font-medium">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {maintenanceRequests.map((request) => (
              <div key={request.id} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{request.title}</div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(request.status)}`} />
                    <span className="text-xs capitalize">{request.status.replace("-", " ")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>ID: {request.id}</div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getPriorityColor(request.priority)}`} />
                    <span className="capitalize">{request.priority}</span>
                  </div>
                </div>
                <Separator />
                <div className="text-sm">{request.description}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>Submitted: {request.date}</div>
                  <div>Last Update: {request.lastUpdate}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/maintenance">View All Requests</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Announcements & Events */}
        <Card className="md:col-span-1">
          <Tabs defaultValue="announcements">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Community Updates</CardTitle>
                <TabsList>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                  <TabsTrigger value="events">Upcoming</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="announcements" className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-lg border p-3">
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-xs text-muted-foreground">{announcement.date}</div>
                    <Separator className="my-2" />
                    <p className="text-sm">{announcement.content}</p>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/bulletin">View All Announcements</Link>
                </Button>
              </TabsContent>
              <TabsContent value="events" className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div
                      className={`mt-0.5 rounded-full p-2 ${
                        event.type === "payment"
                          ? "bg-blue-100 text-blue-600"
                          : event.type === "maintenance"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {event.type === "payment" ? (
                        <CreditCard className="h-4 w-4" />
                      ) : event.type === "maintenance" ? (
                        <Building className="h-4 w-4" />
                      ) : (
                        <Calendar className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm">{event.date}</div>
                      {event.time && <div className="text-xs text-muted-foreground">{event.time}</div>}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
