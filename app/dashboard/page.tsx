"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, DollarSign, Users, Wrench, AlertTriangle, CheckCircle, Clock, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardData {
  user: {
    id: string
    first_name: string
    last_name: string
    role: string
    email: string
  }
  stats: {
    totalProperties: number
    totalTenants: number
    monthlyRevenue: number
    pendingMaintenance: number
    occupancyRate: number
    collectionRate: number
  }
  recentPayments: Array<{
    id: string
    tenant_name: string
    amount: number
    date: string
    status: string
  }>
  maintenanceRequests: Array<{
    id: string
    property_address: string
    description: string
    priority: string
    status: string
    created_at: string
  }>
  upcomingRent: Array<{
    id: string
    tenant_name: string
    property_address: string
    amount: number
    due_date: string
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      } else {
        throw new Error("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unable to load dashboard</h2>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    )
  }

  const { user, stats, recentPayments, maintenanceRequests, upcomingRent } = data

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.first_name}!</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">Active properties under management</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">Occupancy rate: {stats.occupancyRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Collection rate: {stats.collectionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">Requests awaiting attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Payments */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Latest rent payments received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{payment.tenant_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">${payment.amount}</span>
                    <Badge variant={payment.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Requests */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>Recent maintenance issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {request.priority === "high" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : request.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{request.property_address}</p>
                    <p className="text-xs text-muted-foreground truncate">{request.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={request.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {request.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Rent */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Rent Due</CardTitle>
          <CardDescription>Rent payments due in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingRent.map((rent) => (
              <div key={rent.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{rent.tenant_name}</p>
                  <p className="text-xs text-muted-foreground">{rent.property_address}</p>
                  <p className="text-xs text-muted-foreground">Due: {new Date(rent.due_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">${rent.amount}</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    Send Reminder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
