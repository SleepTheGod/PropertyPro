"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Users,
  CreditCard,
  Wrench,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
} from "lucide-react"

interface DashboardStats {
  totalProperties: number
  totalUnits: number
  totalTenants: number
  occupancyRate: number
  monthlyRevenue: number
  pendingPayments: number
  maintenanceRequests: {
    open: number
    inProgress: number
    completed: number
  }
  recentActivity: Array<{
    id: number
    type: string
    description: string
    timestamp: string
    status: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
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
  const mockStats: DashboardStats = {
    totalProperties: 12,
    totalUnits: 156,
    totalTenants: 142,
    occupancyRate: 91.0,
    monthlyRevenue: 285400,
    pendingPayments: 8,
    maintenanceRequests: {
      open: 15,
      inProgress: 8,
      completed: 45,
    },
    recentActivity: [
      {
        id: 1,
        type: "payment",
        description: "Rent payment received from John Doe - Unit 204",
        timestamp: "2 hours ago",
        status: "completed",
      },
      {
        id: 2,
        type: "maintenance",
        description: "New maintenance request - Leaky faucet in Unit 301",
        timestamp: "4 hours ago",
        status: "open",
      },
      {
        id: 3,
        type: "tenant",
        description: "New tenant application for Unit 105",
        timestamp: "6 hours ago",
        status: "pending",
      },
      {
        id: 4,
        type: "payment",
        description: "Late payment reminder sent to Unit 412",
        timestamp: "1 day ago",
        status: "sent",
      },
    ],
  }

  const displayStats = stats || mockStats

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your property management system</p>
        </div>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalUnits}</div>
            <p className="text-xs text-muted-foreground">{displayStats.occupancyRate}% occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalTenants}</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${displayStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Pending Payments</span>
                <Badge variant="destructive">{displayStats.pendingPayments}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed This Month</span>
                <Badge variant="default">134</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Collection Rate</span>
                <Badge variant="default">94.3%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Open</span>
                <Badge variant="destructive">{displayStats.maintenanceRequests.open}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">In Progress</span>
                <Badge variant="secondary">{displayStats.maintenanceRequests.inProgress}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completed</span>
                <Badge variant="default">{displayStats.maintenanceRequests.completed}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{displayStats.occupancyRate}%</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Occupied</span>
                <span>{displayStats.totalTenants} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Vacant</span>
                <span>{displayStats.totalUnits - displayStats.totalTenants} units</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayStats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {activity.type === "payment" && <CreditCard className="h-5 w-5 text-green-600" />}
                  {activity.type === "maintenance" && <Wrench className="h-5 w-5 text-orange-600" />}
                  {activity.type === "tenant" && <Users className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <div className="flex-shrink-0">
                  {activity.status === "completed" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activity.status === "open" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  {activity.status === "pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                  {activity.status === "sent" && <CheckCircle className="h-4 w-4 text-blue-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
