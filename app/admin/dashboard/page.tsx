"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  DollarSign,
  Users,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  UserCheck,
  Settings,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface AdminDashboardData {
  stats: {
    totalProperties: number
    totalTenants: number
    totalLandlords: number
    monthlyRevenue: number
    yearlyRevenue: number
    pendingMaintenance: number
    completedMaintenance: number
    occupancyRate: number
    collectionRate: number
    activeLeases: number
    expiringLeases: number
  }
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user: string
  }>
  financialSummary: {
    thisMonth: number
    lastMonth: number
    growth: number
    pendingPayments: number
    overduePayments: number
  }
  systemHealth: {
    uptime: string
    lastBackup: string
    activeUsers: number
    systemAlerts: number
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const adminData = await response.json()
        setData(adminData)
      } else {
        throw new Error("Failed to fetch admin data")
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin dashboard",
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
          <h2 className="text-2xl font-bold mb-2">Unable to load admin dashboard</h2>
          <Button onClick={fetchAdminData}>Try Again</Button>
        </div>
      </div>
    )
  }

  const { stats, recentActivity, financialSummary, systemHealth } = data

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="default">Administrator</Badge>
          <Button asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">{stats.occupancyRate}% occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTenants + stats.totalLandlords}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTenants} tenants, {stats.totalLandlords} landlords
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {financialSummary.growth > 0 ? "+" : ""}
              {financialSummary.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemHealth.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Active users, {systemHealth.systemAlerts} alerts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Active Leases:</span>
                  <span className="font-bold">{stats.activeLeases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expiring Soon:</span>
                  <span className="font-bold text-orange-600">{stats.expiringLeases}</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy Rate:</span>
                  <span className="font-bold text-green-600">{stats.occupancyRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-bold text-red-600">{stats.pendingMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-bold text-green-600">{stats.completedMaintenance}</span>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/admin/maintenance">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full" variant="outline">
                  <Link href="/admin/properties/new">
                    <Building className="mr-2 h-4 w-4" />
                    Add Property
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/admin/tenants/new">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Add Tenant
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link href="/admin/bulk-sms">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Send SMS
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Month:</span>
                    <span className="text-2xl font-bold">${financialSummary.thisMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Month:</span>
                    <span className="text-lg">${financialSummary.lastMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth:</span>
                    <span
                      className={`text-lg font-bold ${financialSummary.growth > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {financialSummary.growth > 0 ? "+" : ""}
                      {financialSummary.growth}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Collection Rate:</span>
                    <span className="text-lg font-bold text-green-600">{stats.collectionRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pending Payments:</span>
                    <span className="text-lg font-bold text-orange-600">
                      ${financialSummary.pendingPayments.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overdue Payments:</span>
                    <span className="text-lg font-bold text-red-600">
                      ${financialSummary.overduePayments.toLocaleString()}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/admin/payments">View All Payments</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Overview</CardTitle>
              <CardDescription>Current maintenance request status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.pendingMaintenance}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.completedMaintenance}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activity and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "payment" && <CreditCard className="h-4 w-4 text-green-500" />}
                      {activity.type === "maintenance" && <Wrench className="h-4 w-4 text-orange-500" />}
                      {activity.type === "user" && <Users className="h-4 w-4 text-blue-500" />}
                      {activity.type === "property" && <Building className="h-4 w-4 text-purple-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.user} • {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
