"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Building,
  CreditCard,
  DollarSign,
  Download,
  Home,
  PenToolIcon as Tool,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboardPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  // Mock data for the dashboard
  const stats = {
    properties: 12,
    units: 156,
    occupancyRate: 92,
    tenants: 143,
    pendingMaintenance: 8,
    monthlyRevenue: 187500,
    overduePayments: 5,
    overdueAmount: 6250,
  }

  const recentActivities = [
    { id: 1, action: "New tenant added", user: "Admin", date: "May 2, 2024", time: "10:23 AM" },
    { id: 2, action: "Maintenance request completed", user: "Maintenance Staff", date: "May 2, 2024", time: "9:45 AM" },
    { id: 3, action: "Payment received", user: "System", date: "May 2, 2024", time: "8:30 AM" },
    { id: 4, action: "Property added", user: "Admin", date: "May 1, 2024", time: "3:15 PM" },
    { id: 5, action: "Lease renewed", user: "Property Manager", date: "May 1, 2024", time: "1:20 PM" },
  ]

  const upcomingLeaseEnds = [
    { id: 1, tenant: "John Smith", unit: "Apt 101, Sunset Towers", endDate: "May 31, 2024" },
    { id: 2, tenant: "Sarah Johnson", unit: "Apt 205, Riverside Apartments", endDate: "Jun 15, 2024" },
    { id: 3, tenant: "Michael Chen", unit: "Apt 310, Oakwood Residences", endDate: "Jun 30, 2024" },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the PropertyPro administration portal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties}</div>
            <p className="text-xs text-muted-foreground">
              {stats.units} units ({stats.occupancyRate}% occupied)
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/properties" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Properties
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Tenants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tenants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tenants}</div>
            <p className="text-xs text-muted-foreground">{upcomingLeaseEnds.length} leases ending soon</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/tenants" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Manage Tenants
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Maintenance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingMaintenance}</div>
            <p className="text-xs text-muted-foreground">pending requests</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/maintenance" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Requests
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${stats.overdueAmount.toLocaleString()} overdue ({stats.overduePayments} tenants)
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/payments" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                View Payments
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="leases">Upcoming Lease Ends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Property Occupancy</CardTitle>
                <CardDescription>Current occupancy rates across all properties</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Sunset Towers</span>
                      </div>
                      <span>95%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "95%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Riverside Apartments</span>
                      </div>
                      <span>88%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Oakwood Residences</span>
                      </div>
                      <span>92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Parkview Condos</span>
                      </div>
                      <span>100%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "100%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Current month payment overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <CreditCard className="h-8 w-8 text-green-700" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-muted-foreground">Payments received</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-md bg-green-100 p-2 text-center">
                        <div className="font-medium text-green-700">132</div>
                        <div className="text-xs text-green-800">Paid</div>
                      </div>
                      <div className="rounded-md bg-yellow-100 p-2 text-center">
                        <div className="font-medium text-yellow-700">6</div>
                        <div className="text-xs text-yellow-800">Partial</div>
                      </div>
                      <div className="rounded-md bg-red-100 p-2 text-center">
                        <div className="font-medium text-red-700">5</div>
                        <div className="text-xs text-red-800">Overdue</div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Total Revenue</div>
                      <div className="text-sm font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <div>Expected: ${(stats.monthlyRevenue + stats.overdueAmount).toLocaleString()}</div>
                      <div className="flex items-center text-red-500">
                        <ArrowUpRight className="mr-1 h-3 w-3" />${stats.overdueAmount.toLocaleString()} outstanding
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">
                        By {activity.user} on {activity.date} at {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="leases">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Lease Ends</CardTitle>
              <CardDescription>Leases ending in the next 60 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingLeaseEnds.map((lease) => (
                  <div
                    key={lease.id}
                    className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{lease.tenant}</div>
                      <div className="text-sm text-muted-foreground">{lease.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">Ends {lease.endDate}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.ceil((new Date(lease.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                        days left
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View All Leases
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
