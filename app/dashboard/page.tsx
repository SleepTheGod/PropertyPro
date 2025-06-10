"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Wrench, MessageSquare, Calendar, DollarSign, Home } from "lucide-react"
import Link from "next/link"

interface TenantDashboardData {
  tenant: {
    name: string
    unit: string
    property: string
    leaseEnd: string
  }
  payments: {
    nextDue: {
      amount: number
      dueDate: string
      status: string
    }
    history: Array<{
      id: number
      amount: number
      date: string
      status: string
      type: string
    }>
  }
  maintenance: {
    active: number
    recent: Array<{
      id: number
      title: string
      status: string
      date: string
      priority: string
    }>
  }
  announcements: Array<{
    id: number
    title: string
    date: string
    category: string
  }>
}

export default function TenantDashboard() {
  const [data, setData] = useState<TenantDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  // Mock data for demo purposes
  const mockData: TenantDashboardData = {
    tenant: {
      name: "John Doe",
      unit: "Apt 204",
      property: "Sunset Towers",
      leaseEnd: "2024-12-31",
    },
    payments: {
      nextDue: {
        amount: 1850,
        dueDate: "2024-05-01",
        status: "due",
      },
      history: [
        { id: 1, amount: 1850, date: "2024-04-01", status: "paid", type: "rent" },
        { id: 2, amount: 1850, date: "2024-03-01", status: "paid", type: "rent" },
        { id: 3, amount: 1850, date: "2024-02-01", status: "paid", type: "rent" },
      ],
    },
    maintenance: {
      active: 1,
      recent: [
        { id: 1, title: "Leaky faucet in kitchen", status: "in_progress", date: "2024-04-25", priority: "medium" },
        { id: 2, title: "AC unit maintenance", status: "completed", date: "2024-04-20", priority: "low" },
        { id: 3, title: "Broken light fixture", status: "completed", date: "2024-04-15", priority: "high" },
      ],
    },
    announcements: [
      { id: 1, title: "Building Maintenance Notice", date: "2024-04-29", category: "Maintenance" },
      { id: 2, title: "Community BBQ Event", date: "2024-04-27", category: "Events" },
      { id: 3, title: "Parking Lot Repainting", date: "2024-04-25", category: "Maintenance" },
    ],
  }

  const displayData = data || mockData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "default"
      case "due":
      case "overdue":
        return "destructive"
      case "in_progress":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "emergency":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {displayData.tenant.name}!</h1>
          <p className="text-muted-foreground">
            {displayData.tenant.unit} • {displayData.tenant.property}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/payments">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pay Rent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${displayData.payments.nextDue.amount}</div>
              <p className="text-xs text-muted-foreground">Due {displayData.payments.nextDue.dueDate}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/maintenance">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayData.maintenance.active}</div>
              <p className="text-xs text-muted-foreground">Active requests</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/bulletin">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bulletin Board</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{displayData.announcements.length}</div>
              <p className="text-xs text-muted-foreground">New announcements</p>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lease Info</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 months</div>
            <p className="text-xs text-muted-foreground">Until lease end</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Next Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${displayData.payments.nextDue.amount}</p>
                  <p className="text-sm text-muted-foreground">Due {displayData.payments.nextDue.dueDate}</p>
                </div>
                <Badge variant={getStatusColor(displayData.payments.nextDue.status)}>
                  {displayData.payments.nextDue.status.toUpperCase()}
                </Badge>
              </div>
              <Link href="/dashboard/payments">
                <Button className="w-full">Pay Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayData.payments.history.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">${payment.amount}</p>
                    <p className="text-xs text-muted-foreground">{payment.date}</p>
                  </div>
                  <Badge variant={getStatusColor(payment.status)}>{payment.status}</Badge>
                </div>
              ))}
              <Link href="/dashboard/payments">
                <Button variant="outline" size="sm" className="w-full">
                  View All Payments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance & Announcements */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayData.maintenance.recent.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{request.title}</p>
                    <p className="text-xs text-muted-foreground">{request.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityColor(request.priority)} className="text-xs">
                      {request.priority}
                    </Badge>
                    <Badge variant={getStatusColor(request.status)} className="text-xs">
                      {request.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/maintenance">
                <Button variant="outline" size="sm" className="w-full">
                  View All Requests
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayData.announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">{announcement.date}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {announcement.category}
                  </Badge>
                </div>
              ))}
              <Link href="/dashboard/bulletin">
                <Button variant="outline" size="sm" className="w-full">
                  View Bulletin Board
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
